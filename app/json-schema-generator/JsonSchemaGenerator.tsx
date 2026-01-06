'use client';

import { useState, useCallback } from 'react';
import { JsonEditor } from '@/components/JsonEditor';

interface SchemaOptions {
  title: string;
  description: string;
  requiredByDefault: boolean;
  includeExamples: boolean;
  detectFormats: boolean;
}

interface JSONSchema {
  $schema?: string;
  title?: string;
  description?: string;
  type: string;
  properties?: Record<string, JSONSchema>;
  items?: JSONSchema;
  required?: string[];
  format?: string;
  examples?: any[];
  minimum?: number;
  maximum?: number;
  minLength?: number;
  enum?: any[];
}

function detectFormat(value: string): string | undefined {
  // Email
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'email';
  // URI
  if (/^https?:\/\//.test(value)) return 'uri';
  // Date-time (ISO 8601)
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) return 'date-time';
  // Date
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'date';
  // Time
  if (/^\d{2}:\d{2}:\d{2}$/.test(value)) return 'time';
  // UUID
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) return 'uuid';
  // IPv4
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(value)) return 'ipv4';
  
  return undefined;
}

function inferSchema(value: any, options: SchemaOptions): JSONSchema {
  if (value === null) {
    return { type: 'null' };
  }
  
  if (Array.isArray(value)) {
    const schema: JSONSchema = { type: 'array' };
    
    if (value.length > 0) {
      // Infer from first item
      schema.items = inferSchema(value[0], options);
      
      if (options.includeExamples && value.length <= 3) {
        schema.examples = [value];
      }
    } else {
      schema.items = { type: 'object' };
    }
    
    return schema;
  }
  
  if (typeof value === 'object') {
    const schema: JSONSchema = {
      type: 'object',
      properties: {},
    };
    
    const required: string[] = [];
    
    for (const [key, val] of Object.entries(value)) {
      schema.properties![key] = inferSchema(val, options);
      
      if (options.requiredByDefault && val !== null) {
        required.push(key);
      }
    }
    
    if (required.length > 0) {
      schema.required = required;
    }
    
    return schema;
  }
  
  if (typeof value === 'string') {
    const schema: JSONSchema = { type: 'string' };
    
    if (options.detectFormats) {
      const format = detectFormat(value);
      if (format) {
        schema.format = format;
      }
    }
    
    if (options.includeExamples) {
      schema.examples = [value];
    }
    
    return schema;
  }
  
  if (typeof value === 'number') {
    const schema: JSONSchema = {
      type: Number.isInteger(value) ? 'integer' : 'number',
    };
    
    if (options.includeExamples) {
      schema.examples = [value];
    }
    
    return schema;
  }
  
  if (typeof value === 'boolean') {
    return { type: 'boolean' };
  }
  
  return { type: 'string' };
}

function generateSchema(json: any, options: SchemaOptions): JSONSchema {
  const schema = inferSchema(json, options);
  
  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    title: options.title || undefined,
    description: options.description || undefined,
    ...schema,
  };
}

export function JsonSchemaGenerator() {
  const [input, setInput] = useState(`{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "tags": ["developer", "designer"],
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001"
  }
}`);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const [options, setOptions] = useState<SchemaOptions>({
    title: 'Generated Schema',
    description: '',
    requiredByDefault: true,
    includeExamples: false,
    detectFormats: true,
  });

  const generate = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      const schema = generateSchema(parsed, options);
      setOutput(JSON.stringify(schema, null, 2));
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

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'schema.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              JSON Sample
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
              Generated Schema
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
            value={output || '// JSON Schema will appear here'}
            onChange={() => {}}
            height="350px"
            language="json"
            readOnly
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 p-3 rounded" style={{ background: 'var(--bg-secondary)' }}>
        <div className="flex items-center gap-2">
          <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Title:
          </label>
          <input
            type="text"
            value={options.title}
            onChange={(e) => setOptions({ ...options, title: e.target.value })}
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
            checked={options.requiredByDefault}
            onChange={(e) => setOptions({ ...options, requiredByDefault: e.target.checked })}
            className="rounded"
          />
          Mark all required
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={options.detectFormats}
            onChange={(e) => setOptions({ ...options, detectFormats: e.target.checked })}
            className="rounded"
          />
          Detect formats
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={options.includeExamples}
            onChange={(e) => setOptions({ ...options, includeExamples: e.target.checked })}
            className="rounded"
          />
          Include examples
        </label>
      </div>

      <button
        onClick={generate}
        className="px-4 py-2 rounded font-medium transition-colors"
        style={{
          background: 'var(--accent-blue)',
          color: 'white',
        }}
      >
        Generate Schema
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

      {output && !error && (
        <div
          className="p-3 rounded text-sm"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            color: 'var(--text-muted)',
          }}
        >
          💡 <strong>Tip:</strong> Use the generated schema with our{' '}
          <a href="/json-schema" className="underline">JSON Schema Validator</a> to validate data.
        </div>
      )}
    </div>
  );
}
