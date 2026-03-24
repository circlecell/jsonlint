# RemoveAds Service Specification

> A lightweight, embeddable ad-removal subscription service for FullRes properties.

## Overview

RemoveAds is a standalone service (`removeads.fullres.com`) that handles:
- License key generation and validation
- Stripe subscription management
- Cross-device synchronization
- Email notifications

Client sites (like JSONLint) integrate via a lightweight SDK that checks license status and conditionally hides ads.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT SITES                                   │
│  (jsonlint.com, future fullres properties)                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐             │
│   │  JSONLint    │    │  Future      │    │  Future      │             │
│   │              │    │  Site B      │    │  Site C      │             │
│   └──────┬───────┘    └──────┬───────┘    └──────┬───────┘             │
│          │                   │                   │                      │
│          └───────────────────┼───────────────────┘                      │
│                              │                                          │
│                              ▼                                          │
│                    ┌─────────────────┐                                  │
│                    │  RemoveAds SDK  │  (lightweight JS)                │
│                    │  ~2KB gzipped   │                                  │
│                    └────────┬────────┘                                  │
│                              │                                          │
└──────────────────────────────┼──────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    removeads.fullres.com                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐              │
│   │   Next.js   │     │ PlanetScale │     │   Stripe    │              │
│   │   App       │────▶│  Database   │     │             │              │
│   │             │     │             │     │             │              │
│   └──────┬──────┘     └─────────────┘     └──────┬──────┘              │
│          │                                        │                     │
│          │            ┌─────────────┐             │                     │
│          └───────────▶│   Resend    │◀────────────┘                     │
│                       │   (email)   │                                   │
│                       └─────────────┘                                   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Database Schema (PlanetScale)

```sql
-- Sites that integrate RemoveAds
CREATE TABLE sites (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,           -- "JSONLint"
  domain VARCHAR(255) NOT NULL UNIQUE,  -- "jsonlint.com"
  stripe_price_id_monthly VARCHAR(255), -- Stripe price ID for this site
  stripe_price_id_annual VARCHAR(255),  -- Optional annual pricing
  monthly_price_cents INT NOT NULL,     -- 499 = $4.99
  annual_price_cents INT,               -- 3999 = $39.99
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- License keys
CREATE TABLE licenses (
  id VARCHAR(36) PRIMARY KEY,
  key_hash VARCHAR(64) NOT NULL UNIQUE, -- SHA-256 of the key (we don't store plaintext)
  key_prefix VARCHAR(10) NOT NULL,      -- "JLINT-A7X2" for lookup/display
  email VARCHAR(255) NOT NULL,
  site_id VARCHAR(36) NOT NULL,
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  status ENUM('active', 'past_due', 'cancelled', 'expired') DEFAULT 'active',
  current_period_end TIMESTAMP,         -- When subscription renews/expires
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (site_id) REFERENCES sites(id),
  INDEX idx_email (email),
  INDEX idx_stripe_customer (stripe_customer_id),
  INDEX idx_stripe_subscription (stripe_subscription_id),
  INDEX idx_status (status)
);

-- Device activations (for limiting to 5 devices)
CREATE TABLE activations (
  id VARCHAR(36) PRIMARY KEY,
  license_id VARCHAR(36) NOT NULL,
  device_fingerprint VARCHAR(64) NOT NULL, -- Hash of browser fingerprint
  user_agent VARCHAR(500),
  ip_address VARCHAR(45),                   -- For rough geo/abuse detection
  last_validated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (license_id) REFERENCES licenses(id) ON DELETE CASCADE,
  UNIQUE KEY unique_license_device (license_id, device_fingerprint),
  INDEX idx_license (license_id)
);

-- Email log (for rate limiting and debugging)
CREATE TABLE email_log (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  email_type ENUM('license_created', 'key_reminder', 'payment_failed', 'subscription_cancelled') NOT NULL,
  sent_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_email_type_sent (email, email_type, sent_at)
);
```

---

## API Endpoints

### Public Endpoints (called by SDK)

#### `POST /api/v1/licenses/validate`

Validates a license key and registers the device.

**Request:**
```json
{
  "key": "JLINT-A7X2-K9M4-P3Q8",
  "site": "jsonlint.com",
  "fingerprint": "a1b2c3d4e5f6..."  // Browser fingerprint hash
}
```

**Response (success):**
```json
{
  "valid": true,
  "expiresAt": "2026-02-09T00:00:00Z",
  "deviceCount": 2,
  "deviceLimit": 5
}
```

**Response (invalid):**
```json
{
  "valid": false,
  "error": "invalid_key" | "expired" | "wrong_site" | "device_limit_exceeded"
}
```

**Response (device limit exceeded):**
```json
{
  "valid": false,
  "error": "device_limit_exceeded",
  "message": "This key is active on 5 devices. Visit removeads.fullres.com/manage to reset your devices.",
  "manageUrl": "https://removeads.fullres.com/manage?key=JLINT-A7X2"
}
```

**Rate Limit:** 10 requests/minute per IP

---

#### `POST /api/v1/licenses/resend`

Resends license key to email.

**Request:**
```json
{
  "email": "user@example.com",
  "site": "jsonlint.com"
}
```

**Response:**
```json
{
  "sent": true,
  "message": "If a license exists for this email, we've sent a reminder."
}
```

**Rate Limit:** 1 request/hour per email

---

#### `GET /api/v1/checkout`

Redirects to Stripe Checkout.

**Query Params:**
- `site` - Site domain (e.g., `jsonlint.com`)
- `plan` - `monthly` or `annual`
- `return_url` - Where to redirect after success

**Example:**
```
GET /api/v1/checkout?site=jsonlint.com&plan=monthly&return_url=https://jsonlint.com
```

**Response:** 302 redirect to Stripe Checkout

---

### Management Pages (hosted on removeads.fullres.com)

#### `/success`
Displayed after successful Stripe checkout. Shows license key prominently.

**Query Params:**
- `session_id` - Stripe checkout session ID

**Features:**
- Displays license key with copy button
- Confirms email was sent
- "Activate on this device" button (auto-applies key)
- Link to return to originating site

---

#### `/manage`
Self-service device management.

**Query Params:**
- `key` - License key prefix (e.g., `JLINT-A7X2`)

**Features:**
- Enter full key to authenticate
- View active devices (with rough identifiers like "Chrome on Mac")
- "Reset all devices" button (clears all activations)
- Link to Stripe Customer Portal for billing

---

#### `/portal`
Redirects to Stripe Customer Portal.

**Query Params:**
- `key` - License key prefix

---

### Webhook Endpoint

#### `POST /api/webhooks/stripe`

Handles Stripe events:

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Create license, send welcome email with key |
| `customer.subscription.updated` | Update status, period end |
| `customer.subscription.deleted` | Mark cancelled, schedule reminder emails |
| `invoice.payment_failed` | Mark past_due, send payment failed email |

---

## License Key Format

```
{SITE}-{RANDOM}-{RANDOM}-{RANDOM}
 │       │        │        │
 │       └────────┴────────┴── 12 chars (A-Z0-9), ~62 bits entropy
 │
 └── 2-5 char site prefix

Examples:
  JLINT-A7X2-K9M4-P3Q8   (JSONLint)
  FRES-B3C4-M8N2-X5Y7    (FullRes)
```

**Generation:**
```typescript
function generateLicenseKey(sitePrefix: string): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No I,O,0,1 for readability
  const segment = () => Array.from(
    { length: 4 }, 
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join('');
  
  return `${sitePrefix}-${segment()}-${segment()}-${segment()}`;
}
```

---

## Email Templates

### 1. Welcome Email (after purchase)

**Subject:** Your JSONLint Pro license key

```
Hi!

Thanks for subscribing to JSONLint Pro. Here's your license key:

    JLINT-A7X2-K9M4-P3Q8

Enter this key on any device at jsonlint.com to remove ads.

You can use this on up to 5 devices. If you need to reset your devices
or manage your subscription, visit:

    https://removeads.fullres.com/manage?key=JLINT-A7X2

Thanks for supporting JSONLint!
```

### 2. Payment Failed

**Subject:** Action needed: JSONLint payment failed

```
Hi,

We couldn't process your payment for JSONLint Pro. 

Please update your payment method to keep your ad-free experience:

    [Update Payment Method]

If we can't process payment within 7 days, your subscription will 
be cancelled and ads will return.

Your license key: JLINT-A7X2-****-****
```

### 3. Subscription Ending (Day 1, 3, 5, 7)

**Subject:** Your JSONLint Pro subscription is ending

```
Hi,

Your JSONLint Pro subscription has been cancelled and will end on [DATE].

If you'd like to continue ad-free, you can resubscribe anytime:

    [Resubscribe]

Thanks for trying JSONLint Pro!
```

---

## SDK Specification

The SDK is a lightweight JavaScript library that client sites embed.

### Installation

```html
<!-- In site's <head> -->
<script 
  src="https://removeads.fullres.com/sdk.js" 
  data-site="jsonlint.com"
  async
></script>
```

### SDK Behavior

1. **On Load:**
   - Check localStorage for existing key
   - If key exists and not validated in 24h, revalidate
   - Set global `window.RemoveAds.isActive` boolean
   - Dispatch `removeads:ready` event

2. **Methods:**

```typescript
interface RemoveAdsSDK {
  // State
  isActive: boolean;
  
  // Check if user has valid license
  checkStatus(): Promise<{ active: boolean; expiresAt?: string }>;
  
  // Open activation modal
  showActivateModal(): void;
  
  // Apply a license key
  activate(key: string): Promise<{ success: boolean; error?: string }>;
  
  // Clear local license (doesn't cancel subscription)
  deactivate(): void;
  
  // Get checkout URL
  getCheckoutUrl(plan: 'monthly' | 'annual'): string;
  
  // Events
  on(event: 'activated' | 'deactivated' | 'ready', callback: () => void): void;
}

declare global {
  interface Window {
    RemoveAds: RemoveAdsSDK;
  }
}
```

### SDK Source (Minified ~2KB)

```typescript
// sdk.ts (source, will be bundled/minified)
(function() {
  const STORAGE_KEY = 'removeads_license';
  const STORAGE_VALIDATED = 'removeads_validated_at';
  const VALIDATE_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours
  const API_BASE = 'https://removeads.fullres.com/api/v1';
  
  const script = document.currentScript as HTMLScriptElement;
  const site = script?.dataset.site;
  
  if (!site) {
    console.error('RemoveAds: data-site attribute required');
    return;
  }
  
  // Simple browser fingerprint (not for security, just uniqueness)
  function getFingerprint(): string {
    const data = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
    ].join('|');
    
    // Simple hash
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      hash = ((hash << 5) - hash) + data.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(16, '0');
  }
  
  async function validate(key: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/licenses/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key,
          site,
          fingerprint: getFingerprint(),
        }),
      });
      
      const data = await res.json();
      
      if (data.valid) {
        localStorage.setItem(STORAGE_VALIDATED, Date.now().toString());
        return true;
      } else {
        if (data.error === 'device_limit_exceeded') {
          console.warn('RemoveAds: Device limit exceeded. Visit', data.manageUrl);
        }
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_VALIDATED);
        return false;
      }
    } catch {
      // Network error - trust cache if validated recently
      const validated = localStorage.getItem(STORAGE_VALIDATED);
      if (validated) {
        const age = Date.now() - parseInt(validated);
        return age < VALIDATE_INTERVAL_MS * 7; // 7 day grace period offline
      }
      return false;
    }
  }
  
  async function checkStatus(): Promise<{ active: boolean; expiresAt?: string }> {
    const key = localStorage.getItem(STORAGE_KEY);
    if (!key) return { active: false };
    
    const validatedAt = localStorage.getItem(STORAGE_VALIDATED);
    const needsRevalidation = !validatedAt || 
      (Date.now() - parseInt(validatedAt)) > VALIDATE_INTERVAL_MS;
    
    if (needsRevalidation) {
      const valid = await validate(key);
      return { active: valid };
    }
    
    return { active: true };
  }
  
  async function activate(key: string): Promise<{ success: boolean; error?: string }> {
    const valid = await validate(key);
    if (valid) {
      localStorage.setItem(STORAGE_KEY, key);
      sdk.isActive = true;
      dispatch('activated');
      return { success: true };
    }
    return { success: false, error: 'Invalid or expired key' };
  }
  
  function deactivate() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_VALIDATED);
    sdk.isActive = false;
    dispatch('deactivated');
  }
  
  function getCheckoutUrl(plan: 'monthly' | 'annual'): string {
    const returnUrl = encodeURIComponent(window.location.href);
    return `${API_BASE}/checkout?site=${site}&plan=${plan}&return_url=${returnUrl}`;
  }
  
  // Simple event system
  const listeners: Record<string, Function[]> = {};
  
  function on(event: string, callback: Function) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(callback);
  }
  
  function dispatch(event: string) {
    listeners[event]?.forEach(cb => cb());
    window.dispatchEvent(new CustomEvent(`removeads:${event}`));
  }
  
  // Modal (optional - sites can build their own)
  function showActivateModal() {
    // Inject minimal modal HTML/CSS
    // This is optional - sites might want to build their own UI
    const modal = document.createElement('div');
    modal.innerHTML = `
      <div id="removeads-modal" style="position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:99999">
        <div style="background:white;padding:24px;border-radius:8px;max-width:400px;width:90%">
          <h2 style="margin:0 0 16px">Remove Ads</h2>
          <input type="text" id="removeads-key" placeholder="Enter license key (e.g., JLINT-XXXX-XXXX-XXXX)" 
            style="width:100%;padding:8px;border:1px solid #ccc;border-radius:4px;margin-bottom:12px">
          <button id="removeads-activate" style="width:100%;padding:10px;background:#3b82f6;color:white;border:none;border-radius:4px;cursor:pointer;margin-bottom:8px">
            Activate
          </button>
          <div style="text-align:center;margin:12px 0;color:#666">or</div>
          <a href="${getCheckoutUrl('monthly')}" style="display:block;text-align:center;padding:10px;background:#10b981;color:white;border-radius:4px;text-decoration:none">
            Subscribe - $4.99/month
          </a>
          <p style="text-align:center;margin:12px 0 0;font-size:14px">
            <a href="#" id="removeads-forgot" style="color:#3b82f6">Forgot your key?</a>
          </p>
          <button id="removeads-close" style="position:absolute;top:8px;right:8px;background:none;border:none;font-size:24px;cursor:pointer">&times;</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('removeads-close')?.addEventListener('click', () => modal.remove());
    document.getElementById('removeads-modal')?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) modal.remove();
    });
    document.getElementById('removeads-activate')?.addEventListener('click', async () => {
      const key = (document.getElementById('removeads-key') as HTMLInputElement)?.value;
      if (key) {
        const result = await activate(key);
        if (result.success) {
          modal.remove();
          window.location.reload();
        } else {
          alert(result.error);
        }
      }
    });
  }
  
  // Initialize SDK
  const sdk: RemoveAdsSDK = {
    isActive: false,
    checkStatus,
    activate,
    deactivate,
    getCheckoutUrl,
    showActivateModal,
    on,
  };
  
  // Check status on load
  checkStatus().then(({ active }) => {
    sdk.isActive = active;
    dispatch('ready');
  });
  
  // Expose globally
  (window as any).RemoveAds = sdk;
})();
```

---

## Client Integration (JSONLint Example)

### 1. Add SDK to Layout

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <script 
          src="https://removeads.fullres.com/sdk.js" 
          data-site="jsonlint.com"
          async
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### 2. Create Ad Wrapper Component

```tsx
// components/AdUnit.tsx
'use client';

import { useEffect, useState } from 'react';

interface AdUnitProps {
  id: string;
  children: React.ReactNode;
}

export function AdUnit({ id, children }: AdUnitProps) {
  const [showAds, setShowAds] = useState(true);
  
  useEffect(() => {
    // Check on load
    if (window.RemoveAds?.isActive) {
      setShowAds(false);
      return;
    }
    
    // Listen for changes
    const handleReady = () => {
      setShowAds(!window.RemoveAds?.isActive);
    };
    
    window.addEventListener('removeads:ready', handleReady);
    window.addEventListener('removeads:activated', () => setShowAds(false));
    window.addEventListener('removeads:deactivated', () => setShowAds(true));
    
    return () => {
      window.removeEventListener('removeads:ready', handleReady);
      // ... remove others
    };
  }, []);
  
  if (!showAds) return null;
  
  return <div id={id}>{children}</div>;
}
```

### 3. Add "Remove Ads" Link

```tsx
// components/Footer.tsx (or wherever)
'use client';

export function RemoveAdsLink() {
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    const check = () => setIsActive(window.RemoveAds?.isActive ?? false);
    window.addEventListener('removeads:ready', check);
    check();
    return () => window.removeEventListener('removeads:ready', check);
  }, []);
  
  if (isActive) {
    return (
      <span className="text-sm text-green-500">
        Pro Member
      </span>
    );
  }
  
  return (
    <button 
      onClick={() => window.RemoveAds?.showActivateModal()}
      className="text-sm text-blue-500 hover:underline"
    >
      Remove Ads
    </button>
  );
}
```

### 4. Wrap Existing Ads

```tsx
// Before
<div id="bsa-zone_123">
  {/* Carbon/BSA ad code */}
</div>

// After
<AdUnit id="bsa-zone_123">
  {/* Carbon/BSA ad code */}
</AdUnit>
```

---

## RemoveAds Service Project Structure

```
removeads.fullres.com/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # Landing page (optional)
│   ├── success/
│   │   └── page.tsx               # Post-checkout success page
│   ├── manage/
│   │   └── page.tsx               # Device management
│   ├── portal/
│   │   └── route.ts               # Redirect to Stripe Portal
│   └── api/
│       ├── v1/
│       │   ├── licenses/
│       │   │   ├── validate/
│       │   │   │   └── route.ts
│       │   │   └── resend/
│       │   │       └── route.ts
│       │   └── checkout/
│       │       └── route.ts
│       └── webhooks/
│           └── stripe/
│               └── route.ts
├── lib/
│   ├── db.ts                      # PlanetScale connection
│   ├── stripe.ts                  # Stripe client
│   ├── email.ts                   # Resend client
│   ├── license.ts                 # License generation/validation
│   └── rate-limit.ts              # Rate limiting utilities
├── public/
│   └── sdk.js                     # Bundled/minified SDK
├── emails/                        # React Email templates
│   ├── welcome.tsx
│   ├── payment-failed.tsx
│   └── subscription-ending.tsx
└── scripts/
    └── build-sdk.ts               # SDK bundler
```

---

## Environment Variables

```env
# PlanetScale
DATABASE_URL=mysql://...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_JSONLINT_MONTHLY_PRICE_ID=price_...
STRIPE_JSONLINT_ANNUAL_PRICE_ID=price_...

# Resend (email)
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@fullres.com

# App
NEXT_PUBLIC_APP_URL=https://removeads.fullres.com
```

---

## Cron Jobs

### 1. Subscription Reminder Emails

Run daily at 9am UTC:

```typescript
// Check for subscriptions ending in 1, 3, 5, 7 days
// Send appropriate reminder email
// Log to email_log to prevent duplicates
```

### 2. Cleanup Stale Activations

Run weekly:

```typescript
// Delete activations not validated in 90 days
// This naturally cleans up abandoned devices
```

---

## Pricing Configuration

For JSONLint, suggested pricing:

| Plan | Price | Stripe Price ID |
|------|-------|-----------------|
| Monthly | $4.99/month | `price_jsonlint_monthly` |
| Annual | $39.99/year (33% off) | `price_jsonlint_annual` |

---

## Security Considerations

1. **License keys are hashed** in database (SHA-256) - we only store prefix for lookup
2. **Rate limiting** on all public endpoints
3. **CORS** restricted to known client domains
4. **Webhook signature verification** for Stripe
5. **No PII beyond email** stored
6. **Device fingerprint is a loose identifier** - not for security, just uniqueness

---

## Monitoring & Alerts

Set up alerts for:
- Webhook failures
- High rate of invalid key attempts (potential abuse)
- Stripe subscription failures
- Email delivery failures

---

## Future Enhancements

1. **Family/Team plans** - Multiple keys under one subscription
2. **Referral program** - Get free months for referrals
3. **Usage analytics** - Optional anonymous stats for site owners
4. **White-label** - Let other sites use the service
5. **API access** - Premium API tier with higher limits

---

## Implementation Checklist

### Phase 1: Core Service
- [ ] Set up Next.js project with TypeScript
- [ ] Configure PlanetScale database
- [ ] Implement license generation and validation
- [ ] Set up Stripe integration (Checkout, Webhooks)
- [ ] Build success page with key display
- [ ] Set up Resend for transactional emails
- [ ] Implement rate limiting

### Phase 2: SDK
- [ ] Build SDK with bundler (esbuild/rollup)
- [ ] Host on CDN
- [ ] Create TypeScript types package (optional)

### Phase 3: Management
- [ ] Build device management page
- [ ] Implement device reset functionality
- [ ] Connect to Stripe Customer Portal

### Phase 4: Client Integration (JSONLint)
- [ ] Add SDK to layout
- [ ] Create AdUnit wrapper component
- [ ] Add "Remove Ads" link to footer/header
- [ ] Wrap all ad units
- [ ] Test full flow

### Phase 5: Polish
- [ ] Set up cron jobs for reminder emails
- [ ] Add monitoring/alerting
- [ ] Write documentation for future sites
