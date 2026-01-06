'use client';

import { useState, useCallback } from 'react';
import { JsonEditor } from '@/components/JsonEditor';

interface SwiftOptions {
  rootStructName: string;
  useClass: boolean;
  useCodable: boolean;
  useOptionals: boolean;
  useCodingKeys: boolean;
}

function toPascalCase(str: string): string {
  return str
    .replace(/[-_](.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (_, c) => c.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '');
}

function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function inferSwiftType(value: any, key: string, options: SwiftOptions, structs: Map<string, string>): string {
  if (value === null) return 'String?';
  
  if (Array.isArray(value)) {
    if (value.length === 0) return '[Any]';
    const itemType = inferSwiftType(value[0], key, options, structs);
    return `[${itemType}]`;
  }
  
  if (typeof value === 'object') {
    const structName = toPascalCase(key);
    generateSwiftStruct(value, structName, options, structs);
    return options.useOptionals ? `${structName}?` : structName;
  }
  
  const baseType = (() => {
    if (typeof value === 'string') return 'String';
    if (typeof value === 'boolean') return 'Bool';
    if (typeof value === 'number') {
      return Number.isInteger(value) ? 'Int' : 'Double';
    }
    return 'Any';
  })();
  
  return options.useOptionals ? `${baseType}?` : baseType;
}

function generateSwiftStruct(obj: object, structName: string, options: SwiftOptions, structs: Map<string, string>): void {
  if (structs.has(structName)) return;
  
  const entries = Object.entries(obj);
  const keyword = options.useClass ? 'class' : 'struct';
  const codableProtocol = options.useCodable ? ': Codable' : '';
  
  let code = `${keyword} ${structName}${codableProtocol} {\n`;
  
  // Properties
  const needsCodingKeys = options.useCodingKeys && entries.some(([key]) => toCamelCase(key) !== key);
  
  for (const [key, value] of entries) {
    const propName = toCamelCase(key);
    const type = inferSwiftType(value, key, options, structs);
    code += `    ${options.useClass ? 'var' : 'let'} ${propName}: ${type}\n`;
  }
  
  // CodingKeys enum if needed
  if (needsCodingKeys && options.useCodable) {
    code += '\n    enum CodingKeys: String, CodingKey {\n';
    for (const [key] of entries) {
      const propName = toCamelCase(key);
      if (propName !== key) {
        code += `        case ${propName} = "${key}"\n`;
      } else {
        code += `        case ${propName}\n`;
      }
    }
    code += '    }\n';
  }
  
  code += '}';
  structs.set(structName, code);
}

function jsonToSwift(json: object, options: SwiftOptions): string {
  const structs = new Map<string, string>();
  
  generateSwiftStruct(json, options.rootStructName, options, structs);
  
  let output = 'import Foundation\n\n';
  
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

export function JsonToSwiftConverter() {
  const [input, setInput] = useState(`{
  "id": 1,
  "user_name": "john_doe",
  "email": "john@example.com",
  "is_active": true,
  "profile": {
    "first_name": "John",
    "last_name": "Doe",
    "age": 30
  }
}`);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const [options, setOptions] = useState<SwiftOptions>({
    rootStructName: 'Root',
    useClass: false,
    useCodable: true,
    useOptionals: false,
    useCodingKeys: true,
  });

  const convert = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      const swift = jsonToSwift(parsed, options);
      setOutput(swift);
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
              Swift Output
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
            value={output || '// Swift structs will appear here'}
            onChange={() => {}}
            height="350px"
            language="swift"
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
            checked={options.useCodable}
            onChange={(e) => setOptions({ ...options, useCodable: e.target.checked })}
            className="rounded"
          />
          Codable
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={options.useCodingKeys}
            onChange={(e) => setOptions({ ...options, useCodingKeys: e.target.checked })}
            className="rounded"
          />
          CodingKeys
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={options.useClass}
            onChange={(e) => setOptions({ ...options, useClass: e.target.checked })}
            className="rounded"
          />
          Use class
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={options.useOptionals}
            onChange={(e) => setOptions({ ...options, useOptionals: e.target.checked })}
            className="rounded"
          />
          Optionals
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
        Generate Swift Code
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
