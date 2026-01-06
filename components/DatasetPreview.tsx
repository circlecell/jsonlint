'use client';

import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useTheme } from './ThemeProvider';
import copy from 'copy-to-clipboard';

interface DatasetPreviewProps {
  datasetPath: string;
  datasetName: string;
}

export function DatasetPreview({ datasetPath, datasetName }: DatasetPreviewProps) {
  const { resolvedTheme } = useTheme();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [stats, setStats] = useState<{ size: string; items: number } | null>(null);

  useEffect(() => {
    async function loadDataset() {
      try {
        const response = await fetch(datasetPath);
        if (!response.ok) throw new Error('Failed to load dataset');
        const text = await response.text();
        const data = JSON.parse(text);
        
        // Calculate stats
        const sizeBytes = new Blob([text]).size;
        const size = sizeBytes > 1024 
          ? `${(sizeBytes / 1024).toFixed(1)} KB` 
          : `${sizeBytes} B`;
        
        // Count items (look for first array in the data)
        let items = 0;
        const findArray = (obj: unknown): number => {
          if (Array.isArray(obj)) return obj.length;
          if (obj && typeof obj === 'object') {
            for (const value of Object.values(obj)) {
              const count = findArray(value);
              if (count > 0) return count;
            }
          }
          return 0;
        };
        items = findArray(data);
        
        setStats({ size, items });
        setContent(JSON.stringify(data, null, 2));
        setLoading(false);
      } catch (e) {
        setError((e as Error).message);
        setLoading(false);
      }
    }
    
    loadDataset();
  }, [datasetPath]);

  const handleCopy = () => {
    copy(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${datasetName}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOpenInValidator = () => {
    const encoded = encodeURIComponent(content);
    window.open(`/?json=${encoded}`, '_blank');
  };

  if (loading) {
    return (
      <div
        className="rounded-lg p-8 flex items-center justify-center"
        style={{ background: 'var(--bg-secondary)', height: '300px' }}
      >
        <div className="animate-pulse" style={{ color: 'var(--text-muted)' }}>
          Loading dataset...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-lg p-8"
        style={{ background: 'rgba(239, 68, 68, 0.1)' }}
      >
        <span className="text-accent-red">Error loading dataset: {error}</span>
      </div>
    );
  }

  const displayHeight = expanded ? '500px' : '300px';
  const lineCount = content.split('\n').length;

  return (
    <div className="space-y-4">
      {/* Stats and actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-sm">
          {stats && (
            <>
              <span style={{ color: 'var(--text-muted)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>{stats.items}</strong> items
              </span>
              <span style={{ color: 'var(--text-muted)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>{stats.size}</strong>
              </span>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="btn btn-secondary text-sm"
          >
            {copied ? (
              <>
                <CheckIcon className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <CopyIcon className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="btn btn-secondary text-sm"
          >
            <DownloadIcon className="w-4 h-4" />
            Download
          </button>
          <button
            onClick={handleOpenInValidator}
            className="btn btn-primary text-sm"
          >
            <ExternalIcon className="w-4 h-4" />
            Open in JSONLint
          </button>
        </div>
      </div>
      
      {/* Preview */}
      <div
        className="rounded-lg border overflow-hidden"
        style={{
          background: 'var(--bg-secondary)',
          borderColor: 'var(--border-primary)',
        }}
      >
        <Editor
          height={displayHeight}
          language="json"
          value={content}
          theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: 'JetBrains Mono, Fira Code, monospace',
            lineNumbers: 'on',
            folding: true,
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            tabSize: 2,
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>
      
      {/* Expand/collapse */}
      {lineCount > 20 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm flex items-center gap-1 transition-colors hover:text-[var(--text-primary)]"
          style={{ color: 'var(--accent-blue)' }}
        >
          {expanded ? (
            <>
              <ChevronUpIcon className="w-4 h-4" />
              Show less
            </>
          ) : (
            <>
              <ChevronDownIcon className="w-4 h-4" />
              Show full dataset ({lineCount} lines)
            </>
          )}
        </button>
      )}
    </div>
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

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ChevronUpIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}
