'use client';

import { useState, useCallback } from 'react';
import { JsonEditor } from '@/components/JsonEditor';

// Simple YAML parser (handles common cases)
function yamlToJson(yaml: string): any {
  const lines = yaml.split('\n');
  const result: any = {};
  const stack: { indent: number; obj: any; key?: string; isArray?: boolean }[] = [
    { indent: -1, obj: result },
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    // Calculate indentation
    const indent = line.search(/\S/);
    
    // Pop stack to find parent
    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }
    
    const parent = stack[stack.length - 1];
    
    // Handle array items
    if (trimmed.startsWith('- ')) {
      const value = trimmed.slice(2).trim();
      
      // Ensure parent has an array
      if (parent.key && !Array.isArray(parent.obj[parent.key])) {
        parent.obj[parent.key] = [];
      }
      
      const arr = parent.key ? parent.obj[parent.key] : parent.obj;
      
      if (value.includes(':')) {
        // Inline object in array
        const obj = parseInlineObject(value);
        arr.push(obj);
        stack.push({ indent, obj, isArray: true });
      } else if (value) {
        arr.push(parseValue(value));
      } else {
        // Multi-line object in array
        const obj = {};
        arr.push(obj);
        stack.push({ indent, obj, isArray: true });
      }
    }
    // Handle key-value pairs
    else if (trimmed.includes(':')) {
      const colonIndex = trimmed.indexOf(':');
      const key = trimmed.slice(0, colonIndex).trim().replace(/^["']|["']$/g, '');
      const value = trimmed.slice(colonIndex + 1).trim();
      
      if (value === '' || value === '|' || value === '>') {
        // Nested object or multi-line string
        if (value === '|' || value === '>') {
          // Multi-line string - collect following indented lines
          const multiLineIndent = indent + 2;
          let multiLine = '';
          while (i + 1 < lines.length) {
            const nextLine = lines[i + 1];
            const nextIndent = nextLine.search(/\S/);
            if (nextIndent >= multiLineIndent || nextLine.trim() === '') {
              multiLine += (multiLine ? '\n' : '') + nextLine.slice(multiLineIndent);
              i++;
            } else {
              break;
            }
          }
          parent.obj[key] = multiLine.trim();
        } else {
          parent.obj[key] = {};
          stack.push({ indent, obj: parent.obj, key });
        }
      } else if (value.startsWith('[') && value.endsWith(']')) {
        // Inline array
        parent.obj[key] = parseInlineArray(value);
      } else if (value.startsWith('{') && value.endsWith('}')) {
        // Inline object
        parent.obj[key] = parseInlineObject(value);
      } else {
        parent.obj[key] = parseValue(value);
      }
    }
  }
  
  return result;
}

function parseValue(value: string): any {
  const trimmed = value.trim();
  
  // Remove quotes if present
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  
  // Boolean
  if (trimmed === 'true' || trimmed === 'yes' || trimmed === 'on') return true;
  if (trimmed === 'false' || trimmed === 'no' || trimmed === 'off') return false;
  
  // Null
  if (trimmed === 'null' || trimmed === '~' || trimmed === '') return null;
  
  // Number
  if (/^-?\d+$/.test(trimmed)) return parseInt(trimmed, 10);
  if (/^-?\d*\.\d+$/.test(trimmed)) return parseFloat(trimmed);
  
  return trimmed;
}

function parseInlineArray(value: string): any[] {
  const content = value.slice(1, -1).trim();
  if (!content) return [];
  
  // Simple split - doesn't handle nested structures perfectly
  return content.split(',').map(item => parseValue(item.trim()));
}

function parseInlineObject(value: string): any {
  const obj: any = {};
  // Handle "key: value, key2: value2" format
  const pairs = value.replace(/^\{|\}$/g, '').split(',');
  pairs.forEach(pair => {
    const colonIdx = pair.indexOf(':');
    if (colonIdx > -1) {
      const k = pair.slice(0, colonIdx).trim().replace(/^["']|["']$/g, '');
      const v = pair.slice(colonIdx + 1).trim();
      obj[k] = parseValue(v);
    }
  });
  return obj;
}

export function YamlToJsonConverter() {
  const [input, setInput] = useState(`apiVersion: v1
kind: ConfigMap
metadata:
  name: my-config
  namespace: default
data:
  database_url: postgres://localhost:5432/mydb
  cache_ttl: 3600
  features:
    - auth
    - logging
    - metrics
  debug: false`);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const convert = useCallback(() => {
    try {
      const parsed = yamlToJson(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid YAML');
      setOutput('');
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
    a.download = 'data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              YAML Input
            </label>
          </div>
          <div 
            className="rounded-lg overflow-hidden"
            style={{ border: '1px solid var(--border-primary)' }}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-[380px] p-4 font-mono text-sm resize-none"
              style={{ 
                background: 'var(--bg-secondary)', 
                color: 'var(--text-primary)',
                border: 'none',
                outline: 'none'
              }}
              placeholder="Paste your YAML here..."
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
              height="380px"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <button onClick={convert} className="btn btn-primary">
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
