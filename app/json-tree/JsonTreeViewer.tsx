'use client';

import { useState, useCallback } from 'react';
import { JsonEditor } from '@/components/JsonEditor';

interface TreeNodeProps {
  keyName: string | number;
  value: any;
  depth: number;
  defaultExpanded: boolean;
}

function TreeNode({ keyName, value, depth, defaultExpanded }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  
  const isObject = value !== null && typeof value === 'object';
  const isArray = Array.isArray(value);
  const isEmpty = isObject && Object.keys(value).length === 0;
  
  const getValueDisplay = () => {
    if (value === null) return <span style={{ color: 'var(--accent-purple)' }}>null</span>;
    if (typeof value === 'boolean') return <span style={{ color: 'var(--accent-purple)' }}>{value.toString()}</span>;
    if (typeof value === 'number') return <span style={{ color: 'var(--accent-blue)' }}>{value}</span>;
    if (typeof value === 'string') return <span style={{ color: 'var(--accent-green)' }}>"{value}"</span>;
    return null;
  };
  
  const getTypeLabel = () => {
    if (isArray) return `Array(${value.length})`;
    if (isObject) return `Object{${Object.keys(value).length}}`;
    return '';
  };

  return (
    <div style={{ marginLeft: depth > 0 ? '20px' : '0' }}>
      <div 
        className="flex items-center gap-1 py-0.5 cursor-pointer hover:bg-[var(--bg-tertiary)] rounded px-1 -mx-1"
        onClick={() => isObject && setExpanded(!expanded)}
      >
        {isObject && !isEmpty && (
          <span 
            className="w-4 text-center text-xs select-none"
            style={{ color: 'var(--text-muted)' }}
          >
            {expanded ? '▼' : '▶'}
          </span>
        )}
        {(!isObject || isEmpty) && <span className="w-4" />}
        
        <span style={{ color: 'var(--accent-red)' }}>
          {typeof keyName === 'string' ? `"${keyName}"` : keyName}
        </span>
        <span style={{ color: 'var(--text-muted)' }}>:</span>
        
        {isObject ? (
          <>
            <span style={{ color: 'var(--text-muted)' }}>
              {isArray ? '[' : '{'}
            </span>
            {!expanded && (
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {getTypeLabel()}
              </span>
            )}
            {(!expanded || isEmpty) && (
              <span style={{ color: 'var(--text-muted)' }}>
                {isArray ? ']' : '}'}
              </span>
            )}
          </>
        ) : (
          getValueDisplay()
        )}
      </div>
      
      {isObject && expanded && !isEmpty && (
        <div>
          {Object.entries(value).map(([k, v], i) => (
            <TreeNode 
              key={`${k}-${i}`}
              keyName={isArray ? i : k} 
              value={v} 
              depth={depth + 1}
              defaultExpanded={depth < 1}
            />
          ))}
          <div style={{ marginLeft: '20px', color: 'var(--text-muted)' }}>
            {isArray ? ']' : '}'}
          </div>
        </div>
      )}
    </div>
  );
}

export function JsonTreeViewer() {
  const [input, setInput] = useState(`{
  "name": "JSONLint",
  "version": "2.0.0",
  "features": ["validator", "formatter", "converter"],
  "config": {
    "theme": "dark",
    "autoFormat": true,
    "indentSize": 2
  },
  "stats": {
    "users": 50000,
    "conversions": 1250000,
    "uptime": 99.9
  },
  "maintainers": [
    {
      "name": "Alice",
      "role": "lead"
    },
    {
      "name": "Bob", 
      "role": "contributor"
    }
  ],
  "isActive": true,
  "deprecated": null
}`);
  const [parsed, setParsed] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandAll, setExpandAll] = useState(true);
  const [treeKey, setTreeKey] = useState(0);

  const parseJson = useCallback(() => {
    try {
      const result = JSON.parse(input);
      setParsed(result);
      setError(null);
      setTreeKey(k => k + 1); // Force re-render tree
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
      setParsed(null);
    }
  }, [input]);

  const handleExpandAll = () => {
    setExpandAll(true);
    setTreeKey(k => k + 1);
  };

  const handleCollapseAll = () => {
    setExpandAll(false);
    setTreeKey(k => k + 1);
  };

  // Stats
  const getStats = (obj: any): { objects: number; arrays: number; values: number } => {
    let objects = 0, arrays = 0, values = 0;
    
    const count = (val: any) => {
      if (val === null || typeof val !== 'object') {
        values++;
        return;
      }
      if (Array.isArray(val)) {
        arrays++;
        val.forEach(count);
      } else {
        objects++;
        Object.values(val).forEach(count);
      }
    };
    
    count(obj);
    return { objects, arrays, values };
  };

  const stats = parsed ? getStats(parsed) : null;

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
            height="400px"
            language="json"
          />
        </div>

        <div>
          <div className="editor-panel-header">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Tree View
            </label>
            {parsed && (
              <div className="flex gap-2">
                <button
                  onClick={handleExpandAll}
                  className="text-xs px-2 py-1 rounded transition-colors"
                  style={{
                    background: 'var(--bg-tertiary)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Expand All
                </button>
                <button
                  onClick={handleCollapseAll}
                  className="text-xs px-2 py-1 rounded transition-colors"
                  style={{
                    background: 'var(--bg-tertiary)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Collapse All
                </button>
              </div>
            )}
          </div>
          <div 
            className="h-[400px] overflow-auto rounded border p-3 font-mono text-sm"
            style={{ 
              background: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)'
            }}
          >
            {parsed ? (
              <TreeNode 
                key={treeKey}
                keyName="root" 
                value={parsed} 
                depth={0}
                defaultExpanded={expandAll}
              />
            ) : error ? (
              <div style={{ color: 'var(--accent-red)' }}>
                Error: {error}
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)' }}>
                Click "View Tree" to visualize JSON structure
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 p-3 rounded" style={{ background: 'var(--bg-secondary)' }}>
        <button
          onClick={parseJson}
          className="px-4 py-2 rounded font-medium transition-colors"
          style={{
            background: 'var(--accent-blue)',
            color: 'white',
          }}
        >
          View Tree
        </button>

        {stats && (
          <div className="flex gap-4 text-sm" style={{ color: 'var(--text-muted)' }}>
            <span>{stats.objects} objects</span>
            <span>{stats.arrays} arrays</span>
            <span>{stats.values} values</span>
          </div>
        )}
      </div>

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
