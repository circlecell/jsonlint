import { Metadata } from 'next';
import { ToolNav } from '@/components/ToolNav';
import { JsonToExcelConverter } from './JsonToExcelConverter';

export const metadata: Metadata = {
  title: 'JSON to Excel Converter - Convert JSON to XLSX Online | JSONLint',
  description:
    'Convert JSON to Excel (.xlsx) format instantly. Supports nested objects, auto-column widths, and custom sheet names. Free online converter, no upload required.',
};

export default function JsonToExcelPage() {
  return (
    <>
      <ToolNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-4 flex justify-center">
          <div id="bsa-zone_1570746984891-3_123456"></div>
        </div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          JSON to Excel Converter
        </h1>
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
          Convert JSON arrays to Excel spreadsheets. Paste your JSON data below:
        </p>

        <JsonToExcelConverter />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6 mt-8">
          <div className="prose-custom">
            <h2>Convert JSON to Excel Format</h2>
            <p>
              This tool converts JSON data into Excel spreadsheets that you can open in 
              Microsoft Excel, Google Sheets, or any spreadsheet application. It handles 
              arrays of objects, nested data structures, and various data types automatically.
            </p>

            <h2>How to Use</h2>
            <ol>
              <li><strong>Paste your JSON</strong> — Input should be an array of objects</li>
              <li><strong>Configure options</strong> — Set sheet name and flattening preferences</li>
              <li><strong>Preview the result</strong> — Click Preview to see how your data will look</li>
              <li><strong>Download</strong> — Click Download Excel to get your .xls file</li>
            </ol>

            <h2>JSON to Excel vs JSON to CSV</h2>
            <p>
              Both formats export tabular data, but Excel offers advantages for certain use cases:
            </p>
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Excel</th>
                  <th>CSV</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Multiple sheets</td>
                  <td>✅ Yes</td>
                  <td>❌ No</td>
                </tr>
                <tr>
                  <td>Data types</td>
                  <td>✅ Numbers, dates, booleans</td>
                  <td>❌ Text only</td>
                </tr>
                <tr>
                  <td>Formatting</td>
                  <td>✅ Styles, colors, widths</td>
                  <td>❌ None</td>
                </tr>
                <tr>
                  <td>File size</td>
                  <td>Larger</td>
                  <td>Smaller</td>
                </tr>
                <tr>
                  <td>Compatibility</td>
                  <td>Excel, Sheets, Numbers</td>
                  <td>Universal</td>
                </tr>
              </tbody>
            </table>
            <p>
              Use Excel when you need formatting, multiple sheets, or proper data types. 
              Use <a href="/json-to-csv">CSV</a> for maximum compatibility or smaller files.
            </p>

            <h2>Handling Nested JSON</h2>
            <p>
              When your JSON contains nested objects, the converter flattens them using 
              dot notation for column headers:
            </p>
            <pre><code>{`// Input
{
  "name": "Alice",
  "address": {
    "city": "New York",
    "zip": "10001"
  }
}

// Excel columns
| name  | address.city | address.zip |
|-------|--------------|-------------|
| Alice | New York     | 10001       |`}</code></pre>

            <h3>Arrays within objects</h3>
            <p>
              Arrays are converted to comma-separated strings:
            </p>
            <pre><code>{`// Input
{ "name": "Alice", "skills": ["Python", "JavaScript"] }

// Excel output
| name  | skills              |
|-------|---------------------|
| Alice | Python, JavaScript  |`}</code></pre>

            <h2>Data Type Handling</h2>
            <p>The converter preserves data types where possible:</p>
            <ul>
              <li><strong>Numbers</strong> — Stored as numeric values (sortable, summable)</li>
              <li><strong>Booleans</strong> — Converted to 1/0 for Excel compatibility</li>
              <li><strong>Strings</strong> — Stored as text</li>
              <li><strong>Null/undefined</strong> — Empty cells</li>
              <li><strong>Objects</strong> — Flattened or stringified</li>
            </ul>

            <h2>Example Conversion</h2>
            <p>Input JSON:</p>
            <pre><code>{`[
  {
    "id": 1,
    "name": "Alice Johnson",
    "department": "Engineering",
    "salary": 95000,
    "active": true
  },
  {
    "id": 2,
    "name": "Bob Smith",
    "department": "Marketing",
    "salary": 65000,
    "active": true
  }
]`}</code></pre>
            <p>
              This produces an Excel file with columns: id, name, department, salary, active — 
              with proper numeric formatting for id and salary.
            </p>

            <h2>Programmatic Conversion</h2>
            
            <h3>JavaScript (with SheetJS)</h3>
            <pre><code>{`import * as XLSX from 'xlsx';

const data = [{ name: "Alice", age: 30 }];
const ws = XLSX.utils.json_to_sheet(data);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
XLSX.writeFile(wb, "output.xlsx");`}</code></pre>

            <h3>Python (with pandas)</h3>
            <pre><code>{`import pandas as pd
import json

data = json.loads('[{"name": "Alice", "age": 30}]')
df = pd.DataFrame(data)
df.to_excel("output.xlsx", index=False)`}</code></pre>

            <h2>Related Tools</h2>
            <ul>
              <li><a href="/excel-to-json">Excel to JSON</a> — Convert Excel back to JSON</li>
              <li><a href="/json-to-csv">JSON to CSV</a> — Simpler tabular format</li>
              <li><a href="/json-to-table">JSON to Table</a> — Preview as HTML table</li>
              <li><a href="/json-flatten">JSON Flatten</a> — Flatten nested objects first</li>
              <li><a href="/">JSON Validator</a> — Validate JSON before converting</li>
            </ul>

            <h2>Frequently Asked Questions</h2>
            
            <h3>Can I convert nested JSON to Excel?</h3>
            <p>
              Yes! Enable "Flatten nested objects" to convert nested structures into 
              dot-notation columns (e.g., <code>address.city</code>). Arrays become 
              comma-separated values.
            </p>

            <h3>What's the maximum file size?</h3>
            <p>
              The conversion runs entirely in your browser, so there's no server limit. 
              However, very large datasets (10,000+ rows) may slow down your browser. 
              For massive files, consider using a programming library.
            </p>

            <h3>Does it preserve data types?</h3>
            <p>
              Yes. Numbers remain numeric (sortable, usable in formulas), booleans 
              become 1/0, and strings remain text. This is an advantage over CSV 
              which treats everything as text.
            </p>

            <h3>Can I customize column order?</h3>
            <p>
              Column order follows the order of keys in your first JSON object. 
              To reorder, restructure your JSON or reorder columns in Excel after export.
            </p>

            <h3>Why .xls instead of .xlsx?</h3>
            <p>
              We use Excel XML format (.xls) for browser compatibility without external 
              dependencies. This format opens in all modern spreadsheet applications 
              including Excel 2007+, Google Sheets, and LibreOffice.
            </p>
          </div>
          
          <aside className="hidden lg:block">
            <div id="bsa-zone_1605730077127-6_123456"></div>
          </aside>
        </div>
      </div>
    </>
  );
}
