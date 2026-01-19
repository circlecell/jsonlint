'use client';

import { useState, useCallback } from 'react';
import { JsonEditor } from '@/components/JsonEditor';

// Flatten nested objects to dot notation
function flattenObject(obj: any, prefix = ''): Record<string, any> {
  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, newKey));
    } else if (Array.isArray(value)) {
      // Convert arrays to comma-separated strings
      result[newKey] = value.map(v => 
        typeof v === 'object' ? JSON.stringify(v) : String(v)
      ).join(', ');
    } else {
      result[newKey] = value;
    }
  }
  
  return result;
}

function flattenArray(arr: any[]): any[] {
  return arr.map(item => flattenObject(item));
}

// Calculate column widths based on content
function calculateColumnWidths(data: any[], headers: string[]): number[] {
  return headers.map(header => {
    const maxContentLength = Math.max(
      header.length,
      ...data.map(row => String(row[header] ?? '').length)
    );
    return Math.min(Math.max(maxContentLength + 2, 10), 50);
  });
}

// Generate Excel file using pure JavaScript (no external dependencies)
function generateExcelXML(data: any[], sheetName: string): string {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Data must be a non-empty array');
  }

  const headers = Object.keys(data[0]);
  
  // Excel XML template
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Styles>
    <Style ss:ID="Header">
      <Font ss:Bold="1"/>
      <Interior ss:Color="#E0E0E0" ss:Pattern="Solid"/>
    </Style>
  </Styles>
  <Worksheet ss:Name="${escapeXml(sheetName)}">
    <Table>`;

  // Add header row
  xml += '\n      <Row>';
  for (const header of headers) {
    xml += `\n        <Cell ss:StyleID="Header"><Data ss:Type="String">${escapeXml(header)}</Data></Cell>`;
  }
  xml += '\n      </Row>';

  // Add data rows
  for (const row of data) {
    xml += '\n      <Row>';
    for (const header of headers) {
      const value = row[header];
      const { type, displayValue } = getCellType(value);
      xml += `\n        <Cell><Data ss:Type="${type}">${escapeXml(displayValue)}</Data></Cell>`;
    }
    xml += '\n      </Row>';
  }

  xml += `
    </Table>
  </Worksheet>
</Workbook>`;

  return xml;
}

function escapeXml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getCellType(value: any): { type: string; displayValue: string } {
  if (value === null || value === undefined) {
    return { type: 'String', displayValue: '' };
  }
  if (typeof value === 'number') {
    return { type: 'Number', displayValue: String(value) };
  }
  if (typeof value === 'boolean') {
    return { type: 'Boolean', displayValue: value ? '1' : '0' };
  }
  return { type: 'String', displayValue: String(value) };
}

export function JsonToExcelConverter() {
  const [input, setInput] = useState(`[
  {
    "name": "Alice Johnson",
    "age": 30,
    "department": "Engineering",
    "salary": 95000,
    "active": true
  },
  {
    "name": "Bob Smith",
    "age": 25,
    "department": "Marketing",
    "salary": 65000,
    "active": true
  },
  {
    "name": "Carol Williams",
    "age": 35,
    "department": "Engineering",
    "salary": 110000,
    "active": false
  }
]`);
  const [error, setError] = useState<string | null>(null);
  const [sheetName, setSheetName] = useState('Sheet1');
  const [flattenNested, setFlattenNested] = useState(true);
  const [preview, setPreview] = useState<{ headers: string[]; rows: any[] } | null>(null);

  const generatePreview = useCallback(() => {
    try {
      let parsed = JSON.parse(input);
      
      // Wrap single object in array
      if (!Array.isArray(parsed)) {
        parsed = [parsed];
      }
      
      if (parsed.length === 0) {
        throw new Error('JSON array is empty');
      }

      // Flatten if needed
      const data = flattenNested ? flattenArray(parsed) : parsed;
      const headers = Object.keys(data[0]);
      
      setPreview({ headers, rows: data.slice(0, 5) }); // Show first 5 rows
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
      setPreview(null);
    }
  }, [input, flattenNested]);

  const handleDownload = useCallback(() => {
    try {
      let parsed = JSON.parse(input);
      
      if (!Array.isArray(parsed)) {
        parsed = [parsed];
      }
      
      if (parsed.length === 0) {
        throw new Error('JSON array is empty');
      }

      const data = flattenNested ? flattenArray(parsed) : parsed;
      const xml = generateExcelXML(data, sheetName);
      
      const blob = new Blob([xml], { 
        type: 'application/vnd.ms-excel' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${sheetName.replace(/[^a-zA-Z0-9]/g, '_')}.xls`;
      a.click();
      URL.revokeObjectURL(url);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion failed');
    }
  }, [input, sheetName, flattenNested]);

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
              Preview (first 5 rows)
            </label>
          </div>
          <div 
            className="h-[350px] overflow-auto rounded border"
            style={{ 
              background: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)'
            }}
          >
            {preview ? (
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'var(--bg-tertiary)' }}>
                    {preview.headers.map((h, i) => (
                      <th 
                        key={i} 
                        className="px-3 py-2 text-left font-medium border-b"
                        style={{ 
                          color: 'var(--text-primary)',
                          borderColor: 'var(--border-primary)'
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.rows.map((row, i) => (
                    <tr key={i}>
                      {preview.headers.map((h, j) => (
                        <td 
                          key={j}
                          className="px-3 py-2 border-b"
                          style={{ 
                            color: 'var(--text-secondary)',
                            borderColor: 'var(--border-primary)'
                          }}
                        >
                          {String(row[h] ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div 
                className="h-full flex items-center justify-center text-sm"
                style={{ color: 'var(--text-muted)' }}
              >
                Click "Preview" to see table structure
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 p-3 rounded" style={{ background: 'var(--bg-secondary)' }}>
        <div className="flex items-center gap-2">
          <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Sheet name:
          </label>
          <input
            type="text"
            value={sheetName}
            onChange={(e) => setSheetName(e.target.value || 'Sheet1')}
            className="px-2 py-1 rounded text-sm w-28"
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={flattenNested}
            onChange={(e) => setFlattenNested(e.target.checked)}
            className="rounded"
          />
          Flatten nested objects
        </label>

        <button
          onClick={generatePreview}
          className="px-4 py-2 rounded font-medium transition-colors"
          style={{
            background: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-primary)',
          }}
        >
          Preview
        </button>

        <button
          onClick={handleDownload}
          className="px-4 py-2 rounded font-medium transition-colors"
          style={{
            background: 'var(--accent-blue)',
            color: 'white',
          }}
        >
          Download Excel
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
        💡 <strong>Tip:</strong> Your JSON should be an array of objects where each object becomes a row. 
        Nested objects will be flattened to dot notation (e.g., <code>address.city</code>).
      </div>
    </div>
  );
}
