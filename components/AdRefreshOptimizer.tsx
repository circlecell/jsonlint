'use client';

import { useEffect, useRef } from 'react';

/**
 * AdRefreshOptimizer
 *
 * Monitors ad slot viewability using Intersection Observer and
 * controls GPT ad refresh behavior to avoid wasted auctions.
 *
 * When an ad slot is NOT in the viewport:
 * - Pauses GPT refresh for that slot (prevents BSA from refreshing invisible ads)
 * - Tracks viewability metrics for the analytics pipeline
 *
 * When the user returns to viewing the ad:
 * - Resumes normal refresh behavior
 * - Optionally triggers an immediate refresh to show a fresh ad
 *
 * This reduces wasted auction cycles (currently ~95% of auctions produce
 * no Prebid win) by only running auctions when the ad is actually viewable.
 */

// Ad slot selectors for JSONLint's BSA placements
const AD_SLOT_SELECTORS = [
  '[id*="bsa-zone_1570746984891"]', // Header
  '[id*="bsa-zone_1635456522244"]', // Fixed Footer
  '[id*="bsa-zone_1605730077127"]', // Sidebar
  '[id*="bsa-zone_1730478399329"]', // Responsive
];

interface SlotState {
  element: Element;
  isVisible: boolean;
  lastVisibleAt: number;
  totalVisibleMs: number;
  refreshesPaused: number;
  refreshesAllowed: number;
}

export function AdRefreshOptimizer() {
  const slotsRef = useRef<Map<string, SlotState>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Wait for GPT, ad slots, AND the feature flag to be available
    const startTime = Date.now();

    function setupObserver() {
      // Check if the viewability_refresh flag is enabled for this session
      // The flag is set by BidAnalytics after fetching config
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bidAnalyticsFlags = (window as any).__bid_analytics_flags;
      if (bidAnalyticsFlags && !bidAnalyticsFlags.viewability_refresh) {
        // Flag is OFF for this session — don't optimize refreshes
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const googletag = (window as any).googletag;
      if (!googletag || !googletag.pubads) {
        if (Date.now() - startTime < 30000) {
          setTimeout(setupObserver, 2000);
        }
        return;
      }

      // Find ad slot elements
      const adElements: Element[] = [];
      for (const selector of AD_SLOT_SELECTORS) {
        const el = document.querySelector(selector);
        if (el) adElements.push(el);
      }

      if (adElements.length === 0) {
        // No ad slots found yet, retry
        if (Date.now() - startTime < 30000) {
          setTimeout(setupObserver, 2000);
        }
        return;
      }

      // Create Intersection Observer
      observerRef.current = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const slotId = entry.target.id || entry.target.getAttribute('data-slot') || 'unknown';
            const state = slotsRef.current.get(slotId);

            if (!state) continue;

            const wasVisible = state.isVisible;
            state.isVisible = entry.isIntersecting;

            if (entry.isIntersecting && !wasVisible) {
              // Slot came into view
              state.lastVisibleAt = Date.now();
            } else if (!entry.isIntersecting && wasVisible) {
              // Slot went out of view — track viewability time
              if (state.lastVisibleAt > 0) {
                state.totalVisibleMs += Date.now() - state.lastVisibleAt;
              }
            }
          }
        },
        {
          // Trigger when at least 50% of the ad is visible (IAB standard)
          threshold: [0, 0.5, 1.0],
        },
      );

      // Register ad slots
      for (const el of adElements) {
        const slotId = el.id || 'unknown';
        slotsRef.current.set(slotId, {
          element: el,
          isVisible: false,
          lastVisibleAt: 0,
          totalVisibleMs: 0,
          refreshesPaused: 0,
          refreshesAllowed: 0,
        });
        observerRef.current.observe(el);
      }

      // Hook into GPT's refresh to add viewability gating
      // BSA calls googletag.pubads().refresh() every 30s
      // We intercept this to skip slots that aren't in view
      try {
        const pubads = googletag.pubads();
        const originalRefresh = pubads.refresh.bind(pubads);

        pubads.refresh = function (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          slots?: any[],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          options?: any,
        ) {
          if (!slots) {
            // BSA typically calls refresh() with no args (refresh all)
            // Filter to only visible slots
            const allSlots = pubads.getSlots();
            const visibleSlots = allSlots.filter(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (slot: any) => {
                const divId = slot.getSlotElementId();
                const state = slotsRef.current.get(divId);
                if (!state) return true; // Unknown slot — allow refresh

                if (state.isVisible) {
                  state.refreshesAllowed++;
                  return true;
                } else {
                  state.refreshesPaused++;
                  return false; // Skip — not in view
                }
              },
            );

            if (visibleSlots.length > 0) {
              return originalRefresh(visibleSlots, options);
            }
            // All slots hidden — skip the refresh entirely
            return;
          }

          // BSA passed specific slots — apply viewability filter
          const visibleSlots = slots.filter(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (slot: any) => {
              const divId = slot.getSlotElementId?.();
              if (!divId) return true;
              const state = slotsRef.current.get(divId);
              if (!state) return true;
              if (state.isVisible) {
                state.refreshesAllowed++;
                return true;
              }
              state.refreshesPaused++;
              return false;
            },
          );

          if (visibleSlots.length > 0) {
            return originalRefresh(visibleSlots, options);
          }
        };
      } catch {
        // GPT override failed — don't break anything
      }
    }

    // Start setup after a delay (BSA loads after 6.5s)
    const initTimeout = setTimeout(setupObserver, 8000);

    return () => {
      clearTimeout(initTimeout);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return null;
}
