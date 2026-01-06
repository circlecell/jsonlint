'use client';

import { useState, useCallback } from 'react';
import { JsonEditor } from '@/components/JsonEditor';

interface SortOptions {
  descending: boolean;
  caseInsensitive: boolean;
  sortArrays: boolean;
  recursive: boolean;
}

function sortJson(obj: any, options: SortOptions): any {
  if (Array.isArray(obj)) {
    const mapped = obj.map(item => options.recursive ? sortJson(item, options) : item);
    
    if (options.sortArrays) {
      // Only sort arrays of primitives
      const allPrimitives = mapped.every(item => 
        typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean'
      );
      
      if (allPrimitives) {
        return mapped.sort((a, b) => {
          const aStr = String(a);
          const bStr = String(b);
          
          if (options.caseInsensitive) {
            const comparison = aStr.toLowerCase().localeCompare(bStr.toLowerCase());
            return options.descending ? -comparison : comparison;
          }
          
          const comparison = aStr.localeCompare(bStr);
          return options.descending ? -comparison : comparison;
        });
      }
    }
    
    return mapped;
  }
  
  if (typeof obj === 'object' && obj !== null) {
    const sorted: Record<string, any> = {};
    const keys = Object.keys(obj);
    
    keys.sort((a, b) => {
      if (options.caseInsensitive) {
        const comparison = a.toLowerCase().localeCompare(b.toLowerCase());
        return options.descending ? -comparison : comparison;
      }
      const comparison = a.localeCompare(b);
      return options.descending ? -comparison : comparison;
    });
    
    for (const key of keys) {
      sorted[key] = options.recursive ? sortJson(obj[key], options) : obj[key];
    }
    
    return sorted;
  }
  
  return obj;
}

export function JsonSorter() {
  const [input, setInput] = useState(`{
  "zebra": 1,
  "apple": 2,
  "Mango": 3,
  "banana": 4,
  "nested": {
    "zulu": true,
    "alpha": false
  },
  "items": ["cherry", "apple", "banana"]
}`);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [indent, setIndent] = useState(2);
  
  const [options, setOptions] = useState<SortOptions>({
    descending: false,
    caseInsensitive: false,
    sortArrays: false,
    recursive: true,
  });

  const sort = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      const sorted = sortJson(parsed, options);
      setOutput(JSON.stringify(sorted, null, indent));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
      setOutput('');
    }
  }, [input, options, indent]);

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
    a.download = 'sorted.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Input JSON
            </label>
          </div>
          <JsonEditor
            value={input}
            onChange={setInput}
            height="350px"
            language="json"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Sorted Output
            </label>
            {output && (
              <div className="flex gap-2">
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
              </div>
            )}
          </div>
          <JsonEditor
            value={output || '// Sorted JSON will appear here'}
            onChange={() => {}}
            height="350px"
            language="json"
            readOnly
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 p-3 rounded" style={{ background: 'var(--bg-secondary)' }}>
        <div className="flex items-center gap-2">
          <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Order:
          </label>
          <select
            value={options.descending ? 'desc' : 'asc'}
            onChange={(e) => setOptions({ ...options, descending: e.target.value === 'desc' })}
            className="px-2 py-1 rounded text-sm"
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-primary)',
            }}
          >
            <option value="asc">A → Z (Ascending)</option>
            <option value="desc">Z → A (Descending)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Indent:
          </label>
          <select
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className="px-2 py-1 rounded text-sm"
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-primary)',
            }}
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={options.recursive}
            onChange={(e) => setOptions({ ...options, recursive: e.target.checked })}
            className="rounded"
          />
          Recursive (nested objects)
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={options.caseInsensitive}
            onChange={(e) => setOptions({ ...options, caseInsensitive: e.target.checked })}
            className="rounded"
          />
          Case insensitive
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={options.sortArrays}
            onChange={(e) => setOptions({ ...options, sortArrays: e.target.checked })}
            className="rounded"
          />
          Sort array values
        </label>
      </div>

      <button
        onClick={sort}
        className="px-4 py-2 rounded font-medium transition-colors"
        style={{
          background: 'var(--accent-blue)',
          color: 'white',
        }}
      >
        Sort Keys
      </button>

      {error && (
        <div
          className="p-3 rounded text-sm"
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            color: 'var(--accent-red)',
            border: '1px solid var(--accent-red)',
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
