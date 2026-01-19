'use client';

import { useState, useCallback } from 'react';

export function JsonUnescaper() {
  const [input, setInput] = useState(`"{\\\"name\\\":\\\"John Doe\\\",\\\"email\\\":\\\"john@example.com\\\",\\\"active\\\":true}"`);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'unescape' | 'escape'>('unescape');

  const process = useCallback(() => {
    try {
      if (mode === 'unescape') {
        // Try to parse as a JSON string first
        let unescaped = input;
        
        // If it's a quoted string, parse it as JSON to unescape
        if (input.trim().startsWith('"') && input.trim().endsWith('"')) {
          unescaped = JSON.parse(input);
        } else {
          // Manual unescape common patterns
          unescaped = input
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, '\\')
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '\r')
            .replace(/\\t/g, '\t');
        }
        
        // Try to format if it's valid JSON
        try {
          const parsed = JSON.parse(unescaped);
          setOutput(JSON.stringify(parsed, null, 2));
        } catch {
          setOutput(unescaped);
        }
      } else {
        // Escape mode - create a JSON string
        const escaped = JSON.stringify(input);
        setOutput(escaped);
      }
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Processing failed');
      setOutput('');
    }
  }, [input, mode]);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
  };

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div 
        className="flex items-center gap-2 p-3 rounded-lg"
        style={{ background: 'var(--bg-tertiary)' }}
      >
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Mode:</span>
        <div className="flex rounded-md overflow-hidden" style={{ border: '1px solid var(--border-primary)' }}>
          <button
            onClick={() => setMode('unescape')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === 'unescape' ? 'bg-[var(--accent-green)] text-white' : ''
            }`}
            style={mode !== 'unescape' ? { background: 'var(--bg-secondary)', color: 'var(--text-secondary)' } : {}}
          >
            Unescape
          </button>
          <button
            onClick={() => setMode('escape')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === 'escape' ? 'bg-[var(--accent-green)] text-white' : ''
            }`}
            style={mode !== 'escape' ? { background: 'var(--bg-secondary)', color: 'var(--text-secondary)' } : {}}
          >
            Escape
          </button>
        </div>
        <span className="text-xs ml-2" style={{ color: 'var(--text-muted)' }}>
          {mode === 'unescape' 
            ? 'Convert escaped JSON string back to JSON' 
            : 'Escape JSON for embedding in strings'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div>
          <div className="editor-panel-header">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              {mode === 'unescape' ? 'Escaped JSON String' : 'JSON to Escape'}
            </label>
          </div>
          <div 
            className="rounded-lg overflow-hidden"
            style={{ border: '1px solid var(--border-primary)' }}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-[350px] p-4 font-mono text-sm resize-none"
              style={{ 
                background: 'var(--bg-secondary)', 
                color: 'var(--text-primary)',
                border: 'none',
                outline: 'none'
              }}
              placeholder={mode === 'unescape' 
                ? 'Paste escaped JSON string here...' 
                : 'Paste JSON to escape here...'}
            />
          </div>
        </div>

        {/* Output */}
        <div>
          <div className="editor-panel-header">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              {mode === 'unescape' ? 'Unescaped JSON' : 'Escaped String'}
            </label>
            <button
              onClick={handleCopy}
              disabled={!output}
              className="btn-inline"
            >
              Copy
            </button>
          </div>
          <div 
            className="rounded-lg overflow-hidden"
            style={{ border: '1px solid var(--border-primary)' }}
          >
            <textarea
              value={output}
              readOnly
              className="w-full h-[350px] p-4 font-mono text-sm resize-none"
              style={{ 
                background: 'var(--bg-secondary)', 
                color: 'var(--text-primary)',
                border: 'none',
                outline: 'none'
              }}
              placeholder="Output will appear here..."
            />
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <button onClick={process} className="btn btn-primary">
          {mode === 'unescape' ? 'Unescape JSON' : 'Escape JSON'}
        </button>
        <button 
          onClick={() => { setInput(''); setOutput(''); setError(null); }} 
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
