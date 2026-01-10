'use client';

import { useState, useCallback, useMemo } from 'react';
import { JsonEditor } from '@/components/JsonEditor';

interface NodeInfo {
  path: string;
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';
  size: number; // Characters when stringified
  children: number;
  depth: number;
}

interface AnalysisResult {
  valid: boolean;
  error?: string;
  stats: {
    totalSize: number;
    minifiedSize: number;
    prettySize: number;
    compressionRatio: number;
    totalKeys: number;
    uniqueKeys: number;
    totalValues: number;
    maxDepth: number;
    objectCount: number;
    arrayCount: number;
    stringCount: number;
    numberCount: number;
    booleanCount: number;
    nullCount: number;
    longestString: number;
    averageStringLength: number;
    largestArray: number;
    averageArrayLength: number;
  };
  typeDistribution: { type: string; count: number; percentage: number }[];
  largestNodes: NodeInfo[];
  deepestPaths: { path: string; depth: number }[];
  keyFrequency: { key: string; count: number }[];
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzeJson(input: string): AnalysisResult {
  if (!input.trim()) {
    return {
      valid: false,
      error: 'Please enter JSON to analyze',
      stats: getEmptyStats(),
      typeDistribution: [],
      largestNodes: [],
      deepestPaths: [],
      keyFrequency: [],
    };
  }

  let parsed;
  try {
    parsed = JSON.parse(input);
  } catch (e) {
    return {
      valid: false,
      error: `Invalid JSON: ${(e as Error).message}`,
      stats: getEmptyStats(),
      typeDistribution: [],
      largestNodes: [],
      deepestPaths: [],
      keyFrequency: [],
    };
  }

  const minified = JSON.stringify(parsed);
  const pretty = JSON.stringify(parsed, null, 2);

  let totalKeys = 0;
  const keySet = new Set<string>();
  const keyCounts = new Map<string, number>();
  let totalValues = 0;
  let maxDepth = 0;
  let objectCount = 0;
  let arrayCount = 0;
  let stringCount = 0;
  let numberCount = 0;
  let booleanCount = 0;
  let nullCount = 0;
  let longestString = 0;
  let totalStringLength = 0;
  let stringValuesCount = 0;
  let largestArray = 0;
  let totalArrayLength = 0;
  let arrayValuesCount = 0;

  const allNodes: NodeInfo[] = [];
  const allPaths: { path: string; depth: number }[] = [];

  function traverse(value: unknown, path: string, depth: number) {
    maxDepth = Math.max(maxDepth, depth);
    allPaths.push({ path: path || '$', depth });

    if (value === null) {
      nullCount++;
      totalValues++;
      return;
    }

    if (Array.isArray(value)) {
      arrayCount++;
      totalValues++;
      largestArray = Math.max(largestArray, value.length);
      totalArrayLength += value.length;
      arrayValuesCount++;

      const nodeSize = JSON.stringify(value).length;
      allNodes.push({
        path: path || '$',
        type: 'array',
        size: nodeSize,
        children: value.length,
        depth,
      });

      value.forEach((item, index) => {
        traverse(item, `${path}[${index}]`, depth + 1);
      });
      return;
    }

    if (typeof value === 'object') {
      objectCount++;
      totalValues++;
      const keys = Object.keys(value);
      totalKeys += keys.length;

      const nodeSize = JSON.stringify(value).length;
      allNodes.push({
        path: path || '$',
        type: 'object',
        size: nodeSize,
        children: keys.length,
        depth,
      });

      keys.forEach((key) => {
        keySet.add(key);
        keyCounts.set(key, (keyCounts.get(key) || 0) + 1);
        traverse((value as Record<string, unknown>)[key], `${path}.${key}`, depth + 1);
      });
      return;
    }

    if (typeof value === 'string') {
      stringCount++;
      totalValues++;
      longestString = Math.max(longestString, value.length);
      totalStringLength += value.length;
      stringValuesCount++;
      return;
    }

    if (typeof value === 'number') {
      numberCount++;
      totalValues++;
      return;
    }

    if (typeof value === 'boolean') {
      booleanCount++;
      totalValues++;
      return;
    }
  }

  traverse(parsed, '$', 0);

  // Calculate type distribution
  const totalTypedValues = objectCount + arrayCount + stringCount + numberCount + booleanCount + nullCount;
  const typeDistribution = [
    { type: 'Objects', count: objectCount, percentage: Math.round((objectCount / totalTypedValues) * 100) },
    { type: 'Arrays', count: arrayCount, percentage: Math.round((arrayCount / totalTypedValues) * 100) },
    { type: 'Strings', count: stringCount, percentage: Math.round((stringCount / totalTypedValues) * 100) },
    { type: 'Numbers', count: numberCount, percentage: Math.round((numberCount / totalTypedValues) * 100) },
    { type: 'Booleans', count: booleanCount, percentage: Math.round((booleanCount / totalTypedValues) * 100) },
    { type: 'Nulls', count: nullCount, percentage: Math.round((nullCount / totalTypedValues) * 100) },
  ].filter(t => t.count > 0);

  // Get largest nodes
  const largestNodes = allNodes
    .sort((a, b) => b.size - a.size)
    .slice(0, 5);

  // Get deepest paths
  const deepestPaths = allPaths
    .sort((a, b) => b.depth - a.depth)
    .slice(0, 5);

  // Get most frequent keys
  const keyFrequency = Array.from(keyCounts.entries())
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    valid: true,
    stats: {
      totalSize: input.length,
      minifiedSize: minified.length,
      prettySize: pretty.length,
      compressionRatio: Math.round((1 - minified.length / pretty.length) * 100),
      totalKeys,
      uniqueKeys: keySet.size,
      totalValues,
      maxDepth,
      objectCount,
      arrayCount,
      stringCount,
      numberCount,
      booleanCount,
      nullCount,
      longestString,
      averageStringLength: stringValuesCount > 0 ? Math.round(totalStringLength / stringValuesCount) : 0,
      largestArray,
      averageArrayLength: arrayValuesCount > 0 ? Math.round(totalArrayLength / arrayValuesCount) : 0,
    },
    typeDistribution,
    largestNodes,
    deepestPaths,
    keyFrequency,
  };
}

function getEmptyStats() {
  return {
    totalSize: 0,
    minifiedSize: 0,
    prettySize: 0,
    compressionRatio: 0,
    totalKeys: 0,
    uniqueKeys: 0,
    totalValues: 0,
    maxDepth: 0,
    objectCount: 0,
    arrayCount: 0,
    stringCount: 0,
    numberCount: 0,
    booleanCount: 0,
    nullCount: 0,
    longestString: 0,
    averageStringLength: 0,
    largestArray: 0,
    averageArrayLength: 0,
  };
}

const EXAMPLE_JSON = `{
  "company": "TechCorp",
  "founded": 2010,
  "active": true,
  "headquarters": {
    "city": "San Francisco",
    "state": "CA",
    "country": "USA",
    "coordinates": {
      "lat": 37.7749,
      "lng": -122.4194
    }
  },
  "employees": [
    {
      "id": 1,
      "name": "Alice Johnson",
      "role": "CEO",
      "department": "Executive",
      "skills": ["leadership", "strategy", "finance"]
    },
    {
      "id": 2,
      "name": "Bob Smith",
      "role": "CTO",
      "department": "Engineering",
      "skills": ["architecture", "python", "cloud"]
    },
    {
      "id": 3,
      "name": "Carol Williams",
      "role": "Designer",
      "department": "Product",
      "skills": ["ui", "ux", "figma", "prototyping"]
    }
  ],
  "products": [
    {"name": "Widget Pro", "price": 99.99, "inStock": true},
    {"name": "Widget Lite", "price": 49.99, "inStock": true},
    {"name": "Widget Enterprise", "price": 299.99, "inStock": false}
  ]
}`;

export function SizeAnalyzer() {
  const [input, setInput] = useState(EXAMPLE_JSON);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const handleAnalyze = useCallback(() => {
    const result = analyzeJson(input);
    setAnalysis(result);
  }, [input]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-4">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              JSON Input
            </label>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {formatBytes(input.length)}
            </span>
          </div>
          <JsonEditor
            value={input}
            onChange={setInput}
            height="400px"
            language="json"
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
            Analyze Structure
          </button>

          {analysis?.error && (
            <div
              className="p-4 rounded-lg"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid var(--accent-red)',
              }}
            >
              <p className="text-sm" style={{ color: 'var(--accent-red)' }}>
                {analysis.error}
              </p>
            </div>
          )}

          {analysis?.valid && (
            <>
              {/* Size stats */}
              <div
                className="p-4 rounded-lg"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                  Size Analysis
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <StatItem label="Current size" value={formatBytes(analysis.stats.totalSize)} />
                  <StatItem label="Minified" value={formatBytes(analysis.stats.minifiedSize)} />
                  <StatItem label="Pretty printed" value={formatBytes(analysis.stats.prettySize)} />
                  <StatItem 
                    label="Compression potential" 
                    value={`${analysis.stats.compressionRatio}%`}
                    highlight={analysis.stats.compressionRatio > 20}
                  />
                </div>
              </div>

              {/* Structure stats */}
              <div
                className="p-4 rounded-lg"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                  Structure Analysis
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <StatItem label="Max depth" value={analysis.stats.maxDepth.toString()} />
                  <StatItem label="Total values" value={analysis.stats.totalValues.toString()} />
                  <StatItem label="Total keys" value={analysis.stats.totalKeys.toString()} />
                  <StatItem label="Unique keys" value={analysis.stats.uniqueKeys.toString()} />
                </div>
              </div>

              {/* Type distribution */}
              <div
                className="p-4 rounded-lg"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                  Type Distribution
                </h3>
                <div className="space-y-2">
                  {analysis.typeDistribution.map((item) => (
                    <div key={item.type} className="flex items-center gap-2 text-sm">
                      <div className="w-20" style={{ color: 'var(--text-secondary)' }}>
                        {item.type}
                      </div>
                      <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${item.percentage}%`,
                            background: getTypeColor(item.type),
                          }}
                        />
                      </div>
                      <div className="w-16 text-right font-mono" style={{ color: 'var(--text-muted)' }}>
                        {item.count} ({item.percentage}%)
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Largest nodes */}
              {analysis.largestNodes.length > 0 && (
                <div
                  className="p-4 rounded-lg"
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-primary)',
                  }}
                >
                  <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                    Largest Nodes
                  </h3>
                  <div className="space-y-2">
                    {analysis.largestNodes.map((node, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <code className="truncate flex-1" style={{ color: 'var(--text-secondary)' }}>
                          {node.path}
                        </code>
                        <span className="ml-2 font-mono" style={{ color: 'var(--text-muted)' }}>
                          {formatBytes(node.size)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
              <ChartIcon className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Click "Analyze Structure" to see detailed statistics about your JSON.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Additional details (full width) */}
      {analysis?.valid && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* String stats */}
          <div
            className="p-4 rounded-lg"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
            }}
          >
            <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
              String Analysis
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>String values</span>
                <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{analysis.stats.stringCount}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Longest string</span>
                <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{analysis.stats.longestString} chars</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Avg. length</span>
                <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{analysis.stats.averageStringLength} chars</span>
              </div>
            </div>
          </div>

          {/* Array stats */}
          <div
            className="p-4 rounded-lg"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
            }}
          >
            <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
              Array Analysis
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Total arrays</span>
                <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{analysis.stats.arrayCount}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Largest array</span>
                <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{analysis.stats.largestArray} items</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Avg. length</span>
                <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{analysis.stats.averageArrayLength} items</span>
              </div>
            </div>
          </div>

          {/* Key frequency */}
          {analysis.keyFrequency.length > 0 && (
            <div
              className="p-4 rounded-lg"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-primary)',
              }}
            >
              <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                Common Keys
              </h3>
              <div className="space-y-1 text-sm">
                {analysis.keyFrequency.slice(0, 6).map((item) => (
                  <div key={item.key} className="flex justify-between">
                    <code className="truncate" style={{ color: 'var(--text-secondary)' }}>{item.key}</code>
                    <span className="font-mono ml-2" style={{ color: 'var(--text-muted)' }}>×{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatItem({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <div
        className="font-mono text-lg"
        style={{ color: highlight ? 'var(--accent-green)' : 'var(--text-primary)' }}
      >
        {value}
      </div>
      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
        {label}
      </div>
    </div>
  );
}

function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    Objects: 'var(--accent-blue)',
    Arrays: 'var(--accent-amber)',
    Strings: 'var(--accent-green)',
    Numbers: 'var(--accent-purple, #a855f7)',
    Booleans: 'var(--accent-red)',
    Nulls: 'var(--text-muted)',
  };
  return colors[type] || 'var(--text-muted)';
}

function ChartIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={style}>
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  );
}
