'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from './ThemeProvider';
import { useValidation } from './ValidationContext';
import { useLayout } from './LayoutProvider';

const toolsMenu = [
  { href: '/', label: 'Validator', desc: 'Validate & format JSON' },
  { href: '/json-minify', label: 'Minify', desc: 'Compress JSON' },
  { href: '/json-diff', label: 'Diff', desc: 'Compare JSON' },
  { href: '/json-schema', label: 'Schema', desc: 'Validate schema' },
  { href: '/json-path', label: 'Path', desc: 'Query with JSONPath' },
  { href: '/json-tree', label: 'Tree View', desc: 'Visual tree explorer' },
  { href: '/jwt-decoder', label: 'JWT Decoder', desc: 'Decode JWT tokens' },
  { href: '/tools', label: 'All Tools →', desc: 'View all 35+ tools' },
];

const convertersMenu = [
  { href: '/json-to-csv', label: 'JSON → CSV', desc: 'Export to spreadsheet' },
  { href: '/json-to-yaml', label: 'JSON → YAML', desc: 'Convert to YAML' },
  { href: '/json-to-xml', label: 'JSON → XML', desc: 'Convert to XML' },
  { href: '/json-to-typescript', label: 'JSON → TypeScript', desc: 'Generate types' },
  { href: '/json-to-python', label: 'JSON → Python', desc: 'Generate classes' },
  { href: '/json-to-markdown', label: 'JSON → Markdown', desc: 'Create tables' },
  { href: '/json-base64', label: 'Base64', desc: 'Encode/decode Base64' },
  { href: '/tools', label: 'All Converters →', desc: 'View all 20+ converters' },
];

export function Header() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { status } = useValidation();
  const { width, toggleWidth } = useLayout();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [showConvertersMenu, setShowConvertersMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const toolsMenuRef = useRef<HTMLDivElement>(null);
  const convertersMenuRef = useRef<HTMLDivElement>(null);

  // Logo status is passed directly to the Logo component now

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setShowThemeMenu(false);
      }
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(event.target as Node)) {
        setShowToolsMenu(false);
      }
      if (convertersMenuRef.current && !convertersMenuRef.current.contains(event.target as Node)) {
        setShowConvertersMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        background: 'var(--bg-primary)',
        borderColor: 'var(--border-primary)',
      }}
    >
      <div className={`${width === 'fixed' ? 'max-w-7xl' : ''} mx-auto px-4 sm:px-6 lg:px-8`}>
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Logo className="w-8 h-8" status={status} />
            <span
              className="font-bold text-lg tracking-tight"
              style={{ color: 'var(--text-primary)', fontFamily: "'Inter', -apple-system, sans-serif", letterSpacing: '-0.02em' }}
            >
              JSON<span style={{ color: '#0A84FF' }}>Lint</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Tools Dropdown */}
            <div className="relative" ref={toolsMenuRef}>
              <button
                onClick={() => { setShowToolsMenu(!showToolsMenu); setShowConvertersMenu(false); }}
                className="nav-link flex items-center gap-1"
              >
                Tools
                <ChevronIcon className={`w-4 h-4 transition-transform ${showToolsMenu ? 'rotate-180' : ''}`} />
              </button>
              {showToolsMenu && (
                <div
                  className="absolute left-0 mt-1 w-56 rounded-lg border shadow-lg overflow-hidden animate-fade-in"
                  style={{
                    background: 'var(--bg-secondary)',
                    borderColor: 'var(--border-primary)',
                  }}
                >
                  {toolsMenu.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setShowToolsMenu(false)}
                      className="flex flex-col px-4 py-2.5 hover:bg-[var(--bg-tertiary)] transition-colors"
                    >
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {item.label}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {item.desc}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Converters Dropdown */}
            <div className="relative" ref={convertersMenuRef}>
              <button
                onClick={() => { setShowConvertersMenu(!showConvertersMenu); setShowToolsMenu(false); }}
                className="nav-link flex items-center gap-1"
              >
                Convert
                <ChevronIcon className={`w-4 h-4 transition-transform ${showConvertersMenu ? 'rotate-180' : ''}`} />
              </button>
              {showConvertersMenu && (
                <div
                  className="absolute left-0 mt-1 w-56 rounded-lg border shadow-lg overflow-hidden animate-fade-in"
                  style={{
                    background: 'var(--bg-secondary)',
                    borderColor: 'var(--border-primary)',
                  }}
                >
                  {convertersMenu.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setShowConvertersMenu(false)}
                      className="flex flex-col px-4 py-2.5 hover:bg-[var(--bg-tertiary)] transition-colors"
                    >
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {item.label}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {item.desc}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/learn" className="nav-link">
              Learn
            </Link>

            <Link href="/datasets" className="nav-link">
              Datasets
            </Link>

            <div className="w-px h-5 mx-2" style={{ background: 'var(--border-primary)' }} />

            <Link
              href="/json-formatter"
              className="nav-link flex items-center gap-1.5 text-sm"
            >
              <ChromeIcon className="w-4 h-4" />
              Extension
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Width Toggle */}
            <button
              onClick={toggleWidth}
              className="hidden sm:flex p-2 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              aria-label={width === 'fixed' ? 'Expand to full width' : 'Use fixed width'}
              title={width === 'fixed' ? 'Expand to full width' : 'Use fixed width'}
            >
              {width === 'fixed' ? (
                <ExpandIcon className="w-5 h-5" />
              ) : (
                <ContractIcon className="w-5 h-5" />
              )}
            </button>

            {/* Theme Toggle */}
            <div className="relative" ref={themeMenuRef}>
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="p-2 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                aria-label="Toggle theme"
              >
                {resolvedTheme === 'dark' ? (
                  <MoonIcon className="w-5 h-5" />
                ) : (
                  <SunIcon className="w-5 h-5" />
                )}
              </button>
              
              {showThemeMenu && (
                <div
                  className="absolute right-0 mt-1 w-36 rounded-lg border shadow-lg overflow-hidden animate-fade-in"
                  style={{
                    background: 'var(--bg-secondary)',
                    borderColor: 'var(--border-primary)',
                  }}
                >
                  {[
                    { value: 'light', label: 'Light', icon: SunIcon },
                    { value: 'dark', label: 'Dark', icon: MoonIcon },
                    { value: 'system', label: 'System', icon: MonitorIcon },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => { setTheme(option.value as 'light' | 'dark' | 'system'); setShowThemeMenu(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-[var(--bg-tertiary)] ${
                        theme === option.value ? 'bg-[var(--bg-tertiary)]' : ''
                      }`}
                      style={{ color: 'var(--text-primary)' }}
                    >
                      <option.icon className="w-4 h-4" />
                      {option.label}
                      {theme === option.value && <CheckIcon className="w-4 h-4 ml-auto" style={{ color: 'var(--accent-green)' }} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <CloseIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div 
            className="md:hidden py-4 border-t animate-fade-in"
            style={{ borderColor: 'var(--border-primary)' }}
          >
            <div className="space-y-1">
              <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Tools
              </div>
              {toolsMenu.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-2 py-2 text-sm rounded-md hover:bg-[var(--bg-tertiary)]"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {item.label}
                </Link>
              ))}
              
              <div className="px-2 py-1 mt-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Converters
              </div>
              {convertersMenu.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-2 py-2 text-sm rounded-md hover:bg-[var(--bg-tertiary)]"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {item.label}
                </Link>
              ))}

              <div className="pt-3 mt-3 border-t" style={{ borderColor: 'var(--border-primary)' }}>
                <Link
                  href="/learn"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-2 py-2 text-sm rounded-md hover:bg-[var(--bg-tertiary)]"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Learn JSON
                </Link>
                <Link
                  href="/datasets"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-2 py-2 text-sm rounded-md hover:bg-[var(--bg-tertiary)]"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Datasets
                </Link>
                <Link
                  href="/json-formatter"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-[var(--bg-tertiary)]"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <ChromeIcon className="w-4 h-4" />
                  Chrome Extension
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function Logo({ className, status }: { className?: string; status?: 'valid' | 'invalid' | 'idle' | null }) {
  // New brand logo: Blue rounded rectangle with {} and status badge
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
    >
      {/* Blue rounded rectangle background */}
      <rect width="64" height="64" rx="14" fill="#0A84FF" />
      
      {/* {} text */}
      <text
        x="32"
        y="44"
        textAnchor="middle"
        fill="white"
        fontFamily="'SF Mono', 'JetBrains Mono', monospace"
        fontWeight="600"
        fontSize="32"
      >
        {"{}"}
      </text>
      
      {/* Status badge - green checkmark for valid/idle, red X for invalid */}
      {status === 'invalid' ? (
        <>
          <circle cx="52" cy="12" r="10" fill="#FF453A" />
          <path
            d="M48 8L56 16M56 8L48 16"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <>
          <circle cx="52" cy="12" r="10" fill="#32D74B" />
          <path
            d="M47 12L50.5 15.5L57 9"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function MonitorIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

function CheckIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ChromeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C8.21 0 4.831 1.757 2.632 4.501l3.953 6.848A5.454 5.454 0 0 1 12 6.545h10.691A12 12 0 0 0 12 0zM1.931 5.47A11.943 11.943 0 0 0 0 12c0 6.012 4.42 10.991 10.189 11.864l3.953-6.847a5.45 5.45 0 0 1-6.865-2.29zm13.342 2.166a5.446 5.446 0 0 1 1.45 7.09l.002.001h-.002l-3.952 6.848a12.014 12.014 0 0 0 9.229-9.575z" />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );
}

function ExpandIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}

function ContractIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="4 14 10 14 10 20" />
      <polyline points="20 10 14 10 14 4" />
      <line x1="14" y1="10" x2="21" y2="3" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}
