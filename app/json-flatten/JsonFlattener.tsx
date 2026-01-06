'use client';

import { useState, useCallback } from 'react';
import { JsonEditor } from '@/components/JsonEditor';

function flattenObject(obj: any, prefix: string = '', delimiter: string = '.'): Record<string, any> {
  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}${delimiter}${key}` : key;
    
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, newKey, delimiter));
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        const arrayKey = `${newKey}[${index}]`;
        if (item !== null && typeof item === 'object' && !Array.isArray(item)) {
          Object.assign(result, flattenObject(item, arrayKey, delimiter));
        } else {
          result[arrayKey] = item;
        }
      });
    } else {
      result[newKey] = value;
    }
  }
  
  return result;
}

function unflattenObject(obj: Record<string, any>, delimiter: string = '.'): any {
  const result: any = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const parts: (string | number)[] = [];
    let current = '';
    let inBracket = false;
    
    // Parse the key into parts
    for (let i = 0; i < key.length; i++) {
      const char = key[i];
      
      if (char === '[') {
        if (current) {
          parts.push(current);
          current = '';
        }
        inBracket = true;
      } else if (char === ']') {
        if (current) {
          parts.push(parseInt(current, 10));
          current = '';
        }
        inBracket = false;
      } else if (char === delimiter && !inBracket) {
        if (current) {
          parts.push(current);
          current = '';
        }
      } else {
        current += char;
      }
    }
    if (current) {
      parts.push(current);
    }
    
    // Build nested structure
    let target = result;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      const nextPart = parts[i + 1];
      
      if (target[part] === undefined) {
        target[part] = typeof nextPart === 'number' ? [] : {};
      }
      target = target[part];
    }
    
    target[parts[parts.length - 1]] = value;
  }
  
  return result;
}

export function JsonFlattener() {
  const [input, setInput] = useState(`{
  "user": {
    "name": "John Doe",
    "address": {
      "street": "123 Main St",
      "city": "Boston",
      "zip": "02101"
    },
    "emails": [
      "john@work.com",
      "john@personal.com"
    ]
  },
  "settings": {
    "theme": "dark",
    "notifications": {
      "email": true,
      "sms": false
    }
  }
}`);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'flatten' | 'unflatten'>('flatten');
  const [delimiter, setDelimiter] = useState('.');

  const process = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      
      if (mode === 'flatten') {
        const flattened = flattenObject(parsed, '', delimiter);
        setOutput(JSON.stringify(flattened, null, 2));
      } else {
        const unflattened = unflattenObject(parsed, delimiter);
        setOutput(JSON.stringify(unflattened, null, 2));
      }
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
      setOutput('');
    }
  }, [input, mode, delimiter]);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
  };

  return (
    <div className="space-y-4">
      {/* Options */}
      <div 
        className="flex flex-wrap items-center gap-4 p-3 rounded-lg"
        style={{ background: 'var(--bg-tertiary)' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Mode:</span>
          <div className="flex rounded-md overflow-hidden" style={{ border: '1px solid var(--border-primary)' }}>
            <button
              onClick={() => setMode('flatten')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                mode === 'flatten' ? 'bg-[var(--accent-green)] text-white' : ''
              }`}
              style={mode !== 'flatten' ? { background: 'var(--bg-secondary)', color: 'var(--text-secondary)' } : {}}
            >
              Flatten
            </button>
            <button
              onClick={() => setMode('unflatten')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                mode === 'unflatten' ? 'bg-[var(--accent-green)] text-white' : ''
              }`}
              style={mode !== 'unflatten' ? { background: 'var(--bg-secondary)', color: 'var(--text-secondary)' } : {}}
            >
              Unflatten
            </button>
          </div>
        </div>
        
        <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <span>Delimiter:</span>
          <select
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value)}
            className="px-2 py-1 rounded text-sm"
            style={{ 
              background: 'var(--bg-secondary)', 
              color: 'var(--text-primary)', 
              border: '1px solid var(--border-primary)' 
            }}
          >
            <option value=".">Dot (.)</option>
            <option value="/">Slash (/)</option>
            <option value="_">Underscore (_)</option>
            <option value="__">Double underscore (__)</option>
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              {mode === 'flatten' ? 'Nested JSON' : 'Flattened JSON'}
            </label>
          </div>
          <div 
            className="rounded-lg overflow-hidden"
            style={{ border: '1px solid var(--border-primary)' }}
          >
            <JsonEditor
              value={input}
              onChange={setInput}
              height="380px"
            />
          </div>
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              {mode === 'flatten' ? 'Flattened JSON' : 'Nested JSON'}
            </label>
            <button
              onClick={handleCopy}
              disabled={!output}
              className="btn btn-secondary text-xs disabled:opacity-50"
            >
              Copy
            </button>
          </div>
          <div 
            className="rounded-lg overflow-hidden"
            style={{ border: '1px solid var(--border-primary)' }}
          >
            <JsonEditor
              value={output}
              onChange={() => {}}
              height="380px"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <button onClick={process} className="btn btn-primary">
          {mode === 'flatten' ? 'Flatten JSON' : 'Unflatten JSON'}
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
