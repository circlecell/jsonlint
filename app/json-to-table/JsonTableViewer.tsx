'use client';

import { useState, useCallback } from 'react';
import { JsonEditor } from '@/components/JsonEditor';

interface TableData {
  headers: string[];
  rows: any[][];
}

function jsonToTable(data: any): TableData | null {
  // Find array to display
  let arrayData: any[] = [];
  
  if (Array.isArray(data)) {
    arrayData = data;
  } else if (typeof data === 'object' && data !== null) {
    // Look for first array property
    for (const key of Object.keys(data)) {
      if (Array.isArray(data[key])) {
        arrayData = data[key];
        break;
      }
    }
  }
  
  if (arrayData.length === 0) {
    return null;
  }
  
  // Get all unique keys from all objects
  const allKeys = new Set<string>();
  arrayData.forEach(item => {
    if (typeof item === 'object' && item !== null) {
      Object.keys(item).forEach(key => allKeys.add(key));
    }
  });
  
  const headers = Array.from(allKeys);
  
  // Build rows
  const rows = arrayData.map(item => {
    if (typeof item === 'object' && item !== null) {
      return headers.map(header => {
        const value = item[header];
        if (value === null) return 'null';
        if (value === undefined) return '';
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
      });
    }
    return [String(item)];
  });
  
  return { headers, rows };
}

export function JsonTableViewer() {
  const [input, setInput] = useState(`{
  "employees": [
    { "id": 1, "name": "Alice Johnson", "department": "Engineering", "salary": 95000, "active": true },
    { "id": 2, "name": "Bob Smith", "department": "Marketing", "salary": 75000, "active": true },
    { "id": 3, "name": "Carol Williams", "department": "Engineering", "salary": 105000, "active": false },
    { "id": 4, "name": "David Brown", "department": "Sales", "salary": 85000, "active": true },
    { "id": 5, "name": "Eve Davis", "department": "HR", "salary": 70000, "active": true }
  ]
}`);
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const convert = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      const table = jsonToTable(parsed);
      
      if (!table) {
        setError('No array data found. JSON should contain an array of objects.');
        setTableData(null);
        return;
      }
      
      setTableData(table);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
      setTableData(null);
    }
  }, [input]);

  const handleCopyHtml = async () => {
    if (!tableData) return;
    
    const html = `<table>
  <thead>
    <tr>${tableData.headers.map(h => `<th>${h}</th>`).join('')}</tr>
  </thead>
  <tbody>
${tableData.rows.map(row => `    <tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('\n')}
  </tbody>
</table>`;
    
    await navigator.clipboard.writeText(html);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div>
          <div className="editor-panel-header">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              JSON Input
            </label>
          </div>
          <div 
            className="rounded-lg overflow-hidden"
            style={{ border: '1px solid var(--border-primary)' }}
          >
            <JsonEditor
              value={input}
              onChange={setInput}
              height="350px"
            />
          </div>
        </div>

        {/* Output */}
        <div>
          <div className="editor-panel-header">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Table Preview
            </label>
            {tableData && (
              <button
                onClick={handleCopyHtml}
                className="btn btn-secondary text-xs"
              >
                Copy HTML
              </button>
            )}
          </div>
          <div 
            className="rounded-lg overflow-auto h-[350px]"
            style={{ 
              border: '1px solid var(--border-primary)',
              background: 'var(--bg-secondary)'
            }}
          >
            {tableData ? (
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'var(--bg-tertiary)' }}>
                    {tableData.headers.map((header, i) => (
                      <th 
                        key={i}
                        className="px-3 py-2 text-left font-semibold whitespace-nowrap"
                        style={{ 
                          color: 'var(--text-primary)',
                          borderBottom: '2px solid var(--border-primary)'
                        }}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.rows.map((row, i) => (
                    <tr 
                      key={i}
                      className="hover:bg-[var(--bg-tertiary)] transition-colors"
                    >
                      {row.map((cell, j) => (
                        <td 
                          key={j}
                          className="px-3 py-2 whitespace-nowrap"
                          style={{ 
                            color: 'var(--text-secondary)',
                            borderBottom: '1px solid var(--border-primary)'
                          }}
                        >
                          {cell === 'true' || cell === 'false' ? (
                            <span style={{ color: cell === 'true' ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                              {cell}
                            </span>
                          ) : cell === 'null' ? (
                            <span style={{ color: 'var(--text-muted)' }}>null</span>
                          ) : cell.startsWith('{') || cell.startsWith('[') ? (
                            <code className="text-xs px-1 py-0.5 rounded" style={{ background: 'var(--bg-tertiary)', color: 'var(--accent-amber)' }}>
                              {cell.length > 30 ? cell.slice(0, 30) + '...' : cell}
                            </code>
                          ) : (
                            cell
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex items-center justify-center h-full" style={{ color: 'var(--text-muted)' }}>
                Click &quot;Convert to Table&quot; to preview
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <button onClick={convert} className="btn btn-primary">
          Convert to Table
        </button>
        <button 
          onClick={() => { setInput(''); setTableData(null); setError(null); }} 
          className="btn btn-secondary"
        >
          Clear
        </button>
        {tableData && (
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {tableData.rows.length} rows × {tableData.headers.length} columns
          </span>
        )}
      </div>

      {/* Status */}
      {error && (
        <div 
          className="px-3 py-2 rounded-md text-sm"
          style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-red)' }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
