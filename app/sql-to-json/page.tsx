import { Metadata } from 'next';
import { ToolNav } from '@/components/ToolNav';
import { Container } from '@/components/Container';
import { SqlToJsonConverter } from './SqlToJsonConverter';

export const metadata: Metadata = {
  title: 'SQL to JSON Converter - Convert INSERT Statements to JSON | JSONLint',
  description:
    'Convert SQL INSERT statements to JSON format. Extract data from SQL dumps and transform to JSON arrays for APIs and applications.',
};

export default function SqlToJsonPage() {
  return (
    <>
      <ToolNav />

      <Container className="py-4">
        <div className="mb-4 flex justify-center">
          <div id="bsa-zone_1570746984891-3_123456"></div>
        </div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          SQL to JSON Converter
        </h1>
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
          Convert SQL INSERT statements to JSON arrays. Paste your SQL:
        </p>

        <SqlToJsonConverter />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6 mt-8">
          <div className="prose-custom">
            <h2>Convert SQL to JSON</h2>
            <p>
              This tool extracts data from SQL INSERT statements and converts it to JSON format. 
              It parses column names and values, handling strings, numbers, booleans, and NULL values.
            </p>

            <h2>Supported SQL Syntax</h2>
            <p>The converter handles:</p>
            <ul>
              <li>INSERT INTO with explicit column names</li>
              <li>Multiple value sets in single INSERT</li>
              <li>Multiple INSERT statements</li>
              <li>CREATE TABLE for column name extraction</li>
              <li>Standard SQL value types (strings, numbers, booleans, NULL)</li>
            </ul>

            <h2>Example Conversion</h2>
            <p>Input SQL:</p>
            <pre><code>{`INSERT INTO users (id, name, active) VALUES
  (1, 'Alice', TRUE),
  (2, 'Bob', FALSE);`}</code></pre>

            <p>Output JSON:</p>
            <pre><code>{`[
  { "id": 1, "name": "Alice", "active": true },
  { "id": 2, "name": "Bob", "active": false }
]`}</code></pre>

            <h2>Type Conversion</h2>
            <table>
              <thead>
                <tr>
                  <th>SQL Value</th>
                  <th>JSON Result</th>
                </tr>
              </thead>
              <tbody>
                <tr><td><code>'text'</code> or <code>"text"</code></td><td><code>"text"</code></td></tr>
                <tr><td><code>123</code></td><td><code>123</code></td></tr>
                <tr><td><code>45.67</code></td><td><code>45.67</code></td></tr>
                <tr><td><code>TRUE</code> / <code>FALSE</code></td><td><code>true</code> / <code>false</code></td></tr>
                <tr><td><code>NULL</code></td><td><code>null</code></td></tr>
              </tbody>
            </table>

            <h2>Common Use Cases</h2>
            <ul>
              <li><strong>Database exports</strong> — Convert SQL dumps to JSON for analysis</li>
              <li><strong>API migration</strong> — Transform database data for REST APIs</li>
              <li><strong>Testing</strong> — Generate JSON fixtures from SQL test data</li>
              <li><strong>Documentation</strong> — Convert sample data to readable JSON</li>
            </ul>

            <h2>Handling Edge Cases</h2>
            
            <h3>Escaped quotes</h3>
            <p>
              Single quotes within strings should be escaped as <code>''</code> (standard SQL escaping):
            </p>
            <pre><code>{`INSERT INTO messages (text) VALUES ('It''s working');
-- Becomes: { "text": "It's working" }`}</code></pre>

            <h3>Multiple tables</h3>
            <p>
              If your SQL contains inserts to multiple tables, all rows are combined. 
              For best results, convert one table at a time.
            </p>

            <h2>Programmatic Conversion</h2>
            
            <h3>Python</h3>
            <pre><code>{`import re
import json

def sql_insert_to_json(sql):
    # Simple regex for INSERT VALUES
    pattern = r"INSERT INTO \w+ \(([^)]+)\) VALUES (.+)"
    match = re.search(pattern, sql, re.IGNORECASE)
    
    columns = [c.strip() for c in match.group(1).split(',')]
    # Parse values and build objects...
    return json.dumps(result, indent=2)`}</code></pre>

            <h3>JavaScript</h3>
            <pre><code>{`// Using a SQL parser library
import { Parser } from 'node-sql-parser';

const parser = new Parser();
const ast = parser.astify(sql);
// Extract data from AST...`}</code></pre>

            <h2>Related Tools</h2>
            <ul>
              <li><a href="/json-to-sql">JSON to SQL</a> — Convert JSON back to SQL</li>
              <li><a href="/">JSON Validator</a> — Validate the output</li>
              <li><a href="/json-to-csv">JSON to CSV</a> — Export as spreadsheet</li>
              <li><a href="/csv-to-json">CSV to JSON</a> — Alternative data import</li>
            </ul>

            <h2>Frequently Asked Questions</h2>
            
            <h3>Can I convert SELECT query results?</h3>
            <p>
              This tool parses INSERT statements, not query results. For SELECT output, 
              export as CSV first, then use our <a href="/csv-to-json">CSV to JSON</a> converter.
            </p>

            <h3>What SQL dialects are supported?</h3>
            <p>
              The parser handles standard SQL syntax compatible with MySQL, PostgreSQL, 
              SQLite, and SQL Server. Dialect-specific features may not be supported.
            </p>

            <h3>How do I handle large SQL files?</h3>
            <p>
              The tool runs in your browser, so very large files may be slow. For 
              massive datasets, consider using command-line tools or programming libraries.
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
