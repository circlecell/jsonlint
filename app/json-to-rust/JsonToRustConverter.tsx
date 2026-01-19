'use client';

import { useState, useCallback } from 'react';
import { JsonEditor } from '@/components/JsonEditor';

interface RustOptions {
  rootStructName: string;
  useSerde: boolean;
  deriveDebug: boolean;
  deriveClone: boolean;
  useOption: boolean;
  renameAll: 'none' | 'camelCase' | 'snake_case';
}

function toPascalCase(str: string): string {
  return str
    .replace(/[-_](.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (_, c) => c.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '');
}

function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '')
    .replace(/[^a-zA-Z0-9_]/g, '_');
}

function inferRustType(value: any, key: string, options: RustOptions, structs: Map<string, string>): string {
  if (value === null) return 'Option<String>';
  
  if (Array.isArray(value)) {
    if (value.length === 0) return 'Vec<serde_json::Value>';
    const itemType = inferRustType(value[0], key, options, structs);
    return `Vec<${itemType}>`;
  }
  
  if (typeof value === 'object') {
    const structName = toPascalCase(key);
    generateRustStruct(value, structName, options, structs);
    return options.useOption ? `Option<${structName}>` : structName;
  }
  
  const baseType = (() => {
    if (typeof value === 'string') return 'String';
    if (typeof value === 'boolean') return 'bool';
    if (typeof value === 'number') {
      if (Number.isInteger(value)) {
        if (value > 2147483647 || value < -2147483648) return 'i64';
        return 'i32';
      }
      return 'f64';
    }
    return 'serde_json::Value';
  })();
  
  return options.useOption ? `Option<${baseType}>` : baseType;
}

function generateRustStruct(obj: object, structName: string, options: RustOptions, structs: Map<string, string>): void {
  if (structs.has(structName)) return;
  
  const entries = Object.entries(obj);
  
  // Derive macros
  const derives: string[] = [];
  if (options.useSerde) {
    derives.push('Serialize', 'Deserialize');
  }
  if (options.deriveDebug) derives.push('Debug');
  if (options.deriveClone) derives.push('Clone');
  
  let code = '';
  if (derives.length > 0) {
    code += `#[derive(${derives.join(', ')})]\n`;
  }
  
  // Serde rename_all attribute
  if (options.useSerde && options.renameAll !== 'none') {
    code += `#[serde(rename_all = "${options.renameAll}")]\n`;
  }
  
  code += `pub struct ${structName} {\n`;
  
  for (const [key, value] of entries) {
    const fieldName = toSnakeCase(key);
    const type = inferRustType(value, key, options, structs);
    
    // Add serde rename if field name differs and no global rename_all
    if (options.useSerde && options.renameAll === 'none' && fieldName !== key) {
      code += `    #[serde(rename = "${key}")]\n`;
    }
    
    code += `    pub ${fieldName}: ${type},\n`;
  }
  
  code += '}';
  structs.set(structName, code);
}

function jsonToRust(json: object, options: RustOptions): string {
  const structs = new Map<string, string>();
  
  generateRustStruct(json, options.rootStructName, options, structs);
  
  let output = '';
  
  if (options.useSerde) {
    output += 'use serde::{Deserialize, Serialize};\n\n';
  }
  
  // Other structs first (dependencies), then root
  const rootStruct = structs.get(options.rootStructName);
  const otherStructs = Array.from(structs.entries())
    .filter(([name]) => name !== options.rootStructName)
    .map(([, code]) => code);
  
  for (const struct of otherStructs) {
    output += struct + '\n\n';
  }
  
  if (rootStruct) {
    output += rootStruct;
  }
  
  return output;
}

export function JsonToRustConverter() {
  const [input, setInput] = useState(`{
  "id": 1,
  "userName": "john_doe",
  "email": "john@example.com",
  "isActive": true,
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "age": 30
  }
}`);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const [options, setOptions] = useState<RustOptions>({
    rootStructName: 'Root',
    useSerde: true,
    deriveDebug: true,
    deriveClone: true,
    useOption: false,
    renameAll: 'camelCase',
  });

  const convert = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      const rust = jsonToRust(parsed, options);
      setOutput(rust);
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
          <div className="editor-panel-header">
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
          <div className="editor-panel-header">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Rust Output
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
            value={output || '// Rust structs will appear here'}
            onChange={() => {}}
            height="350px"
            language="rust"
            readOnly
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 p-3 rounded" style={{ background: 'var(--bg-secondary)' }}>
        <div className="flex items-center gap-2">
          <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Name:
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

        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={options.useSerde}
            onChange={(e) => setOptions({ ...options, useSerde: e.target.checked })}
            className="rounded"
          />
          Serde
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={options.deriveDebug}
            onChange={(e) => setOptions({ ...options, deriveDebug: e.target.checked })}
            className="rounded"
          />
          Debug
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={options.deriveClone}
            onChange={(e) => setOptions({ ...options, deriveClone: e.target.checked })}
            className="rounded"
          />
          Clone
        </label>

        <div className="flex items-center gap-2">
          <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            rename_all:
          </label>
          <select
            value={options.renameAll}
            onChange={(e) => setOptions({ ...options, renameAll: e.target.value as any })}
            className="px-2 py-1 rounded text-sm"
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-primary)',
            }}
          >
            <option value="none">None</option>
            <option value="camelCase">camelCase</option>
            <option value="snake_case">snake_case</option>
          </select>
        </div>
      </div>

      <button
        onClick={convert}
        className="px-4 py-2 rounded font-medium transition-colors"
        style={{
          background: 'var(--accent-blue)',
          color: 'white',
        }}
      >
        Generate Rust Structs
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
