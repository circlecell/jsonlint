'use client';

import { useState, useCallback } from 'react';
import { JsonEditor } from '@/components/JsonEditor';

export function CsvToJsonConverter() {
  const [input, setInput] = useState(`name,email,age
Alice,alice@example.com,30
Bob,bob@example.com,25
Charlie,charlie@example.com,35`);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [delimiter, setDelimiter] = useState(',');
  const [firstRowHeaders, setFirstRowHeaders] = useState(true);

  const convertToJson = useCallback(() => {
    try {
      const lines = input.trim().split('\n');
      if (lines.length === 0) {
        setError('No data to convert');
        setOutput('');
        return;
      }

      // Parse CSV properly handling quoted fields
      const parseCSVLine = (line: string, delim: string): string[] => {
        const result: string[] = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          const nextChar = line[i + 1];
          
          if (inQuotes) {
            if (char === '"' && nextChar === '"') {
              current += '"';
              i++; // Skip next quote
            } else if (char === '"') {
              inQuotes = false;
            } else {
              current += char;
            }
          } else {
            if (char === '"') {
              inQuotes = true;
            } else if (char === delim) {
              result.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
        }
        result.push(current.trim());
        return result;
      };

      const parsedLines = lines.map(line => parseCSVLine(line, delimiter));
      
      let headers: string[];
      let dataLines: string[][];

      if (firstRowHeaders) {
        headers = parsedLines[0];
        dataLines = parsedLines.slice(1);
      } else {
        // Generate column names
        const colCount = parsedLines[0].length;
        headers = Array.from({ length: colCount }, (_, i) => `column${i + 1}`);
        dataLines = parsedLines;
      }

      // Convert to array of objects
      const result = dataLines
        .filter(line => line.some(cell => cell.length > 0)) // Skip empty lines
        .map(line => {
          const obj: Record<string, any> = {};
          headers.forEach((header, index) => {
            let value: any = line[index] ?? '';
            
            // Try to parse numbers and booleans
            if (value === 'true') value = true;
            else if (value === 'false') value = false;
            else if (value === 'null') value = null;
            else if (value !== '' && !isNaN(Number(value))) {
              value = Number(value);
            }
            
            obj[header] = value;
          });
          return obj;
        });

      setOutput(JSON.stringify(result, null, 2));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to parse CSV');
      setOutput('');
    }
  }, [input, delimiter, firstRowHeaders]);

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
    a.download = 'data.json';
    a.click();
    URL.revokeObjectURL(url);
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
            <option value="	">Tab</option>
            <option value="|">Pipe (|)</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={firstRowHeaders}
            onChange={(e) => setFirstRowHeaders(e.target.checked)}
            className="rounded"
          />
          <span>First row is headers</span>
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              CSV Input
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
              placeholder="Paste your CSV here..."
            />
          </div>
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              JSON Output
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                disabled={!output}
                className="btn btn-secondary text-xs disabled:opacity-50"
              >
                Copy
              </button>
              <button
                onClick={handleDownload}
                disabled={!output}
                className="btn btn-secondary text-xs disabled:opacity-50"
              >
                Download
              </button>
            </div>
          </div>
          <div 
            className="rounded-lg overflow-hidden"
            style={{ border: '1px solid var(--border-primary)' }}
          >
            <JsonEditor
              value={output}
              onChange={() => {}}
              height="350px"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <button onClick={convertToJson} className="btn btn-primary">
          Convert to JSON
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
