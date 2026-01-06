import { Metadata } from 'next';
import { ToolNav } from '@/components/ToolNav';
import { MarkdownConverter } from './MarkdownConverter';

export const metadata: Metadata = {
  title: 'JSON to Markdown Table - Convert JSON Arrays to Tables | JSONLint',
  description:
    'Convert JSON arrays to Markdown tables instantly. Perfect for documentation, README files, and GitHub. Free online converter.',
};

export default function JsonToMarkdownPage() {
  return (
    <>
      <ToolNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-4 flex justify-center">
          <div id="bsa-zone_1570746984891-3_123456"></div>
        </div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          JSON to Markdown Table
        </h1>
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
          Convert JSON arrays to Markdown tables for documentation and README files:
        </p>

        <MarkdownConverter />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6 mt-8">
          <div className="prose-custom">
            <h2>About Markdown Tables</h2>
            <p>
              Markdown tables are a simple way to display tabular data in documentation, 
              README files, GitHub issues, and other Markdown-compatible platforms.
            </p>

            <h2>Example Output</h2>
            <p>Given this JSON:</p>
            <pre><code>{`[
  {"name": "Alice", "role": "Admin", "active": true},
  {"name": "Bob", "role": "User", "active": false}
]`}</code></pre>
            
            <p>You get this Markdown:</p>
            <pre><code>{`| name | role | active |
|------|------|--------|
| Alice | Admin | true |
| Bob | User | false |`}</code></pre>

            <p>Which renders as:</p>
            <table>
              <thead>
                <tr><th>name</th><th>role</th><th>active</th></tr>
              </thead>
              <tbody>
                <tr><td>Alice</td><td>Admin</td><td>true</td></tr>
                <tr><td>Bob</td><td>User</td><td>false</td></tr>
              </tbody>
            </table>

            <h2>Supported JSON Structures</h2>
            <ul>
              <li><strong>Array of objects</strong> — Most common, each object becomes a row</li>
              <li><strong>Nested values</strong> — Automatically stringified</li>
              <li><strong>Mixed types</strong> — Strings, numbers, booleans all supported</li>
            </ul>

            <h2>Column Alignment</h2>
            <p>
              Markdown supports column alignment using colons in the separator row:
            </p>
            <pre><code>{`| Left | Center | Right |
|:-----|:------:|------:|
| a    | b      | c     |`}</code></pre>

            <h2>Use Cases</h2>
            <ul>
              <li><strong>API Documentation</strong> — Document request/response formats</li>
              <li><strong>README files</strong> — Display configuration options</li>
              <li><strong>GitHub Issues</strong> — Present data clearly in tickets</li>
              <li><strong>Technical specs</strong> — List features or requirements</li>
              <li><strong>Database schemas</strong> — Document table structures</li>
            </ul>

            <h2>Limitations</h2>
            <ul>
              <li>Markdown tables don&apos;t support cell merging</li>
              <li>No built-in sorting or filtering</li>
              <li>Complex nested objects shown as JSON strings</li>
              <li>Very wide tables may not render well</li>
            </ul>

            <h2>Related Tools</h2>
            <ul>
              <li><a href="/json-to-csv">JSON to CSV</a> — Convert to spreadsheet format</li>
              <li><a href="/json-to-table">JSON Table Viewer</a> — Interactive HTML table</li>
              <li><a href="/">JSON Validator</a> — Validate your JSON first</li>
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
