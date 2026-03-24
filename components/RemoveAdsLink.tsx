'use client';

import { useEffect, useState } from 'react';

/**
 * Displays a "Remove Ads" link for non-subscribers or "Pro" badge for subscribers.
 * Integrates with the RemoveAds SDK from removeads.fullres.com.
 * 
 * When SDK is not loaded (e.g., during development), falls back to inactive state.
 */
export function RemoveAdsLink() {
  const [status, setStatus] = useState<'loading' | 'active' | 'inactive'>('loading');
  
  useEffect(() => {
    const checkStatus = () => {
      if (typeof window !== 'undefined' && window.RemoveAds) {
        setStatus(window.RemoveAds.isActive ? 'active' : 'inactive');
      }
    };
    
    // Check if SDK already loaded
    checkStatus();
    
    window.addEventListener('removeads:ready', checkStatus);
    window.addEventListener('removeads:activated', () => setStatus('active'));
    window.addEventListener('removeads:deactivated', () => setStatus('inactive'));
    
    // Fallback if SDK doesn't load (e.g., blocked by ad blocker, or not yet deployed)
    const timeout = setTimeout(() => {
      if (status === 'loading') setStatus('inactive');
    }, 3000);
    
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('removeads:ready', checkStatus);
    };
  }, [status]);
  
  // Don't show anything while loading to avoid layout shift
  if (status === 'loading') return null;
  
  if (status === 'active') {
    return (
      <span 
        className="text-xs px-2 py-1 rounded font-medium"
        style={{ 
          background: 'rgba(16, 185, 129, 0.1)', 
          color: 'var(--accent-green)' 
        }}
      >
        Pro
      </span>
    );
  }
  
  return (
    <button 
      onClick={() => {
        if (window.RemoveAds?.showActivateModal) {
          window.RemoveAds.showActivateModal();
        } else {
          // Fallback if SDK not loaded - direct to service
          window.open('https://removeads.fullres.com?site=jsonlint.com', '_blank');
        }
      }}
      className="text-xs hover:underline transition-colors"
      style={{ color: 'var(--text-muted)' }}
    >
      Remove Ads
    </button>
  );
}
