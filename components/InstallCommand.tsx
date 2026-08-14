'use client';

import { useState } from 'react';

/** A copyable `npm install …` pill. Click to copy the command. */
export function InstallCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md font-mono text-xs transition-colors hover:bg-[var(--bg-secondary)]"
      style={{
        background: 'var(--bg-tertiary)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-primary)',
      }}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
      aria-label={copied ? 'Copied' : `Copy: ${command}`}
    >
      <span aria-hidden="true" style={{ color: 'var(--text-muted)' }}>$</span>
      <span>{command}</span>
      {copied ? (
        <CheckIcon className="w-3.5 h-3.5" />
      ) : (
        <CopyIcon className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ color: 'var(--accent-green)' }} aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
