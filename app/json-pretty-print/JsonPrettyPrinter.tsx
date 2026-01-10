'use client';

import { useState, useCallback, useEffect } from 'react';
import { JsonEditor } from '@/components/JsonEditor';

export function JsonPrettyPrinter() {
  const [input, setInput] = useState('{"name":"John Doe","age":30,"city":"New York","active":true,"tags":["developer","designer"],"address":{"street":"123 Main St","zip":"10001"}}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [indent, setIndent] = useState<number | 'tab'>(2);
  const [sortKeys, setSortKeys] = useState(false);

  // Sort object keys recursively
  const sortObjectKeys = useCallback((obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(sortObjectKeys);
    }
    if (typeof obj === 'object' && obj !== null) {
      return Object.keys(obj)
        .sort()
        .reduce((sorted: any, key) => {
          sorted[key] = sortObjectKeys(obj[key]);
          return sorted;
        }, {});
    }
    return obj;
  }, []);

  const format = useCallback(() => {
    try {
      let parsed = JSON.parse(input);
      
      if (sortKeys) {
        parsed = sortObjectKeys(parsed);
      }
      
      // Use tab character or number of spaces
      const indentValue = indent === 'tab' ? '\t' : indent;
      setOutput(JSON.stringify(parsed, null, indentValue));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
      setOutput('');
    }
  }, [input, indent, sortKeys, sortObjectKeys]);

  // Auto-format on input change (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (input.trim()) {
        format();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [input, indent, sortKeys, format]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Stats
  const inputLength = input.length;
  const outputLength = output.length;
  const compressionRatio = inputLength > 0 ? ((outputLength / inputLength) * 100).toFixed(0) : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Input JSON
            </label>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {inputLength.toLocaleString()} chars
            </span>
          </div>
          <JsonEditor
            value={input}
            onChange={setInput}
            height="400px"
            language="json"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Formatted Output
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {outputLength.toLocaleString()} chars
              </span>
              {output && (
                <>
                  <button
                    onClick={handleCopy}
                    className="text-xs px-2 py-1 rounded transition-colors"
                    style={{
                      background: 'var(--bg-tertiary)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="text-xs px-2 py-1 rounded transition-colors"
                    style={{
                      background: 'var(--bg-tertiary)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Download
                  </button>
                </>
              )}
            </div>
          </div>
          <JsonEditor
            value={output || '// Formatted JSON will appear here'}
            onChange={() => {}}
            height="400px"
            language="json"
            readOnly
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 p-3 rounded" style={{ background: 'var(--bg-secondary)' }}>
        <div className="flex items-center gap-2">
          <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Indentation:
          </label>
          <select
            value={indent}
            onChange={(e) => {
              const val = e.target.value;
              setIndent(val === 'tab' ? 'tab' : Number(val));
            }}
            className="px-2 py-1 rounded text-sm"
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-primary)',
            }}
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value="tab">Tab</option>
            <option value={1}>1 space</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={sortKeys}
            onChange={(e) => setSortKeys(e.target.checked)}
            className="rounded"
          />
          Sort keys alphabetically
        </label>

        <button
          onClick={format}
          className="px-4 py-2 rounded font-medium transition-colors"
          style={{
            background: 'var(--accent-blue)',
            color: 'white',
          }}
        >
          Format JSON
        </button>
      </div>

      {error && (
        <div
          className="p-3 rounded text-sm"
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            color: 'var(--accent-red)',
            border: '1px solid var(--accent-red)',
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      {output && !error && (
        <div
          className="p-3 rounded text-sm flex items-center gap-4"
          style={{
            background: 'rgba(34, 197, 94, 0.1)',
            color: 'var(--accent-green)',
            border: '1px solid var(--accent-green)',
          }}
        >
          <span>✓ Valid JSON</span>
          <span style={{ color: 'var(--text-muted)' }}>
            {outputLength > inputLength 
              ? `Expanded by ${(outputLength - inputLength).toLocaleString()} chars`
              : `Same size`
            }
          </span>
        </div>
      )}
    </div>
  );
}
