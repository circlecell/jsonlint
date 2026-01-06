'use client';

import { useState, useMemo } from 'react';
import { JsonEditor } from '@/components/JsonEditor';
import { parseJSON } from '@/lib/json-utils';
import { diffJson, Change } from 'diff';

export function JsonDiff() {
  const [leftInput, setLeftInput] = useState('');
  const [rightInput, setRightInput] = useState('');
  const [diffResult, setDiffResult] = useState<Change[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCompare = () => {
    // Validate both inputs
    const leftResult = parseJSON(leftInput);
    const rightResult = parseJSON(rightInput);

    if (!leftInput.trim() || !rightInput.trim()) {
      setError('Both inputs are required');
      setDiffResult(null);
      return;
    }

    if (!leftResult.valid) {
      setError(`Left JSON is invalid: ${leftResult.error}`);
      setDiffResult(null);
      return;
    }

    if (!rightResult.valid) {
      setError(`Right JSON is invalid: ${rightResult.error}`);
      setDiffResult(null);
      return;
    }

    // Format both for consistent comparison
    const leftFormatted = JSON.stringify(leftResult.data, null, 2);
    const rightFormatted = JSON.stringify(rightResult.data, null, 2);

    const diff = diffJson(leftResult.data as object, rightResult.data as object);
    setDiffResult(diff);
    setError(null);
  };

  const handleClear = () => {
    setLeftInput('');
    setRightInput('');
    setDiffResult(null);
    setError(null);
  };

  const handleSwap = () => {
    const temp = leftInput;
    setLeftInput(rightInput);
    setRightInput(temp);
    setDiffResult(null);
  };

  const stats = useMemo(() => {
    if (!diffResult) return null;
    let additions = 0;
    let deletions = 0;
    diffResult.forEach((part) => {
      const lines = part.value.split('\n').length - 1;
      if (part.added) additions += lines;
      if (part.removed) deletions += lines;
    });
    return { additions, deletions };
  }, [diffResult]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Input */}
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            Original JSON
          </label>
          <div className="editor-container">
            <JsonEditor value={leftInput} onChange={setLeftInput} height="300px" />
          </div>
        </div>

        {/* Right Input */}
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            Modified JSON
          </label>
          <div className="editor-container">
            <JsonEditor
              value={rightInput}
              onChange={setRightInput}
              height="300px"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button className="btn btn-primary" onClick={handleCompare}>
          <DiffIcon className="w-4 h-4" />
          Compare
        </button>
        <button className="btn btn-secondary" onClick={handleSwap}>
          <SwapIcon className="w-4 h-4" />
          Swap
        </button>
        <button className="btn btn-secondary" onClick={handleClear}>
          Clear
        </button>
        {stats && (
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            <span className="text-accent-green">+{stats.additions}</span>
            <span className="mx-2">/</span>
            <span className="text-accent-red">-{stats.deletions}</span>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div
          className="p-4 rounded-lg border animate-fade-in"
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            borderColor: 'rgba(239, 68, 68, 0.3)',
          }}
        >
          <span className="text-accent-red">{error}</span>
        </div>
      )}

      {/* Diff Result */}
      {diffResult && (
        <div className="card p-4 animate-fade-in">
          <h3
            className="text-sm font-medium mb-3"
            style={{ color: 'var(--text-primary)' }}
          >
            Differences
          </h3>
          <pre
            className="font-mono text-sm overflow-x-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            {diffResult.map((part, index) => (
              <span
                key={index}
                style={{
                  color: part.added
                    ? 'var(--accent-green)'
                    : part.removed
                      ? 'var(--accent-red)'
                      : 'var(--text-secondary)',
                  background: part.added
                    ? 'rgba(16, 185, 129, 0.1)'
                    : part.removed
                      ? 'rgba(239, 68, 68, 0.1)'
                      : 'transparent',
                }}
              >
                {part.value}
              </span>
            ))}
          </pre>
        </div>
      )}
    </div>
  );
}

function DiffIcon({ className }: { className?: string }) {
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
      <line x1="18" y1="6" x2="18" y2="18" />
      <line x1="6" y1="6" x2="6" y2="18" />
      <line x1="6" y1="12" x2="18" y2="12" />
    </svg>
  );
}

function SwapIcon({ className }: { className?: string }) {
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
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}
