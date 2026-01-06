'use client';

import { useState, useCallback } from 'react';
import { JsonEditor } from '@/components/JsonEditor';

// Simple YAML serializer (handles common cases)
function jsonToYaml(obj: any, indent: number = 0): string {
  const spaces = '  '.repeat(indent);
  
  if (obj === null) return 'null';
  if (obj === undefined) return '';
  if (typeof obj === 'boolean') return obj.toString();
  if (typeof obj === 'number') return obj.toString();
  if (typeof obj === 'string') {
    // Check if string needs quoting
    if (
      obj === '' ||
      obj.includes('\n') ||
      obj.includes(':') ||
      obj.includes('#') ||
      obj.startsWith(' ') ||
      obj.endsWith(' ') ||
      /^[0-9]/.test(obj) ||
      ['true', 'false', 'null', 'yes', 'no', 'on', 'off'].includes(obj.toLowerCase())
    ) {
      // Use double quotes and escape
      return `"${obj.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`;
    }
    return obj;
  }
  
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]';
    
    const items = obj.map(item => {
      if (typeof item === 'object' && item !== null) {
        const yamlObj = jsonToYaml(item, indent + 1);
        // For objects in arrays, put first key on same line as dash
        const lines = yamlObj.split('\n');
        if (lines.length > 0) {
          return `${spaces}- ${lines[0].trim()}\n${lines.slice(1).map(l => spaces + '  ' + l.trim()).filter(l => l.trim()).join('\n')}`;
        }
      }
      return `${spaces}- ${jsonToYaml(item, indent + 1)}`;
    });
    return items.join('\n').trim();
  }
  
  if (typeof obj === 'object') {
    const keys = Object.keys(obj);
    if (keys.length === 0) return '{}';
    
    const lines = keys.map(key => {
      const value = obj[key];
      const safeKey = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key) ? key : `"${key}"`;
      
      if (value === null) {
        return `${spaces}${safeKey}: null`;
      }
      if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value) && value.length === 0) {
          return `${spaces}${safeKey}: []`;
        }
        if (!Array.isArray(value) && Object.keys(value).length === 0) {
          return `${spaces}${safeKey}: {}`;
        }
        return `${spaces}${safeKey}:\n${jsonToYaml(value, indent + 1)}`;
      }
      return `${spaces}${safeKey}: ${jsonToYaml(value, indent)}`;
    });
    return lines.join('\n');
  }
  
  return String(obj);
}

export function JsonToYamlConverter() {
  const [input, setInput] = useState(`{
  "apiVersion": "v1",
  "kind": "ConfigMap",
  "metadata": {
    "name": "my-config",
    "namespace": "default"
  },
  "data": {
    "database_url": "postgres://localhost:5432/mydb",
    "cache_ttl": 3600,
    "features": ["auth", "logging", "metrics"],
    "debug": false
  }
}`);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const convert = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      const yaml = jsonToYaml(parsed);
      setOutput(yaml);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
      setOutput('');
    }
  }, [input]);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.yaml';
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
              height="380px"
            />
          </div>
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              YAML Output
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
            <textarea
              value={output}
              readOnly
              className="w-full h-[380px] p-4 font-mono text-sm resize-none"
              style={{ 
                background: 'var(--bg-secondary)', 
                color: 'var(--text-primary)',
                border: 'none',
                outline: 'none'
              }}
              placeholder="YAML output will appear here..."
            />
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <button onClick={convert} className="btn btn-primary">
          Convert to YAML
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
