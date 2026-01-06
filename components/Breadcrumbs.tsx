'use client';

import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-sm">
        <li>
          <Link
            href="/"
            className="transition-colors hover:text-[var(--text-primary)]"
            style={{ color: 'var(--text-muted)' }}
          >
            <HomeIcon className="w-4 h-4" />
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <ChevronIcon className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            {item.href ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-[var(--text-primary)]"
                style={{ color: 'var(--text-muted)' }}
              >
                {item.label}
              </Link>
            ) : (
              <span style={{ color: 'var(--text-primary)' }}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function HomeIcon({ className }: { className?: string }) {
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
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function ChevronIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
