import { Metadata } from 'next';
import { ToolNav } from '@/components/ToolNav';
import { Container } from '@/components/Container';
import { JsonTableViewer } from './JsonTableViewer';

export const metadata: Metadata = {
  title: 'JSON to Table - View JSON as HTML Table | JSONLint',
  description:
    'Convert JSON arrays to HTML tables. View JSON data in a readable table format and export as HTML. Free online tool.',
};

export default function JsonToTablePage() {
  return (
    <>
      <ToolNav />

      <Container className="py-4">
        <div className="mb-4 flex justify-center">
          <div id="bsa-zone_1570746984891-3_123456"></div>
        </div>

        <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
          Paste your JSON below to view it as a table:
        </p>

        <JsonTableViewer />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6 mt-8">
          <div className="prose-custom">
            <h2>View JSON as a Table</h2>
            <p>
              This tool converts JSON arrays into a visual HTML table format. It's the 
              fastest way to preview JSON data in a readable, spreadsheet-like view 
              without leaving your browser.
            </p>

            <h2>Supported JSON Structures</h2>
            <p>The tool works best with arrays of objects:</p>
            <pre><code>{`[
  { "name": "Alice", "age": 30 },
  { "name": "Bob", "age": 25 }
]`}</code></pre>

            <p>Or an object containing an array:</p>
            <pre><code>{`{
  "users": [
    { "name": "Alice", "age": 30 },
    { "name": "Bob", "age": 25 }
  ]
}`}</code></pre>

            <h2>Features</h2>
            <ul>
              <li>
                <strong>Auto-detect arrays</strong> — Finds the first array in your JSON
              </li>
              <li>
                <strong>Merged columns</strong> — Handles objects with different fields
              </li>
              <li>
                <strong>Type highlighting</strong> — Booleans, nulls, and objects are color-coded
              </li>
              <li>
                <strong>HTML export</strong> — Copy as HTML table for use in documents
              </li>
            </ul>

            <h2>Common Use Cases</h2>
            <ul>
              <li>
                <strong>API response inspection</strong> — Quickly visualize API data
              </li>
              <li>
                <strong>Data validation</strong> — Check data structure at a glance
              </li>
              <li>
                <strong>Documentation</strong> — Generate tables for documentation
              </li>
              <li>
                <strong>Debugging</strong> — Easier than reading raw JSON
              </li>
            </ul>

            <h2>Handling Special Values</h2>
            <table>
              <thead>
                <tr>
                  <th>JSON Value</th>
                  <th>Table Display</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>null</code></td>
                  <td><span style={{ color: 'var(--text-muted)' }}>null</span> (grayed)</td>
                </tr>
                <tr>
                  <td><code>true</code></td>
                  <td><span style={{ color: 'var(--accent-green)' }}>true</span> (green)</td>
                </tr>
                <tr>
                  <td><code>false</code></td>
                  <td><span style={{ color: 'var(--accent-red)' }}>false</span> (red)</td>
                </tr>
                <tr>
                  <td>Nested objects</td>
                  <td><code>{`{...}`}</code> (truncated)</td>
                </tr>
              </tbody>
            </table>

            <h2>HTML Export</h2>
            <p>
              Click &quot;Copy HTML&quot; to get a clean HTML table you can paste into:
            </p>
            <ul>
              <li>Confluence or wiki pages</li>
              <li>Email clients</li>
              <li>HTML documents</li>
              <li>CMS platforms</li>
            </ul>

            <h2>Programmatic Conversion</h2>
            
            <h3>JavaScript</h3>
            <pre><code>{`function jsonToHtmlTable(data) {
  if (!Array.isArray(data) || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const headerRow = headers.map(h => \`<th>\${h}</th>\`).join('');
  
  const bodyRows = data.map(row => 
    \`<tr>\${headers.map(h => \`<td>\${row[h] ?? ''}</td>\`).join('')}</tr>\`
  ).join('');
  
  return \`<table><thead><tr>\${headerRow}</tr></thead><tbody>\${bodyRows}</tbody></table>\`;
}`}</code></pre>

            <h3>Python</h3>
            <pre><code>{`import json
import pandas as pd

# Read JSON and convert to HTML table
data = json.loads(json_string)
df = pd.DataFrame(data)
html_table = df.to_html(index=False)`}</code></pre>

            <h2>Pro Tips</h2>
            <ul>
              <li>
                💡 <strong>Large datasets</strong> — For very large arrays, the table might 
                be slow. Consider paginating or filtering first.
              </li>
              <li>
                💡 <strong>Nested data</strong> — For deeply nested JSON, use 
                <a href="/json-flatten">JSON Flatten</a> first.
              </li>
              <li>
                💡 <strong>Export to spreadsheet</strong> — Use <a href="/json-to-csv">JSON to CSV</a> for 
                Excel or Google Sheets.
              </li>
            </ul>

            <h2>Related Tools</h2>
            <ul>
              <li><a href="/json-to-csv">JSON to CSV</a> — Export to spreadsheet format</li>
              <li><a href="/json-flatten">JSON Flatten</a> — Flatten nested data first</li>
              <li><a href="/json-path">JSON Path</a> — Extract specific data</li>
              <li><a href="/">JSON Validator</a> — Validate your JSON</li>
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
