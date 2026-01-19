'use client';

import { useState, useCallback } from 'react';
import { JsonEditor } from '@/components/JsonEditor';

export function JsonToCsvConverter() {
  const [input, setInput] = useState(`{
  "users": [
    { "name": "Alice", "email": "alice@example.com", "age": 30 },
    { "name": "Bob", "email": "bob@example.com", "age": 25 },
    { "name": "Charlie", "email": "charlie@example.com", "age": 35 }
  ]
}`);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [delimiter, setDelimiter] = useState(',');
  const [includeHeaders, setIncludeHeaders] = useState(true);

  const convertToCsv = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      
      // Find the array to convert
      let dataArray: any[] = [];
      
      if (Array.isArray(parsed)) {
        dataArray = parsed;
      } else if (typeof parsed === 'object') {
        // Look for first array property
        for (const key of Object.keys(parsed)) {
          if (Array.isArray(parsed[key])) {
            dataArray = parsed[key];
            break;
          }
        }
        // If no array found, treat the object as a single row
        if (dataArray.length === 0) {
          dataArray = [parsed];
        }
      }

      if (dataArray.length === 0) {
        setError('No data found to convert. JSON should contain an array of objects.');
        setOutput('');
        return;
      }

      // Get all unique keys from all objects
      const allKeys = new Set<string>();
      dataArray.forEach(item => {
        if (typeof item === 'object' && item !== null) {
          Object.keys(item).forEach(key => allKeys.add(key));
        }
      });
      const headers = Array.from(allKeys);

      // Build CSV
      const rows: string[] = [];
      
      if (includeHeaders) {
        rows.push(headers.map(h => escapeCSVField(h, delimiter)).join(delimiter));
      }

      dataArray.forEach(item => {
        if (typeof item === 'object' && item !== null) {
          const row = headers.map(header => {
            const value = item[header];
            if (value === null || value === undefined) return '';
            if (typeof value === 'object') return escapeCSVField(JSON.stringify(value), delimiter);
            return escapeCSVField(String(value), delimiter);
          });
          rows.push(row.join(delimiter));
        }
      });

      setOutput(rows.join('\n'));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
      setOutput('');
    }
  }, [input, delimiter, includeHeaders]);

  const escapeCSVField = (field: string, delim: string): string => {
    // If field contains delimiter, newline, or quote, wrap in quotes
    if (field.includes(delim) || field.includes('\n') || field.includes('"')) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
  };

  return (
    <div className="space-y-4">
      {/* Options bar */}
      <div 
        className="flex flex-wrap items-center gap-4 p-3 rounded-lg"
        style={{ background: 'var(--bg-tertiary)' }}
      >
        <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <span>Delimiter:</span>
          <select
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value)}
            className="px-2 py-1 rounded text-sm"
            style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
          >
            <option value=",">Comma (,)</option>
            <option value=";">Semicolon (;)</option>
            <option value="\t">Tab</option>
            <option value="|">Pipe (|)</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={includeHeaders}
            onChange={(e) => setIncludeHeaders(e.target.checked)}
            className="rounded"
          />
          <span>Include headers</span>
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div>
          <div className="editor-panel-header">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              JSON Input
            </label>
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
              CSV Output
            </label>
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
              placeholder="CSV output will appear here..."
            />
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <button onClick={convertToCsv} className="btn btn-primary">
          Convert to CSV
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
