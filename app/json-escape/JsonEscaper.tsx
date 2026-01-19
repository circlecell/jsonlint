'use client';

import { useState, useCallback } from 'react';
import { JsonEditor } from '@/components/JsonEditor';

function escapeJsonString(input: string): string {
  return input
    .replace(/\\/g, '\\\\')   // Backslash first!
    .replace(/"/g, '\\"')     // Double quotes
    .replace(/\n/g, '\\n')    // Newlines
    .replace(/\r/g, '\\r')    // Carriage returns
    .replace(/\t/g, '\\t')    // Tabs
    .replace(/\f/g, '\\f')    // Form feeds
    .replace(/\b/g, '\\b');   // Backspaces (word boundary in regex, but works on actual backspace chars)
}

function escapeUnicode(input: string): string {
  return input.replace(/[\u0000-\u001F\u007F-\u009F\u00A0-\uFFFF]/g, (char) => {
    const code = char.charCodeAt(0);
    if (code > 127) {
      return '\\u' + code.toString(16).padStart(4, '0');
    }
    return char;
  });
}

export function JsonEscaper() {
  const [input, setInput] = useState(`Hello "World"
This is line 2	with a tab
And a backslash: C:\\Users\\Name`);
  const [output, setOutput] = useState('');
  const [wrapInQuotes, setWrapInQuotes] = useState(true);
  const [escapeUnicodeChars, setEscapeUnicodeChars] = useState(false);
  const [copied, setCopied] = useState(false);

  const escape = useCallback(() => {
    let result = escapeJsonString(input);
    
    if (escapeUnicodeChars) {
      result = escapeUnicode(result);
    }
    
    if (wrapInQuotes) {
      result = '"' + result + '"';
    }
    
    setOutput(result);
  }, [input, wrapInQuotes, escapeUnicodeChars]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Character count stats
  const stats = {
    original: input.length,
    escaped: output.replace(/^"|"$/g, '').length,
    quotes: (input.match(/"/g) || []).length,
    newlines: (input.match(/\n/g) || []).length,
    tabs: (input.match(/\t/g) || []).length,
    backslashes: (input.match(/\\/g) || []).length,
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="editor-panel-header">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Input Text
            </label>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {stats.original} chars
            </span>
          </div>
          <JsonEditor
            value={input}
            onChange={setInput}
            height="250px"
            language="plaintext"
          />
        </div>

        <div>
          <div className="editor-panel-header">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Escaped Output
            </label>
            {output && (
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
            )}
          </div>
          <JsonEditor
            value={output || '// Escaped text will appear here'}
            onChange={() => {}}
            height="250px"
            language="plaintext"
            readOnly
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={wrapInQuotes}
            onChange={(e) => setWrapInQuotes(e.target.checked)}
            className="rounded"
          />
          Wrap in quotes
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={escapeUnicodeChars}
            onChange={(e) => setEscapeUnicodeChars(e.target.checked)}
            className="rounded"
          />
          Escape Unicode (\\uXXXX)
        </label>

        <button
          onClick={escape}
          className="px-4 py-2 rounded font-medium transition-colors"
          style={{
            background: 'var(--accent-blue)',
            color: 'white',
          }}
        >
          Escape Text
        </button>
      </div>

      {output && (
        <div
          className="p-3 rounded text-sm"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
          }}
        >
          <span style={{ color: 'var(--text-muted)' }}>Characters escaped: </span>
          <span style={{ color: 'var(--text-primary)' }}>
            {stats.quotes > 0 && `${stats.quotes} quotes, `}
            {stats.newlines > 0 && `${stats.newlines} newlines, `}
            {stats.tabs > 0 && `${stats.tabs} tabs, `}
            {stats.backslashes > 0 && `${stats.backslashes} backslashes`}
            {stats.quotes === 0 && stats.newlines === 0 && stats.tabs === 0 && stats.backslashes === 0 && 'None'}
          </span>
        </div>
      )}

      {/* Quick reference */}
      <div
        className="p-4 rounded"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
        }}
      >
        <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
          Escape Reference
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-sm">
          {[
            { char: '"', escaped: '\\"', name: 'Quote' },
            { char: '\\', escaped: '\\\\', name: 'Backslash' },
            { char: '\\n', escaped: '\\n', name: 'Newline' },
            { char: '\\t', escaped: '\\t', name: 'Tab' },
            { char: '\\r', escaped: '\\r', name: 'CR' },
            { char: '\\b', escaped: '\\b', name: 'Backspace' },
          ].map(({ char, escaped, name }) => (
            <div
              key={name}
              className="p-2 rounded text-center"
              style={{ background: 'var(--bg-primary)' }}
            >
              <code className="text-xs" style={{ color: 'var(--accent-blue)' }}>{escaped}</code>
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
