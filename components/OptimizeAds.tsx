'use client';

import { useEffect } from 'react';
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

  useEffect(() => {
    // Initialize optimize queue if not already done
    window.optimize = window.optimize || { queue: [] };
    
    // Push ads on route change
    window.optimize.queue.push(() => {
      window.optimize.pushAll();
    });
  }, [pathname]);

  return <div data-optimize="shadow-container" />;
}
