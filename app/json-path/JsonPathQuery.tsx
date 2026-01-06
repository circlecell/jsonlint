'use client';

import { useState } from 'react';
import { JsonEditor } from '@/components/JsonEditor';
import { parseJSON } from '@/lib/json-utils';
import { JSONPath } from 'jsonpath-plus';

const exampleJson = `{
  "store": {
    "books": [
      { "title": "The Great Gatsby", "author": "F. Scott Fitzgerald", "price": 12.99 },
      { "title": "1984", "author": "George Orwell", "price": 10.99 },
      { "title": "To Kill a Mockingbird", "author": "Harper Lee", "price": 14.99 }
    ],
    "location": "Downtown"
  }
}`;

const exampleQueries = [
  { query: '$.store.books[*].title', description: 'All book titles' },
  { query: '$..price', description: 'All prices (recursive)' },
  { query: '$.store.books[0]', description: 'First book' },
  { query: '$.store.books[-1]', description: 'Last book' },
  { query: '$.store.books[?(@.price > 12)]', description: 'Books over $12' },
];

export function JsonPathQuery() {
  const [jsonInput, setJsonInput] = useState(exampleJson);
  const [pathQuery, setPathQuery] = useState('$.store.books[*].title');
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleQuery = () => {
    const parseResult = parseJSON(jsonInput);
    if (!parseResult.valid) {
      setError(`Invalid JSON: ${parseResult.error}`);
      setResult('');
      return;
    }

    if (!pathQuery.trim()) {
      setError('Please enter a JSONPath query');
      setResult('');
      return;
    }

    try {
      const queryResult = JSONPath({ path: pathQuery, json: parseResult.data as object });
      setResult(JSON.stringify(queryResult, null, 2));
      setError(null);
    } catch (e) {
      setError(`Query error: ${(e as Error).message}`);
      setResult('');
    }
  };

  const handleClear = () => {
    setJsonInput('');
    setPathQuery('');
    setResult('');
    setError(null);
  };

  const handleLoadExample = () => {
    setJsonInput(exampleJson);
    setPathQuery('$.store.books[*].title');
    setResult('');
    setError(null);
  };

  const handleQuickQuery = (query: string) => {
    setPathQuery(query);
    // Auto-run the query
    setTimeout(() => {
      const parseResult = parseJSON(jsonInput);
      if (parseResult.valid) {
        try {
          const queryResult = JSONPath({ path: query, json: parseResult.data as object });
          setResult(JSON.stringify(queryResult, null, 2));
          setError(null);
        } catch (e) {
          setError(`Query error: ${(e as Error).message}`);
        }
      }
    }, 0);
  };

  return (
    <div className="space-y-4">
      {/* Query input */}
      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: 'var(--text-secondary)' }}
        >
          JSONPath Query
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={pathQuery}
            onChange={(e) => setPathQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
            className="input-base flex-1 font-mono"
            placeholder="$.store.books[*].title"
          />
          <button className="btn btn-primary" onClick={handleQuery}>
            <SearchIcon className="w-4 h-4" />
            Query
          </button>
        </div>
      </div>

      {/* Quick queries */}
      <div className="flex flex-wrap gap-2">
        {exampleQueries.map((item) => (
          <button
            key={item.query}
            onClick={() => handleQuickQuery(item.query)}
            className="text-xs px-2 py-1 rounded transition-colors"
            style={{
              background: 'var(--bg-tertiary)',
              color: 'var(--text-secondary)',
            }}
            title={item.description}
          >
            <code>{item.query}</code>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* JSON Input */}
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            JSON Data
          </label>
          <div className="editor-container">
            <JsonEditor
              value={jsonInput}
              onChange={setJsonInput}
              height="350px"
            />
          </div>
        </div>

        {/* Result */}
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            Query Result
          </label>
          <div className="editor-container">
            <JsonEditor value={result} readOnly height="350px" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button className="btn btn-secondary" onClick={handleLoadExample}>
          Load Example
        </button>
        <button className="btn btn-secondary" onClick={handleClear}>
          Clear
        </button>
      </div>

      {/* Error */}
      {error && (
        <div
          className="p-4 rounded-lg border animate-fade-in"
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            borderColor: 'rgba(239, 68, 68, 0.3)',
          }}
        >
          <span className="text-accent-red">{error}</span>
        </div>
      )}
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
