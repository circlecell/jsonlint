'use client';

import { useState, useCallback } from 'react';
import { JsonEditor } from '@/components/JsonEditor';

interface KotlinOptions {
  rootClassName: string;
  packageName: string;
  useDataClass: boolean;
  useSerializable: boolean;
  useMoshi: boolean;
  useGson: boolean;
  nullableByDefault: boolean;
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

function inferKotlinType(value: any, key: string, options: KotlinOptions, classes: Map<string, string>): string {
  if (value === null) return 'String?';
  
  if (Array.isArray(value)) {
    if (value.length === 0) return 'List<Any>';
    const itemType = inferKotlinType(value[0], key, options, classes);
    return `List<${itemType}>`;
  }
  
  if (typeof value === 'object') {
    const className = toPascalCase(key);
    generateKotlinClass(value, className, options, classes);
    return options.nullableByDefault ? `${className}?` : className;
  }
  
  if (typeof value === 'string') return options.nullableByDefault ? 'String?' : 'String';
  if (typeof value === 'boolean') return options.nullableByDefault ? 'Boolean?' : 'Boolean';
  if (typeof value === 'number') {
    if (Number.isInteger(value)) {
      if (value > 2147483647 || value < -2147483648) return options.nullableByDefault ? 'Long?' : 'Long';
      return options.nullableByDefault ? 'Int?' : 'Int';
    }
    return options.nullableByDefault ? 'Double?' : 'Double';
  }
  
  return 'Any?';
}

function generateKotlinClass(obj: object, className: string, options: KotlinOptions, classes: Map<string, string>): void {
  if (classes.has(className)) return;
  
  const entries = Object.entries(obj);
  
  // Annotations
  const annotations: string[] = [];
  if (options.useSerializable) annotations.push('@Serializable');
  
  // Build properties
  const props = entries.map(([key, value]) => {
    const propName = toCamelCase(key);
    const type = inferKotlinType(value, key, options, classes);
    
    let propAnnotations = '';
    if (options.useMoshi && propName !== key) {
      propAnnotations = `@Json(name = "${key}") `;
    } else if (options.useGson && propName !== key) {
      propAnnotations = `@SerializedName("${key}") `;
    } else if (options.useSerializable && propName !== key) {
      propAnnotations = `@SerialName("${key}") `;
    }
    
    const defaultValue = value === null ? ' = null' : '';
    return `    ${propAnnotations}val ${propName}: ${type}${defaultValue}`;
  });
  
  let code = annotations.length > 0 ? annotations.join('\n') + '\n' : '';
  code += options.useDataClass ? 'data class' : 'class';
  code += ` ${className}(\n${props.join(',\n')}\n)`;
  
  classes.set(className, code);
}

function jsonToKotlin(json: object, options: KotlinOptions): string {
  const classes = new Map<string, string>();
  
  generateKotlinClass(json, options.rootClassName, options, classes);
  
  // Build imports
  const imports: string[] = [];
  if (options.useSerializable) {
    imports.push('import kotlinx.serialization.Serializable');
    imports.push('import kotlinx.serialization.SerialName');
  }
  if (options.useMoshi) {
    imports.push('import com.squareup.moshi.Json');
  }
  if (options.useGson) {
    imports.push('import com.google.gson.annotations.SerializedName');
  }
  
  let output = '';
  if (options.packageName) {
    output += `package ${options.packageName}\n\n`;
  }
  if (imports.length > 0) {
    output += imports.join('\n') + '\n\n';
  }
  
  // Other classes first (dependencies), then root
  const rootClass = classes.get(options.rootClassName);
  const otherClasses = Array.from(classes.entries())
    .filter(([name]) => name !== options.rootClassName)
    .map(([, code]) => code);
  
  for (const cls of otherClasses) {
    output += cls + '\n\n';
  }
  
  if (rootClass) {
    output += rootClass;
  }
  
  return output;
}

export function JsonToKotlinConverter() {
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
  
  const [options, setOptions] = useState<KotlinOptions>({
    rootClassName: 'Root',
    packageName: 'com.example.model',
    useDataClass: true,
    useSerializable: true,
    useMoshi: false,
    useGson: false,
    nullableByDefault: false,
  });

  const convert = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      const kotlin = jsonToKotlin(parsed, options);
      setOutput(kotlin);
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
              Kotlin Output
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
            value={output || '// Kotlin classes will appear here'}
            onChange={() => {}}
            height="350px"
            language="kotlin"
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

        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={options.useDataClass}
            onChange={(e) => setOptions({ ...options, useDataClass: e.target.checked })}
            className="rounded"
          />
          data class
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={options.useSerializable}
            onChange={(e) => setOptions({ ...options, useSerializable: e.target.checked, useMoshi: false, useGson: false })}
            className="rounded"
          />
          Serializable
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={options.useMoshi}
            onChange={(e) => setOptions({ ...options, useMoshi: e.target.checked, useSerializable: false, useGson: false })}
            className="rounded"
          />
          Moshi
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={options.nullableByDefault}
            onChange={(e) => setOptions({ ...options, nullableByDefault: e.target.checked })}
            className="rounded"
          />
          Nullable
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
        Generate Kotlin Classes
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
