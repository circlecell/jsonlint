import { Metadata } from 'next';
import { ToolNav } from '@/components/ToolNav';
import { Container } from '@/components/Container';
import { ExcelToJsonConverter } from './ExcelToJsonConverter';

export const metadata: Metadata = {
  title: 'Excel to JSON Converter - Convert XLSX to JSON Online | JSONLint',
  description:
    'Convert Excel spreadsheets to JSON format online. Upload .xlsx, .xls, or .csv files or paste data directly. Free, private, browser-based conversion.',
};

export default function ExcelToJsonPage() {
  return (
    <>
      <ToolNav />

      <Container className="py-4">
        <div className="mb-4 flex justify-center">
          <div id="bsa-zone_1570746984891-3_123456"></div>
        </div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Excel to JSON Converter
        </h1>
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
          Convert Excel spreadsheets to JSON format. Upload a file or paste directly from Excel:
        </p>

        <ExcelToJsonConverter />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6 mt-8">
          <div className="prose-custom">
            <h2>Convert Excel to JSON</h2>
            <p>
              This tool transforms Excel spreadsheet data into JSON format, making it easy 
              to use your tabular data in web applications, APIs, and databases. The conversion 
              runs entirely in your browser — no data is uploaded to any server.
            </p>

            <h2>How to Use</h2>
            <ol>
              <li><strong>Upload a file</strong> — Click the upload area and select an Excel file (.xlsx, .xls, .csv)</li>
              <li><strong>Or paste data</strong> — Copy cells from Excel and paste into the text area</li>
              <li><strong>Get JSON</strong> — Your data is instantly converted to JSON format</li>
              <li><strong>Copy or download</strong> — Use the buttons to copy to clipboard or download as .json</li>
            </ol>

            <h2>Supported Formats</h2>
            <table>
              <thead>
                <tr>
                  <th>Format</th>
                  <th>Extension</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Excel XML</td>
                  <td>.xls</td>
                  <td>Older Excel format, widely compatible</td>
                </tr>
                <tr>
                  <td>CSV</td>
                  <td>.csv</td>
                  <td>Comma-separated values</td>
                </tr>
                <tr>
                  <td>TSV</td>
                  <td>.tsv, .txt</td>
                  <td>Tab-separated values</td>
                </tr>
                <tr>
                  <td>Clipboard</td>
                  <td>—</td>
                  <td>Direct paste from Excel (tab-separated)</td>
                </tr>
              </tbody>
            </table>

            <h2>How Data is Converted</h2>
            <p>
              The first row of your spreadsheet becomes the JSON property names (keys), 
              and each subsequent row becomes an object in the output array:
            </p>
            
            <h3>Excel input</h3>
            <pre><code>{`| name  | age | city     |
|-------|-----|----------|
| Alice | 30  | New York |
| Bob   | 25  | Boston   |`}</code></pre>

            <h3>JSON output</h3>
            <pre><code>{`[
  { "name": "Alice", "age": 30, "city": "New York" },
  { "name": "Bob", "age": 25, "city": "Boston" }
]`}</code></pre>

            <h2>Data Type Detection</h2>
            <p>The converter automatically detects and preserves data types:</p>
            <ul>
              <li><strong>Numbers</strong> — Numeric cells become JSON numbers</li>
              <li><strong>Booleans</strong> — "true"/"false" become JSON booleans</li>
              <li><strong>Text</strong> — Everything else becomes JSON strings</li>
              <li><strong>Empty cells</strong> — Become empty strings</li>
            </ul>

            <h2>Copy-Paste from Excel</h2>
            <p>
              The fastest way to convert small datasets: select cells in Excel, press Ctrl+C (Cmd+C on Mac), 
              then paste directly into the text area. Excel uses tab characters as delimiters when copying, 
              which this tool handles automatically.
            </p>

            <h2>Privacy & Security</h2>
            <p>
              Your data never leaves your computer. The entire conversion process runs in your 
              web browser using JavaScript. No files are uploaded to any server, making this 
              safe for sensitive or confidential data.
            </p>

            <h2>Programmatic Conversion</h2>
            
            <h3>JavaScript (with SheetJS)</h3>
            <pre><code>{`import * as XLSX from 'xlsx';

const file = await fetch('data.xlsx');
const buffer = await file.arrayBuffer();
const workbook = XLSX.read(buffer);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const json = XLSX.utils.sheet_to_json(sheet);
console.log(JSON.stringify(json, null, 2));`}</code></pre>

            <h3>Python (with pandas)</h3>
            <pre><code>{`import pandas as pd
import json

df = pd.read_excel('data.xlsx')
json_data = df.to_json(orient='records')
print(json.dumps(json.loads(json_data), indent=2))`}</code></pre>

            <h2>Common Use Cases</h2>
            <ul>
              <li><strong>API development</strong> — Convert sample data to JSON for testing</li>
              <li><strong>Database seeding</strong> — Transform spreadsheet data for database imports</li>
              <li><strong>Web applications</strong> — Use spreadsheet data in JavaScript apps</li>
              <li><strong>Data migration</strong> — Convert legacy Excel data to modern formats</li>
              <li><strong>Configuration files</strong> — Transform spreadsheet configs to JSON</li>
            </ul>

            <h2>Related Tools</h2>
            <ul>
              <li><a href="/json-to-excel">JSON to Excel</a> — Convert JSON back to Excel format</li>
              <li><a href="/csv-to-json">CSV to JSON</a> — Convert CSV files to JSON</li>
              <li><a href="/">JSON Validator</a> — Validate your JSON output</li>
              <li><a href="/json-to-table">JSON to Table</a> — View JSON as a table</li>
            </ul>

            <h2>Frequently Asked Questions</h2>
            
            <h3>Is my data secure?</h3>
            <p>
              Yes. All processing happens in your browser. Your Excel file is never uploaded 
              to any server. You can verify this by using the tool offline or checking your 
              browser's network tab.
            </p>

            <h3>What's the maximum file size?</h3>
            <p>
              Since processing happens in your browser, the limit depends on your device's 
              memory. Most modern browsers handle files up to 50MB without issues. For very 
              large files, consider using a programming library.
            </p>

            <h3>Can I convert multiple sheets?</h3>
            <p>
              Currently, the tool converts the first sheet only. For multi-sheet workbooks, 
              export each sheet separately or use a programming library for full control.
            </p>

            <h3>Why are my numbers becoming strings?</h3>
            <p>
              Ensure your Excel cells are formatted as numbers, not text. If cells contain 
              leading zeros (like zip codes), they may be stored as text intentionally.
            </p>

            <h3>Can I convert .xlsx files?</h3>
            <p>
              For best results with .xlsx files, save your spreadsheet as .csv or .xls 
              (Excel 97-2003 format) first. Alternatively, copy the data directly from 
              Excel and paste it into the text area.
            </p>
          </div>
          
          <aside className="hidden lg:block">
            <div id="bsa-zone_1605730077127-6_123456"></div>
          </aside>
        </div>
      </Container>
    </>
  );
}
