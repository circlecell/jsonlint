'use client';

import { useState } from 'react';

type Alignment = 'left' | 'center' | 'right';

export function MarkdownConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [alignment, setAlignment] = useState<Alignment>('left');
  const [includeIndex, setIncludeIndex] = useState(false);

  const convert = (json: string) => {
    setError('');
    setOutput('');

    if (!json.trim()) return;

    try {
      const data = JSON.parse(json);
      
      // Handle different structures
      let rows: Record<string, unknown>[];
      
      if (Array.isArray(data)) {
        if (data.length === 0) {
          setError('Array is empty. Add some objects to convert.');
          return;
        }
        if (typeof data[0] !== 'object' || data[0] === null) {
          setError('Array must contain objects. Example: [{"key": "value"}]');
          return;
        }
        rows = data;
      } else if (typeof data === 'object' && data !== null) {
        // Single object - wrap in array
        rows = [data];
      } else {
        setError('Input must be a JSON array of objects or a single object.');
        return;
      }

      // Get all unique keys
      const keys = new Set<string>();
      rows.forEach(row => {
        Object.keys(row).forEach(key => keys.add(key));
      });
      const headers = Array.from(keys);

      if (includeIndex) {
        headers.unshift('#');
      }

      // Build markdown
      const lines: string[] = [];
      
      // Header row
      lines.push('| ' + headers.join(' | ') + ' |');
      
      // Separator row with alignment
      const separator = headers.map(() => {
        switch (alignment) {
          case 'center': return ':---:';
          case 'right': return '---:';
          default: return '---';
        }
      });
      lines.push('| ' + separator.join(' | ') + ' |');
      
      // Data rows
      rows.forEach((row, index) => {
        const cells = headers.map(header => {
          if (header === '#' && includeIndex) {
            return String(index + 1);
          }
          const value = row[header];
          if (value === undefined || value === null) {
            return '';
          }
          if (typeof value === 'object') {
            return JSON.stringify(value);
          }
          return String(value);
        });
        lines.push('| ' + cells.join(' | ') + ' |');
      });

      setOutput(lines.join('\n'));
    } catch (e) {
      setError('Invalid JSON: ' + (e instanceof Error ? e.message : 'Unknown error'));
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    convert(value);
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
  };

  const loadSample = () => {
    const sample = `[
  {"name": "Alice", "email": "alice@example.com", "role": "Admin", "active": true},
  {"name": "Bob", "email": "bob@example.com", "role": "Editor", "active": true},
  {"name": "Charlie", "email": "charlie@example.com", "role": "Viewer", "active": false}
]`;
    setInput(sample);
    convert(sample);
  };

  return (
    <div className="space-y-4">
      {/* Options */}
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Alignment:
          <select
            value={alignment}
            onChange={(e) => {
              setAlignment(e.target.value as Alignment);
              if (input.trim()) convert(input);
            }}
            className="px-2 py-1 rounded text-sm"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-primary)',
            }}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={includeIndex}
            onChange={(e) => {
              setIncludeIndex(e.target.checked);
              if (input.trim()) convert(input);
            }}
            className="rounded"
          />
          Include row numbers
        </label>
      </div>

      {/* Input/Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              JSON Input
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
            placeholder='Paste a JSON array of objects, e.g., [{"name": "Alice"}, {"name": "Bob"}]'
            className="w-full h-72 p-4 rounded-lg font-mono text-sm resize-none"
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

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Markdown Output
            </label>
            <button
              onClick={copy}
              disabled={!output}
              className="text-xs px-2 py-1 rounded hover:bg-[var(--bg-tertiary)] disabled:opacity-50"
              style={{ color: 'var(--text-muted)' }}
            >
              Copy
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Markdown table will appear here..."
            className="w-full h-72 p-4 rounded-lg font-mono text-sm resize-none"
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-primary)',
            }}
          />
        </div>
      </div>

      {/* Preview */}
      {output && (
        <div>
          <label className="text-sm font-medium block mb-2" style={{ color: 'var(--text-primary)' }}>
            Preview
          </label>
          <div
            className="p-4 rounded-lg overflow-auto"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
            }}
          >
            <MarkdownPreview markdown={output} />
          </div>
        </div>
      )}
    </div>
  );
}

function MarkdownPreview({ markdown }: { markdown: string }) {
  const lines = markdown.trim().split('\n');
  if (lines.length < 2) return null;

  const headers = lines[0].split('|').filter(s => s.trim()).map(s => s.trim());
  const rows = lines.slice(2).map(line => 
    line.split('|').filter(s => s.trim()).map(s => s.trim())
  );

  return (
    <table className="w-full text-sm">
      <thead>
        <tr style={{ borderBottom: '2px solid var(--border-primary)' }}>
          {headers.map((h, i) => (
            <th
              key={i}
              className="px-3 py-2 text-left font-medium"
              style={{ color: 'var(--text-primary)' }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: '1px solid var(--border-primary)' }}>
            {row.map((cell, j) => (
              <td
                key={j}
                className="px-3 py-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
