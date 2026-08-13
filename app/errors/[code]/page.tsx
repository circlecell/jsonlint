import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ToolNav } from '@/components/ToolNav';
import { Container } from '@/components/Container';
import {
  getAllErrorCodes,
  getErrorCode,
  type ErrorCodeEntry,
} from '@/lib/error-codes';

interface PageProps {
  params: { code: string };
}

export function generateStaticParams() {
  return getAllErrorCodes().map((e) => ({ code: e.code }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const entry = getErrorCode(params.code);
  if (!entry) {
    return { title: 'Unknown JSON error code' };
  }
  const label = entry.severity === 'error' ? 'Error' : 'Warning';
  const title = `${entry.code}: ${entry.title} — JSON ${label}`;
  const description = `${entry.summary} Learn what JSON ${entry.code} means, see an example, and how to fix it.`;
  return {
    title,
    description,
    keywords: [
      entry.code,
      `json ${entry.code}`,
      `${entry.code} json error`,
      entry.title.toLowerCase(),
      'json error',
      'json validator',
    ],
    openGraph: { title, description },
    alternates: { canonical: `https://jsonlint.com/errors/${entry.code}` },
  };
}

function CodeBlock({
  label,
  tone,
  children,
}: {
  label: string;
  tone: 'bad' | 'good';
  children: string;
}) {
  const color = tone === 'bad' ? 'text-accent-red' : 'text-accent-green';
  const bg =
    tone === 'bad' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)';
  return (
    <div>
      <div className={`text-xs font-medium mb-1 ${color}`}>{label}</div>
      <pre
        className="text-sm font-mono overflow-x-auto rounded-md px-3 py-2 m-0"
        style={{ background: bg, color: 'var(--text-secondary)' }}
      >
        {children}
      </pre>
    </div>
  );
}

export default function ErrorCodePage({ params }: PageProps) {
  const entry: ErrorCodeEntry | null = getErrorCode(params.code);
  if (!entry) notFound();

  const isError = entry.severity === 'error';
  const badgeColor = isError ? 'text-accent-red' : 'text-accent-amber';

  return (
    <>
      <ToolNav />

      <Container className="py-4">
        <nav className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
          <Link href="/errors" className="hover:underline">
            JSON error codes
          </Link>{' '}
          / {entry.code}
        </nav>

        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span
            className={`font-mono text-sm px-2 py-0.5 rounded ${badgeColor}`}
            style={{ background: 'var(--bg-tertiary)' }}
          >
            {entry.code}
          </span>
          <span
            className={`text-xs uppercase tracking-wide ${badgeColor}`}
          >
            {isError ? 'Error' : 'Warning'}
          </span>
        </div>

        <h1
          className="text-2xl font-bold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          {entry.title}
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
          {entry.summary}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6">
          <div className="prose-custom max-w-none">
            <h2>What it means</h2>
            <p>{entry.explanation}</p>

            <h2>Example</h2>
            <div className="space-y-3 not-prose">
              <CodeBlock label="Invalid" tone="bad">
                {entry.example.bad}
              </CodeBlock>
              {entry.example.good && (
                <CodeBlock label="Valid" tone="good">
                  {entry.example.good}
                </CodeBlock>
              )}
            </div>

            <h2>How to fix it</h2>
            <p>{entry.fix}</p>

            <p>
              <Link href="/">Validate your JSON</Link> to see this and every
              other issue highlighted in one pass.
            </p>

            <hr />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Diagnostics on this page come from{' '}
              <a
                href="https://www.npmjs.com/package/@jsonlint/core"
                target="_blank"
                rel="noopener noreferrer"
              >
                @jsonlint/core
              </a>
              , the open-source engine that powers the JSONLint validator.
              Install it with <code>npm install @jsonlint/core</code>.
            </p>
          </div>

          <aside className="lg:pt-1">
            <div
              className="rounded-lg p-4 text-sm"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-primary)',
              }}
            >
              <div
                className="font-medium mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                Other codes
              </div>
              <ul className="space-y-1 list-none p-0 m-0">
                {getAllErrorCodes()
                  .filter((e) => e.code !== entry.code)
                  .slice(0, 12)
                  .map((e) => (
                    <li key={e.code}>
                      <Link
                        href={`/errors/${e.code}`}
                        className="hover:underline"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <span className="font-mono text-xs">{e.code}</span> —{' '}
                        {e.title}
                      </Link>
                    </li>
                  ))}
              </ul>
              <Link
                href="/errors"
                className="inline-block mt-3 text-xs"
                style={{ color: 'var(--accent-blue)' }}
              >
                View all error codes →
              </Link>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
