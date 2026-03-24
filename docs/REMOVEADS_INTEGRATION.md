# RemoveAds Integration for JSONLint

This document covers what needs to be added to JSONLint once the RemoveAds service is live.

## Changes Required

### 1. Add SDK to Layout

**File:** `app/layout.tsx`

Add before `</head>`:

```tsx
<script 
  src="https://removeads.fullres.com/sdk.js" 
  data-site="jsonlint.com"
  async
/>
```

### 2. Create AdUnit Component

**File:** `components/AdUnit.tsx`

```tsx
'use client';

import { useEffect, useState } from 'react';

interface AdUnitProps {
  children: React.ReactNode;
  className?: string;
}

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
```

### 3. Create RemoveAds Link Component

**File:** `components/RemoveAdsLink.tsx`

```tsx
'use client';

import { useEffect, useState } from 'react';

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
    
    // Fallback if SDK doesn't load
    const timeout = setTimeout(() => {
      if (status === 'loading') setStatus('inactive');
    }, 3000);
    
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('removeads:ready', checkStatus);
    };
  }, []);
  
  if (status === 'loading') return null;
  
  if (status === 'active') {
    return (
      <span 
        className="text-xs px-2 py-1 rounded"
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
      onClick={() => window.RemoveAds?.showActivateModal()}
      className="text-xs hover:underline"
      style={{ color: 'var(--text-muted)' }}
    >
      Remove Ads
    </button>
  );
}
```

### 4. Add TypeScript Declarations

**File:** `types/removeads.d.ts`

```typescript
interface RemoveAdsSDK {
  isActive: boolean;
  checkStatus(): Promise<{ active: boolean; expiresAt?: string }>;
  showActivateModal(): void;
  activate(key: string): Promise<{ success: boolean; error?: string }>;
  deactivate(): void;
  getCheckoutUrl(plan: 'monthly' | 'annual'): string;
  on(event: 'activated' | 'deactivated' | 'ready', callback: () => void): void;
}

declare global {
  interface Window {
    RemoveAds?: RemoveAdsSDK;
  }
}

export {};
```

### 5. Update Footer with RemoveAds Link

**File:** `components/Footer.tsx`

Add to the footer links section:

```tsx
import { RemoveAdsLink } from './RemoveAdsLink';

// In the footer JSX, add:
<RemoveAdsLink />
```

### 6. Wrap Ad Units

Find all ad units in the codebase and wrap them:

```tsx
// Before
<div className="mb-4 flex justify-center">
  <div id="bsa-zone_1570746984891-3_123456"></div>
</div>

// After
<AdUnit className="mb-4 flex justify-center">
  <div id="bsa-zone_1570746984891-3_123456"></div>
</AdUnit>
```

**Files to update:**
- `app/page.tsx` (home page ads)
- `app/*/page.tsx` (tool page ads)
- Any other pages with ad zones

### 7. Optional: Pro Badge in Header

Add a small "Pro" indicator when user has active subscription:

```tsx
// components/Header.tsx
import { RemoveAdsLink } from './RemoveAdsLink';

// Add near the theme toggle:
<RemoveAdsLink />
```

---

## Testing Checklist

- [ ] SDK loads without errors
- [ ] Ads show for non-subscribers
- [ ] Ads hide when valid key is entered
- [ ] Key persists across page refreshes
- [ ] Key works across different pages
- [ ] "Pro" badge shows when subscribed
- [ ] Modal opens when clicking "Remove Ads"
- [ ] Checkout flow works end-to-end
- [ ] Expired keys show ads again

---

## Rollback Plan

If issues arise, simply remove the SDK script tag from layout.tsx. The AdUnit component will default to showing ads if the SDK isn't present.
