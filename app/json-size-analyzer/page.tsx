import { Metadata } from 'next';
import { ToolNav } from '@/components/ToolNav';
import { Container } from '@/components/Container';
import { SizeAnalyzer } from './SizeAnalyzer';

export const metadata: Metadata = {
  title: 'JSON Size Analyzer - Analyze JSON Structure & Complexity | JSONLint',
  description:
    'Analyze JSON size, structure, and complexity. See type distribution, depth analysis, largest nodes, and optimization opportunities.',
  keywords: [
    'json size',
    'json analyzer',
    'json structure',
    'json complexity',
    'json depth',
    'json stats',
    'json optimization',
    'json profiler',
  ],
  openGraph: {
    title: 'JSON Size & Structure Analyzer',
    description: 'Analyze JSON size, structure, depth, and find optimization opportunities.',
  },
};

export default function JsonSizeAnalyzerPage() {
  return (
    <>
      <ToolNav />

      <Container className="py-4">
        <div className="mb-4 flex justify-center">
          <div id="bsa-zone_1570746984891-3_123456"></div>
        </div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          JSON Size & Structure Analyzer
        </h1>
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
          Get detailed insights into your JSON structure. Analyze size, depth, type distribution, 
          and find optimization opportunities.
        </p>

        <SizeAnalyzer />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6 mt-8">
          <div className="prose-custom">
            <h2>Understanding JSON Size</h2>
            <p>
              JSON file size matters for performance. Large JSON payloads affect:
            </p>
            <ul>
              <li><strong>Network transfer time</strong> — Bigger files take longer to download</li>
              <li><strong>Parse time</strong> — Complex structures take longer to parse</li>
              <li><strong>Memory usage</strong> — Large objects consume more RAM</li>
              <li><strong>API costs</strong> — Many services charge by data transfer</li>
            </ul>

            <h2>Metrics Explained</h2>
            
            <h3>Size Metrics</h3>
            <table>
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Current size</td>
                  <td>Size of your input as-is (may include whitespace)</td>
                </tr>
                <tr>
                  <td>Minified</td>
                  <td>Size with all whitespace removed</td>
                </tr>
                <tr>
                  <td>Pretty printed</td>
                  <td>Size with standard 2-space indentation</td>
                </tr>
                <tr>
                  <td>Compression potential</td>
                  <td>% savings from minification</td>
                </tr>
              </tbody>
            </table>

            <h3>Structure Metrics</h3>
            <table>
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Max depth</td>
                  <td>Deepest nesting level (0 = flat)</td>
                </tr>
                <tr>
                  <td>Total values</td>
                  <td>Count of all primitive and container values</td>
                </tr>
                <tr>
                  <td>Total keys</td>
                  <td>Number of object keys (including duplicates)</td>
                </tr>
                <tr>
                  <td>Unique keys</td>
                  <td>Number of distinct key names</td>
                </tr>
              </tbody>
            </table>

            <h2>Interpreting Results</h2>
            
            <h3>High Compression Potential (&gt;30%)</h3>
            <p>
              If your JSON has more than 30% compression potential, it's probably pretty-printed 
              with lots of whitespace. Consider:
            </p>
            <ul>
              <li>Minifying for production API responses</li>
              <li>Enabling gzip compression on your server</li>
              <li>The trade-off: readability vs. size</li>
            </ul>

            <h3>Deep Nesting (depth &gt; 5)</h3>
            <p>
              Deeply nested JSON can indicate:
            </p>
            <ul>
              <li>Complex data models that might be hard to work with</li>
              <li>Potential for flattening to improve access patterns</li>
              <li>Recursion risks when processing</li>
            </ul>

            <h3>Many Duplicate Keys</h3>
            <p>
              When total keys is much higher than unique keys, you have repeated structures. 
              This is common in arrays of objects and is usually fine, but consider:
            </p>
            <ul>
              <li>Shortening frequently-used key names</li>
              <li>Using arrays instead of repeated objects for tabular data</li>
            </ul>

            <h2>Optimization Strategies</h2>
            
            <h3>1. Minify for Production</h3>
            <pre><code>{`// Before: 156 bytes
{
  "name": "John",
  "age": 30
}

// After: 24 bytes (85% smaller!)
{"name":"John","age":30}`}</code></pre>
            <p>
              Use our <a href="/json-minify">JSON Minify tool</a> to compress your JSON.
            </p>

            <h3>2. Shorten Key Names</h3>
            <pre><code>{`// Before
{"firstName": "John", "lastName": "Doe"}

// After
{"fn": "John", "ln": "Doe"}`}</code></pre>
            <p>
              In arrays with many objects, shorter keys provide significant savings.
            </p>

            <h3>3. Remove Unnecessary Data</h3>
            <ul>
              <li>Remove null/empty values when they're optional</li>
              <li>Omit default values that can be assumed</li>
              <li>Remove debugging/internal fields before sending to clients</li>
            </ul>

            <h3>4. Use Arrays for Tabular Data</h3>
            <pre><code>{`// Before: Keys repeated for each object
[
  {"name": "Alice", "age": 30},
  {"name": "Bob", "age": 25}
]

// After: Keys specified once
{
  "columns": ["name", "age"],
  "rows": [["Alice", 30], ["Bob", 25]]
}`}</code></pre>

            <h3>5. Enable Server Compression</h3>
            <p>
              Most production savings come from HTTP compression (gzip/brotli), not JSON 
              minification. A 100KB JSON file might compress to 10KB over the wire.
            </p>

            <h2>Size Guidelines</h2>
            <table>
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Typical Use Case</th>
                  <th>Concerns</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>&lt;10 KB</td>
                  <td>API responses, configs</td>
                  <td>None — this is ideal</td>
                </tr>
                <tr>
                  <td>10-100 KB</td>
                  <td>Data exports, larger responses</td>
                  <td>Consider pagination</td>
                </tr>
                <tr>
                  <td>100 KB - 1 MB</td>
                  <td>Bulk data transfers</td>
                  <td>Use streaming, compression</td>
                </tr>
                <tr>
                  <td>&gt;1 MB</td>
                  <td>Data dumps, backups</td>
                  <td>Consider alternative formats</td>
                </tr>
              </tbody>
            </table>

            <h2>Related Tools</h2>
            <ul>
              <li><a href="/json-minify">JSON Minify</a> — Compress JSON by removing whitespace</li>
              <li><a href="/json-tree">JSON Tree View</a> — Visualize JSON structure</li>
              <li><a href="/json-flatten">JSON Flatten</a> — Convert nested to flat structure</li>
              <li><a href="/json-token-counter">Token Counter</a> — Count tokens for LLM use</li>
            </ul>

            <h2>Frequently Asked Questions</h2>
            
            <h3>What's a good max depth?</h3>
            <p>
              For most APIs, 3-5 levels is typical. Deeper than 7-8 levels often indicates 
              overly complex data models. However, some domains (like file systems or 
              organizational hierarchies) naturally require deep nesting.
            </p>

            <h3>Does whitespace affect parse time?</h3>
            <p>
              Slightly, but the difference is usually negligible. The main benefit of 
              minification is reduced transfer size, not parse speed.
            </p>

            <h3>Why analyze JSON size?</h3>
            <p>
              Understanding your JSON structure helps you make informed decisions about 
              optimization, identify potential performance issues, and ensure your data 
              models are appropriate for your use case.
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
