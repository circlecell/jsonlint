'use client';

import { useState, useCallback } from 'react';
import { JsonEditor } from '@/components/JsonEditor';

interface PhpOptions {
  rootClassName: string;
  namespace: string;
  useTypedProperties: boolean;
  useConstructorPromotion: boolean;
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

function inferPhpType(value: any, key: string, options: PhpOptions, classes: Map<string, string>): string {
  if (value === null) return '?string';
  
  if (Array.isArray(value)) {
    if (value.length === 0) return 'array';
    const itemType = inferPhpType(value[0], key, options, classes);
    return 'array'; // PHP doesn't have generic arrays in type hints
  }
  
  if (typeof value === 'object') {
    const className = toPascalCase(key);
    generatePhpClass(value, className, options, classes);
    return className;
  }
  
  if (typeof value === 'string') return 'string';
  if (typeof value === 'boolean') return 'bool';
  if (typeof value === 'number') {
    return Number.isInteger(value) ? 'int' : 'float';
  }
  
  return 'mixed';
}

function generatePhpClass(obj: object, className: string, options: PhpOptions, classes: Map<string, string>): void {
  if (classes.has(className)) return;
  
  const entries = Object.entries(obj);
  let code = '';
  
  if (options.useConstructorPromotion) {
    // PHP 8+ constructor property promotion
    code = `class ${className}\n{\n    public function __construct(\n`;
    const params = entries.map(([key, value]) => {
      const type = inferPhpType(value, key, options, classes);
      const propName = toCamelCase(key);
      return `        public ${type} $${propName}`;
    });
    code += params.join(',\n') + '\n    ) {}\n}';
  } else {
    // Traditional class
    const properties: string[] = [];
    const constructorParams: string[] = [];
    const constructorAssigns: string[] = [];
    const gettersSetters: string[] = [];
    
    for (const [key, value] of entries) {
      const type = inferPhpType(value, key, options, classes);
      const propName = toCamelCase(key);
      
      if (options.useTypedProperties) {
        properties.push(`    private ${type} $${propName};`);
      } else {
        properties.push(`    /** @var ${type} */\n    private $${propName};`);
      }
      
      constructorParams.push(`${options.useTypedProperties ? type + ' ' : ''}$${propName}`);
      constructorAssigns.push(`        $this->${propName} = $${propName};`);
      
      if (options.generateGettersSetters) {
        const pascalProp = toPascalCase(propName);
        gettersSetters.push(`
    public function get${pascalProp}()${options.useTypedProperties ? ': ' + type : ''}
    {
        return $this->${propName};
    }

    public function set${pascalProp}(${options.useTypedProperties ? type + ' ' : ''}$${propName})${options.useTypedProperties ? ': void' : ''}
    {
        $this->${propName} = $${propName};
    }`);
      }
    }
    
    code = `class ${className}\n{\n`;
    code += properties.join('\n\n') + '\n\n';
    code += `    public function __construct(${constructorParams.join(', ')})\n    {\n`;
    code += constructorAssigns.join('\n') + '\n    }';
    if (gettersSetters.length > 0) {
      code += gettersSetters.join('\n');
    }
    code += '\n}';
  }
  
  classes.set(className, code);
}

function jsonToPhp(json: object, options: PhpOptions): string {
  const classes = new Map<string, string>();
  
  generatePhpClass(json, options.rootClassName, options, classes);
  
  let output = '<?php\n\n';
  
  if (options.namespace) {
    output += `namespace ${options.namespace};\n\n`;
  }
  
  // Root class first, then others
  const rootClass = classes.get(options.rootClassName);
  const otherClasses = Array.from(classes.entries())
    .filter(([name]) => name !== options.rootClassName)
    .map(([, code]) => code);
  
  // Other classes first (dependencies)
  for (const cls of otherClasses) {
    output += cls + '\n\n';
  }
  
  if (rootClass) {
    output += rootClass;
  }
  
  return output;
}

export function JsonToPhpConverter() {
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
  
  const [options, setOptions] = useState<PhpOptions>({
    rootClassName: 'Root',
    namespace: 'App\\Models',
    useTypedProperties: true,
    useConstructorPromotion: true,
    generateGettersSetters: false,
  });

  const convert = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      const php = jsonToPhp(parsed, options);
      setOutput(php);
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
              PHP Output
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
            value={output || '// PHP classes will appear here'}
            onChange={() => {}}
            height="350px"
            language="php"
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
            Namespace:
          </label>
          <input
            type="text"
            value={options.namespace}
            onChange={(e) => setOptions({ ...options, namespace: e.target.value })}
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
            checked={options.useConstructorPromotion}
            onChange={(e) => setOptions({ ...options, useConstructorPromotion: e.target.checked })}
            className="rounded"
          />
          PHP 8+ promotion
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={options.useTypedProperties}
            onChange={(e) => setOptions({ ...options, useTypedProperties: e.target.checked })}
            className="rounded"
          />
          Typed properties
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
        Generate PHP Classes
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
