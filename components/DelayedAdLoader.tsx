'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

/**
 * Delays ad script loading until after page load + configurable delay.
 * This improves initial page load performance by deferring non-critical ad scripts.
 * 
 * @see https://www.aaronpeters.nl/blog/why-loading-third-party-scripts-async-is-not-good-enough/
 */

interface DelayedAdLoaderProps {
  /** Delay in milliseconds after window load before loading ad scripts (default: 6500ms) */
  delay?: number;
}

export function DelayedAdLoader({ delay = 6500 }: DelayedAdLoaderProps) {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    function loadAds() {
      timeoutId = setTimeout(() => {
        setShouldLoad(true);
      }, delay);
    }

    // Check if window is already loaded
    if (document.readyState === 'complete') {
      loadAds();
    } else {
      window.addEventListener('load', loadAds);
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('load', loadAds);
    };
  }, [delay]);

  if (!shouldLoad) {
    return null;
  }

  return (
    <>
      {/* BuySellAds Optimize — loaded via proxy for dead bidder optimization */}
      <Script
        id="bsaOptimizeScript"
        src={`https://bid-proxy.toddynho-544.workers.dev/_bsa/jsonlint.js?${Date.now() - (Date.now() % 600000)}`}
      />

      {/* BuySellAds Native Ads */}
      <Script 
        id="bsaMonetization"
        src="//m.servedby-buysellads.com/monetization.custom.js"
        onLoad={() => {
          // Initialize native ad after monetization script loads
          if (typeof window !== 'undefined' && (window as any)._bsa) {
            (window as any)._bsa.init('custom', 'CVADT27Y', 'placement:jsonlintcom', {
              target: '.native-ad-container',
              template: `
                <a href="##link##" class="native-ad" rel="noopener sponsored">
                  <div class="native-ad-sponsor">
                    <span>Sponsored by ##company##</span>
                  </div>
                  <div class="native-ad-content">
                    <img class="native-ad-logo" src="##logo##" style="background-color: ##backgroundColor##" alt="##company##">
                    <div class="native-ad-text">
                      <div class="native-ad-tagline">##tagline##</div>
                      <div class="native-ad-description">##description##</div>
                      <div class="native-ad-cta">##callToAction##</div>
                    </div>
                  </div>
                </a>`
            });
          }
        }}
      />

      {/* NOTE: Legacy Universal Analytics (UA-69209117-1) removed.
         UA was sunset by Google in July 2024 and no longer collects data.
         If GA4 tracking is needed, add the GA4 measurement ID here instead.
         See: https://support.google.com/analytics/answer/11583528 */}
    </>
  );
}
