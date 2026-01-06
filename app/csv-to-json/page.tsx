import { Metadata } from 'next';
import { ToolNav } from '@/components/ToolNav';
import { CsvToJsonConverter } from './CsvToJsonConverter';

export const metadata: Metadata = {
  title: 'CSV to JSON Converter - Convert CSV to JSON Online | JSONLint',
  description:
    'Convert CSV to JSON array instantly. Handles headers, custom delimiters, and automatic type detection. Free online tool.',
};

export default function CsvToJsonPage() {
  return (
    <>
      <ToolNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-4 flex justify-center">
          <div id="bsa-zone_1570746984891-3_123456"></div>
        </div>

        <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
          Paste your CSV below to convert it to JSON:
        </p>

        <CsvToJsonConverter />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6 mt-8">
          <div className="prose-custom">
            <h2>How CSV to JSON Conversion Works</h2>
            <p>
              This tool converts CSV (Comma-Separated Values) data into a JSON array of objects. 
              Each row becomes an object, and each column header becomes a property name. 
              It automatically detects numbers, booleans, and null values.
            </p>

            <h2>Example Conversion</h2>
            <p>Input CSV:</p>
            <pre><code>{`name,email,age,active
Alice,alice@example.com,30,true
Bob,bob@example.com,25,false`}</code></pre>

            <p>Output JSON:</p>
            <pre><code>{`[
  {
    "name": "Alice",
    "email": "alice@example.com",
    "age": 30,
    "active": true
  },
  {
    "name": "Bob",
    "email": "bob@example.com",
    "age": 25,
    "active": false
  }
]`}</code></pre>

            <h2>Automatic Type Detection</h2>
            <p>The converter automatically parses:</p>
            <table>
              <thead>
                <tr>
                  <th>CSV Value</th>
                  <th>JSON Type</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>123</code>, <code>45.67</code></td>
                  <td>Number</td>
                </tr>
                <tr>
                  <td><code>true</code>, <code>false</code></td>
                  <td>Boolean</td>
                </tr>
                <tr>
                  <td><code>null</code></td>
                  <td>Null</td>
                </tr>
                <tr>
                  <td>Everything else</td>
                  <td>String</td>
                </tr>
              </tbody>
            </table>

            <h2>Handling Special Cases</h2>

            <h3>Quoted Fields</h3>
            <p>Fields containing commas or newlines should be wrapped in double quotes:</p>
            <pre><code>{`name,description
"Acme, Inc.","A company that makes ""everything"""`}</code></pre>

            <h3>No Header Row</h3>
            <p>
              If your CSV doesn't have headers, uncheck "First row is headers" and 
              columns will be named <code>column1</code>, <code>column2</code>, etc.
            </p>

            <h3>Different Delimiters</h3>
            <p>
              Not all CSV files use commas. European systems often use semicolons 
              because comma is the decimal separator. Select the appropriate delimiter 
              from the dropdown.
            </p>

            <h2>Common Use Cases</h2>
            <ul>
              <li>
                <strong>API payload preparation</strong> — Convert spreadsheet data to JSON for API requests
              </li>
              <li>
                <strong>Database seeding</strong> — Transform CSV exports into JSON for MongoDB or other document databases
              </li>
              <li>
                <strong>Configuration files</strong> — Convert tabular config data to JSON format
              </li>
              <li>
                <strong>Data transformation</strong> — Intermediate step in ETL pipelines
              </li>
            </ul>

            <h2>Programmatic Conversion</h2>
            
            <h3>JavaScript</h3>
            <pre><code>{`function csvToJson(csv) {
  const lines = csv.trim().split('\\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return headers.reduce((obj, header, i) => {
      obj[header] = values[i];
      return obj;
    }, {});
  });
}`}</code></pre>

            <h3>Python</h3>
            <pre><code>{`import csv
import json

def csv_to_json(csv_string):
    reader = csv.DictReader(csv_string.splitlines())
    return json.dumps(list(reader), indent=2)`}</code></pre>

            <h2>Pro Tips</h2>
            <ul>
              <li>
                💡 <strong>Clean your data first</strong> — Remove empty rows and fix inconsistent quoting before converting
              </li>
              <li>
                💡 <strong>Check for BOM</strong> — Excel sometimes adds a byte-order mark that can corrupt the first header
              </li>
              <li>
                💡 <strong>Validate after</strong> — Use the <a href="/">JSON Validator</a> to ensure your output is valid
              </li>
            </ul>

            <h2>Related Tools</h2>
            <ul>
              <li><a href="/json-to-csv">JSON to CSV</a> — Convert JSON back to CSV</li>
              <li><a href="/excel-to-json">Excel to JSON</a> — Convert Excel files directly</li>
              <li><a href="/">JSON Validator</a> — Validate your JSON output</li>
              <li><a href="/json-schema">JSON Schema Validator</a> — Validate structure</li>
            </ul>
          </div>
          
          <aside className="hidden lg:block">
            <div id="bsa-zone_1605730077127-6_123456"></div>
          </aside>
        </div>
      </div>
    </>
  );
}
