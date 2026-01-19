'use client';

import { useState, useCallback } from 'react';
import { JsonEditor } from '@/components/JsonEditor';

interface CSharpOptions {
  rootClassName: string;
  useJsonProperty: boolean;
  useSystemTextJson: boolean;
  usePascalCase: boolean;
  useNullable: boolean;
  useRecords: boolean;
  namespace?: string;
}

function toPascalCase(str: string): string {
  return str
    .replace(/[-_](.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (_, c) => c.toUpperCase());
}

function inferCSharpType(value: any, key: string, options: CSharpOptions, classes: Map<string, string>): string {
  if (value === null) {
    return 'object?';
  }
  
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return 'List<object>';
    }
    const itemType = inferCSharpType(value[0], key, options, classes);
    return `List<${itemType}>`;
  }
  
  if (typeof value === 'object') {
    const className = toPascalCase(key);
    generateClass(value, className, options, classes);
    return className;
  }
  
  if (typeof value === 'string') return 'string';
  if (typeof value === 'boolean') return 'bool';
  if (typeof value === 'number') {
    if (Number.isInteger(value)) {
      if (value > 2147483647 || value < -2147483648) {
        return 'long';
      }
      return 'int';
    }
    return 'double';
  }
  
  return 'object';
}

function generateClass(obj: object, className: string, options: CSharpOptions, classes: Map<string, string>): void {
  if (classes.has(className)) return;
  
  const properties: string[] = [];
  const entries = Object.entries(obj);
  
  for (const [key, value] of entries) {
    const propName = options.usePascalCase ? toPascalCase(key) : key;
    let propType = inferCSharpType(value, key, options, classes);
    
    // Add nullable annotation if value is null or options.useNullable is true
    if (value === null && options.useNullable) {
      propType = 'string?';
    }
    
    let propDef = '';
    
    // Add JSON attribute if property name differs from key
    if (options.useJsonProperty && (propName !== key || !options.usePascalCase)) {
      if (options.useSystemTextJson) {
        propDef += `    [JsonPropertyName("${key}")]\n`;
      } else {
        propDef += `    [JsonProperty("${key}")]\n`;
      }
    }
    
    propDef += `    public ${propType} ${propName} { get; set; }`;
    properties.push(propDef);
  }
  
  let classCode: string;
  
  if (options.useRecords) {
    // Generate record
    const recordProps = entries.map(([key, value]) => {
      const propName = options.usePascalCase ? toPascalCase(key) : key;
      const propType = inferCSharpType(value, key, options, classes);
      return `${propType} ${propName}`;
    }).join(', ');
    
    classCode = `public record ${className}(${recordProps});`;
  } else {
    classCode = `public class ${className}\n{\n${properties.join('\n\n')}\n}`;
  }
  
  classes.set(className, classCode);
}

function jsonToCSharp(json: object, options: CSharpOptions): string {
  const classes = new Map<string, string>();
  
  generateClass(json, options.rootClassName, options, classes);
  
  const classesArray = Array.from(classes.values());
  // Put root class first
  const rootClass = classes.get(options.rootClassName);
  const otherClasses = classesArray.filter(c => c !== rootClass);
  const orderedClasses = rootClass ? [rootClass, ...otherClasses] : classesArray;
  
  let output = '';
  
  // Add using statements
  const usings: string[] = [];
  if (options.useJsonProperty) {
    if (options.useSystemTextJson) {
      usings.push('using System.Text.Json.Serialization;');
    } else {
      usings.push('using Newtonsoft.Json;');
    }
  }
  usings.push('using System.Collections.Generic;');
  
  output += usings.join('\n') + '\n\n';
  
  // Add namespace if specified
  if (options.namespace) {
    output += `namespace ${options.namespace}\n{\n`;
    output += orderedClasses.map(c => c.split('\n').map(line => '    ' + line).join('\n')).join('\n\n');
    output += '\n}';
  } else {
    output += orderedClasses.join('\n\n');
  }
  
  return output;
}

export function JsonToCSharpConverter() {
  const [input, setInput] = useState(`{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "isActive": true,
  "roles": ["admin", "user"],
  "profile": {
    "avatar": "https://example.com/avatar.jpg",
    "bio": "Software developer"
  }
}`);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const [options, setOptions] = useState<CSharpOptions>({
    rootClassName: 'Root',
    useJsonProperty: true,
    useSystemTextJson: false,
    usePascalCase: true,
    useNullable: true,
    useRecords: false,
    namespace: '',
  });

  const convert = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      const csharp = jsonToCSharp(parsed, options);
      setOutput(csharp);
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
              C# Output
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
            value={output || '// C# classes will appear here'}
            onChange={() => {}}
            height="350px"
            language="csharp"
            readOnly
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 p-3 rounded" style={{ background: 'var(--bg-secondary)' }}>
        <div className="flex items-center gap-2">
          <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Class name:
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
            Namespace:
          </label>
          <input
            type="text"
            value={options.namespace}
            onChange={(e) => setOptions({ ...options, namespace: e.target.value })}
            placeholder="MyApp.Models"
            className="px-2 py-1 rounded text-sm w-32"
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
            checked={options.usePascalCase}
            onChange={(e) => setOptions({ ...options, usePascalCase: e.target.checked })}
            className="rounded"
          />
          PascalCase
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={options.useJsonProperty}
            onChange={(e) => setOptions({ ...options, useJsonProperty: e.target.checked })}
            className="rounded"
          />
          JSON attributes
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={options.useSystemTextJson}
            onChange={(e) => setOptions({ ...options, useSystemTextJson: e.target.checked })}
            className="rounded"
          />
          System.Text.Json
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={options.useRecords}
            onChange={(e) => setOptions({ ...options, useRecords: e.target.checked })}
            className="rounded"
          />
          Use Records
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
        Generate C# Classes
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
