'use client';

import { useState, useCallback } from 'react';
import { JsonEditor } from '@/components/JsonEditor';

function inferType(value: any, depth: number = 0): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  
  const type = typeof value;
  
  if (type === 'string') return 'string';
  if (type === 'number') return Number.isInteger(value) ? 'number' : 'number';
  if (type === 'boolean') return 'boolean';
  
  if (Array.isArray(value)) {
    if (value.length === 0) return 'any[]';
    
    // Check if all items have the same type
    const itemTypes = new Set(value.map(item => inferType(item, depth + 1)));
    
    if (itemTypes.size === 1) {
      const itemType = inferType(value[0], depth + 1);
      return `${itemType}[]`;
    }
    
    // Mixed array - create union type
    const types = Array.from(itemTypes).join(' | ');
    return `(${types})[]`;
  }
  
  if (type === 'object') {
    return 'object'; // Will be expanded to interface
  }
  
  return 'any';
}

function generateInterface(obj: any, name: string, interfaces: Map<string, string>, depth: number = 0): string {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return inferType(obj, depth);
  }
  
  const indent = '  ';
  const properties: string[] = [];
  
  for (const [key, value] of Object.entries(obj)) {
    // Clean key name for TypeScript
    const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
    
    if (value === null) {
      properties.push(`${indent}${safeKey}: null;`);
    } else if (Array.isArray(value)) {
      if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
        // Array of objects - generate a separate interface
        const itemInterfaceName = `${name}${capitalize(key)}Item`;
        generateInterface(value[0], itemInterfaceName, interfaces, depth + 1);
        properties.push(`${indent}${safeKey}: ${itemInterfaceName}[];`);
      } else {
        properties.push(`${indent}${safeKey}: ${inferType(value, depth)};`);
      }
    } else if (typeof value === 'object') {
      // Nested object - generate a separate interface
      const nestedInterfaceName = `${name}${capitalize(key)}`;
      generateInterface(value, nestedInterfaceName, interfaces, depth + 1);
      properties.push(`${indent}${safeKey}: ${nestedInterfaceName};`);
    } else {
      properties.push(`${indent}${safeKey}: ${inferType(value, depth)};`);
    }
  }
  
  const interfaceStr = `interface ${name} {\n${properties.join('\n')}\n}`;
  interfaces.set(name, interfaceStr);
  
  return name;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/[^a-zA-Z0-9]/g, '');
}

export function JsonToTypescriptConverter() {
  const [input, setInput] = useState(`{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "isActive": true,
  "roles": ["admin", "editor"],
  "profile": {
    "bio": "Software developer",
    "avatar": "https://example.com/avatar.jpg",
    "social": {
      "twitter": "@johndoe",
      "github": "johndoe"
    }
  },
  "posts": [
    {
      "id": 101,
      "title": "Hello World",
      "published": true
    }
  ]
}`);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [rootName, setRootName] = useState('Root');

  const convert = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      const interfaces = new Map<string, string>();
      
      if (Array.isArray(parsed)) {
        if (parsed.length > 0 && typeof parsed[0] === 'object') {
          generateInterface(parsed[0], rootName, interfaces);
          // Add array type alias
          interfaces.set('__root__', `type ${rootName}Array = ${rootName}[];`);
        } else {
          setOutput(`type ${rootName} = ${inferType(parsed)}[];`);
          setError(null);
          return;
        }
      } else {
        generateInterface(parsed, rootName, interfaces);
      }
      
      // Build output - interfaces first, then root
      const result: string[] = [];
      interfaces.forEach((value, key) => {
        if (key !== '__root__' && key !== rootName) {
          result.push(value);
        }
      });
      
      // Add root interface last
      if (interfaces.has(rootName)) {
        result.push(interfaces.get(rootName)!);
      }
      
      if (interfaces.has('__root__')) {
        result.push(interfaces.get('__root__')!);
      }
      
      setOutput(result.join('\n\n'));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
      setOutput('');
    }
  }, [input, rootName]);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
  };

  return (
    <div className="space-y-4">
      {/* Options */}
      <div 
        className="flex items-center gap-4 p-3 rounded-lg"
        style={{ background: 'var(--bg-tertiary)' }}
      >
        <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <span>Root interface name:</span>
          <input
            type="text"
            value={rootName}
            onChange={(e) => setRootName(e.target.value || 'Root')}
            className="px-2 py-1 rounded text-sm w-32"
            style={{ 
              background: 'var(--bg-secondary)', 
              color: 'var(--text-primary)', 
              border: '1px solid var(--border-primary)' 
            }}
          />
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
              height="400px"
            />
          </div>
        </div>

        {/* Output */}
        <div>
          <div className="editor-panel-header">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              TypeScript Interfaces
            </label>
            <button
              onClick={handleCopy}
              disabled={!output}
              className="btn-inline"
            >
              Copy
            </button>
          </div>
          <div 
            className="rounded-lg overflow-hidden"
            style={{ border: '1px solid var(--border-primary)' }}
          >
            <textarea
              value={output}
              readOnly
              className="w-full h-[400px] p-4 font-mono text-sm resize-none"
              style={{ 
                background: 'var(--bg-secondary)', 
                color: 'var(--text-primary)',
                border: 'none',
                outline: 'none'
              }}
              placeholder="TypeScript interfaces will appear here..."
            />
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <button onClick={convert} className="btn btn-primary">
          Generate TypeScript
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
