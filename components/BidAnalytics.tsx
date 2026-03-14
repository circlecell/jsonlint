'use client';

import { useEffect, useRef } from 'react';

/**
 * BidAnalytics - Phase 1 Instrumentation
 *
 * Hooks into BSA's Prebid.js instance (window.bsapb) to capture
 * bid response, bid won, no bid, and timeout events.
 * Sends data via sendBeacon to a Cloudflare Worker for ClickHouse storage.
 *
 * Zero impact on ad revenue - read-only event listeners only.
 */

const ANALYTICS_ENDPOINT = 'https://bid-analytics.toddynho-544.workers.dev/bid-event';

// Batch settings
const BATCH_INTERVAL_MS = 2000;
const MAX_BATCH_SIZE = 50;

// JSONLint-specific ad unit prefixes
const JSONLINT_AD_UNITS = [
  'bsa-zone_1570746984891-3',  // Header
  'bsa-zone_1635456522244-9',  // Fixed Footer
  'bsa-zone_1605730077127-6',  // Sidebar
  'bsa-zone_1730478399329-2',  // Responsive
];

function isJsonlintAdUnit(adUnitCode: string): boolean {
  return JSONLINT_AD_UNITS.some(prefix => adUnitCode.startsWith(prefix));
}

interface PageContext {
  path: string;
  referrer: string;
  screenWidth: number;
  hour: number;
  dayOfWeek: number;
  sessionId: string;
}

function getPageContext(): PageContext {
  return {
    path: window.location.pathname,
    referrer: document.referrer
      ? (() => {
          try {
            return new URL(document.referrer).hostname;
          } catch {
            return 'unknown';
          }
        })()
      : 'direct',
    screenWidth: window.screen.width,
    hour: new Date().getUTCHours(),
    dayOfWeek: new Date().getUTCDay(),
    sessionId: crypto.randomUUID(),
  };
}

interface BidEventPayload {
  event: string;
  timestamp: number;
  auctionId?: string;
  bidderCode?: string;
  cpm?: number;
  currency?: string;
  responseTimeMs?: number;
  adUnitCode?: string;
  size?: string;
  mediaType?: string;
  ttl?: number;
  netRevenue?: boolean;
  timeoutMs?: number;
  context: PageContext;
}

export function BidAnalytics() {
  const eventBuffer = useRef<BidEventPayload[]>([]);
  const contextRef = useRef<PageContext | null>(null);
  const registeredRef = useRef(false);

  useEffect(() => {
    // Generate session context once per mount (tab-scoped)
    contextRef.current = getPageContext();

    function queueEvent(eventType: string, data: Partial<BidEventPayload>) {
      if (!contextRef.current) return;

      const payload: BidEventPayload = {
        event: eventType,
        timestamp: Date.now(),
        ...data,
        context: contextRef.current,
      };

      eventBuffer.current.push(payload);

      // Flush if batch is full
      if (eventBuffer.current.length >= MAX_BATCH_SIZE) {
        flushEvents();
      }
    }

    function flushEvents() {
      if (eventBuffer.current.length === 0) return;

      const batch = eventBuffer.current.splice(0);

      try {
        const payload = JSON.stringify(batch);
        // sendBeacon is fire-and-forget, non-blocking
        const sent = navigator.sendBeacon(ANALYTICS_ENDPOINT, payload);
        if (!sent) {
          // Fallback: try fetch with keepalive
          fetch(ANALYTICS_ENDPOINT, {
            method: 'POST',
            body: payload,
            keepalive: true,
          }).catch(() => {
            // Silently fail - analytics, not critical path
          });
        }
      } catch {
        // Silently fail
      }
    }

    // Flush on interval
    const flushInterval = setInterval(flushEvents, BATCH_INTERVAL_MS);

    // Flush when page is hidden or unloaded
    function handleVisibilityChange() {
      if (document.visibilityState === 'hidden') {
        flushEvents();
      }
    }
    function handlePageHide() {
      flushEvents();
    }

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);

    // Poll for window.bsapb availability
    // BSA scripts load after 6.5s delay (via DelayedAdLoader), so we poll with backoff
    function registerListeners(): boolean {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bsapb = (window as any).bsapb;
      if (!bsapb || !bsapb.onEvent || registeredRef.current) return false;

      registeredRef.current = true;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      bsapb.onEvent('bidResponse', (bid: any) => {
        if (!bid.adUnitCode || !isJsonlintAdUnit(bid.adUnitCode)) return;
        queueEvent('bidResponse', {
          auctionId: bid.auctionId,
          bidderCode: bid.bidderCode,
          cpm: bid.cpm,
          currency: bid.currency,
          responseTimeMs: bid.timeToRespond,
          adUnitCode: bid.adUnitCode,
          size: bid.width && bid.height ? `${bid.width}x${bid.height}` : '',
          mediaType: bid.mediaType,
          ttl: bid.ttl,
          netRevenue: bid.netRevenue,
        });
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      bsapb.onEvent('bidWon', (bid: any) => {
        if (!bid.adUnitCode || !isJsonlintAdUnit(bid.adUnitCode)) return;
        queueEvent('bidWon', {
          auctionId: bid.auctionId,
          bidderCode: bid.bidderCode,
          cpm: bid.cpm,
          adUnitCode: bid.adUnitCode,
        });
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      bsapb.onEvent('noBid', (bid: any) => {
        if (!bid.adUnitCode || !isJsonlintAdUnit(bid.adUnitCode)) return;
        queueEvent('noBid', {
          auctionId: bid.auctionId,
          bidderCode: bid.bidderCode || bid.bidder || '',
          adUnitCode: bid.adUnitCode,
        });
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      bsapb.onEvent('bidTimeout', (bids: any) => {
        // bidTimeout receives an array of timed-out bids
        const bidArray = Array.isArray(bids) ? bids : [bids];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        bidArray.forEach((bid: any) => {
          if (!bid.adUnitCode || !isJsonlintAdUnit(bid.adUnitCode)) return;
          queueEvent('bidTimeout', {
            auctionId: bid.auctionId,
            bidderCode: bid.bidderCode || bid.bidder || '',
            adUnitCode: bid.adUnitCode,
            timeoutMs: bid.timeout,
          });
        });
      });

      return true;
    }

    // Exponential backoff polling: starts at 3s, grows with 1.5x factor
    let attempt = 0;
    const maxAttempts = 10;
    let pollTimeout: ReturnType<typeof setTimeout>;

    function pollForBsapb() {
      if (registerListeners()) return; // Success

      attempt++;
      if (attempt >= maxAttempts) return; // Give up after ~30s of polling

      const delay = Math.min(1000 * Math.pow(1.5, attempt), 10000);
      pollTimeout = setTimeout(pollForBsapb, delay);
    }

    // Start polling after 3s (BSA scripts load after ~6.5s)
    pollTimeout = setTimeout(pollForBsapb, 3000);

    return () => {
      clearInterval(flushInterval);
      clearTimeout(pollTimeout);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
      flushEvents(); // Final flush on unmount
    };
  }, []);

  // This component renders nothing
  return null;
}
