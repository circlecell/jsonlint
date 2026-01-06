'use client';

import { useState, useCallback } from 'react';
import { JsonEditor } from '@/components/JsonEditor';

function jsonToXml(obj: any, rootName: string = 'root', indent: number = 2): string {
  const spaces = ' '.repeat(indent);
  
  function escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
  
  function convert(value: any, name: string, depth: number): string {
    const padding = spaces.repeat(depth);
    
    if (value === null || value === undefined) {
      return `${padding}<${name}/>\n`;
    }
    
    if (typeof value === 'boolean' || typeof value === 'number') {
      return `${padding}<${name}>${value}</${name}>\n`;
    }
    
    if (typeof value === 'string') {
      return `${padding}<${name}>${escapeXml(value)}</${name}>\n`;
    }
    
    if (Array.isArray(value)) {
      return value.map(item => convert(item, name, depth)).join('');
    }
    
    if (typeof value === 'object') {
      const entries = Object.entries(value);
      if (entries.length === 0) {
        return `${padding}<${name}/>\n`;
      }
      
      let result = `${padding}<${name}>\n`;
      for (const [key, val] of entries) {
        // Handle keys that start with @ as attributes (from XML to JSON conversion)
        // For now, convert them back to child elements
        const cleanKey = key.replace(/^@_/, '').replace(/^#text$/, '__text');
        const safeName = cleanKey.replace(/[^a-zA-Z0-9_-]/g, '_');
        result += convert(val, safeName || 'item', depth + 1);
      }
      result += `${padding}</${name}>\n`;
      return result;
    }
    
    return '';
  }
  
  const xmlContent = convert(obj, rootName, 0);
  return `<?xml version="1.0" encoding="UTF-8"?>\n${xmlContent}`;
}

export function JsonToXmlConverter() {
  const [input, setInput] = useState('{\n  "book": {\n    "title": "1984",\n    "author": "George Orwell",\n    "year": 1949,\n    "genres": ["dystopian", "political fiction"]\n  }\n}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [rootName, setRootName] = useState('root');
  const [copied, setCopied] = useState(false);

  const convert = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      const xml = jsonToXml(parsed, rootName);
      setOutput(xml);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
      setOutput('');
    }
  }, [input, rootName]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.xml';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              JSON Input
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
              XML Output
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
            value={output || '<!-- XML output will appear here -->'}
            onChange={() => {}}
            height="350px"
            language="xml"
            readOnly
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Root element:
          </label>
          <input
            type="text"
            value={rootName}
            onChange={(e) => setRootName(e.target.value || 'root')}
            className="px-2 py-1 rounded text-sm w-32"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        <button
          onClick={convert}
          className="px-4 py-2 rounded font-medium transition-colors"
          style={{
            background: 'var(--accent-blue)',
            color: 'white',
          }}
        >
          Convert to XML
        </button>
      </div>

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
