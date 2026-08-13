'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { LazyJsonEditor as JsonEditor } from './LazyJsonEditor';
import { useValidation } from './ValidationContext';
import {
  parseJSON,
  formatJSON,
  minifyJSON,
  getJSONStats,
  detectFormat,
  sortJSONKeys,
  tryFixJSON,
} from '@/lib/json-utils';
import { lint, type LintDiagnostic } from '@/lib/jsonlint-core-integration';
import { recordValidationSample } from '@/lib/shadow-telemetry';

const SAMPLE_JSON = `{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "active": true,
  "roles": ["admin", "user"],
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "country": "USA"
  },
  "projects": [
    {"id": 1, "name": "Website Redesign"},
    {"id": 2, "name": "Mobile App"}
  ]
}`;

type IndentOption = '2' | '4' | 'tab';

interface JsonValidatorProps {
  initialJson?: string;
  initialUrl?: string;
}

export function JsonValidator({ initialJson, initialUrl }: JsonValidatorProps) {
  const [input, setInput] = useState('');
  const [isFormatted, setIsFormatted] = useState(true);
  const [copied, setCopied] = useState(false);
  const [diagnostics, setDiagnostics] = useState<LintDiagnostic[]>([]);
  const [indentOption, setIndentOption] = useState<IndentOption>('2');
  const containerRef = useRef<HTMLDivElement>(null);
  const { status, setStatus, errorMessage, setErrorMessage, errorLine, setErrorLine } =
    useValidation();

  // Load initial data
  useEffect(() => {
    if (initialJson) {
      const decoded = decodeURIComponent(initialJson);
      setInput(decoded);
      handleValidate(decoded);
    } else if (initialUrl) {
      fetchFromUrl(decodeURIComponent(initialUrl));
    }
  }, [initialJson, initialUrl]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter to validate
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleValidate();
      }
      // Ctrl/Cmd + Shift + F to format
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'f') {
        e.preventDefault();
        if (status === 'valid') handleFormat();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input, status]);

  const fetchFromUrl = async (url: string) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      const formatted = JSON.stringify(data, null, 2);
      setInput(formatted);
      handleValidate(formatted);
    } catch (e) {
      setStatus('invalid');
      setErrorMessage(`Failed to fetch JSON from URL: ${(e as Error).message}`);
    }
  };

  const handleValidate = useCallback(
    (jsonToValidate: string = input) => {
      if (!jsonToValidate.trim()) {
        setStatus('idle');
        setErrorMessage(null);
        setErrorLine(null);
        setDiagnostics([]);
        return;
      }

      // Validated by @jsonlint/core: a single pass returns every error and
      // warning at once, each with a precise line/column. See
      // lib/jsonlint-core-integration.ts.
      const result = lint(jsonToValidate);
      setDiagnostics(result.diagnostics);

      // Sampled, document-free telemetry (code frequency + engine latency).
      // See lib/shadow-telemetry.ts.
      recordValidationSample(result, jsonToValidate.length);

      const firstError = result.diagnostics.find((d) => d.severity === 'error');

      if (result.ok) {
        setStatus('valid');
        setErrorMessage(null);
        setErrorLine(null);
        // Don't auto-format - preserve original input to maintain number formatting (e.g., 1.0 vs 1)
        // User can click "Prettify" to format if desired
        setIsFormatted(detectFormat(jsonToValidate) === 'formatted');
      } else {
        setStatus('invalid');
        setErrorMessage(firstError?.message || 'Invalid JSON');
        setErrorLine(firstError?.line || null);
      }
    },
    [input, setStatus, setErrorMessage, setErrorLine]
  );

  const handleFormat = () => {
    if (status !== 'valid') return;

    try {
      if (isFormatted) {
        setInput(minifyJSON(input));
        setIsFormatted(false);
      } else {
        // Format with selected indent option
        const result = parseJSON(input);
        if (result.valid) {
          const indent = indentOption === 'tab' ? '\t' : parseInt(indentOption, 10);
          setInput(JSON.stringify(result.data, null, indent));
          setIsFormatted(true);
        }
      }
    } catch (e) {
      // Ignore formatting errors
    }
  };

  const handleClear = () => {
    setInput('');
    setStatus('idle');
    setErrorMessage(null);
    setErrorLine(null);
    setDiagnostics([]);
  };

  const handleSort = () => {
    try {
      setInput(sortJSONKeys(input));
    } catch (e) {
      // Ignore errors
    }
  };

  const handleFix = () => {
    const fixed = tryFixJSON(input);
    setInput(fixed);
    handleValidate(fixed);
  };

  const handleDrop = (content: string) => {
    setInput(content);
    handleValidate(content);
  };

  const handleLoadSample = () => {
    setInput(SAMPLE_JSON);
    handleValidate(SAMPLE_JSON);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = status === 'valid' ? getJSONStats(input) : null;
  const format = detectFormat(input);
  const errors = diagnostics.filter((d) => d.severity === 'error');
  const warnings = diagnostics.filter((d) => d.severity === 'warning');

  return (
    <div className="space-y-3">
      {/* Editor */}
      <div
        className={`editor-container ${status === 'valid' ? 'valid' : ''} ${
          status === 'invalid' ? 'invalid' : ''
        }`}
      >
        <JsonEditor
          value={input}
          onChange={setInput}
          height="380px"
          errorLine={errorLine}
          onDrop={handleDrop}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2">
        <button className="btn btn-primary" onClick={() => handleValidate()} title="Ctrl/Cmd + Enter">
          <CheckIcon className="w-4 h-4" />
          Validate
        </button>
        <button className="btn btn-secondary" onClick={handleClear}>
          Clear
        </button>
        <button
          className="btn btn-secondary"
          onClick={handleFormat}
          disabled={status !== 'valid'}
          title="Ctrl/Cmd + Shift + F"
        >
          {isFormatted ? 'Compress' : 'Prettify'}
        </button>
        {!isFormatted && status === 'valid' && (
          <select
            value={indentOption}
            onChange={(e) => setIndentOption(e.target.value as IndentOption)}
            className="px-2 py-1.5 text-sm rounded-lg"
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-primary)',
            }}
            title="Indentation style for Prettify"
          >
            <option value="2">2 spaces</option>
            <option value="4">4 spaces</option>
            <option value="tab">Tab</option>
          </select>
        )}
        <button
          className="btn btn-secondary"
          onClick={handleSort}
          disabled={status !== 'valid'}
        >
          Sort Keys
        </button>
        <button
          className="btn btn-secondary"
          onClick={handleCopy}
          disabled={!input.trim()}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
        {status === 'invalid' && (
          <button className="btn btn-secondary" onClick={handleFix}>
            Try Fix
          </button>
        )}
        {!input.trim() && (
          <button
            className="btn btn-ghost text-sm"
            onClick={handleLoadSample}
            style={{ color: 'var(--accent-blue)' }}
          >
            Load Sample
          </button>
        )}
      </div>
      
      {/* Keyboard shortcuts hint */}
      {!input.trim() && (
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Tip: Press <kbd className="px-1 py-0.5 rounded text-xs" style={{ background: 'var(--bg-tertiary)' }}>Ctrl</kbd>+<kbd className="px-1 py-0.5 rounded text-xs" style={{ background: 'var(--bg-tertiary)' }}>Enter</kbd> to validate
        </p>
      )}

      {/* Status messages */}
      {status === 'valid' && (
        <div className="space-y-2">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm animate-fade-in"
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
            }}
          >
            <CheckCircleIcon className="w-4 h-4 text-accent-green flex-shrink-0" />
            <span className="font-medium text-accent-green">Valid JSON</span>
            {stats && (
              <span
                className="ml-2"
                style={{ color: 'var(--text-muted)' }}
              >
                {stats.sizeFormatted} • {stats.keys} keys • depth {stats.depth} •{' '}
                {stats.objects} objects • {stats.arrays} arrays
              </span>
            )}
          </div>
          {warnings.length > 0 && (
            <div
              className="space-y-3 px-3 py-2 rounded-md animate-fade-in"
              style={{ background: 'rgba(245, 158, 11, 0.1)' }}
            >
              {warnings.map((d, i) => (
                <DiagnosticCard key={`w${i}`} d={d} sourceText={input} />
              ))}
            </div>
          )}
        </div>
      )}

      {status === 'invalid' && (
        <div
          className="space-y-3 px-3 py-2 rounded-md animate-fade-in"
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
          }}
        >
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <XCircleIcon className="w-4 h-4 text-accent-red flex-shrink-0" />
            <span className="font-medium text-accent-red text-sm">Invalid JSON</span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {errors.length} error{errors.length === 1 ? '' : 's'}
              {warnings.length > 0 &&
                ` • ${warnings.length} warning${warnings.length === 1 ? '' : 's'}`}
            </span>
          </div>
          <div className="space-y-3">
            {errors.map((d, i) => (
              <DiagnosticCard key={`e${i}`} d={d} sourceText={input} />
            ))}
            {warnings.map((d, i) => (
              <DiagnosticCard key={`w${i}`} d={d} sourceText={input} />
            ))}
          </div>
        </div>
      )}

      {/* Powered by @jsonlint/core — the engine behind this validator */}
      <div
        className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs pt-1"
        style={{ color: 'var(--text-muted)' }}
      >
        <span>
          Validated by{' '}
          <a
            href="https://github.com/toddynho/jsonlint-core"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
            style={{ color: 'var(--text-secondary)' }}
          >
            @jsonlint/core
          </a>
        </span>
        <span aria-hidden="true">·</span>
        <code
          className="px-1.5 py-0.5 rounded font-mono"
          style={{ background: 'var(--bg-tertiary)' }}
        >
          npm install @jsonlint/core
        </code>
        <span aria-hidden="true">·</span>
        <Link
          href="/errors"
          className="hover:underline"
          style={{ color: 'var(--text-secondary)' }}
        >
          Error code reference
        </Link>
      </div>
    </div>
  );
}

const JSONC_CODES = new Set(['E008', 'E020', 'E021']);

function DiagnosticCard({
  d,
  sourceText,
}: {
  d: LintDiagnostic;
  sourceText: string;
}) {
  const isError = d.severity === 'error';
  const color = isError ? 'text-accent-red' : 'text-accent-amber';
  const srcLine = sourceText.split(/\r\n|\r|\n/)[d.line - 1] ?? '';
  const caret =
    ' '.repeat(Math.min(Math.max(d.column - 1, 0), 200)) + '^';

  return (
    <div className="flex items-start gap-2">
      {isError ? (
        <XCircleIcon className={`w-4 h-4 ${color} flex-shrink-0 mt-0.5`} />
      ) : (
        <WarningIcon className={`w-4 h-4 ${color} flex-shrink-0 mt-0.5`} />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm">
          <Link
            href={`/errors/${d.code}`}
            className={`font-mono text-xs px-1.5 py-0.5 rounded hover:underline ${color}`}
            style={{ background: 'var(--bg-tertiary)' }}
            title={`What does ${d.code} mean?`}
          >
            {d.code}
          </Link>
          <span style={{ color: 'var(--text-secondary)' }}>{d.message}</span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            line {d.line}, col {d.column}
          </span>
        </div>
        {srcLine && (
          <pre
            className="mt-1 text-xs font-mono overflow-x-auto"
            style={{ color: 'var(--text-muted)' }}
          >
            {srcLine.slice(0, 200)}
            {'\n'}
            {caret}
          </pre>
        )}
        {d.related && (
          <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
            first occurrence at line {d.related.line}, col {d.related.column}
          </p>
        )}
        {d.hint && (
          <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <LightBulbIcon className="w-3.5 h-3.5 inline-block mr-1 text-accent-amber" />
            {d.hint}
          </p>
        )}
        {JSONC_CODES.has(d.code) && (
          <p className="mt-1 text-xs">
            <a href="/jsonc-to-json" className="text-accent-blue hover:underline">
              Convert with the JSONC to JSON tool
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
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
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
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
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function XCircleIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}

function LightBulbIcon({ className }: { className?: string }) {
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
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </svg>
  );
}

function WarningIcon({ className }: { className?: string }) {
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
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
