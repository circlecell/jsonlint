'use client';

import Link from 'next/link';
import { useLayout } from './LayoutProvider';

const footerLinks = {
  tools: [
    { href: '/', label: 'JSON Validator' },
    { href: '/json-pretty-print', label: 'Pretty Print' },
    { href: '/json-minify', label: 'JSON Minify' },
    { href: '/json-diff', label: 'JSON Diff' },
    { href: '/json-tree', label: 'Tree Viewer' },
    { href: '/json-schema', label: 'Schema Validator' },
    { href: '/json-schema-generator', label: 'Schema Generator' },
    { href: '/json-path', label: 'JSON Path' },
  ],
  converters: [
    { href: '/json-to-csv', label: 'JSON to CSV' },
    { href: '/json-to-excel', label: 'JSON to Excel' },
    { href: '/json-to-sql', label: 'JSON to SQL' },
    { href: '/sql-to-json', label: 'SQL to JSON' },
    { href: '/json-to-yaml', label: 'JSON to YAML' },
    { href: '/json-to-xml', label: 'JSON to XML' },
    { href: '/json-to-java', label: 'JSON to Java' },
    { href: '/json-to-python', label: 'JSON to Python' },
  ],
  learn: [
    { href: '/learn', label: 'All Resources' },
    { href: '/python-json', label: 'Python JSON Guide' },
    { href: '/json-parse-error', label: 'Fix Parse Errors' },
    { href: '/json-syntax-error', label: 'Fix Syntax Errors' },
    { href: '/json-vs-xml', label: 'JSON vs XML' },
    { href: '/json-comments', label: 'JSON Comments' },
    { href: '/how-to-open-json-file', label: 'Open JSON Files' },
  ],
  datasets: [
    { href: '/datasets/http-status-codes', label: 'HTTP Status Codes' },
    { href: '/datasets/programming-languages', label: 'Programming Languages' },
    { href: '/datasets/file-extensions', label: 'File Extensions' },
    { href: '/datasets/config-package', label: 'package.json Template' },
    { href: '/datasets/config-tsconfig', label: 'tsconfig.json Template' },
  ],
  friends: [
    { href: 'https://fr.sh/7ee613', label: 'Fullres', external: true },
    { href: 'https://chartkit.dev', label: 'ChartKit', external: true },
    { href: 'https://markdowneditor.org', label: 'Markdown Editor', external: true },
    { href: 'https://jscompress.com/', label: 'JSCompress', external: true },
    { href: 'https://randomkeygen.com/', label: 'RandomKeygen', external: true },
    { href: 'https://jsoncompare.com/', label: 'JSONCompare', external: true },
    { href: 'https://validatejavascript.com/', label: 'ValidateJavaScript', external: true },
  ],
};

function FooterSection({ 
  title, 
  links,
  viewAllHref,
  viewAllLabel,
}: { 
  title: string; 
  links: { href: string; label: string; external?: boolean }[];
  viewAllHref?: string;
  viewAllLabel?: string;
}) {
  return (
    <div>
      <h3
        className="font-mono text-xs font-semibold uppercase tracking-wider mb-4"
        style={{ color: 'var(--text-primary)' }}
      >
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            {link.external ? (
              <a
                href={link.href}
                rel="noopener noreferrer"
                className="text-sm hover:text-[var(--accent-blue)] transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                {link.label}
              </a>
            ) : (
              <Link
                href={link.href}
                className="text-sm hover:text-[var(--accent-blue)] transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
        {viewAllHref && (
          <li className="pt-1">
            <Link
              href={viewAllHref}
              className="text-sm font-medium hover:text-[var(--accent-blue)] transition-colors inline-flex items-center gap-1"
              style={{ color: 'var(--text-muted)' }}
            >
              {viewAllLabel || 'View all'} <span aria-hidden="true">→</span>
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}

export function Footer() {
  const { width } = useLayout();

  return (
    <footer
      className="border-t mt-auto pb-24"
      style={{
        background: 'var(--bg-secondary)',
        borderColor: 'var(--border-primary)',
      }}
    >
      <div className={`${width === 'fixed' ? 'max-w-7xl' : ''} mx-auto px-4 sm:px-6 lg:px-8 py-12`}>
        {/* Main footer grid - equal width columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-10">
          <FooterSection title="Tools" links={footerLinks.tools} viewAllHref="/tools" viewAllLabel="All tools" />
          <FooterSection title="Converters" links={footerLinks.converters} viewAllHref="/tools" viewAllLabel="All converters" />
          <FooterSection title="Learn" links={footerLinks.learn} />
          <FooterSection title="Datasets" links={footerLinks.datasets} viewAllHref="/datasets" viewAllLabel="All datasets" />
          <FooterSection title="Friends" links={footerLinks.friends} />
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: 'var(--border-primary)' }}
        >
          <div className="text-sm flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
            <span>© {new Date().getFullYear()} JSONLint.com. Made with ❤️ for developers.</span>
            <span>·</span>
            <span>Hosted by{' '}
              <a
                href="https://ready.dev?ref=jsonlint.com"
                rel="noopener noreferrer"
                className="hover:text-[var(--accent-blue)] transition-colors"
                style={{ color: 'var(--text-muted)' }}
              >
                ready.dev
              </a>
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/about"
              className="hover:text-[var(--accent-blue)] transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              About
            </Link>
            <Link
              href="/privacy"
              className="hover:text-[var(--accent-blue)] transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              Privacy
            </Link>
            <Link
              href="/json-formatter"
              className="hover:text-[var(--accent-blue)] transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              Chrome Extension
            </Link>
            <a
              href="https://github.com/circlecell/jsonlint"
              rel="noopener noreferrer"
              className="hover:text-[var(--accent-blue)] transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
