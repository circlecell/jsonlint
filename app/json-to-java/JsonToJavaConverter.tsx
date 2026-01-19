'use client';

import { useState, useCallback } from 'react';
import { JsonEditor } from '@/components/JsonEditor';

interface JavaOptions {
  rootClassName: string;
  packageName: string;
  useLombok: boolean;
  useRecords: boolean;
  useJackson: boolean;
  useGson: boolean;
  generateGettersSetters: boolean;
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

function inferJavaType(value: any, key: string, options: JavaOptions, classes: Map<string, string>): string {
  if (value === null) return 'Object';
  
  if (Array.isArray(value)) {
    if (value.length === 0) return 'List<Object>';
    const itemType = inferJavaType(value[0], key, options, classes);
    return `List<${itemType}>`;
  }
  
  if (typeof value === 'object') {
    const className = toPascalCase(key);
    generateJavaClass(value, className, options, classes);
    return className;
  }
  
  if (typeof value === 'string') return 'String';
  if (typeof value === 'boolean') return 'Boolean';
  if (typeof value === 'number') {
    if (Number.isInteger(value)) {
      if (value > 2147483647 || value < -2147483648) return 'Long';
      return 'Integer';
    }
    return 'Double';
  }
  
  return 'Object';
}

function generateJavaClass(obj: object, className: string, options: JavaOptions, classes: Map<string, string>): void {
  if (classes.has(className)) return;
  
  const entries = Object.entries(obj);
  let code = '';
  
  if (options.useRecords) {
    // Java 16+ Record
    const params = entries.map(([key, value]) => {
      const type = inferJavaType(value, key, options, classes);
      const fieldName = toCamelCase(key);
      if (options.useJackson && fieldName !== key) {
        return `@JsonProperty("${key}") ${type} ${fieldName}`;
      }
      return `${type} ${fieldName}`;
    }).join(', ');
    
    code = `public record ${className}(${params}) {}`;
  } else {
    // Standard class
    const fields: string[] = [];
    const gettersSetters: string[] = [];
    
    for (const [key, value] of entries) {
      const type = inferJavaType(value, key, options, classes);
      const fieldName = toCamelCase(key);
      
      let fieldDef = '';
      if (options.useJackson && fieldName !== key) {
        fieldDef += `    @JsonProperty("${key}")\n`;
      }
      if (options.useGson && fieldName !== key) {
        fieldDef += `    @SerializedName("${key}")\n`;
      }
      fieldDef += `    private ${type} ${fieldName};`;
      fields.push(fieldDef);
      
      if (options.generateGettersSetters && !options.useLombok) {
        const pascalField = toPascalCase(fieldName);
        gettersSetters.push(`
    public ${type} get${pascalField}() {
        return ${fieldName};
    }

    public void set${pascalField}(${type} ${fieldName}) {
        this.${fieldName} = ${fieldName};
    }`);
      }
    }
    
    const annotations: string[] = [];
    if (options.useLombok) {
      annotations.push('@Data');
    }
    
    code = annotations.length > 0 ? annotations.join('\n') + '\n' : '';
    code += `public class ${className} {\n`;
    code += fields.join('\n\n');
    if (gettersSetters.length > 0) {
      code += '\n' + gettersSetters.join('\n');
    }
    code += '\n}';
  }
  
  classes.set(className, code);
}

function jsonToJava(json: object, options: JavaOptions): string {
  const classes = new Map<string, string>();
  
  generateJavaClass(json, options.rootClassName, options, classes);
  
  // Build output
  let output = '';
  
  // Package
  if (options.packageName) {
    output += `package ${options.packageName};\n\n`;
  }
  
  // Imports
  const imports: string[] = [];
  imports.push('import java.util.List;');
  if (options.useLombok) {
    imports.push('import lombok.Data;');
  }
  if (options.useJackson) {
    imports.push('import com.fasterxml.jackson.annotation.JsonProperty;');
  }
  if (options.useGson) {
    imports.push('import com.google.gson.annotations.SerializedName;');
  }
  
  output += imports.join('\n') + '\n\n';
  
  // Classes (root first)
  const rootClass = classes.get(options.rootClassName);
  const otherClasses = Array.from(classes.entries())
    .filter(([name]) => name !== options.rootClassName)
    .map(([, code]) => code);
  
  if (rootClass) {
    output += rootClass;
  }
  
  for (const cls of otherClasses) {
    output += '\n\n' + cls;
  }
  
  return output;
}

export function JsonToJavaConverter() {
  const [input, setInput] = useState(`{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "isActive": true,
  "roles": ["admin", "user"],
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "age": 30
  }
}`);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const [options, setOptions] = useState<JavaOptions>({
    rootClassName: 'Root',
    packageName: 'com.example.model',
    useLombok: true,
    useRecords: false,
    useJackson: true,
    useGson: false,
    generateGettersSetters: true,
  });

  const convert = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      const java = jsonToJava(parsed, options);
      setOutput(java);
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
              Java Output
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
            value={output || '// Java classes will appear here'}
            onChange={() => {}}
            height="350px"
            language="java"
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
            Package:
          </label>
          <input
            type="text"
            value={options.packageName}
            onChange={(e) => setOptions({ ...options, packageName: e.target.value })}
            className="px-2 py-1 rounded text-sm w-36"
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
            checked={options.useLombok}
            onChange={(e) => setOptions({ ...options, useLombok: e.target.checked })}
            className="rounded"
          />
          Lombok
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={options.useRecords}
            onChange={(e) => setOptions({ ...options, useRecords: e.target.checked })}
            className="rounded"
          />
          Records (Java 16+)
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={options.useJackson}
            onChange={(e) => setOptions({ ...options, useJackson: e.target.checked, useGson: e.target.checked ? false : options.useGson })}
            className="rounded"
          />
          Jackson
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={options.useGson}
            onChange={(e) => setOptions({ ...options, useGson: e.target.checked, useJackson: e.target.checked ? false : options.useJackson })}
            className="rounded"
          />
          Gson
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
        Generate Java Classes
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
