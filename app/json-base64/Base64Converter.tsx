'use client';

import { useState } from 'react';

type Mode = 'encode' | 'decode';

export function Base64Converter() {
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [urlSafe, setUrlSafe] = useState(false);

  const convert = (text: string, convertMode: Mode) => {
    setError('');
    setOutput('');

    if (!text.trim()) return;

    try {
      if (convertMode === 'encode') {
        // Validate JSON first
        JSON.parse(text);
        let encoded = btoa(unescape(encodeURIComponent(text)));
        if (urlSafe) {
          encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        }
        setOutput(encoded);
      } else {
        // Decode Base64
        let decoded = text.trim();
        if (urlSafe) {
          decoded = decoded.replace(/-/g, '+').replace(/_/g, '/');
          // Add padding if needed
          while (decoded.length % 4) {
            decoded += '=';
          }
        }
        const jsonString = decodeURIComponent(escape(atob(decoded)));
        // Validate and format JSON
        const parsed = JSON.parse(jsonString);
        setOutput(JSON.stringify(parsed, null, 2));
      }
    } catch (e) {
      if (convertMode === 'encode') {
        setError('Invalid JSON. Please check your input.');
      } else {
        setError('Invalid Base64 or the decoded content is not valid JSON.');
      }
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    convert(value, mode);
  };

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setInput('');
    setOutput('');
    setError('');
  };

  const handleUrlSafeChange = (checked: boolean) => {
    setUrlSafe(checked);
    if (input.trim()) {
      convert(input, mode);
    }
  };

  const swap = () => {
    if (output) {
      const newMode = mode === 'encode' ? 'decode' : 'encode';
      setMode(newMode);
      setInput(output);
      convert(output, newMode);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
  };

  const loadSample = () => {
    const sample = mode === 'encode' 
      ? '{\n  "name": "John Doe",\n  "email": "john@example.com",\n  "role": "admin"\n}'
      : 'eyJuYW1lIjoiSm9obiBEb2UiLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJyb2xlIjoiYWRtaW4ifQ==';
    handleInputChange(sample);
  };

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex flex-wrap items-center gap-4">
        <div
          className="inline-flex rounded-lg p-1"
          style={{ background: 'var(--bg-secondary)' }}
        >
          <button
            onClick={() => handleModeChange('encode')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'encode' ? 'bg-[var(--accent-blue)] text-white' : ''
            }`}
            style={mode !== 'encode' ? { color: 'var(--text-secondary)' } : {}}
          >
            Encode (JSON → Base64)
          </button>
          <button
            onClick={() => handleModeChange('decode')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'decode' ? 'bg-[var(--accent-blue)] text-white' : ''
            }`}
            style={mode !== 'decode' ? { color: 'var(--text-secondary)' } : {}}
          >
            Decode (Base64 → JSON)
          </button>
        </div>

        <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={urlSafe}
            onChange={(e) => handleUrlSafeChange(e.target.checked)}
            className="rounded"
          />
          URL-safe encoding
        </label>
      </div>

      {/* Input/Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {mode === 'encode' ? 'JSON Input' : 'Base64 Input'}
            </label>
            <button
              onClick={loadSample}
              className="text-xs px-2 py-1 rounded hover:bg-[var(--bg-tertiary)]"
              style={{ color: 'var(--accent-blue)' }}
            >
              Load Sample
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={mode === 'encode' ? 'Paste JSON here...' : 'Paste Base64 string here...'}
            className="w-full h-64 p-4 rounded-lg font-mono text-sm resize-none"
            style={{
              background: 'var(--bg-secondary)',
              border: `1px solid ${error ? 'var(--accent-red)' : output ? 'var(--accent-green)' : 'var(--border-primary)'}`,
              color: 'var(--text-primary)',
            }}
          />
          {error && (
            <p className="mt-2 text-sm" style={{ color: 'var(--accent-red)' }}>
              {error}
            </p>
          )}
        </div>

        {/* Swap Button (for larger screens) */}
        <div className="hidden lg:flex items-center justify-center absolute left-1/2 -translate-x-1/2" style={{ top: '50%' }}>
          <button
            onClick={swap}
            disabled={!output}
            className="p-2 rounded-full hover:bg-[var(--bg-tertiary)] disabled:opacity-50"
            style={{ color: 'var(--text-muted)' }}
            title="Swap input and output"
          >
            <SwapIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {mode === 'encode' ? 'Base64 Output' : 'JSON Output'}
            </label>
            <div className="flex gap-2">
              <button
                onClick={swap}
                disabled={!output}
                className="text-xs px-2 py-1 rounded hover:bg-[var(--bg-tertiary)] disabled:opacity-50 lg:hidden"
                style={{ color: 'var(--text-muted)' }}
              >
                Swap
              </button>
              <button
                onClick={copy}
                disabled={!output}
                className="text-xs px-2 py-1 rounded hover:bg-[var(--bg-tertiary)] disabled:opacity-50"
                style={{ color: 'var(--text-muted)' }}
              >
                Copy
              </button>
            </div>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder={mode === 'encode' ? 'Base64 output will appear here...' : 'Decoded JSON will appear here...'}
            className="w-full h-64 p-4 rounded-lg font-mono text-sm resize-none"
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-primary)',
            }}
          />
        </div>
      </div>
    </div>
  );
}

function SwapIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}
