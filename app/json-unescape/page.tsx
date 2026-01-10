import { Metadata } from 'next';
import { ToolNav } from '@/components/ToolNav';
import { Container } from '@/components/Container';
import { JsonUnescaper } from './JsonUnescaper';

export const metadata: Metadata = {
  title: 'JSON Unescape - Unescape JSON Strings Online | JSONLint',
  description:
    'Unescape JSON strings instantly. Convert escaped backslashes, quotes, and special characters back to readable JSON. Free online tool.',
};

export default function JsonUnescapePage() {
  return (
    <>
      <ToolNav />

      <Container className="py-4">
        <div className="mb-4 flex justify-center">
          <div id="bsa-zone_1570746984891-3_123456"></div>
        </div>

        <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
          Paste your escaped JSON string below to convert it back to readable JSON:
        </p>

        <JsonUnescaper />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6 mt-8">
          <div className="prose-custom">
            <h2>What is JSON Escaping?</h2>
            <p>
              When JSON is embedded inside a string (like in a database field or API response), 
              special characters must be escaped with backslashes. This tool converts those 
              escaped strings back to readable, valid JSON.
            </p>

            <h2>Example</h2>
            <p>Escaped JSON string:</p>
            <pre><code>{`"{\\\"name\\\":\\\"John\\\",\\\"age\\\":30}"`}</code></pre>

            <p>Unescaped JSON:</p>
            <pre><code>{`{
  "name": "John",
  "age": 30
}`}</code></pre>

            <h2>Common Escape Sequences</h2>
            <table>
              <thead>
                <tr>
                  <th>Escaped</th>
                  <th>Unescaped</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>\\&quot;</code></td>
                  <td><code>&quot;</code></td>
                  <td>Double quote</td>
                </tr>
                <tr>
                  <td><code>\\\\</code></td>
                  <td><code>\\</code></td>
                  <td>Backslash</td>
                </tr>
                <tr>
                  <td><code>\\n</code></td>
                  <td>newline</td>
                  <td>Line feed</td>
                </tr>
                <tr>
                  <td><code>\\r</code></td>
                  <td>return</td>
                  <td>Carriage return</td>
                </tr>
                <tr>
                  <td><code>\\t</code></td>
                  <td>tab</td>
                  <td>Horizontal tab</td>
                </tr>
                <tr>
                  <td><code>\\uXXXX</code></td>
                  <td>unicode</td>
                  <td>Unicode character</td>
                </tr>
              </tbody>
            </table>

            <h2>Why Does This Happen?</h2>
            <p>JSON gets double-escaped in several common scenarios:</p>
            <ul>
              <li>
                <strong>Database storage</strong> — JSON stored as a text column needs escaping
              </li>
              <li>
                <strong>API responses</strong> — JSON embedded in another JSON string
              </li>
              <li>
                <strong>Logging</strong> — Log systems often escape JSON for single-line output
              </li>
              <li>
                <strong>Message queues</strong> — Kafka, RabbitMQ often stringify JSON payloads
              </li>
              <li>
                <strong>Environment variables</strong> — Complex config stored as escaped strings
              </li>
            </ul>

            <h2>Programmatic Solutions</h2>
            
            <h3>JavaScript</h3>
            <pre><code>{`// Unescape a JSON string
const escaped = '{"name":"John","age":30}';
const unescaped = JSON.parse(escaped);

// If double-escaped (string within string)
const doubleEscaped = '"{\\"name\\":\\"John\\"}"';
const parsed = JSON.parse(JSON.parse(doubleEscaped));`}</code></pre>

            <h3>Python</h3>
            <pre><code>{`import json

# Unescape a JSON string
escaped = r'{"name":"John","age":30}'
unescaped = json.loads(escaped)

# If double-escaped
double_escaped = r'"{\"name\":\"John\"}"'
parsed = json.loads(json.loads(double_escaped))`}</code></pre>

            <h3>Command Line (with jq)</h3>
            <pre><code>{`# Parse escaped JSON
echo '"{\\\"name\\\":\\\"John\\\"}"' | jq -r '.' | jq '.'`}</code></pre>

            <h2>Escape Mode</h2>
            <p>
              This tool also works in reverse. Use <strong>Escape</strong> mode to convert 
              JSON into an escaped string for embedding in:
            </p>
            <ul>
              <li>JavaScript string literals</li>
              <li>JSON string values</li>
              <li>Database text fields</li>
              <li>Environment variables</li>
            </ul>

            <h2>Pro Tips</h2>
            <ul>
              <li>
                💡 <strong>Multiple layers</strong> — If one unescape doesn't work, 
                the JSON might be double or triple escaped. Run it multiple times.
              </li>
              <li>
                💡 <strong>Check the quotes</strong> — Properly escaped JSON strings 
                are usually wrapped in outer quotes.
              </li>
              <li>
                💡 <strong>Validate after</strong> — Use the <a href="/">JSON Validator</a> to 
                ensure the unescaped result is valid JSON.
              </li>
            </ul>

            <h2>Related Tools</h2>
            <ul>
              <li><a href="/json-escape">JSON Escape</a> — Convert raw text to escaped JSON strings</li>
              <li><a href="/">JSON Validator</a> — Validate your unescaped JSON</li>
              <li><a href="/json-stringify">JSON Stringify</a> — Similar escaping functionality</li>
              <li><a href="/json-minify">JSON Minify</a> — Compact JSON for storage</li>
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
