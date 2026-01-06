import { Metadata } from 'next';
import { ToolNav } from '@/components/ToolNav';
import { JsonFlattener } from './JsonFlattener';

export const metadata: Metadata = {
  title: 'JSON Flatten - Flatten Nested JSON Online | JSONLint',
  description:
    'Flatten nested JSON objects into single-level key-value pairs. Unflatten back to nested structure. Free online tool.',
};

export default function JsonFlattenPage() {
  return (
    <>
      <ToolNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-4 flex justify-center">
          <div id="bsa-zone_1570746984891-3_123456"></div>
        </div>

        <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
          Flatten nested JSON to a single level, or unflatten back to nested structure:
        </p>

        <JsonFlattener />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6 mt-8">
          <div className="prose-custom">
            <h2>What is JSON Flattening?</h2>
            <p>
              Flattening converts a nested JSON structure into a single-level object where 
              nested keys are joined with a delimiter. This is useful for data processing, 
              database storage, and CSV export.
            </p>

            <h2>Example</h2>
            <p>Nested JSON:</p>
            <pre><code>{`{
  "user": {
    "name": "John",
    "address": {
      "city": "Boston"
    }
  }
}`}</code></pre>

            <p>Flattened (with dot delimiter):</p>
            <pre><code>{`{
  "user.name": "John",
  "user.address.city": "Boston"
}`}</code></pre>

            <h2>Array Handling</h2>
            <p>Arrays are flattened with bracket notation:</p>
            <pre><code>{`// Input
{
  "tags": ["javascript", "typescript"],
  "users": [
    { "name": "Alice" },
    { "name": "Bob" }
  ]
}

// Output
{
  "tags[0]": "javascript",
  "tags[1]": "typescript",
  "users[0].name": "Alice",
  "users[1].name": "Bob"
}`}</code></pre>

            <h2>Delimiter Options</h2>
            <table>
              <thead>
                <tr>
                  <th>Delimiter</th>
                  <th>Example Key</th>
                  <th>Use Case</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>.</code> (dot)</td>
                  <td><code>user.address.city</code></td>
                  <td>Most common, JavaScript-like</td>
                </tr>
                <tr>
                  <td><code>/</code> (slash)</td>
                  <td><code>user/address/city</code></td>
                  <td>Path-like, Firebase RTDB</td>
                </tr>
                <tr>
                  <td><code>_</code> (underscore)</td>
                  <td><code>user_address_city</code></td>
                  <td>Environment variables</td>
                </tr>
                <tr>
                  <td><code>__</code> (double)</td>
                  <td><code>user__address__city</code></td>
                  <td>Avoids conflicts with underscores</td>
                </tr>
              </tbody>
            </table>

            <h2>Common Use Cases</h2>
            <ul>
              <li>
                <strong>CSV export</strong> — Flatten before converting to CSV for 
                spreadsheet-friendly data
              </li>
              <li>
                <strong>Search indexing</strong> — Elasticsearch and other search engines 
                work better with flat documents
              </li>
              <li>
                <strong>Key-value stores</strong> — Redis, DynamoDB, and similar databases
              </li>
              <li>
                <strong>Environment variables</strong> — Config management systems
              </li>
              <li>
                <strong>Form data</strong> — HTML form serialization
              </li>
            </ul>

            <h2>Unflatten</h2>
            <p>
              The reverse operation reconstructs nested objects from flattened keys. 
              Use this when you need to restore the original structure after processing.
            </p>

            <h2>Programmatic Flattening</h2>
            
            <h3>JavaScript</h3>
            <pre><code>{`function flatten(obj, prefix = '', delimiter = '.') {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const newKey = prefix ? \`\${prefix}\${delimiter}\${key}\` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(acc, flatten(value, newKey, delimiter));
    } else {
      acc[newKey] = value;
    }
    
    return acc;
  }, {});
}`}</code></pre>

            <h3>Python</h3>
            <pre><code>{`def flatten(obj, prefix='', delimiter='.'):
    result = {}
    for key, value in obj.items():
        new_key = f"{prefix}{delimiter}{key}" if prefix else key
        if isinstance(value, dict):
            result.update(flatten(value, new_key, delimiter))
        else:
            result[new_key] = value
    return result`}</code></pre>

            <h3>Command Line (with jq)</h3>
            <pre><code>{`# Flatten with jq (recursive)
jq '[paths(scalars) as $p | {"key": $p | join("."), "value": getpath($p)}] | from_entries' data.json`}</code></pre>

            <h2>Pro Tips</h2>
            <ul>
              <li>
                💡 <strong>Choose delimiter wisely</strong> — If your keys contain dots, 
                use a different delimiter to avoid confusion
              </li>
              <li>
                💡 <strong>Preserve array indices</strong> — The bracket notation preserves 
                order when unflattening
              </li>
              <li>
                💡 <strong>Use with CSV</strong> — Flatten first, then use 
                <a href="/json-to-csv">JSON to CSV</a> for spreadsheet export
              </li>
            </ul>

            <h2>Related Tools</h2>
            <ul>
              <li><a href="/json-to-csv">JSON to CSV</a> — Export flattened data to CSV</li>
              <li><a href="/json-path">JSON Path</a> — Query nested JSON data</li>
              <li><a href="/">JSON Validator</a> — Validate your JSON</li>
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
