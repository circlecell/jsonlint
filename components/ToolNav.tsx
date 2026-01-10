'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLayout } from './LayoutProvider';

const tools = [
  { href: '/', label: 'Validate', icon: CheckCircleIcon },
  { href: '/json-minify', label: 'Minify', icon: CompressIcon },
  { href: '/json-diff', label: 'Diff', icon: DiffIcon },
  { href: '/json-to-csv', label: 'CSV', icon: TableIcon },
  { href: '/json-to-yaml', label: 'YAML', icon: ArrowRightIcon },
  { href: '/json-schema', label: 'Schema', icon: ShieldIcon },
  { href: '/json-path', label: 'Path', icon: TargetIcon },
  { href: '/jwt-decoder', label: 'JWT', icon: KeyIcon },
  { href: '/json-tree', label: 'Tree', icon: TreeIcon },
  { href: '/tools', label: 'All Tools', icon: GridIcon },
];

export function ToolNav() {
  const pathname = usePathname();
  const { width } = useLayout();

  return (
    <div className={`${width === 'fixed' ? 'max-w-7xl' : ''} mx-auto px-4 sm:px-6 lg:px-8`}>
      <nav
        className="border-b border-l border-r rounded-b-lg"
        style={{
          background: 'var(--bg-secondary)',
          borderColor: 'var(--border-primary)',
        }}
      >
        <div className="flex gap-0.5 overflow-x-auto py-1.5 px-2">
          {tools.map((tool) => {
            const isActive =
              pathname === tool.href ||
              (tool.href !== '/' && pathname.startsWith(tool.href));

            return (
              <Link
                key={tool.href}
                href={tool.href}
                className={`tool-nav-item flex items-center gap-1.5 whitespace-nowrap ${
                  isActive ? 'active' : ''
                }`}
              >
                <tool.icon className="w-3.5 h-3.5" />
                {tool.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function CodeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function DiffIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="18" y1="6" x2="18" y2="18" />
      <line x1="6" y1="6" x2="6" y2="18" />
      <line x1="6" y1="12" x2="18" y2="12" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 12 15 22 5" />
    </svg>
  );
}

function TargetIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function CompressIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="4" y1="12" x2="20" y2="12" />
      <polyline points="8 8 4 12 8 16" />
      <polyline points="16 8 20 12 16 16" />
    </svg>
  );
}

function TableIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="3" x2="9" y2="21" />
    </svg>
  );
}

function KeyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  );
}

function TreeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3v6m0 0l-3-3m3 3l3-3" />
      <path d="M6 15v-2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
      <circle cx="12" cy="18" r="2" />
    </svg>
  );
}

function GridIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}
