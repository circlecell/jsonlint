'use client';

import { useEffect, useRef } from 'react';

/**
 * BidAnalytics — Bid stream instrumentation + config optimization
 *
 * Phase 1: Hooks into BSA's Prebid.js (window.bsapb) to capture bid events.
 * Phase 2: Fetches optimized config from edge Worker and applies overrides
 *          (timeout, floor prices, bidder exclusions, A/B experiments).
 *
 * Zero risk: config overrides only apply AFTER Prebid initializes,
 * and only modify tuning parameters (never ad rendering or GPT).
 */

const ANALYTICS_ENDPOINT = 'https://bid-analytics.toddynho-544.workers.dev/bid-event';
const CONFIG_ENDPOINT = 'https://bid-config.toddynho-544.workers.dev/config';

const BATCH_INTERVAL_MS = 2000;
const MAX_BATCH_SIZE = 50;

const JSONLINT_AD_UNITS = [
  'bsa-zone_1570746984891-3',
  'bsa-zone_1635456522244-9',
  'bsa-zone_1605730077127-6',
  'bsa-zone_1730478399329-2',
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
  configVersion: string;
  experimentId: string;
  variant: number;
}

interface AuctionConfig {
  version: string;
  bidderTimeout: number;
  excludeBidders: string[];
  bidderTimeouts: Record<string, number>;
  floors: {
    default: number;
    byAdUnit: Record<string, number>;
    byCountry: Record<string, number>;
  };
  variant: number;
  experimentId: string;
}

function getPageContext(sessionId: string): PageContext {
  return {
    path: window.location.pathname,
    referrer: document.referrer
      ? (() => {
          try { return new URL(document.referrer).hostname; }
          catch { return 'unknown'; }
        })()
      : 'direct',
    screenWidth: window.screen.width,
    hour: new Date().getUTCHours(),
    dayOfWeek: new Date().getUTCDay(),
    sessionId,
    configVersion: '',
    experimentId: '',
    variant: 0,
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

async function fetchConfig(sessionId: string): Promise<AuctionConfig | null> {
  try {
    const resp = await fetch(`${CONFIG_ENDPOINT}?session=${encodeURIComponent(sessionId)}`);
    if (!resp.ok) return null;
    return await resp.json();
  } catch {
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyConfig(bsapb: any, config: AuctionConfig): void {
  try {
    // Apply global timeout override
    if (config.bidderTimeout && config.bidderTimeout !== 2500) {
      bsapb.setConfig({ bidderTimeout: config.bidderTimeout });
    }

    // Apply per-bidder timeout overrides via bidder-specific config
    if (config.bidderTimeouts && Object.keys(config.bidderTimeouts).length > 0) {
      for (const [bidder, timeout] of Object.entries(config.bidderTimeouts)) {
        bsapb.setBidderConfig({
          bidders: [bidder],
          config: { bidderTimeout: timeout },
        });
      }
    }

    // Apply floor prices if Prebid supports it
    if (config.floors && config.floors.default > 0) {
      bsapb.setConfig({
        floors: {
          enforcement: { floorDeals: false },
          data: {
            currency: 'USD',
            schema: { fields: ['mediaType'] },
            values: { '*': config.floors.default },
          },
        },
      });
    }

    // Note: excludeBidders cannot be applied retroactively after Prebid init
    // This would need script interception (Phase 2b) to actually remove adapters
    // For now, we track which bidders SHOULD be excluded for future optimization
  } catch {
    // Config application is best-effort — never break the auction
  }
}

export function BidAnalytics() {
  const eventBuffer = useRef<BidEventPayload[]>([]);
  const contextRef = useRef<PageContext | null>(null);
  const registeredRef = useRef(false);
  const configRef = useRef<AuctionConfig | null>(null);

  useEffect(() => {
    const sessionId = crypto.randomUUID();
    contextRef.current = getPageContext(sessionId);

    // Fetch config early (before BSA loads)
    fetchConfig(sessionId).then(config => {
      if (config && contextRef.current) {
        configRef.current = config;
        contextRef.current.configVersion = config.version;
        contextRef.current.experimentId = config.experimentId;
        contextRef.current.variant = config.variant;
      }
    });

    function queueEvent(eventType: string, data: Partial<BidEventPayload>) {
      if (!contextRef.current) return;
      const payload: BidEventPayload = {
        event: eventType,
        timestamp: Date.now(),
        ...data,
        context: contextRef.current,
      };
      eventBuffer.current.push(payload);
      if (eventBuffer.current.length >= MAX_BATCH_SIZE) {
        flushEvents();
      }
    }

    function flushEvents() {
      if (eventBuffer.current.length === 0) return;
      const batch = eventBuffer.current.splice(0);
      try {
        const payload = JSON.stringify(batch);
        const sent = navigator.sendBeacon(ANALYTICS_ENDPOINT, payload);
        if (!sent) {
          fetch(ANALYTICS_ENDPOINT, {
            method: 'POST',
            body: payload,
            keepalive: true,
          }).catch(() => {});
        }
      } catch {
        // Silently fail
      }
    }

    const flushInterval = setInterval(flushEvents, BATCH_INTERVAL_MS);

    function handleVisibilityChange() {
      if (document.visibilityState === 'hidden') flushEvents();
    }
    function handlePageHide() { flushEvents(); }

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);

    function registerListeners(): boolean {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bsapb = (window as any).bsapb;
      if (!bsapb || !bsapb.onEvent || registeredRef.current) return false;
      registeredRef.current = true;

      // Apply config overrides if we have them
      if (configRef.current) {
        applyConfig(bsapb, configRef.current);
      }

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

    let attempt = 0;
    const maxAttempts = 10;
    let pollTimeout: ReturnType<typeof setTimeout>;

    function pollForBsapb() {
      if (registerListeners()) return;
      attempt++;
      if (attempt >= maxAttempts) return;
      const delay = Math.min(1000 * Math.pow(1.5, attempt), 10000);
      pollTimeout = setTimeout(pollForBsapb, delay);
    }

    pollTimeout = setTimeout(pollForBsapb, 3000);

    return () => {
      clearInterval(flushInterval);
      clearTimeout(pollTimeout);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
      flushEvents();
    };
  }, []);

  return null;
}
