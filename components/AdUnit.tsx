'use client';

import { useEffect, useState } from 'react';

interface AdUnitProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wrapper component for ad units that respects RemoveAds subscription status.
 * If user has an active RemoveAds subscription, children are not rendered.
 * 
 * Usage:
 * <AdUnit className="mb-4 flex justify-center">
 *   <div id="bsa-zone_123"></div>
 * </AdUnit>
 */
export function AdUnit({ children, className }: AdUnitProps) {
  const [showAds, setShowAds] = useState(true);
  
  useEffect(() => {
    // Check initial state
    const checkStatus = () => {
      if (typeof window !== 'undefined' && window.RemoveAds?.isActive) {
        setShowAds(false);
      }
    };
    
    checkStatus();
    
    // Listen for SDK ready event
    const handleReady = () => checkStatus();
    const handleActivated = () => setShowAds(false);
    const handleDeactivated = () => setShowAds(true);
    
    window.addEventListener('removeads:ready', handleReady);
    window.addEventListener('removeads:activated', handleActivated);
    window.addEventListener('removeads:deactivated', handleDeactivated);
    
    return () => {
      window.removeEventListener('removeads:ready', handleReady);
      window.removeEventListener('removeads:activated', handleActivated);
      window.removeEventListener('removeads:deactivated', handleDeactivated);
    };
  }, []);
  
  if (!showAds) return null;
  
  return <div className={className}>{children}</div>;
}
