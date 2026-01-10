'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { JsonEditor } from './JsonEditor';
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

interface JsonValidatorProps {
  initialJson?: string;
  initialUrl?: string;
}

export function JsonValidator({ initialJson, initialUrl }: JsonValidatorProps) {
  const [input, setInput] = useState('');
  const [isFormatted, setIsFormatted] = useState(true);
  const [copied, setCopied] = useState(false);
  const [errorHint, setErrorHint] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
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
        setErrorHint(null);
        setWarning(null);
        return;
      }

      const result = parseJSON(jsonToValidate);

      if (result.valid) {
        setStatus('valid');
        setErrorMessage(null);
        setErrorLine(null);
        setErrorHint(null);
        setWarning(result.warning || null);
        // Don't auto-format - preserve original input to maintain number formatting (e.g., 1.0 vs 1)
        // User can click "Prettify" to format if desired
        setIsFormatted(detectFormat(jsonToValidate) === 'formatted');
      } else {
        setStatus('invalid');
        setErrorMessage(result.error || 'Invalid JSON');
        setErrorLine(result.line || null);
        setErrorHint(result.hint || null);
        setWarning(null);
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
        setInput(formatJSON(input));
        setIsFormatted(true);
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
          {warning && (
            <div
              className="flex items-start gap-2 px-3 py-2 rounded-md text-sm animate-fade-in"
              style={{
                background: 'rgba(245, 158, 11, 0.1)',
              }}
            >
              <WarningIcon className="w-4 h-4 text-accent-amber flex-shrink-0 mt-0.5" />
              <span style={{ color: 'var(--text-secondary)' }}>{warning}</span>
            </div>
          )}
        </div>
      )}

      {status === 'invalid' && (
        <div
          className="px-3 py-2 rounded-md animate-fade-in"
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
          }}
        >
          <div className="flex items-start gap-2">
            <XCircleIcon className="w-4 h-4 text-accent-red flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="font-medium text-accent-red text-sm">Invalid JSON</span>
              {errorMessage && (
                <pre
                  className="mt-1 text-xs font-mono overflow-x-auto"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {errorMessage}
                  {errorLine && (
                    <span className="text-accent-amber ml-2">
                      (Line {errorLine})
                    </span>
                  )}
                </pre>
              )}
              {errorHint && (
                <p
                  className="mt-2 text-xs"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <LightBulbIcon className="w-3.5 h-3.5 inline-block mr-1 text-accent-amber" />
                  {errorHint.includes('JSONC to JSON tool') ? (
                    <>
                      {errorHint.replace('JSONC to JSON tool', '')}
                      <a
                        href="/jsonc-to-json"
                        className="text-accent-blue hover:underline"
                      >
                        JSONC to JSON tool
                      </a>
                      .
                    </>
                  ) : (
                    errorHint
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
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
