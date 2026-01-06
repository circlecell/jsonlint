import { Metadata } from 'next';
import { ToolNav } from '@/components/ToolNav';
import { JsonToSqlConverter } from './JsonToSqlConverter';

export const metadata: Metadata = {
  title: 'JSON to SQL Converter - Generate INSERT Statements Online | JSONLint',
  description:
    'Convert JSON to SQL INSERT statements and CREATE TABLE scripts. Supports PostgreSQL, MySQL, SQLite, and SQL Server with proper type inference.',
};

export default function JsonToSqlPage() {
  return (
    <>
      <ToolNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-4 flex justify-center">
          <div id="bsa-zone_1570746984891-3_123456"></div>
        </div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          JSON to SQL Converter
        </h1>
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
          Convert JSON arrays to SQL CREATE TABLE and INSERT statements. Paste your JSON:
        </p>

        <JsonToSqlConverter />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6 mt-8">
          <div className="prose-custom">
            <h2>Convert JSON to SQL</h2>
            <p>
              This tool transforms JSON data into SQL statements for database import. 
              It generates CREATE TABLE statements with inferred column types and 
              INSERT statements with properly escaped values.
            </p>

            <h2>Supported Databases</h2>
            <table>
              <thead>
                <tr>
                  <th>Database</th>
                  <th>Identifier Quotes</th>
                  <th>JSON Support</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>PostgreSQL</td>
                  <td><code>"column"</code></td>
                  <td>JSONB type</td>
                </tr>
                <tr>
                  <td>MySQL</td>
                  <td><code>`column`</code></td>
                  <td>JSON type</td>
                </tr>
                <tr>
                  <td>SQLite</td>
                  <td><code>"column"</code></td>
                  <td>TEXT (store as string)</td>
                </tr>
                <tr>
                  <td>SQL Server</td>
                  <td><code>[column]</code></td>
                  <td>NVARCHAR (store as string)</td>
                </tr>
              </tbody>
            </table>

            <h2>Type Mapping</h2>
            <p>
              The converter infers SQL types from JSON values:
            </p>
            <table>
              <thead>
                <tr>
                  <th>JSON Type</th>
                  <th>PostgreSQL</th>
                  <th>MySQL</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>string</td><td>VARCHAR / TEXT</td><td>VARCHAR / TEXT</td></tr>
                <tr><td>integer</td><td>INT / BIGINT</td><td>INT / BIGINT</td></tr>
                <tr><td>decimal</td><td>DOUBLE</td><td>DOUBLE</td></tr>
                <tr><td>boolean</td><td>BOOLEAN</td><td>TINYINT(1)</td></tr>
                <tr><td>null</td><td>TEXT NULL</td><td>VARCHAR NULL</td></tr>
                <tr><td>date string</td><td>DATE</td><td>DATE</td></tr>
                <tr><td>datetime string</td><td>TIMESTAMP</td><td>DATETIME</td></tr>
                <tr><td>object/array</td><td>JSONB</td><td>JSON</td></tr>
              </tbody>
            </table>

            <h2>Example Output</h2>
            <p>From this JSON:</p>
            <pre><code>{`[
  {"id": 1, "name": "Alice", "active": true},
  {"id": 2, "name": "Bob", "active": false}
]`}</code></pre>

            <p>PostgreSQL output:</p>
            <pre><code>{`CREATE TABLE "users" (
  "id" INT NOT NULL,
  "name" VARCHAR(50) NOT NULL,
  "active" BOOLEAN NOT NULL
);

INSERT INTO "users" ("id", "name", "active")
VALUES
  (1, 'Alice', TRUE),
  (2, 'Bob', FALSE);`}</code></pre>

            <h2>Options Explained</h2>
            
            <h3>Table name</h3>
            <p>
              The name used for the CREATE TABLE and INSERT statements. 
              Automatically quoted with the appropriate syntax for your database.
            </p>

            <h3>Output type</h3>
            <ul>
              <li><strong>CREATE + INSERT</strong> — Full table creation with data</li>
              <li><strong>CREATE TABLE only</strong> — Schema definition only</li>
              <li><strong>INSERT only</strong> — Data insertion only (for existing tables)</li>
            </ul>

            <h3>Include NULLs</h3>
            <p>
              When enabled, null values are inserted as NULL. When disabled, 
              they use DEFAULT (requires column defaults defined).
            </p>

            <h2>Handling Special Cases</h2>
            
            <h3>Nested objects</h3>
            <p>
              Nested JSON objects and arrays are stored as JSON/JSONB columns in 
              PostgreSQL and MySQL, or as TEXT strings in SQLite and SQL Server.
            </p>

            <h3>String escaping</h3>
            <p>
              Single quotes in strings are automatically escaped by doubling them 
              (<code>''</code>). This prevents SQL injection in the generated statements.
            </p>

            <h3>Large datasets</h3>
            <p>
              Insert statements are batched (default 100 rows per statement) 
              for better performance and to avoid query size limits.
            </p>

            <h2>Common Use Cases</h2>
            <ul>
              <li><strong>Database seeding</strong> — Initialize test/dev databases</li>
              <li><strong>Data migration</strong> — Move data from NoSQL to SQL</li>
              <li><strong>API data import</strong> — Import JSON API responses</li>
              <li><strong>Schema generation</strong> — Create tables from JSON structure</li>
            </ul>

            <h2>Related Tools</h2>
            <ul>
              <li><a href="/">JSON Validator</a> — Validate JSON before converting</li>
              <li><a href="/json-to-csv">JSON to CSV</a> — Export as CSV instead</li>
              <li><a href="/json-to-excel">JSON to Excel</a> — Export as Excel</li>
              <li><a href="/json-flatten">JSON Flatten</a> — Flatten nested objects first</li>
            </ul>

            <h2>Frequently Asked Questions</h2>
            
            <h3>Is the output safe from SQL injection?</h3>
            <p>
              The generated SQL properly escapes string values. However, always 
              review generated SQL before running on production databases, and 
              prefer parameterized queries in application code.
            </p>

            <h3>Can I convert a single JSON object?</h3>
            <p>
              Yes. Single objects are automatically wrapped in an array to 
              generate a single-row insert.
            </p>

            <h3>How are column types determined?</h3>
            <p>
              Types are inferred from the first row of data. If your data has 
              varying types, you may need to adjust the generated schema manually.
            </p>

            <h3>What about primary keys and indexes?</h3>
            <p>
              The generator creates basic column definitions. Add PRIMARY KEY, 
              UNIQUE, INDEX, and other constraints manually based on your requirements.
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
