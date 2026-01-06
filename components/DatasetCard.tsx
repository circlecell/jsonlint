'use client';

import { useState } from 'react';
import Link from 'next/link';
import copy from 'copy-to-clipboard';
import { DatasetMetadata, CATEGORY_CONFIG } from '@/lib/dataset-types';

interface DatasetCardProps {
  dataset: DatasetMetadata;
  sampleData?: string;
}

export function DatasetCard({ dataset, sampleData }: DatasetCardProps) {
  const [copied, setCopied] = useState(false);
  
  const categoryConfig = CATEGORY_CONFIG[dataset.category];
  
  const handleCopySample = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (sampleData) {
      copy(sampleData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenInValidator = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/?url=${dataset.jsonPath}`;
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = dataset.jsonPath;
    link.download = `${dataset.slug}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Display first 3 fields + count of remaining
  const displayFields = dataset.fields.slice(0, 3);
  const remainingFields = dataset.fields.length - 3;

  return (
    <div
      className="group relative flex flex-col p-5 rounded-lg border transition-all hover:border-[var(--accent-blue)] hover:shadow-md"
      style={{
        background: 'var(--bg-secondary)',
        borderColor: 'var(--border-primary)',
      }}
    >
      {/* Header with category badge and record count */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
          style={{
            background: 'var(--bg-tertiary)',
            color: categoryConfig.color,
          }}
        >
          {categoryConfig.label}
        </span>
        <span
          className="text-xs font-medium"
          style={{ color: 'var(--text-muted)' }}
        >
          {dataset.records} records
        </span>
      </div>

      {/* Title and icon */}
      <Link href={dataset.docPath} className="flex items-center gap-3 mb-2">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--bg-tertiary)' }}
        >
          <DatabaseIcon
            className="w-5 h-5"
            style={{ color: categoryConfig.color }}
          />
        </div>
        <h3
          className="font-semibold group-hover:text-[var(--accent-blue)] transition-colors line-clamp-1"
          style={{ color: 'var(--text-primary)' }}
        >
          {dataset.title.replace(' JSON Dataset', '')}
        </h3>
      </Link>

      {/* Description */}
      <p
        className="text-sm line-clamp-2 mb-3 flex-grow"
        style={{ color: 'var(--text-muted)' }}
      >
        {dataset.description}
      </p>

      {/* Fields preview */}
      {dataset.fields.length > 0 && (
        <div className="mb-4">
          <span
            className="text-xs"
            style={{ color: 'var(--text-muted)' }}
          >
            Fields:{' '}
            <span style={{ color: 'var(--text-secondary)' }}>
              {displayFields.map(f => f.name).join(', ')}
              {remainingFields > 0 && ` +${remainingFields} more`}
            </span>
          </span>
        </div>
      )}

      {/* File size badge */}
      <div className="flex items-center gap-2 mb-4">
        <span
          className="inline-flex items-center px-2 py-0.5 rounded text-xs"
          style={{
            background: 'var(--bg-tertiary)',
            color: 'var(--text-muted)',
          }}
        >
          <FileIcon className="w-3 h-3 mr-1" />
          {dataset.fileSize}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 pt-3 border-t" style={{ borderColor: 'var(--border-primary)' }}>
        <button
          onClick={handleCopySample}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded transition-colors"
          style={{
            background: 'var(--bg-tertiary)',
            color: copied ? 'var(--accent-green)' : 'var(--text-secondary)',
          }}
          title="Copy first record to clipboard"
        >
          {copied ? (
            <>
              <CheckIcon className="w-3 h-3" />
              Copied
            </>
          ) : (
            <>
              <CopyIcon className="w-3 h-3" />
              Copy
            </>
          )}
        </button>
        
        <button
          onClick={handleOpenInValidator}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded transition-colors hover:bg-[var(--bg-tertiary)]"
          style={{
            background: 'var(--bg-tertiary)',
            color: 'var(--text-secondary)',
          }}
          title="Open in JSON Validator"
        >
          <ValidateIcon className="w-3 h-3" />
          Validate
        </button>
        
        <button
          onClick={handleDownload}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded transition-colors hover:bg-[var(--bg-tertiary)]"
          style={{
            background: 'var(--bg-tertiary)',
            color: 'var(--text-secondary)',
          }}
          title="Download JSON file"
        >
          <DownloadIcon className="w-3 h-3" />
          Download
        </button>
      </div>
    </div>
  );
}

// Icons
function DatabaseIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

function FileIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ValidateIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 12l2 2 4-4" />
      <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
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
