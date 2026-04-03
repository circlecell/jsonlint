'use client';

import dynamic from 'next/dynamic';
import { useState, useCallback } from 'react';

// Dynamically import the full Monaco-based editor — no SSR, deferred until needed
const JsonEditor = dynamic(
  () => import('./JsonEditor').then(mod => ({ default: mod.JsonEditor })),
  {
    ssr: false,
    loading: () => (
      <div
        className="rounded-lg animate-pulse"
        style={{
          background: 'var(--bg-secondary)',
          height: '500px',
        }}
      />
    ),
  }
);

interface LazyJsonEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  height?: string;
  errorLine?: number | null;
  className?: string;
  onDrop?: (content: string) => void;
  language?: string;
}

/**
 * Interaction-gated wrapper around JsonEditor.
 *
 * On the initial render it shows a lightweight placeholder that looks like
 * the real editor. Once the user clicks, focuses, or drops a file onto it,
 * the full Monaco editor is loaded dynamically (no SSR).
 *
 * This keeps ~600 KB+ of Monaco / Shiki JS out of the critical path.
 */
export function LazyJsonEditor(props: LazyJsonEditorProps) {
  const [activated, setActivated] = useState(false);

  const activate = useCallback(() => {
    if (!activated) setActivated(true);
  }, [activated]);

  if (!activated) {
    return (
      <div
        role="textbox"
        tabIndex={0}
        onClick={activate}
        onFocus={activate}
        onDragOver={(e) => { e.preventDefault(); activate(); }}
        onDrop={(e) => { e.preventDefault(); activate(); }}
        className={`rounded-lg cursor-text border ${props.className || ''}`}
        style={{
          background: 'var(--bg-secondary)',
          borderColor: 'var(--border-primary)',
          height: props.height || '500px',
          padding: '16px',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '14px',
          color: 'var(--text-muted)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div style={{ opacity: 0.5 }}>
          {props.value
            ? props.value.slice(0, 500)
            : 'Click here to start editing JSON...'}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            fontSize: '12px',
            opacity: 0.4,
          }}
        >
          Click to activate editor
        </div>
      </div>
    );
  }

  return <JsonEditor {...(props as any)} />;
}
