'use client';

import { useState, useCallback } from 'react';
import { JsonEditor } from '@/components/JsonEditor';

interface GoOptions {
  rootStructName: string;
  packageName: string;
  usePointers: boolean;
  omitEmpty: boolean;
  inlineStructs: boolean;
}

function toPascalCase(str: string): string {
  return str
    .replace(/[-_](.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (_, c) => c.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '');
}

function inferGoType(value: any, key: string, options: GoOptions, structs: Map<string, string>): string {
  if (value === null) {
    return options.usePointers ? '*string' : 'interface{}';
  }
  
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]interface{}';
    const itemType = inferGoType(value[0], key, options, structs);
    return `[]${itemType}`;
  }
  
  if (typeof value === 'object') {
    const structName = toPascalCase(key);
    if (!options.inlineStructs) {
      generateGoStruct(value, structName, options, structs);
    }
    return options.usePointers ? `*${structName}` : structName;
  }
  
  if (typeof value === 'string') return 'string';
  if (typeof value === 'boolean') return 'bool';
  if (typeof value === 'number') {
    if (Number.isInteger(value)) {
      if (value > 2147483647 || value < -2147483648) return 'int64';
      return 'int';
    }
    return 'float64';
  }
  
  return 'interface{}';
}

function generateGoStruct(obj: object, structName: string, options: GoOptions, structs: Map<string, string>): void {
  if (structs.has(structName)) return;
  
  const entries = Object.entries(obj);
  let code = `type ${structName} struct {\n`;
  
  for (const [key, value] of entries) {
    const fieldName = toPascalCase(key);
    const fieldType = inferGoType(value, key, options, structs);
    
    // Build JSON tag
    let tag = `json:"${key}`;
    if (options.omitEmpty) {
      tag += ',omitempty';
    }
    tag += '"';
    
    code += `\t${fieldName} ${fieldType} \`${tag}\`\n`;
  }
  
  code += '}';
  structs.set(structName, code);
}

function jsonToGo(json: object, options: GoOptions): string {
  const structs = new Map<string, string>();
  
  generateGoStruct(json, options.rootStructName, options, structs);
  
  // Build output
  let output = `package ${options.packageName}\n\n`;
  
  // Root struct first, then others
  const rootStruct = structs.get(options.rootStructName);
  const otherStructs = Array.from(structs.entries())
    .filter(([name]) => name !== options.rootStructName)
    .map(([, code]) => code);
  
  if (rootStruct) {
    output += rootStruct;
  }
  
  for (const struct of otherStructs) {
    output += '\n\n' + struct;
  }
  
  return output;
}

export function JsonToGoConverter() {
  const [input, setInput] = useState(`{
  "id": 1,
  "user_name": "john_doe",
  "email": "john@example.com",
  "is_active": true,
  "tags": ["golang", "developer"],
  "profile": {
    "first_name": "John",
    "last_name": "Doe",
    "age": 30
  }
}`);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const [options, setOptions] = useState<GoOptions>({
    rootStructName: 'Root',
    packageName: 'main',
    usePointers: false,
    omitEmpty: true,
    inlineStructs: false,
  });

  const convert = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      const goCode = jsonToGo(parsed, options);
      setOutput(goCode);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
      setOutput('');
    }
  }, [input, options]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
              Go Output
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
            value={output || '// Go structs will appear here'}
            onChange={() => {}}
            height="350px"
            language="go"
            readOnly
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 p-3 rounded" style={{ background: 'var(--bg-secondary)' }}>
        <div className="flex items-center gap-2">
          <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Struct:
          </label>
          <input
            type="text"
            value={options.rootStructName}
            onChange={(e) => setOptions({ ...options, rootStructName: e.target.value || 'Root' })}
            className="px-2 py-1 rounded text-sm w-24"
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Package:
          </label>
          <input
            type="text"
            value={options.packageName}
            onChange={(e) => setOptions({ ...options, packageName: e.target.value || 'main' })}
            className="px-2 py-1 rounded text-sm w-24"
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={options.omitEmpty}
            onChange={(e) => setOptions({ ...options, omitEmpty: e.target.checked })}
            className="rounded"
          />
          omitempty
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={options.usePointers}
            onChange={(e) => setOptions({ ...options, usePointers: e.target.checked })}
            className="rounded"
          />
          Pointer types
        </label>
      </div>

      <button
        onClick={convert}
        className="px-4 py-2 rounded font-medium transition-colors"
        style={{
          background: 'var(--accent-blue)',
          color: 'white',
        }}
      >
        Generate Go Structs
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
