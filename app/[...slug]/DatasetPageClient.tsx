'use client';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { DatasetPreview } from '@/components/DatasetPreview';
import { ShareButtons } from '@/components/ShareButtons';
import Link from 'next/link';

interface DatasetPageClientProps {
  title: string;
  content: string;
  breadcrumbs: { label: string; href?: string }[];
  datasetPath: string;
  datasetName: string;
  otherDatasets: { name: string; href: string }[];
}

export function DatasetPageClient({
  title,
  content,
  breadcrumbs,
  datasetPath,
  datasetName,
  otherDatasets,
}: DatasetPageClientProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr,280px] gap-6">
        {/* Main content */}
        <div className="min-w-0">
          <Breadcrumbs items={breadcrumbs} />
          
          {/* Header */}
          <header className="mb-6">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h1
                className="text-2xl sm:text-3xl font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                {title}
              </h1>
              <div className="flex-shrink-0 mt-1">
                <ShareButtons title={title} />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                style={{
                  background: 'var(--bg-tertiary)',
                  color: 'var(--accent-blue)',
                }}
              >
                <DatabaseIcon className="w-3 h-3 mr-1" />
                JSON Dataset
              </span>
            </div>
          </header>
          
          {/* Dataset Preview */}
          <section className="mb-8">
            <h2
              className="text-base font-semibold mb-3 flex items-center gap-2"
              style={{ color: 'var(--text-primary)' }}
            >
              <CodeIcon className="w-4 h-4" />
              Live Preview
            </h2>
            <DatasetPreview datasetPath={datasetPath} datasetName={datasetName} />
          </section>
          
          {/* Documentation */}
          <section>
            <div
              className="prose-custom max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </section>
        </div>
        
        {/* Sidebar */}
        <aside className="hidden xl:block">
          <div className="sticky top-20 space-y-4">
            {/* Quick actions */}
            <div
              className="p-4 rounded-lg"
              style={{ background: 'var(--bg-tertiary)' }}
            >
              <h3
                className="font-semibold text-xs mb-3"
                style={{ color: 'var(--text-primary)' }}
              >
                Quick Access
              </h3>
              <div className="space-y-1 text-sm">
                <a
                  href={datasetPath}
                  download
                  className="flex items-center gap-2 p-2 rounded-md transition-colors hover:bg-[var(--bg-secondary)]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <DownloadIcon className="w-4 h-4" />
                  Download JSON
                </a>
                <a
                  href={datasetPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 rounded-md transition-colors hover:bg-[var(--bg-secondary)]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <ExternalIcon className="w-4 h-4" />
                  View Raw JSON
                </a>
              </div>
            </div>
            
            {/* Other datasets */}
            {otherDatasets.length > 0 && (
              <div
                className="p-4 rounded-lg"
                style={{ background: 'var(--bg-tertiary)' }}
              >
                <h3
                  className="font-semibold text-xs mb-3"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Other Datasets
                </h3>
                <ul className="space-y-1 text-sm">
                  {otherDatasets.map((dataset) => (
                    <li key={dataset.href}>
                      <Link
                        href={dataset.href}
                        className="flex items-center gap-2 p-2 rounded-md transition-colors hover:bg-[var(--bg-secondary)]"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <DatabaseIcon className="w-4 h-4" />
                        {dataset.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function DatabaseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

function CodeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function ExternalIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
