'use client';

import { useState, useCallback } from 'react';
import { jsonrepair } from 'jsonrepair';
import { JsonEditor } from '@/components/JsonEditor';

interface ConversionResult {
  success: boolean;
  output: string;
  stats: {
    singleLineComments: number;
    multiLineComments: number;
    trailingCommas: number;
  };
  error?: string;
}

function countComments(input: string): { single: number; multi: number } {
  const singleLineMatches = input.match(/\/\/[^\n]*/g) || [];
  const multiLineMatches = input.match(/\/\*[\s\S]*?\*\//g) || [];
  return {
    single: singleLineMatches.length,
    multi: multiLineMatches.length,
  };
}

function countTrailingCommas(input: string): number {
  const matches = input.match(/,\s*[}\]]/g) || [];
  return matches.length;
}

function convertJsonc(input: string): ConversionResult {
  const trimmed = input.trim();
  
  if (!trimmed) {
    return {
      success: false,
      output: '',
      stats: { singleLineComments: 0, multiLineComments: 0, trailingCommas: 0 },
      error: 'Please enter some JSONC/JSON5 to convert',
    };
  }
  
  // Count what we're removing before conversion
  const comments = countComments(trimmed);
  const trailingCommas = countTrailingCommas(trimmed);
  
  // First, try to parse as standard JSON (might already be valid)
  try {
    const parsed = JSON.parse(trimmed);
    const pretty = JSON.stringify(parsed, null, 2);
    return {
      success: true,
      output: pretty,
      stats: { 
        singleLineComments: 0, 
        multiLineComments: 0, 
        trailingCommas: 0 
      },
    };
  } catch {
    // Not valid JSON, continue with conversion
  }
  
  try {
    // Use jsonrepair which handles comments, trailing commas, etc.
    const repaired = jsonrepair(trimmed);
    
    // Verify it's valid JSON
    const parsed = JSON.parse(repaired);
    const pretty = JSON.stringify(parsed, null, 2);
    
    return {
      success: true,
      output: pretty,
      stats: {
        singleLineComments: comments.single,
        multiLineComments: comments.multi,
        trailingCommas,
      },
    };
  } catch (e) {
    return {
      success: false,
      output: '',
      stats: { singleLineComments: 0, multiLineComments: 0, trailingCommas: 0 },
      error: `Conversion failed: ${e instanceof Error ? e.message : 'Unknown error'}`,
    };
  }
}

const EXAMPLE_JSONC = `{
  // Database configuration
  "database": {
    "host": "localhost",
    "port": 5432,
    "name": "myapp", // production uses 'myapp_prod'
  },
  
  /*
   * Feature flags
   * Enable experimental features with caution
   */
  "features": {
    "darkMode": true,
    "betaFeatures": false,
    "maxUploadSize": 10485760, // 10MB in bytes
  },
  
  // Logging settings
  "logging": {
    "level": "info",
    "format": "json",
  }
}`;

export function JsoncConverter() {
  const [input, setInput] = useState(EXAMPLE_JSONC);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [outputFormat, setOutputFormat] = useState<'pretty' | 'minified'>('pretty');

  const handleConvert = useCallback(() => {
    const conversionResult = convertJsonc(input);
    
    // Apply output format
    if (conversionResult.success && outputFormat === 'minified') {
      try {
        conversionResult.output = JSON.stringify(JSON.parse(conversionResult.output));
      } catch {
        // Keep pretty format if minification fails
      }
    }
    
    setResult(conversionResult);
  }, [input, outputFormat]);

  const handleCopy = async () => {
    if (result?.output) {
      await navigator.clipboard.writeText(result.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const totalRemoved = result 
    ? result.stats.singleLineComments + result.stats.multiLineComments + result.stats.trailingCommas
    : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div>
          <div className="editor-panel-header">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              JSONC / JSON5 Input
            </label>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {input.length} chars
            </span>
          </div>
          <JsonEditor
            value={input}
            onChange={setInput}
            height="350px"
            language="json"
          />
        </div>

        {/* Output */}
        <div>
          <div className="editor-panel-header">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Standard JSON Output
            </label>
            {result?.success && result.output && (
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
            value={result?.output || '// Standard JSON will appear here'}
            onChange={() => {}}
            height="350px"
            language="json"
            readOnly
          />
        </div>
      </div>

      {/* Options and convert button */}
      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={handleConvert}
          className="px-6 py-2 rounded font-medium transition-colors"
          style={{
            background: 'var(--accent-blue)',
            color: 'white',
          }}
        >
          Convert to JSON
        </button>

        <div className="flex items-center gap-2">
          <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Output format:
          </label>
          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value as 'pretty' | 'minified')}
            className="px-2 py-1 rounded text-sm"
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-primary)',
            }}
          >
            <option value="pretty">Pretty printed</option>
            <option value="minified">Minified</option>
          </select>
        </div>

        {result && (
          <div className="flex items-center gap-2">
            {result.success ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
            <span
              className="text-sm"
              style={{ color: result.success ? 'var(--accent-green)' : 'var(--accent-red)' }}
            >
              {result.success ? 'Conversion successful!' : 'Conversion failed'}
            </span>
          </div>
        )}
      </div>

      {/* Stats */}
      {result?.success && totalRemoved > 0 && (
        <div
          className="p-4 rounded-lg"
          style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid var(--accent-green)',
          }}
        >
          <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--accent-green)' }}>
            Items Removed:
          </h4>
          <div className="flex flex-wrap gap-4 text-sm">
            {result.stats.singleLineComments > 0 && (
              <span style={{ color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--accent-green)' }}>✓</span> {result.stats.singleLineComments} single-line comment{result.stats.singleLineComments !== 1 ? 's' : ''} (//)
              </span>
            )}
            {result.stats.multiLineComments > 0 && (
              <span style={{ color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--accent-green)' }}>✓</span> {result.stats.multiLineComments} multi-line comment{result.stats.multiLineComments !== 1 ? 's' : ''} (/* */)
              </span>
            )}
            {result.stats.trailingCommas > 0 && (
              <span style={{ color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--accent-green)' }}>✓</span> {result.stats.trailingCommas} trailing comma{result.stats.trailingCommas !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      )}

      {result?.error && (
        <div
          className="p-4 rounded-lg"
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid var(--accent-red)',
          }}
        >
          <p className="text-sm" style={{ color: 'var(--accent-red)' }}>
            {result.error}
          </p>
        </div>
      )}

      {/* Feature comparison */}
      <div
        className="p-4 rounded-lg"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
        }}
      >
        <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
          JSONC/JSON5 Features We Support
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { feature: 'Single-line comments', example: '// comment' },
            { feature: 'Multi-line comments', example: '/* ... */' },
            { feature: 'Trailing commas', example: '{"a": 1,}' },
            { feature: 'Unquoted keys', example: '{key: "value"}' },
            { feature: 'Single quotes', example: "{'a': 'b'}" },
            { feature: 'Hexadecimal numbers', example: '0xFF' },
          ].map((item) => (
            <div
              key={item.feature}
              className="p-2 rounded text-xs flex items-center gap-2"
              style={{ background: 'var(--bg-primary)' }}
            >
              <CheckCircle className="w-4 h-4 flex-shrink-0 text-green-500" />
              <div>
                <div style={{ color: 'var(--text-primary)' }}>{item.feature}</div>
                <code style={{ color: 'var(--text-muted)' }}>{item.example}</code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function XCircle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M15 9l-6 6M9 9l6 6" />
    </svg>
  );
}
