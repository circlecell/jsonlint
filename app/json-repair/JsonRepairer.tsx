'use client';

import { useState, useCallback } from 'react';
import { jsonrepair } from 'jsonrepair';
import { JsonEditor } from '@/components/JsonEditor';

interface RepairResult {
  success: boolean;
  output: string;
  changes: string[];
  error?: string;
}

function detectChanges(original: string, repaired: string): string[] {
  const changes: string[] = [];
  
  // Check for common repairs
  if (original.includes("'") && !repaired.includes("'")) {
    changes.push("Converted single quotes to double quotes");
  }
  
  if (/,\s*[}\]]/.test(original) && !/,\s*[}\]]/.test(repaired)) {
    changes.push("Removed trailing commas");
  }
  
  if (/```/.test(original) && !/```/.test(repaired)) {
    changes.push("Removed markdown code block wrappers");
  }
  
  if (/^\s*json\s*\n/i.test(original)) {
    changes.push("Removed 'json' language identifier");
  }
  
  if (/\/\/.*$/m.test(original) || /\/\*[\s\S]*?\*\//.test(original)) {
    changes.push("Removed comments");
  }
  
  if (/([{,]\s*)(\w+)\s*:/.test(original)) {
    const unquotedKeys = original.match(/([{,]\s*)(\w+)\s*:/g);
    if (unquotedKeys && unquotedKeys.some(k => !k.includes('"'))) {
      changes.push("Added quotes to unquoted keys");
    }
  }
  
  if (original.includes('undefined') && !repaired.includes('undefined')) {
    changes.push("Converted 'undefined' to null");
  }
  
  if (original.includes('NaN') && !repaired.includes('NaN')) {
    changes.push("Converted NaN to null");
  }
  
  if (/\bInfinity\b/.test(original) && !/\bInfinity\b/.test(repaired)) {
    changes.push("Converted Infinity to null");
  }
  
  // Check for truncation repair (added closing brackets)
  const originalOpenBraces = (original.match(/\{/g) || []).length;
  const originalCloseBraces = (original.match(/\}/g) || []).length;
  const repairedCloseBraces = (repaired.match(/\}/g) || []).length;
  
  if (repairedCloseBraces > originalCloseBraces) {
    changes.push("Added missing closing braces");
  }
  
  const originalOpenBrackets = (original.match(/\[/g) || []).length;
  const originalCloseBrackets = (original.match(/\]/g) || []).length;
  const repairedCloseBrackets = (repaired.match(/\]/g) || []).length;
  
  if (repairedCloseBrackets > originalCloseBrackets) {
    changes.push("Added missing closing brackets");
  }
  
  // Check for missing commas
  if (repaired.split(',').length > original.split(',').length) {
    changes.push("Added missing commas between elements");
  }
  
  if (changes.length === 0 && original !== repaired) {
    changes.push("Made structural repairs");
  }
  
  return changes;
}

function repairJson(input: string): RepairResult {
  const trimmed = input.trim();
  
  if (!trimmed) {
    return {
      success: false,
      output: '',
      changes: [],
      error: 'Please enter some JSON to repair',
    };
  }
  
  // First, try to parse as-is (might already be valid)
  try {
    JSON.parse(trimmed);
    return {
      success: true,
      output: trimmed,
      changes: ['JSON is already valid - no repairs needed'],
    };
  } catch {
    // JSON is invalid, try to repair
  }
  
  try {
    // Strip markdown code blocks if present
    let toRepair = trimmed;
    const codeBlockMatch = toRepair.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```$/);
    if (codeBlockMatch) {
      toRepair = codeBlockMatch[1];
    }
    
    const repaired = jsonrepair(toRepair);
    const changes = detectChanges(trimmed, repaired);
    
    // Verify the repair worked
    JSON.parse(repaired);
    
    // Pretty print the result
    const pretty = JSON.stringify(JSON.parse(repaired), null, 2);
    
    return {
      success: true,
      output: pretty,
      changes: changes.length > 0 ? changes : ['JSON repaired successfully'],
    };
  } catch (e) {
    return {
      success: false,
      output: '',
      changes: [],
      error: `Unable to repair JSON: ${e instanceof Error ? e.message : 'Unknown error'}`,
    };
  }
}

const EXAMPLES = [
  {
    name: 'Trailing commas',
    json: `{
  "name": "John",
  "age": 30,
  "active": true,
}`,
  },
  {
    name: 'Single quotes',
    json: `{'name': 'John', 'city': 'New York'}`,
  },
  {
    name: 'Unquoted keys',
    json: `{name: "John", age: 30}`,
  },
  {
    name: 'Markdown wrapper',
    json: `\`\`\`json
{"name": "John", "age": 30}
\`\`\``,
  },
  {
    name: 'Comments',
    json: `{
  // User information
  "name": "John",
  /* Age in years */
  "age": 30
}`,
  },
  {
    name: 'Truncated JSON',
    json: `{"users": [{"name": "John", "age": 30}, {"name": "Jane"`,
  },
  {
    name: 'Missing commas',
    json: `{"name": "John" "age": 30 "active": true}`,
  },
];

export function JsonRepairer() {
  const [input, setInput] = useState(EXAMPLES[0].json);
  const [result, setResult] = useState<RepairResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleRepair = useCallback(() => {
    const repairResult = repairJson(input);
    setResult(repairResult);
  }, [input]);

  const handleCopy = async () => {
    if (result?.output) {
      await navigator.clipboard.writeText(result.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const loadExample = (json: string) => {
    setInput(json);
    setResult(null);
  };

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Broken JSON
            </label>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {input.length} chars
            </span>
          </div>
          <JsonEditor
            value={input}
            onChange={setInput}
            height="300px"
            language="json"
          />
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Repaired JSON
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
            value={result?.output || '// Repaired JSON will appear here'}
            onChange={() => {}}
            height="300px"
            language="json"
            readOnly
          />
        </div>
      </div>

      {/* Repair button */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleRepair}
          className="px-6 py-2 rounded font-medium transition-colors"
          style={{
            background: 'var(--accent-blue)',
            color: 'white',
          }}
        >
          Repair JSON
        </button>
        
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
              {result.success ? 'Repair successful!' : 'Repair failed'}
            </span>
          </div>
        )}
      </div>

      {/* Changes list */}
      {result && (
        <div
          className="p-4 rounded-lg"
          style={{
            background: result.success ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${result.success ? 'var(--accent-green)' : 'var(--accent-red)'}`,
          }}
        >
          {result.success ? (
            <>
              <h4
                className="text-sm font-medium mb-2"
                style={{ color: 'var(--accent-green)' }}
              >
                Repairs Made:
              </h4>
              <ul className="space-y-1">
                {result.changes.map((change, i) => (
                  <li
                    key={i}
                    className="text-sm flex items-center gap-2"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <span style={{ color: 'var(--accent-green)' }}>✓</span>
                    {change}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-sm" style={{ color: 'var(--accent-red)' }}>
              {result.error}
            </p>
          )}
        </div>
      )}

      {/* Quick reference */}
      <div
        className="p-4 rounded-lg"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
        }}
      >
        <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
          Common Issues We Fix
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { issue: 'Trailing commas', before: '{"a": 1,}', after: '{"a": 1}' },
            { issue: 'Single quotes', before: "{'a': 1}", after: '{"a": 1}' },
            { issue: 'Unquoted keys', before: '{a: 1}', after: '{"a": 1}' },
            { issue: 'Missing commas', before: '{"a": 1 "b": 2}', after: '{"a": 1, "b": 2}' },
            { issue: 'Comments', before: '{"a": 1} // note', after: '{"a": 1}' },
            { issue: 'Truncated', before: '{"a": [1, 2', after: '{"a": [1, 2]}' },
          ].map((item) => (
            <div
              key={item.issue}
              className="p-2 rounded text-xs"
              style={{ background: 'var(--bg-primary)' }}
            >
              <div className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                {item.issue}
              </div>
              <div className="flex items-center gap-2">
                <code className="text-red-500 line-through">{item.before}</code>
                <span style={{ color: 'var(--text-muted)' }}>→</span>
                <code className="text-green-500">{item.after}</code>
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
