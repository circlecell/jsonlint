'use client';

import { useState, useCallback } from 'react';
import { JsonEditor } from '@/components/JsonEditor';

interface SQLParseResult {
  tableName: string;
  columns: string[];
  rows: Record<string, any>[];
}

function parseCreateTable(sql: string): { tableName: string; columns: string[] } | null {
  const match = sql.match(/CREATE\s+TABLE\s+[`"'\[]?(\w+)[`"'\]]?\s*\(([\s\S]+?)\)/i);
  if (!match) return null;
  
  const tableName = match[1];
  const columnDefs = match[2];
  
  // Extract column names (simplified - handles most common cases)
  const columns: string[] = [];
  const colMatches = Array.from(columnDefs.matchAll(/[`"'\[]?(\w+)[`"'\]]?\s+(INT|INTEGER|VARCHAR|TEXT|BOOLEAN|BOOL|FLOAT|DOUBLE|DECIMAL|DATE|DATETIME|TIMESTAMP|BIGINT|SMALLINT|TINYINT|CHAR|NVARCHAR|JSONB?|SERIAL|UUID)/gi));
  
  for (const colMatch of colMatches) {
    columns.push(colMatch[1]);
  }
  
  return { tableName, columns };
}

function parseInsertStatements(sql: string, knownColumns?: string[]): SQLParseResult[] {
  const results: SQLParseResult[] = [];
  
  // Match INSERT statements
  const insertRegex = /INSERT\s+INTO\s+[`"'\[]?(\w+)[`"'\]]?\s*(?:\(([^)]+)\))?\s*VALUES\s*([\s\S]+?)(?=;|INSERT|$)/gi;
  
  let match;
  while ((match = insertRegex.exec(sql)) !== null) {
    const tableName = match[1];
    const columnsPart = match[2];
    const valuesPart = match[3];
    
    // Parse column names
    let columns: string[] = [];
    if (columnsPart) {
      columns = columnsPart.split(',').map(c => c.trim().replace(/[`"'\[\]]/g, ''));
    } else if (knownColumns) {
      columns = knownColumns;
    }
    
    // Parse values - handle multiple value sets
    const rows: Record<string, any>[] = [];
    const valueSetRegex = /\(([^)]+)\)/g;
    
    let valueMatch;
    while ((valueMatch = valueSetRegex.exec(valuesPart)) !== null) {
      const values = parseValueList(valueMatch[1]);
      const row: Record<string, any> = {};
      
      values.forEach((value, index) => {
        const colName = columns[index] || `column${index + 1}`;
        row[colName] = value;
      });
      
      rows.push(row);
    }
    
    if (rows.length > 0) {
      results.push({ tableName, columns, rows });
    }
  }
  
  return results;
}

function parseValueList(valueStr: string): any[] {
  const values: any[] = [];
  let current = '';
  let inString = false;
  let stringChar = '';
  let depth = 0;
  
  for (let i = 0; i < valueStr.length; i++) {
    const char = valueStr[i];
    
    if (!inString && (char === "'" || char === '"')) {
      inString = true;
      stringChar = char;
      continue;
    }
    
    if (inString && char === stringChar) {
      // Check for escaped quote
      if (valueStr[i + 1] === stringChar) {
        current += char;
        i++;
        continue;
      }
      inString = false;
      continue;
    }
    
    if (!inString) {
      if (char === '(') depth++;
      if (char === ')') depth--;
      
      if (char === ',' && depth === 0) {
        values.push(parseValue(current.trim()));
        current = '';
        continue;
      }
    }
    
    current += char;
  }
  
  if (current.trim()) {
    values.push(parseValue(current.trim()));
  }
  
  return values;
}

function parseValue(str: string): any {
  const upper = str.toUpperCase();
  
  if (upper === 'NULL') return null;
  if (upper === 'TRUE' || str === '1') return true;
  if (upper === 'FALSE' || str === '0') return false;
  
  // Remove surrounding quotes
  if ((str.startsWith("'") && str.endsWith("'")) || 
      (str.startsWith('"') && str.endsWith('"'))) {
    return str.slice(1, -1).replace(/''/g, "'").replace(/""/g, '"');
  }
  
  // Try number
  const num = Number(str);
  if (!isNaN(num) && str !== '') return num;
  
  return str;
}

function sqlToJson(sql: string): { data: any; tableName: string } {
  // First try to find CREATE TABLE for column names
  const createTable = parseCreateTable(sql);
  
  // Parse INSERT statements
  const inserts = parseInsertStatements(sql, createTable?.columns);
  
  if (inserts.length === 0) {
    throw new Error('No valid INSERT statements found');
  }
  
  // Combine all rows from all inserts
  const allRows = inserts.flatMap(i => i.rows);
  const tableName = inserts[0].tableName;
  
  return { data: allRows, tableName };
}

export function SqlToJsonConverter() {
  const [input, setInput] = useState(`-- Example SQL with CREATE TABLE and INSERT statements
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(255),
  age INT,
  is_active BOOLEAN
);

INSERT INTO users (id, name, email, age, is_active) VALUES
  (1, 'Alice Johnson', 'alice@example.com', 28, TRUE),
  (2, 'Bob Smith', 'bob@example.com', 34, TRUE),
  (3, 'Carol Williams', 'carol@example.com', 45, FALSE);

INSERT INTO users (id, name, email, age, is_active) VALUES
  (4, 'David Brown', 'david@example.com', 29, TRUE);`);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [indent, setIndent] = useState(2);
  const [rowCount, setRowCount] = useState(0);

  const convert = useCallback(() => {
    try {
      const { data, tableName } = sqlToJson(input);
      setRowCount(data.length);
      setOutput(JSON.stringify(data, null, indent));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to parse SQL');
      setOutput('');
      setRowCount(0);
    }
  }, [input, indent]);

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
    a.download = 'data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              SQL Input (INSERT statements)
            </label>
          </div>
          <JsonEditor
            value={input}
            onChange={setInput}
            height="350px"
            language="sql"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              JSON Output {rowCount > 0 && `(${rowCount} rows)`}
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
            value={output || '// JSON will appear here'}
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
            Indent:
          </label>
          <select
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className="px-2 py-1 rounded text-sm"
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-primary)',
            }}
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={0}>Minified</option>
          </select>
        </div>

        <button
          onClick={convert}
          className="px-4 py-2 rounded font-medium transition-colors"
          style={{
            background: 'var(--accent-blue)',
            color: 'white',
          }}
        >
          Convert to JSON
        </button>
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

      <div
        className="p-3 rounded text-sm"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          color: 'var(--text-muted)',
        }}
      >
        💡 <strong>Tip:</strong> Paste SQL INSERT statements. Column names are extracted 
        from the INSERT clause or CREATE TABLE if present.
      </div>
    </div>
  );
}
