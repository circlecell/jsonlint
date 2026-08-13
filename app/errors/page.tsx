import { Metadata } from 'next';
import Link from 'next/link';
import { ToolNav } from '@/components/ToolNav';
import { Container } from '@/components/Container';
import { getAllErrorCodes } from '@/lib/error-codes';

export const metadata: Metadata = {
  title: 'JSON Error Codes — Reference & Fixes',
  description:
    'A complete reference for every JSON validation error and warning: what each code means, an example, and how to fix it. Powered by @jsonlint/core.',
  keywords: [
    'json error codes',
    'json validation errors',
    'json syntax error',
    'json parse error',
    'fix json error',
    'json error reference',
  ],
  openGraph: {
    title: 'JSON Error Codes — Reference & Fixes',
    description:
      'Every JSON validation error and warning explained, with examples and fixes.',
  },
  alternates: { canonical: 'https://jsonlint.com/errors' },
};

export default function ErrorsIndexPage() {
  const all = getAllErrorCodes();
  const errors = all.filter((e) => e.severity === 'error');
  const warnings = all.filter((e) => e.severity === 'warning');

  const Section = ({
    title,
    subtitle,
    items,
    tone,
  }: {
    title: string;
    subtitle: string;
    items: typeof all;
    tone: 'error' | 'warning';
  }) => {
    const color = tone === 'error' ? 'text-accent-red' : 'text-accent-amber';
    return (
      <section className="mb-8">
        <h2
          className="text-lg font-semibold mb-1"
          style={{ color: 'var(--text-primary)' }}
        >
          {title}
        </h2>
        <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
          {subtitle}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {items.map((e) => (
            <Link
              key={e.code}
              href={`/errors/${e.code}`}
              className="flex items-start gap-2 rounded-md px-3 py-2 transition-colors"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-primary)',
              }}
            >
              <span
                className={`font-mono text-xs px-1.5 py-0.5 rounded flex-shrink-0 ${color}`}
                style={{ background: 'var(--bg-tertiary)' }}
              >
                {e.code}
              </span>
              <span className="min-w-0">
                <span
                  className="text-sm font-medium"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {e.title}
                </span>
                <span
                  className="block text-xs"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {e.summary}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    );
  };

  return (
    <>
      <ToolNav />

      <Container className="py-4">
        <h1
          className="text-2xl font-bold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          JSON Error Codes
        </h1>
        <p className="text-sm mb-6 max-w-2xl" style={{ color: 'var(--text-muted)' }}>
          Every diagnostic the JSONLint validator can report, with a plain-English
          explanation, an example, and how to fix it. Paste your JSON into the{' '}
          <Link href="/" style={{ color: 'var(--accent-blue)' }}>
            validator
          </Link>{' '}
          to see all of these at once, each linked to its reference page.
        </p>

        <Section
          title="Errors"
          subtitle="These make the document invalid — it will not parse until they are fixed."
          items={errors}
          tone="error"
        />
        <Section
          title="Warnings"
          subtitle="The document is still valid JSON, but these are common sources of bugs."
          items={warnings}
          tone="warning"
        />

        <p className="text-sm mt-4" style={{ color: 'var(--text-muted)' }}>
          These codes are produced by{' '}
          <a
            href="https://www.npmjs.com/package/@jsonlint/core"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--accent-blue)' }}
          >
            @jsonlint/core
          </a>
          , the open-source engine behind JSONLint. Run the same checks in your own
          tooling with <code>npm install @jsonlint/core</code>.
        </p>
      </Container>
    </>
  );
}
