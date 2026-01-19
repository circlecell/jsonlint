'use client';

import { useState, useCallback } from 'react';
import { JsonEditor } from '@/components/JsonEditor';

export function JsonMinifier() {
  const [input, setInput] = useState(`{
  "name": "JSONLint",
  "description": "The JSON Validator",
  "features": [
    "Validate",
    "Format",
    "Minify"
  ],
  "settings": {
    "theme": "dark",
    "autoValidate": true
  }
}`);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{ before: number; after: number } | null>(null);

  const minify = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError(null);
      setStats({
        before: input.length,
        after: minified.length,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
      setOutput('');
      setStats(null);
    }
  }, [input]);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.min.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const compressionPercent = stats 
    ? Math.round((1 - stats.after / stats.before) * 100) 
    : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div>
          <div className="editor-panel-header">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              JSON Input
            </label>
            {stats && (
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {stats.before.toLocaleString()} chars
              </span>
            )}
          </div>
          <div 
            className="rounded-lg overflow-hidden"
            style={{ border: '1px solid var(--border-primary)' }}
          >
            <JsonEditor
              value={input}
              onChange={setInput}
              height="350px"
            />
          </div>
        </div>

        {/* Output */}
        <div>
          <div className="editor-panel-header">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Minified Output
            </label>
            <div className="flex items-center gap-3">
              {stats && (
                <span className="text-xs" style={{ color: 'var(--accent-green)' }}>
                  {stats.after.toLocaleString()} chars ({compressionPercent}% smaller)
                </span>
              )}
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  disabled={!output}
                  className="btn-inline"
                >
                  Copy
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!output}
                  className="btn-inline"
                >
                  Download
                </button>
              </div>
            </div>
          </div>
          <div 
            className="rounded-lg overflow-hidden"
            style={{ border: '1px solid var(--border-primary)' }}
          >
            <textarea
              value={output}
              readOnly
              className="w-full h-[350px] p-4 font-mono text-sm resize-none break-all"
              style={{ 
                background: 'var(--bg-secondary)', 
                color: 'var(--text-primary)',
                border: 'none',
                outline: 'none',
                wordBreak: 'break-all'
              }}
              placeholder="Minified JSON will appear here..."
            />
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <button onClick={minify} className="btn btn-primary">
          Minify JSON
        </button>
        <button 
          onClick={() => { setInput(''); setOutput(''); setError(null); setStats(null); }} 
          className="btn btn-secondary"
        >
          Clear
        </button>
      </div>

      {/* Status */}
      {error && (
        <div 
          className="px-3 py-2 rounded-md text-sm"
          style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-red)' }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
