'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    optimize?: {
      queue: Array<() => void>;
      push?: (id: string | string[]) => void;
      pushAll?: () => void;
      refresh?: (id: string | string[]) => void;
      refreshAll?: () => void;
      stopAutomaticRefresh?: (id?: string | string[]) => void;
      isInitialized?: boolean;
    };
  }
}

export function OptimizeAds() {
  const pathname = usePathname();
  const isInitialLoad = useRef(true);
  const lastPathname = useRef(pathname);

  const refreshAds = useCallback(() => {
    // Only proceed if optimize is available
    if (!window.optimize) {
      return;
    }
    
    // Use the queue to ensure optimize is initialized
    window.optimize.queue.push(() => {
      if (window.optimize?.pushAll) {
        window.optimize.pushAll();
      }
    });
  }, []);

  useEffect(() => {
    // Skip the initial page load - BuySellAds handles that automatically
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      lastPathname.current = pathname;
      return;
    }

    // Skip if pathname hasn't actually changed (prevents duplicate calls)
    if (lastPathname.current === pathname) {
      return;
    }
    lastPathname.current = pathname;

    // Small delay to ensure DOM is ready after navigation
    const timeoutId = setTimeout(refreshAds, 100);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [pathname, refreshAds]);

  return <div data-optimize="shadow-container" />;
}
