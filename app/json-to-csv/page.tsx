import { Metadata } from 'next';
import { ToolNav } from '@/components/ToolNav';
import { Container } from '@/components/Container';
import { JsonToCsvConverter } from './JsonToCsvConverter';

export const metadata: Metadata = {
  title: 'JSON to CSV Converter - Convert JSON to CSV Online | JSONLint',
  description:
    'Convert JSON to CSV instantly. Handles nested objects, arrays, and custom delimiters. Download or copy the result.',
};

export default function JsonToCsvPage() {
  return (
    <>
      <ToolNav />

      <Container className="py-4">
        <div className="mb-4 flex justify-center">
          <div id="bsa-zone_1570746984891-3_123456"></div>
        </div>

        <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
          Paste your JSON below to convert it to CSV format:
        </p>

        <JsonToCsvConverter />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6 mt-8">
          <div className="prose-custom">
            <h2>How JSON to CSV Conversion Works</h2>
            <p>
              This tool converts JSON arrays into CSV (Comma-Separated Values) format. 
              Each object in the array becomes a row, and each property becomes a column. 
              It's the fastest way to get JSON data into Excel, Google Sheets, or any 
              spreadsheet application.
            </p>

            <h2>What JSON Structure Works Best?</h2>
            <p>The ideal input is an array of flat objects:</p>
            <pre><code>{`[
  { "name": "Alice", "email": "alice@example.com", "age": 30 },
  { "name": "Bob", "email": "bob@example.com", "age": 25 }
]`}</code></pre>

            <p>Or an object containing an array:</p>
            <pre><code>{`{
  "users": [
    { "name": "Alice", "email": "alice@example.com" },
    { "name": "Bob", "email": "bob@example.com" }
  ]
}`}</code></pre>

            <h2>Handling Nested Objects</h2>
            <p>
              When your JSON contains nested objects or arrays, they're converted to 
              JSON strings in the CSV output. For example:
            </p>
            <pre><code>{`{ "name": "Alice", "address": { "city": "NYC", "zip": "10001" } }`}</code></pre>
            <p>Becomes:</p>
            <pre><code>{`name,address
Alice,"{""city"":""NYC"",""zip"":""10001""}"`}</code></pre>

            <h2>Delimiter Options</h2>
            <table>
              <thead>
                <tr>
                  <th>Option</th>
                  <th>Use Case</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>,</code> Comma</td>
                  <td>Standard CSV, works everywhere</td>
                </tr>
                <tr>
                  <td><code>;</code> Semicolon</td>
                  <td>European locales where comma is decimal separator</td>
                </tr>
                <tr>
                  <td><code>Tab</code></td>
                  <td>TSV format, good for data with commas</td>
                </tr>
                <tr>
                  <td><code>|</code> Pipe</td>
                  <td>When data contains commas and quotes</td>
                </tr>
              </tbody>
            </table>

            <h2>Common Use Cases</h2>
            <ul>
              <li>
                <strong>API response to spreadsheet</strong> — Export API data for analysis in Excel
              </li>
              <li>
                <strong>Database export</strong> — Convert MongoDB/JSON exports to CSV for reporting
              </li>
              <li>
                <strong>Data migration</strong> — Move data between systems that expect different formats
              </li>
              <li>
                <strong>Quick data review</strong> — CSV is easier to scan than nested JSON
              </li>
            </ul>

            <h2>Programmatic Conversion</h2>
            
            <h3>JavaScript</h3>
            <pre><code>{`function jsonToCsv(jsonArray) {
  if (!jsonArray.length) return '';
  
  const headers = Object.keys(jsonArray[0]);
  const rows = jsonArray.map(obj => 
    headers.map(h => JSON.stringify(obj[h] ?? '')).join(',')
  );
  
  return [headers.join(','), ...rows].join('\\n');
}`}</code></pre>

            <h3>Python</h3>
            <pre><code>{`import json
import csv
import io

def json_to_csv(json_data):
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=json_data[0].keys())
    writer.writeheader()
    writer.writerows(json_data)
    return output.getvalue()`}</code></pre>

            <h2>Pro Tips</h2>
            <ul>
              <li>
                💡 <strong>Flatten first</strong> — For deeply nested JSON, consider using 
                our <a href="/json-flatten">JSON Flatten</a> tool before converting
              </li>
              <li>
                💡 <strong>Check encoding</strong> — If you see garbled characters, ensure 
                your JSON is UTF-8 encoded
              </li>
              <li>
                💡 <strong>Large files</strong> — This tool handles files up to a few MB. 
                For larger datasets, use a programmatic approach
              </li>
            </ul>

            <h2>Related Tools</h2>
            <ul>
              <li><a href="/csv-to-json">CSV to JSON</a> — Convert CSV back to JSON</li>
              <li><a href="/json-to-excel">JSON to Excel</a> — Direct Excel export</li>
              <li><a href="/">JSON Validator</a> — Validate your JSON first</li>
              <li><a href="/json-path">JSON Path</a> — Extract specific data before converting</li>
            </ul>
          </div>
          
          <aside className="hidden lg:block">
            <div id="bsa-zone_1605730077127-6_123456"></div>
          </aside>
        </div>
      </Container>
    </>
  );
}
