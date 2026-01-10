'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type LayoutWidth = 'fixed' | 'full';

interface LayoutContextType {
  width: LayoutWidth;
  setWidth: (width: LayoutWidth) => void;
  toggleWidth: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

const STORAGE_KEY = 'jsonlint-layout-width';

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [width, setWidthState] = useState<LayoutWidth>('fixed');
  const [mounted, setMounted] = useState(false);

  // Initialize width from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as LayoutWidth | null;
    if (stored === 'fixed' || stored === 'full') {
      setWidthState(stored);
    }
    setMounted(true);
  }, []);

  const setWidth = (newWidth: LayoutWidth) => {
    setWidthState(newWidth);
    localStorage.setItem(STORAGE_KEY, newWidth);
  };

  const toggleWidth = () => {
    const newWidth = width === 'fixed' ? 'full' : 'fixed';
    setWidth(newWidth);
  };

  // Return children with default values until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <LayoutContext.Provider value={{ width: 'fixed', setWidth: () => {}, toggleWidth: () => {} }}>
        {children}
      </LayoutContext.Provider>
    );
  }

  return (
    <LayoutContext.Provider value={{ width, setWidth, toggleWidth }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    // Safe defaults for SSR/pre-mount
    return {
      width: 'fixed' as LayoutWidth,
      setWidth: () => {},
      toggleWidth: () => {},
    };
  }
  return context;
}
