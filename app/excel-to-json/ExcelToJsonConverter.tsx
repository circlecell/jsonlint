'use client';

import { useState, useCallback, useRef } from 'react';
import { JsonEditor } from '@/components/JsonEditor';

// Simple CSV/TSV parser for clipboard data or basic files
function parseDelimited(text: string, delimiter: string = '\t'): any[] {
  const lines = text.trim().split('\n');
  if (lines.length === 0) return [];
  
  const headers = lines[0].split(delimiter).map(h => h.trim().replace(/^"|"$/g, ''));
  const data: any[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(delimiter).map(v => v.trim().replace(/^"|"$/g, ''));
    const row: Record<string, any> = {};
    
    headers.forEach((header, j) => {
      let value: any = values[j] || '';
      
      // Try to parse numbers and booleans
      if (value === 'true') value = true;
      else if (value === 'false') value = false;
      else if (value !== '' && !isNaN(Number(value))) value = Number(value);
      
      row[header] = value;
    });
    
    if (Object.values(row).some(v => v !== '')) {
      data.push(row);
    }
  }
  
  return data;
}

// Parse Excel XML format
function parseExcelXML(xmlText: string): any[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, 'text/xml');
  
  const rows = doc.querySelectorAll('Row');
  if (rows.length === 0) return [];
  
  // Get headers from first row
  const headerCells = rows[0].querySelectorAll('Cell Data');
  const headers: string[] = [];
  headerCells.forEach(cell => headers.push(cell.textContent || ''));
  
  const data: any[] = [];
  
  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].querySelectorAll('Cell');
    const row: Record<string, any> = {};
    let cellIndex = 0;
    
    cells.forEach(cell => {
      // Handle ss:Index attribute for sparse data
      const indexAttr = cell.getAttribute('ss:Index');
      if (indexAttr) {
        cellIndex = parseInt(indexAttr) - 1;
      }
      
      const dataEl = cell.querySelector('Data');
      if (dataEl && cellIndex < headers.length) {
        let value: any = dataEl.textContent || '';
        const type = dataEl.getAttribute('ss:Type');
        
        if (type === 'Number') value = parseFloat(value);
        else if (type === 'Boolean') value = value === '1';
        
        row[headers[cellIndex]] = value;
      }
      cellIndex++;
    });
    
    if (Object.keys(row).length > 0) {
      data.push(row);
    }
  }
  
  return data;
}

export function ExcelToJsonConverter() {
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [indent, setIndent] = useState(2);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pasteInput, setPasteInput] = useState('');

  const processData = useCallback((data: any[]) => {
    if (data.length === 0) {
      throw new Error('No data found in file');
    }
    setRowCount(data.length);
    setOutput(JSON.stringify(data, null, indent));
    setError(null);
  }, [indent]);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFileName(file.name);
    
    try {
      const text = await file.text();
      
      // Try to detect format
      if (file.name.endsWith('.csv')) {
        const data = parseDelimited(text, ',');
        processData(data);
      } else if (file.name.endsWith('.tsv') || file.name.endsWith('.txt')) {
        const data = parseDelimited(text, '\t');
        processData(data);
      } else if (text.includes('<?xml') || text.includes('<Workbook')) {
        const data = parseExcelXML(text);
        processData(data);
      } else {
        // Try CSV first, then TSV
        let data = parseDelimited(text, ',');
        if (data.length === 0 || Object.keys(data[0] || {}).length <= 1) {
          data = parseDelimited(text, '\t');
        }
        processData(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
      setOutput('');
    }
  }, [processData]);

  const handlePaste = useCallback(() => {
    if (!pasteInput.trim()) {
      setError('Please paste some data first');
      return;
    }
    
    try {
      // Detect delimiter - tab is common from Excel copy
      const hasTab = pasteInput.includes('\t');
      const data = parseDelimited(pasteInput, hasTab ? '\t' : ',');
      processData(data);
      setFileName('Pasted data');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse pasted data');
      setOutput('');
    }
  }, [pasteInput, processData]);

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

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* File Upload Section */}
      <div 
        className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors hover:border-[var(--accent-blue)]"
        style={{ borderColor: 'var(--border-primary)' }}
        onClick={triggerFileInput}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv,.tsv,.txt"
          onChange={handleFileUpload}
          className="hidden"
        />
        <div className="text-4xl mb-2">📊</div>
        <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
          Click to upload Excel file
        </p>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Supports .xlsx, .xls, .csv, .tsv files
        </p>
        {fileName && (
          <p className="text-sm mt-2" style={{ color: 'var(--accent-blue)' }}>
            Selected: {fileName}
          </p>
        )}
      </div>

      {/* Paste Section */}
      <div className="text-center text-sm" style={{ color: 'var(--text-muted)' }}>
        — or paste data directly from Excel —
      </div>

      <div>
        <textarea
          value={pasteInput}
          onChange={(e) => setPasteInput(e.target.value)}
          placeholder="Copy cells from Excel and paste here (Ctrl+V / Cmd+V)"
          className="w-full h-32 p-3 rounded text-sm font-mono"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            color: 'var(--text-primary)',
            resize: 'vertical',
          }}
        />
        <button
          onClick={handlePaste}
          className="mt-2 px-4 py-2 rounded font-medium transition-colors"
          style={{
            background: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-primary)',
          }}
        >
          Convert Pasted Data
        </button>
      </div>

      {/* Output Section */}
      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              JSON Output {rowCount > 0 && `(${rowCount} rows)`}
            </label>
            <div className="flex items-center gap-2">
              <select
                value={indent}
                onChange={(e) => {
                  const newIndent = Number(e.target.value);
                  setIndent(newIndent);
                  if (output) {
                    try {
                      const parsed = JSON.parse(output);
                      setOutput(JSON.stringify(parsed, null, newIndent));
                    } catch {}
                  }
                }}
                className="text-xs px-2 py-1 rounded"
                style={{
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
                <option value={0}>Minified</option>
              </select>
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
          </div>
          <JsonEditor
            value={output}
            onChange={() => {}}
            height="350px"
            language="json"
            readOnly
          />
        </div>
      )}

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
        💡 <strong>Privacy:</strong> Your file is processed entirely in your browser. 
        No data is uploaded to any server.
      </div>
    </div>
  );
}
