'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import ad analytics — they don't need to run until ads are loaded
const BidAnalytics = dynamic(
  () => import('./BidAnalytics').then(mod => ({ default: mod.BidAnalytics })),
  { ssr: false }
);

const AdRefreshOptimizer = dynamic(
  () => import('./AdRefreshOptimizer').then(mod => ({ default: mod.AdRefreshOptimizer })),
  { ssr: false }
);

/**
 * Defers loading of BidAnalytics and AdRefreshOptimizer until after
 * first user interaction (scroll, click, keypress, or touch).
 *
 * These components monitor ad viewability and bid streams — they're
 * useless until the page is interactive and ads are loading, so there's
 * no reason to include them in the initial JS bundle.
 */
export function DeferredAdComponents() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Load on first interaction OR after a generous timeout as fallback
    const events = ['scroll', 'click', 'keydown', 'touchstart'] as const;

    function activate() {
      setShouldLoad(true);
      events.forEach(e => window.removeEventListener(e, activate));
    }

    events.forEach(e => window.addEventListener(e, activate, { once: true, passive: true }));

    // Fallback: load after 10s even without interaction (e.g., if user just reads)
    const timer = setTimeout(activate, 10000);

    return () => {
      clearTimeout(timer);
      events.forEach(e => window.removeEventListener(e, activate));
    };
  }, []);

  if (!shouldLoad) return null;

  return (
    <>
      <BidAnalytics />
      <AdRefreshOptimizer />
    </>
  );
}
