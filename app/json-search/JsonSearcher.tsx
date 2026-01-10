'use client';

import { useState, useCallback, useMemo } from 'react';
import { JsonEditor } from '@/components/JsonEditor';
import copy from 'copy-to-clipboard';

interface SearchResult {
  path: string;
  key: string | null;
  value: unknown;
  valueType: string;
  valuePreview: string;
  matchType: 'key' | 'value' | 'both';
  context: {
    parentPath: string;
    parentType: 'object' | 'array' | 'root';
    siblings: number;
  };
}

function getValueType(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

function getValuePreview(value: unknown, maxLength: number = 50): string {
  if (value === null) return 'null';
  if (typeof value === 'boolean') return String(value);
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') {
    if (value.length > maxLength) {
      return `"${value.substring(0, maxLength)}..."`;
    }
    return `"${value}"`;
  }
  if (Array.isArray(value)) {
    return `Array[${value.length}]`;
  }
  if (typeof value === 'object') {
    const keys = Object.keys(value);
    return `Object{${keys.length} keys}`;
  }
  return String(value);
}

function searchJson(
  data: unknown,
  query: string,
  options: {
    searchKeys: boolean;
    searchValues: boolean;
    caseSensitive: boolean;
    matchWholeWord: boolean;
  }
): SearchResult[] {
  const results: SearchResult[] = [];
  const normalizedQuery = options.caseSensitive ? query : query.toLowerCase();

  function matches(text: string): boolean {
    const normalizedText = options.caseSensitive ? text : text.toLowerCase();
    if (options.matchWholeWord) {
      return normalizedText === normalizedQuery;
    }
    return normalizedText.includes(normalizedQuery);
  }

  function traverse(
    value: unknown,
    path: string,
    key: string | null,
    parentType: 'object' | 'array' | 'root',
    siblingCount: number
  ) {
    const valueType = getValueType(value);
    let matchType: 'key' | 'value' | 'both' | null = null;

    // Check if key matches
    if (options.searchKeys && key !== null && matches(key)) {
      matchType = 'key';
    }

    // Check if value matches (only for primitives)
    if (options.searchValues && value !== null && typeof value !== 'object') {
      const valueStr = String(value);
      if (matches(valueStr)) {
        matchType = matchType === 'key' ? 'both' : 'value';
      }
    }

    if (matchType) {
      const parentPath = path.includes('.') 
        ? path.substring(0, path.lastIndexOf('.'))
        : path.includes('[')
          ? path.substring(0, path.lastIndexOf('['))
          : '$';

      results.push({
        path,
        key,
        value,
        valueType,
        valuePreview: getValuePreview(value),
        matchType,
        context: {
          parentPath,
          parentType,
          siblings: siblingCount,
        },
      });
    }

    // Recurse into children
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        traverse(item, `${path}[${index}]`, null, 'array', value.length);
      });
    } else if (value !== null && typeof value === 'object') {
      const entries = Object.entries(value);
      entries.forEach(([k, v]) => {
        traverse(v, `${path}.${k}`, k, 'object', entries.length);
      });
    }
  }

  traverse(data, '$', null, 'root', 1);
  return results;
}

const EXAMPLE_JSON = `{
  "company": "TechCorp",
  "employees": [
    {
      "id": 1,
      "name": "Alice Johnson",
      "email": "alice@techcorp.com",
      "department": "Engineering",
      "role": "Senior Engineer",
      "skills": ["JavaScript", "Python", "React"]
    },
    {
      "id": 2,
      "name": "Bob Smith",
      "email": "bob@techcorp.com",
      "department": "Engineering",
      "role": "Tech Lead",
      "skills": ["Java", "Kubernetes", "AWS"]
    },
    {
      "id": 3,
      "name": "Carol Williams",
      "email": "carol@techcorp.com",
      "department": "Design",
      "role": "UX Designer",
      "skills": ["Figma", "CSS", "User Research"]
    }
  ],
  "departments": {
    "Engineering": {"headcount": 50, "budget": 5000000},
    "Design": {"headcount": 15, "budget": 1500000},
    "Marketing": {"headcount": 20, "budget": 2000000}
  },
  "metadata": {
    "lastUpdated": "2024-01-15",
    "version": "2.0"
  }
}`;

export function JsonSearcher() {
  const [input, setInput] = useState(EXAMPLE_JSON);
  const [query, setQuery] = useState('');
  const [searchKeys, setSearchKeys] = useState(true);
  const [searchValues, setSearchValues] = useState(true);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [matchWholeWord, setMatchWholeWord] = useState(false);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const results = useMemo(() => {
    if (!query.trim()) {
      setParseError(null);
      return [];
    }

    try {
      const data = JSON.parse(input);
      setParseError(null);
      return searchJson(data, query, {
        searchKeys,
        searchValues,
        caseSensitive,
        matchWholeWord,
      });
    } catch (e) {
      setParseError(`Invalid JSON: ${(e as Error).message}`);
      return [];
    }
  }, [input, query, searchKeys, searchValues, caseSensitive, matchWholeWord]);

  const handleCopyPath = useCallback((path: string) => {
    copy(path);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  }, []);

  const handleCopyValue = useCallback((value: unknown) => {
    const str = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
    copy(str);
  }, []);

  // Group results by match type for display
  const groupedResults = useMemo(() => {
    const keyMatches = results.filter(r => r.matchType === 'key' || r.matchType === 'both');
    const valueMatches = results.filter(r => r.matchType === 'value');
    return { keyMatches, valueMatches, total: results.length };
  }, [results]);

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div
        className="p-4 rounded-lg"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
        }}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <SearchIcon
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                style={{ color: 'var(--text-muted)' }}
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for keys or values..."
                className="w-full pl-10 pr-4 py-3 rounded-lg text-base"
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-primary)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Search options */}
        <div className="flex flex-wrap items-center gap-4 mt-3">
          <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
            <input
              type="checkbox"
              checked={searchKeys}
              onChange={(e) => setSearchKeys(e.target.checked)}
              className="rounded"
            />
            Search keys
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
            <input
              type="checkbox"
              checked={searchValues}
              onChange={(e) => setSearchValues(e.target.checked)}
              className="rounded"
            />
            Search values
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="rounded"
            />
            Case sensitive
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
            <input
              type="checkbox"
              checked={matchWholeWord}
              onChange={(e) => setMatchWholeWord(e.target.checked)}
              className="rounded"
            />
            Exact match
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              JSON Input
            </label>
          </div>
          <JsonEditor
            value={input}
            onChange={setInput}
            height="400px"
            language="json"
          />
        </div>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Search Results
              {query && (
                <span className="ml-2 font-normal" style={{ color: 'var(--text-muted)' }}>
                  ({groupedResults.total} match{groupedResults.total !== 1 ? 'es' : ''})
                </span>
              )}
            </label>
          </div>

          <div
            className="h-[400px] overflow-auto rounded-lg p-3"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
            }}
          >
            {parseError && (
              <div className="p-3 rounded" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                <p className="text-sm" style={{ color: 'var(--accent-red)' }}>{parseError}</p>
              </div>
            )}

            {!query && !parseError && (
              <div className="h-full flex items-center justify-center text-center">
                <div>
                  <SearchIcon className="w-10 h-10 mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Enter a search term to find keys and values in your JSON
                  </p>
                </div>
              </div>
            )}

            {query && !parseError && results.length === 0 && (
              <div className="h-full flex items-center justify-center text-center">
                <div>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    No matches found for "{query}"
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    Try adjusting your search options
                  </p>
                </div>
              </div>
            )}

            {results.length > 0 && (
              <div className="space-y-2">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg"
                    style={{ background: 'var(--bg-primary)' }}
                  >
                    {/* Path */}
                    <div className="flex items-center justify-between mb-2">
                      <code
                        className="text-xs font-mono truncate flex-1"
                        style={{ color: 'var(--accent-blue)' }}
                      >
                        {result.path}
                      </code>
                      <button
                        onClick={() => handleCopyPath(result.path)}
                        className="ml-2 px-2 py-1 text-xs rounded transition-colors hover:bg-[var(--bg-tertiary)]"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {copiedPath === result.path ? 'Copied!' : 'Copy path'}
                      </button>
                    </div>

                    {/* Value preview */}
                    <div className="flex items-start gap-2">
                      <span
                        className="text-xs px-1.5 py-0.5 rounded shrink-0"
                        style={{
                          background: 'var(--bg-tertiary)',
                          color: getTypeColor(result.valueType),
                        }}
                      >
                        {result.valueType}
                      </span>
                      <code
                        className="text-sm break-all"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {result.valuePreview}
                      </code>
                    </div>

                    {/* Match type indicator */}
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <span style={{ color: 'var(--text-muted)' }}>
                        Matched in: 
                      </span>
                      {result.matchType === 'key' && (
                        <span className="px-1.5 py-0.5 rounded" style={{ background: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent-blue)' }}>
                          key
                        </span>
                      )}
                      {result.matchType === 'value' && (
                        <span className="px-1.5 py-0.5 rounded" style={{ background: 'rgba(34, 197, 94, 0.2)', color: 'var(--accent-green)' }}>
                          value
                        </span>
                      )}
                      {result.matchType === 'both' && (
                        <>
                          <span className="px-1.5 py-0.5 rounded" style={{ background: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent-blue)' }}>
                            key
                          </span>
                          <span className="px-1.5 py-0.5 rounded" style={{ background: 'rgba(34, 197, 94, 0.2)', color: 'var(--accent-green)' }}>
                            value
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick reference */}
      <div
        className="p-4 rounded-lg"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
        }}
      >
        <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
          About JSON Path Syntax
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {[
            { path: '$', desc: 'Root object' },
            { path: '$.store', desc: 'Property access' },
            { path: '$.store.books[0]', desc: 'Array index' },
            { path: '$.store.books[*]', desc: 'All array items' },
          ].map((item) => (
            <div
              key={item.path}
              className="p-2 rounded"
              style={{ background: 'var(--bg-primary)' }}
            >
              <code style={{ color: 'var(--accent-blue)' }}>{item.path}</code>
              <div className="mt-1" style={{ color: 'var(--text-muted)' }}>{item.desc}</div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          For advanced JSONPath queries, use our <a href="/json-path" className="text-[var(--accent-blue)] hover:underline">JSON Path tool</a>.
        </p>
      </div>
    </div>
  );
}

function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    object: 'var(--accent-blue)',
    array: 'var(--accent-amber)',
    string: 'var(--accent-green)',
    number: '#a855f7',
    boolean: 'var(--accent-red)',
    null: 'var(--text-muted)',
  };
  return colors[type] || 'var(--text-muted)';
}

function SearchIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={style}>
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}
