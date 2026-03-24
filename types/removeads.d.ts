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
