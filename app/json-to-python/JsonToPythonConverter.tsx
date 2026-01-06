'use client';

import { useState, useCallback } from 'react';
import { JsonEditor } from '@/components/JsonEditor';

type PythonFormat = 'dataclass' | 'typeddict' | 'pydantic';

interface PythonOptions {
  rootClassName: string;
  format: PythonFormat;
  useOptional: boolean;
  snakeCase: boolean;
}

function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '')
    .replace(/[^a-zA-Z0-9_]/g, '_');
}

function toPascalCase(str: string): string {
  return str
    .replace(/[-_](.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (_, c) => c.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '');
}

function inferPythonType(value: any, key: string, options: PythonOptions, classes: Map<string, string>): string {
  if (value === null) {
    return options.useOptional ? 'Optional[str]' : 'None';
  }
  
  if (Array.isArray(value)) {
    if (value.length === 0) return 'List[Any]';
    const itemType = inferPythonType(value[0], key, options, classes);
    return `List[${itemType}]`;
  }
  
  if (typeof value === 'object') {
    const className = toPascalCase(key);
    generatePythonClass(value, className, options, classes);
    return className;
  }
  
  if (typeof value === 'string') return 'str';
  if (typeof value === 'boolean') return 'bool';
  if (typeof value === 'number') {
    return Number.isInteger(value) ? 'int' : 'float';
  }
  
  return 'Any';
}

function generatePythonClass(obj: object, className: string, options: PythonOptions, classes: Map<string, string>): void {
  if (classes.has(className)) return;
  
  const entries = Object.entries(obj);
  let code = '';
  
  if (options.format === 'dataclass') {
    code = `@dataclass\nclass ${className}:\n`;
    for (const [key, value] of entries) {
      const fieldName = options.snakeCase ? toSnakeCase(key) : key;
      let fieldType = inferPythonType(value, key, options, classes);
      if (value === null && options.useOptional) {
        fieldType = 'Optional[str]';
        code += `    ${fieldName}: ${fieldType} = None\n`;
      } else {
        code += `    ${fieldName}: ${fieldType}\n`;
      }
    }
  } else if (options.format === 'typeddict') {
    code = `class ${className}(TypedDict):\n`;
    for (const [key, value] of entries) {
      const fieldName = options.snakeCase ? toSnakeCase(key) : key;
      const fieldType = inferPythonType(value, key, options, classes);
      code += `    ${fieldName}: ${fieldType}\n`;
    }
  } else if (options.format === 'pydantic') {
    code = `class ${className}(BaseModel):\n`;
    for (const [key, value] of entries) {
      const fieldName = options.snakeCase ? toSnakeCase(key) : key;
      let fieldType = inferPythonType(value, key, options, classes);
      
      // Add Field alias if name was converted
      if (options.snakeCase && fieldName !== key) {
        if (value === null && options.useOptional) {
          code += `    ${fieldName}: Optional[str] = Field(None, alias="${key}")\n`;
        } else {
          code += `    ${fieldName}: ${fieldType} = Field(..., alias="${key}")\n`;
        }
      } else {
        if (value === null && options.useOptional) {
          code += `    ${fieldName}: Optional[str] = None\n`;
        } else {
          code += `    ${fieldName}: ${fieldType}\n`;
        }
      }
    }
    // Add Config for alias
    if (options.snakeCase && entries.some(([key]) => toSnakeCase(key) !== key)) {
      code += `\n    class Config:\n        populate_by_name = True\n`;
    }
  }
  
  classes.set(className, code.trimEnd());
}

function jsonToPython(json: object, options: PythonOptions): string {
  const classes = new Map<string, string>();
  
  generatePythonClass(json, options.rootClassName, options, classes);
  
  // Build imports
  const imports: string[] = [];
  imports.push('from typing import List, Optional, Any');
  
  if (options.format === 'dataclass') {
    imports.push('from dataclasses import dataclass');
  } else if (options.format === 'typeddict') {
    imports.push('from typing import TypedDict');
  } else if (options.format === 'pydantic') {
    imports.push('from pydantic import BaseModel, Field');
  }
  
  let output = imports.join('\n') + '\n\n';
  
  // Add classes (dependencies first, then root)
  const rootClass = classes.get(options.rootClassName);
  const otherClasses = Array.from(classes.entries())
    .filter(([name]) => name !== options.rootClassName)
    .map(([, code]) => code);
  
  // Other classes first (dependencies)
  for (const cls of otherClasses) {
    output += cls + '\n\n';
  }
  
  // Root class last
  if (rootClass) {
    output += rootClass;
  }
  
  return output;
}

export function JsonToPythonConverter() {
  const [input, setInput] = useState(`{
  "id": 1,
  "userName": "john_doe",
  "email": "john@example.com",
  "isActive": true,
  "tags": ["python", "developer"],
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "age": 30
  }
}`);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const [options, setOptions] = useState<PythonOptions>({
    rootClassName: 'Root',
    format: 'dataclass',
    useOptional: true,
    snakeCase: true,
  });

  const convert = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      const python = jsonToPython(parsed, options);
      setOutput(python);
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
              Python Output
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
            value={output || '# Python classes will appear here'}
            onChange={() => {}}
            height="350px"
            language="python"
            readOnly
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 p-3 rounded" style={{ background: 'var(--bg-secondary)' }}>
        <div className="flex items-center gap-2">
          <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Class:
          </label>
          <input
            type="text"
            value={options.rootClassName}
            onChange={(e) => setOptions({ ...options, rootClassName: e.target.value || 'Root' })}
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
            Format:
          </label>
          <select
            value={options.format}
            onChange={(e) => setOptions({ ...options, format: e.target.value as PythonFormat })}
            className="px-2 py-1 rounded text-sm"
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-primary)',
            }}
          >
            <option value="dataclass">dataclass</option>
            <option value="pydantic">Pydantic</option>
            <option value="typeddict">TypedDict</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={options.snakeCase}
            onChange={(e) => setOptions({ ...options, snakeCase: e.target.checked })}
            className="rounded"
          />
          snake_case
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={options.useOptional}
            onChange={(e) => setOptions({ ...options, useOptional: e.target.checked })}
            className="rounded"
          />
          Optional for nulls
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
        Generate Python Classes
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
