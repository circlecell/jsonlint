'use client';

import { useState, useCallback, useMemo } from 'react';
import { JsonEditor } from '@/components/JsonEditor';

interface ErrorInfo {
  message: string;
  line: number;
  column: number;
  position: number;
  context: string;
  contextBefore: string;
  contextAfter: string;
  suggestion?: string;
  fixable: boolean;
  fix?: () => string;
  type: 'syntax' | 'structure' | 'value';
  severity: 'error' | 'warning';
}

interface AnalysisResult {
  valid: boolean;
  errors: ErrorInfo[];
  warnings: string[];
}

// Common JSON error patterns and their human-readable explanations
const ERROR_PATTERNS: {
  pattern: RegExp;
  getMessage: (match: RegExpMatchArray, input: string, position: number) => string;
  getSuggestion: (match: RegExpMatchArray, input: string, position: number) => string | undefined;
  getFixable: (input: string, position: number) => boolean;
  getFix?: (input: string, position: number) => string;
}[] = [
  {
    pattern: /Unexpected token '?,'?/i,
    getMessage: () => 'Unexpected comma found',
    getSuggestion: (_, input, pos) => {
      // Check if it's a trailing comma
      const after = input.substring(pos).match(/^,\s*[}\]]/);
      if (after) {
        return 'This looks like a trailing comma. JSON doesn\'t allow commas before closing brackets.';
      }
      return 'Check if there\'s a missing value before this comma, or remove the extra comma.';
    },
    getFixable: (input, pos) => {
      const after = input.substring(pos).match(/^,\s*[}\]]/);
      return !!after;
    },
    getFix: (input, pos) => {
      return input.substring(0, pos) + input.substring(pos).replace(/^,\s*/, '');
    },
  },
  {
    pattern: /Unexpected token '?''?/i,
    getMessage: () => 'Single quote found instead of double quote',
    getSuggestion: () => 'JSON requires double quotes (") for strings, not single quotes (\').',
    getFixable: () => true,
    getFix: (input) => {
      // Replace single quotes with double quotes (simple approach)
      return input.replace(/'([^']*)'/g, '"$1"');
    },
  },
  {
    pattern: /Unexpected token '?([a-zA-Z])'?/i,
    getMessage: (match) => `Unexpected character: ${match[1]}`,
    getSuggestion: (match, input, pos) => {
      const before = input.substring(Math.max(0, pos - 20), pos);
      // Check if it looks like an unquoted key
      if (/[{,]\s*$/.test(before)) {
        return 'This looks like an unquoted object key. JSON requires all keys to be in double quotes.';
      }
      // Check for common typos
      const word = input.substring(pos).match(/^[a-zA-Z]+/)?.[0];
      if (word === 'true' || word === 'false' || word === 'null') {
        return `"${word}" is a valid JSON value, but check if it's in the right place.`;
      }
      if (word === 'undefined') {
        return '"undefined" is not valid in JSON. Use "null" instead.';
      }
      if (word === 'NaN' || word === 'Infinity') {
        return `"${word}" is not valid in JSON. Use a string or null instead.`;
      }
      return 'Make sure string values are wrapped in double quotes.';
    },
    getFixable: (input, pos) => {
      const before = input.substring(Math.max(0, pos - 20), pos);
      return /[{,]\s*$/.test(before);
    },
    getFix: (input, pos) => {
      // Try to quote the unquoted key
      const before = input.substring(0, pos);
      const keyMatch = input.substring(pos).match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*:/);
      if (keyMatch) {
        return before + `"${keyMatch[1]}"` + input.substring(pos + keyMatch[1].length);
      }
      return input;
    },
  },
  {
    pattern: /Unexpected end of JSON/i,
    getMessage: () => 'JSON is incomplete or truncated',
    getSuggestion: (_, input) => {
      const openBraces = (input.match(/{/g) || []).length;
      const closeBraces = (input.match(/}/g) || []).length;
      const openBrackets = (input.match(/\[/g) || []).length;
      const closeBrackets = (input.match(/]/g) || []).length;
      
      const missingBraces = openBraces - closeBraces;
      const missingBrackets = openBrackets - closeBrackets;
      
      const parts = [];
      if (missingBraces > 0) parts.push(`${missingBraces} closing brace(s) "}"`);
      if (missingBrackets > 0) parts.push(`${missingBrackets} closing bracket(s) "]"`);
      
      if (parts.length > 0) {
        return `Missing ${parts.join(' and ')}. The JSON appears to be cut off.`;
      }
      return 'The JSON appears to be incomplete. Check if it was truncated.';
    },
    getFixable: () => false,
  },
  {
    pattern: /Expected '?:'?.*after property name/i,
    getMessage: () => 'Missing colon after property name',
    getSuggestion: () => 'Object properties need a colon between the key and value: "key": "value"',
    getFixable: () => false,
  },
  {
    pattern: /Expected '?"'?/i,
    getMessage: () => 'Expected a double quote',
    getSuggestion: (_, input, pos) => {
      const context = input.substring(Math.max(0, pos - 10), pos + 10);
      if (context.includes("'")) {
        return 'It looks like you\'re using single quotes. JSON requires double quotes for strings.';
      }
      return 'String values and keys must be wrapped in double quotes.';
    },
    getFixable: () => false,
  },
  {
    pattern: /Unexpected number/i,
    getMessage: () => 'Unexpected number in this position',
    getSuggestion: () => 'Check if you\'re missing a comma before this number, or if a key name starts with a number (keys must be strings).',
    getFixable: () => false,
  },
  {
    pattern: /Bad control character/i,
    getMessage: () => 'Invalid control character in string',
    getSuggestion: () => 'Strings cannot contain raw control characters like tabs or newlines. Use escape sequences: \\t for tab, \\n for newline.',
    getFixable: () => false,
  },
];

function analyzeError(input: string): AnalysisResult {
  if (!input.trim()) {
    return { valid: false, errors: [], warnings: ['Input is empty'] };
  }

  try {
    JSON.parse(input);
    return { valid: true, errors: [], warnings: [] };
  } catch (e) {
    const error = e as SyntaxError;
    const errorMsg = error.message;
    
    // Extract position from error message
    const posMatch = errorMsg.match(/at position (\d+)/i) || 
                     errorMsg.match(/at line (\d+) column (\d+)/i);
    
    let position = 0;
    let line = 1;
    let column = 1;
    
    if (posMatch) {
      if (posMatch[2]) {
        // Line and column format
        line = parseInt(posMatch[1], 10);
        column = parseInt(posMatch[2], 10);
        // Calculate position from line/column
        const lines = input.split('\n');
        for (let i = 0; i < line - 1 && i < lines.length; i++) {
          position += lines[i].length + 1;
        }
        position += column - 1;
      } else {
        // Position format
        position = parseInt(posMatch[1], 10);
        const before = input.substring(0, position);
        const linesBefore = before.split('\n');
        line = linesBefore.length;
        column = linesBefore[linesBefore.length - 1].length + 1;
      }
    }
    
    // Get context around the error
    const contextStart = Math.max(0, position - 30);
    const contextEnd = Math.min(input.length, position + 30);
    const contextBefore = input.substring(contextStart, position);
    const contextAfter = input.substring(position, contextEnd);
    const errorChar = input[position] || '';
    
    // Find matching error pattern
    let suggestion: string | undefined;
    let fixable = false;
    let fix: (() => string) | undefined;
    
    for (const pattern of ERROR_PATTERNS) {
      const match = errorMsg.match(pattern.pattern);
      if (match) {
        suggestion = pattern.getSuggestion(match, input, position);
        fixable = pattern.getFixable(input, position);
        if (fixable && pattern.getFix) {
          const fixedInput = pattern.getFix(input, position);
          fix = () => fixedInput;
        }
        break;
      }
    }
    
    // If no pattern matched, provide generic advice
    if (!suggestion) {
      suggestion = getGenericSuggestion(input, position, errorChar);
    }
    
    const errorInfo: ErrorInfo = {
      message: errorMsg,
      line,
      column,
      position,
      context: contextBefore + '→' + errorChar + '←' + contextAfter.substring(1),
      contextBefore,
      contextAfter,
      suggestion,
      fixable,
      fix,
      type: 'syntax',
      severity: 'error',
    };
    
    return {
      valid: false,
      errors: [errorInfo],
      warnings: [],
    };
  }
}

function getGenericSuggestion(input: string, position: number, char: string): string {
  // Check for common issues based on character
  if (char === ',') {
    return 'Check for trailing commas or missing values.';
  }
  if (char === ':') {
    return 'Check that your key-value pairs are properly formatted.';
  }
  if (char === '{' || char === '[') {
    return 'Check for unclosed brackets or braces earlier in the document.';
  }
  if (char === '}' || char === ']') {
    return 'Check for missing opening brackets or unexpected closing brackets.';
  }
  if (char === '"') {
    return 'Check for unclosed strings or escape characters inside strings.';
  }
  
  return 'Check the syntax around this position for missing quotes, commas, or colons.';
}

const EXAMPLES = [
  {
    name: 'Trailing comma',
    json: `{
  "name": "John",
  "age": 30,
}`,
  },
  {
    name: 'Single quotes',
    json: `{'name': 'John', 'age': 30}`,
  },
  {
    name: 'Unquoted key',
    json: `{name: "John", age: 30}`,
  },
  {
    name: 'Truncated',
    json: `{"users": [{"name": "John"}, {"name": "Jane"`,
  },
  {
    name: 'Missing comma',
    json: `{"name": "John" "age": 30}`,
  },
  {
    name: 'Undefined value',
    json: `{"name": "John", "age": undefined}`,
  },
];

export function ErrorAnalyzer() {
  const [input, setInput] = useState(EXAMPLES[0].json);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const handleAnalyze = useCallback(() => {
    const result = analyzeError(input);
    setAnalysis(result);
  }, [input]);

  const handleFix = useCallback((fix: () => string) => {
    const fixed = fix();
    setInput(fixed);
    // Re-analyze after fix
    const result = analyzeError(fixed);
    setAnalysis(result);
  }, []);

  const loadExample = (json: string) => {
    setInput(json);
    setAnalysis(null);
  };

  // Calculate line display for error highlighting
  const errorLine = useMemo(() => {
    if (analysis?.errors[0]) {
      return analysis.errors[0].line;
    }
    return null;
  }, [analysis]);

  return (
    <div className="space-y-4">
      {/* Example buttons */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm self-center" style={{ color: 'var(--text-muted)' }}>
          Try an example:
        </span>
        {EXAMPLES.map((example) => (
          <button
            key={example.name}
            onClick={() => loadExample(example.json)}
            className="px-3 py-1 text-xs rounded-full transition-colors hover:bg-[var(--bg-tertiary)]"
            style={{
              background: 'var(--bg-secondary)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-primary)',
            }}
          >
            {example.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-4">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              JSON Input
            </label>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {input.split('\n').length} lines
            </span>
          </div>
          <JsonEditor
            value={input}
            onChange={setInput}
            height="350px"
            language="json"
            errorLine={errorLine}
          />
        </div>

        {/* Analysis panel */}
        <div className="space-y-4">
          <button
            onClick={handleAnalyze}
            className="w-full px-6 py-3 rounded font-medium transition-colors"
            style={{
              background: 'var(--accent-blue)',
              color: 'white',
            }}
          >
            Analyze Errors
          </button>

          {analysis && (
            <>
              {/* Status */}
              <div
                className="p-4 rounded-lg"
                style={{
                  background: analysis.valid ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  border: `1px solid ${analysis.valid ? 'var(--accent-green)' : 'var(--accent-red)'}`,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  {analysis.valid ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span
                    className="font-medium"
                    style={{ color: analysis.valid ? 'var(--accent-green)' : 'var(--accent-red)' }}
                  >
                    {analysis.valid ? 'Valid JSON!' : `${analysis.errors.length} Error(s) Found`}
                  </span>
                </div>
                
                {analysis.valid && (
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Your JSON is syntactically correct and ready to use.
                  </p>
                )}
              </div>

              {/* Error details */}
              {analysis.errors.map((error, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg space-y-3"
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-primary)',
                  }}
                >
                  {/* Error location */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono px-2 py-1 rounded" style={{ background: 'var(--bg-tertiary)', color: 'var(--accent-amber)' }}>
                      Line {error.line}, Column {error.column}
                    </span>
                    {error.fixable && error.fix && (
                      <button
                        onClick={() => handleFix(error.fix!)}
                        className="text-xs px-3 py-1 rounded font-medium transition-colors"
                        style={{
                          background: 'var(--accent-green)',
                          color: 'white',
                        }}
                      >
                        Auto-Fix
                      </button>
                    )}
                  </div>

                  {/* Error message */}
                  <div>
                    <h4 className="text-sm font-medium mb-1" style={{ color: 'var(--accent-red)' }}>
                      Error
                    </h4>
                    <p className="text-sm font-mono" style={{ color: 'var(--text-primary)' }}>
                      {error.message}
                    </p>
                  </div>

                  {/* Context */}
                  <div>
                    <h4 className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                      Context
                    </h4>
                    <pre
                      className="text-xs p-2 rounded overflow-x-auto"
                      style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                    >
                      <span style={{ color: 'var(--text-muted)' }}>{error.contextBefore}</span>
                      <span className="px-1 rounded" style={{ background: 'rgba(239, 68, 68, 0.3)', color: 'var(--accent-red)' }}>
                        {input[error.position] || '⏎'}
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}>{error.contextAfter.substring(1)}</span>
                    </pre>
                  </div>

                  {/* Suggestion */}
                  {error.suggestion && (
                    <div>
                      <h4 className="text-sm font-medium mb-1 flex items-center gap-1" style={{ color: 'var(--accent-blue)' }}>
                        <LightbulbIcon className="w-4 h-4" />
                        Suggestion
                      </h4>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {error.suggestion}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}

          {!analysis && (
            <div
              className="p-6 rounded-lg text-center"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-primary)',
              }}
            >
              <SearchIcon className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Click "Analyze Errors" to get detailed information about any JSON issues.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Common errors reference */}
      <div
        className="p-4 rounded-lg"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
        }}
      >
        <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
          Common JSON Errors Quick Reference
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { error: 'Trailing comma', wrong: '{"a": 1,}', right: '{"a": 1}' },
            { error: 'Single quotes', wrong: "{'a': 1}", right: '{"a": 1}' },
            { error: 'Unquoted key', wrong: '{a: 1}', right: '{"a": 1}' },
            { error: 'Missing comma', wrong: '{"a": 1 "b": 2}', right: '{"a": 1, "b": 2}' },
            { error: 'undefined', wrong: '{"a": undefined}', right: '{"a": null}' },
            { error: 'Raw newline', wrong: '{"a": "line1\\nline2"}', right: '{"a": "line1\\\\nline2"}' },
          ].map((item) => (
            <div
              key={item.error}
              className="p-2 rounded text-xs"
              style={{ background: 'var(--bg-primary)' }}
            >
              <div className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                {item.error}
              </div>
              <div className="flex items-center gap-2">
                <code className="text-red-500">{item.wrong}</code>
                <span style={{ color: 'var(--text-muted)' }}>→</span>
                <code className="text-green-500">{item.right}</code>
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

function LightbulbIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.3A7 7 0 0 0 12 2z" />
    </svg>
  );
}

function SearchIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={style}>
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}
