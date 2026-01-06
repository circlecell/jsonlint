'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    optimize: {
      queue: Array<() => void>;
      pushAll: () => void;
      refreshAll: () => void;
      isInitialized?: boolean;
    };
  }
}

export function OptimizeAds() {
  const pathname = usePathname();
  const isInitialLoad = useRef(true);

  useEffect(() => {
    // Skip the initial page load - BuySellAds handles that automatically
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    // Initialize optimize queue if not already done
    window.optimize = window.optimize || { queue: [] };
    
    // Push ads only on subsequent route changes (SPA navigation)
    window.optimize.queue.push(() => {
      window.optimize.pushAll();
    });
  }, [pathname]);

  return <div data-optimize="shadow-container" />;
}
