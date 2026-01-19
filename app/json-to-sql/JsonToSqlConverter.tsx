'use client';

import { useState, useCallback } from 'react';
import { JsonEditor } from '@/components/JsonEditor';

type SQLDialect = 'mysql' | 'postgresql' | 'sqlite' | 'mssql';
type OutputType = 'insert' | 'create' | 'both';

interface SQLOptions {
  tableName: string;
  dialect: SQLDialect;
  outputType: OutputType;
  includeNulls: boolean;
  batchSize: number;
}

function escapeString(value: string, dialect: SQLDialect): string {
  // Escape single quotes by doubling them
  const escaped = value.replace(/'/g, "''");
  return `'${escaped}'`;
}

function inferSQLType(value: any, dialect: SQLDialect): string {
  if (value === null) return dialect === 'postgresql' ? 'TEXT' : 'VARCHAR(255)';
  
  if (typeof value === 'boolean') {
    return dialect === 'postgresql' ? 'BOOLEAN' : 'TINYINT(1)';
  }
  
  if (typeof value === 'number') {
    if (Number.isInteger(value)) {
      if (value > 2147483647 || value < -2147483648) return 'BIGINT';
      return 'INT';
    }
    return dialect === 'mssql' ? 'FLOAT' : 'DOUBLE';
  }
  
  if (typeof value === 'string') {
    // Check for date patterns
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'DATE';
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
      return dialect === 'postgresql' ? 'TIMESTAMP' : 'DATETIME';
    }
    
    // Estimate string length
    if (value.length > 255) {
      return dialect === 'mssql' ? 'NVARCHAR(MAX)' : 'TEXT';
    }
    return dialect === 'mssql' ? `NVARCHAR(${Math.max(50, value.length * 2)})` : `VARCHAR(${Math.max(50, value.length * 2)})`;
  }
  
  if (typeof value === 'object') {
    // JSON column for objects/arrays
    if (dialect === 'postgresql') return 'JSONB';
    if (dialect === 'mysql') return 'JSON';
    return 'TEXT';
  }
  
  return 'TEXT';
}

function formatValue(value: any, dialect: SQLDialect): string {
  if (value === null) return 'NULL';
  if (typeof value === 'boolean') {
    if (dialect === 'postgresql') return value ? 'TRUE' : 'FALSE';
    return value ? '1' : '0';
  }
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') return escapeString(value, dialect);
  if (typeof value === 'object') {
    return escapeString(JSON.stringify(value), dialect);
  }
  return 'NULL';
}

function generateCreateTable(data: any[], options: SQLOptions): string {
  if (data.length === 0) return '';
  
  const sample = data[0];
  const columns = Object.entries(sample).map(([key, value]) => {
    const type = inferSQLType(value, options.dialect);
    const nullable = value === null ? '' : ' NOT NULL';
    
    // Quote column names
    const quotedKey = options.dialect === 'mysql' ? `\`${key}\`` : 
                      options.dialect === 'mssql' ? `[${key}]` : `"${key}"`;
    
    return `  ${quotedKey} ${type}${nullable}`;
  });
  
  const tableName = options.dialect === 'mysql' ? `\`${options.tableName}\`` :
                    options.dialect === 'mssql' ? `[${options.tableName}]` : `"${options.tableName}"`;
  
  return `CREATE TABLE ${tableName} (\n${columns.join(',\n')}\n);`;
}

function generateInsertStatements(data: any[], options: SQLOptions): string {
  if (data.length === 0) return '';
  
  const columns = Object.keys(data[0]);
  const quotedColumns = columns.map(col => {
    if (options.dialect === 'mysql') return `\`${col}\``;
    if (options.dialect === 'mssql') return `[${col}]`;
    return `"${col}"`;
  });
  
  const tableName = options.dialect === 'mysql' ? `\`${options.tableName}\`` :
                    options.dialect === 'mssql' ? `[${options.tableName}]` : `"${options.tableName}"`;
  
  const statements: string[] = [];
  
  // Batch inserts
  for (let i = 0; i < data.length; i += options.batchSize) {
    const batch = data.slice(i, i + options.batchSize);
    const values = batch.map(row => {
      const rowValues = columns.map(col => {
        const value = row[col];
        if (!options.includeNulls && value === null) return 'DEFAULT';
        return formatValue(value, options.dialect);
      });
      return `(${rowValues.join(', ')})`;
    });
    
    statements.push(`INSERT INTO ${tableName} (${quotedColumns.join(', ')})\nVALUES\n  ${values.join(',\n  ')};`);
  }
  
  return statements.join('\n\n');
}

function jsonToSQL(data: any[], options: SQLOptions): string {
  const parts: string[] = [];
  
  if (options.outputType === 'create' || options.outputType === 'both') {
    parts.push(generateCreateTable(data, options));
  }
  
  if (options.outputType === 'insert' || options.outputType === 'both') {
    parts.push(generateInsertStatements(data, options));
  }
  
  return parts.join('\n\n');
}

export function JsonToSqlConverter() {
  const [input, setInput] = useState(`[
  {
    "id": 1,
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "age": 28,
    "is_active": true,
    "created_at": "2024-01-15T10:30:00Z"
  },
  {
    "id": 2,
    "name": "Bob Smith",
    "email": "bob@example.com",
    "age": 34,
    "is_active": false,
    "created_at": "2024-02-20T14:45:00Z"
  }
]`);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const [options, setOptions] = useState<SQLOptions>({
    tableName: 'users',
    dialect: 'postgresql',
    outputType: 'both',
    includeNulls: true,
    batchSize: 100,
  });

  const convert = useCallback(() => {
    try {
      let parsed = JSON.parse(input);
      
      // Wrap single object in array
      if (!Array.isArray(parsed)) {
        parsed = [parsed];
      }
      
      if (parsed.length === 0) {
        throw new Error('JSON array is empty');
      }
      
      const sql = jsonToSQL(parsed, options);
      setOutput(sql);
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

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${options.tableName}.sql`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="editor-panel-header">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              JSON Input (array of objects)
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
              SQL Output
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
            value={output || '-- SQL will appear here'}
            onChange={() => {}}
            height="350px"
            language="sql"
            readOnly
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 p-3 rounded" style={{ background: 'var(--bg-secondary)' }}>
        <div className="flex items-center gap-2">
          <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Table:
          </label>
          <input
            type="text"
            value={options.tableName}
            onChange={(e) => setOptions({ ...options, tableName: e.target.value || 'data' })}
            className="px-2 py-1 rounded text-sm w-28"
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Dialect:
          </label>
          <select
            value={options.dialect}
            onChange={(e) => setOptions({ ...options, dialect: e.target.value as SQLDialect })}
            className="px-2 py-1 rounded text-sm"
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-primary)',
            }}
          >
            <option value="postgresql">PostgreSQL</option>
            <option value="mysql">MySQL</option>
            <option value="sqlite">SQLite</option>
            <option value="mssql">SQL Server</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Output:
          </label>
          <select
            value={options.outputType}
            onChange={(e) => setOptions({ ...options, outputType: e.target.value as OutputType })}
            className="px-2 py-1 rounded text-sm"
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-primary)',
            }}
          >
            <option value="both">CREATE + INSERT</option>
            <option value="create">CREATE TABLE only</option>
            <option value="insert">INSERT only</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={options.includeNulls}
            onChange={(e) => setOptions({ ...options, includeNulls: e.target.checked })}
            className="rounded"
          />
          Include NULLs
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
        Generate SQL
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
