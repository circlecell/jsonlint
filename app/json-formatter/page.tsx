import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ToolNav } from '@/components/ToolNav';
import { JsonValidatorWrapper } from '../JsonValidatorWrapper';
import { SeoContent, ToolsSidebar } from '@/components/SeoContent';
import { Container } from '@/components/Container';

export const metadata: Metadata = {
  title: 'JSON Formatter - Format & Beautify JSON Online',
  description:
    'Free online JSON formatter and beautifier. Paste JSON to instantly format, beautify, and validate it with customizable indentation. No signup, works in your browser.',
  alternates: { canonical: '/json-formatter' },
};

export default function JsonFormatterPage() {
  return (
    <>
      <ToolNav />

      <Container className="py-4">
        {/* Top ad zone */}
        <div className="mb-4 flex justify-center">
          <div id="bsa-zone_1570746984891-3_123456"></div>
        </div>

        <h1
          className="text-2xl font-bold mb-1"
          style={{ color: 'var(--text-primary)' }}
        >
          JSON Formatter
        </h1>
        <p
          className="text-sm mb-3"
          style={{ color: 'var(--text-muted)' }}
        >
          Format, beautify, and validate JSON online — paste your JSON below and
          it&apos;s formatted instantly.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6">
          {/* Main editor area */}
          <div className="min-w-0">
            <Suspense fallback={<EditorSkeleton />}>
              <JsonValidatorWrapper />
            </Suspense>

            {/* Cross-links to related tools (descriptive anchors) */}
            <nav
              className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm"
              style={{ color: 'var(--text-secondary)' }}
              aria-label="Related JSON tools"
            >
              <Link href="/json-pretty-print" className="text-[var(--accent-blue)] hover:underline">
                Pretty print JSON
              </Link>
              <Link href="/json-tree" className="text-[var(--accent-blue)] hover:underline">
                JSON tree viewer
              </Link>
              <Link href="/json-minify" className="text-[var(--accent-blue)] hover:underline">
                Minify JSON
              </Link>
              <Link href="/json-formatter/chrome-extension" className="text-[var(--accent-blue)] hover:underline">
                JSON Formatter for Chrome
              </Link>
            </nav>

            {/* Native ad */}
            <div className="native-ad-container mt-6"></div>

            {/* SEO Content */}
            <SeoContent />
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-20">
              {/* Sidebar ad zone */}
              <div className="mb-4">
                <div id="bsa-zone_1605730077127-6_123456"></div>
              </div>

              <ToolsSidebar />
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}

function EditorSkeleton() {
  return (
    <div
      className="rounded-lg animate-pulse"
      style={{
        background: 'var(--bg-secondary)',
        height: '400px',
      }}
    />
  );
}
