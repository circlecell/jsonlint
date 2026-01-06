import { Metadata } from 'next';
import { ToolNav } from '@/components/ToolNav';
import { JsonMinifier } from './JsonMinifier';

export const metadata: Metadata = {
  title: 'JSON Minify - Compress JSON Online | JSONLint',
  description:
    'Minify and compress JSON by removing whitespace. Reduce file size for faster transfers and smaller payloads. Free online tool.',
};

export default function JsonMinifyPage() {
  return (
    <>
      <ToolNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-4 flex justify-center">
          <div id="bsa-zone_1570746984891-3_123456"></div>
        </div>

        <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
          Paste your JSON below to minify it by removing all whitespace:
        </p>

        <JsonMinifier />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6 mt-8">
          <div className="prose-custom">
            <h2>What is JSON Minification?</h2>
            <p>
              Minification removes all unnecessary whitespace (spaces, tabs, newlines) from JSON 
              while keeping it valid. The result is a single-line, compact string that's smaller 
              in size but functionally identical.
            </p>

            <h2>Before and After</h2>
            <p>Formatted (287 bytes):</p>
            <pre><code>{`{
  "user": {
    "name": "Alice",
    "email": "alice@example.com",
    "roles": [
      "admin",
      "editor"
    ]
  }
}`}</code></pre>

            <p>Minified (75 bytes — 74% smaller):</p>
            <pre><code>{`{"user":{"name":"Alice","email":"alice@example.com","roles":["admin","editor"]}}`}</code></pre>

            <h2>Why Minify JSON?</h2>
            <ul>
              <li>
                <strong>Smaller payloads</strong> — Reduce API response sizes by 60-80%
              </li>
              <li>
                <strong>Faster transfers</strong> — Less data = faster network transmission
              </li>
              <li>
                <strong>Lower storage costs</strong> — Store more data in less space
              </li>
              <li>
                <strong>Bandwidth savings</strong> — Especially important for mobile users
              </li>
            </ul>

            <h2>When to Minify</h2>
            <table>
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th>Minify?</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Production API responses</td>
                  <td>✅ Yes</td>
                </tr>
                <tr>
                  <td>Storing in databases</td>
                  <td>✅ Yes (usually)</td>
                </tr>
                <tr>
                  <td>Config files in version control</td>
                  <td>❌ No (readability matters)</td>
                </tr>
                <tr>
                  <td>Development/debugging</td>
                  <td>❌ No</td>
                </tr>
                <tr>
                  <td>Log files</td>
                  <td>✅ Yes (saves disk space)</td>
                </tr>
              </tbody>
            </table>

            <h2>Minification vs Compression</h2>
            <p>
              Minification and compression (gzip, brotli) are complementary:
            </p>
            <ul>
              <li>
                <strong>Minification</strong> — Removes whitespace, ~60-80% reduction
              </li>
              <li>
                <strong>Compression</strong> — Algorithmic compression, ~70-90% additional reduction
              </li>
              <li>
                <strong>Both together</strong> — Best results, up to 95% size reduction
              </li>
            </ul>
            <p>
              Most web servers apply gzip/brotli automatically. Minifying first gives 
              compression algorithms less redundant data to work with.
            </p>

            <h2>Programmatic Minification</h2>
            
            <h3>JavaScript</h3>
            <pre><code>{`// Minify JSON string
const minified = JSON.stringify(JSON.parse(jsonString));

// Or from an object
const minified = JSON.stringify(data);`}</code></pre>

            <h3>Python</h3>
            <pre><code>{`import json

# From string
minified = json.dumps(json.loads(json_string), separators=(',', ':'))

# From object
minified = json.dumps(data, separators=(',', ':'))`}</code></pre>

            <h3>Command Line (with jq)</h3>
            <pre><code>{`# Minify a file
jq -c '.' data.json > data.min.json

# Minify from stdin
echo '{"a": 1}' | jq -c '.'`}</code></pre>

            <h2>Pro Tips</h2>
            <ul>
              <li>
                💡 <strong>Validate first</strong> — Use the <a href="/">JSON Validator</a> before 
                minifying to catch errors
              </li>
              <li>
                💡 <strong>Keep originals</strong> — Store formatted JSON in source control, 
                minify during build/deploy
              </li>
              <li>
                💡 <strong>Enable compression</strong> — Configure your server to gzip JSON responses 
                for maximum savings
              </li>
            </ul>

            <h2>Limitations</h2>
            <p>
              Minification only removes whitespace. It doesn't:
            </p>
            <ul>
              <li>Shorten key names (that would break your code)</li>
              <li>Remove duplicate data</li>
              <li>Apply semantic compression</li>
            </ul>
            <p>
              For those optimizations, consider restructuring your data or using a 
              binary format like Protocol Buffers or MessagePack.
            </p>

            <h2>Related Tools</h2>
            <ul>
              <li><a href="/json-pretty-print">JSON Pretty Print</a> — Format minified JSON for readability</li>
              <li><a href="/">JSON Validator</a> — Validate and format JSON</li>
              <li><a href="/json-diff">JSON Diff</a> — Compare minified vs formatted</li>
              <li><a href="/json-stringify">JSON Stringify</a> — Escape JSON for embedding</li>
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
