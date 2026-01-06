import { Metadata } from 'next';
import { ToolNav } from '@/components/ToolNav';
import { JsonPrettyPrinter } from './JsonPrettyPrinter';

export const metadata: Metadata = {
  title: 'JSON Pretty Print - Format & Beautify JSON Online | JSONLint',
  description:
    'Pretty print JSON instantly with our free online formatter. Customize indentation, sort keys, and beautify minified JSON. No signup required.',
};

export default function JsonPrettyPrintPage() {
  return (
    <>
      <ToolNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-4 flex justify-center">
          <div id="bsa-zone_1570746984891-3_123456"></div>
        </div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          JSON Pretty Print
        </h1>
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
          Format and beautify minified JSON. Paste your JSON below:
        </p>

        <JsonPrettyPrinter />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6 mt-8">
          <div className="prose-custom">
            <h2>What is Pretty Printing?</h2>
            <p>
              Pretty printing (also called beautifying) adds whitespace, indentation, and 
              line breaks to JSON to make it human-readable. Minified JSON saves bandwidth 
              but is nearly impossible to read. Pretty printing solves this.
            </p>

            <h3>Before (minified)</h3>
            <pre><code>{`{"name":"John","age":30,"address":{"city":"New York","zip":"10001"}}`}</code></pre>

            <h3>After (pretty printed)</h3>
            <pre><code>{`{
  "name": "John",
  "age": 30,
  "address": {
    "city": "New York",
    "zip": "10001"
  }
}`}</code></pre>

            <h2>How to Use</h2>
            <ol>
              <li><strong>Paste your JSON</strong> — Minified or already formatted</li>
              <li><strong>Choose indentation</strong> — 2 spaces (common), 4 spaces, or 1 space</li>
              <li><strong>Optional: Sort keys</strong> — Alphabetize object keys</li>
              <li><strong>Copy or download</strong> — Use the formatted result</li>
            </ol>
            <p>
              The tool formats automatically as you type. You can also click "Format JSON" 
              to manually trigger formatting.
            </p>

            <h2>Formatting Options</h2>
            
            <h3>Indentation</h3>
            <ul>
              <li><strong>2 spaces</strong> — Most common, used by JavaScript/TypeScript projects</li>
              <li><strong>4 spaces</strong> — Common in Java, Python, and some style guides</li>
              <li><strong>1 space</strong> — Compact but readable</li>
            </ul>
            <p>
              The JSON specification doesn't mandate any particular indentation. Choose what 
              matches your project's style guide or personal preference.
            </p>

            <h3>Sort Keys</h3>
            <p>
              Enable "Sort keys alphabetically" to reorder object keys A-Z. This helps with:
            </p>
            <ul>
              <li>Comparing two JSON files (consistent ordering)</li>
              <li>Finding specific keys quickly</li>
              <li>Cleaner version control diffs</li>
            </ul>
            <p>
              For more sorting options, try our dedicated <a href="/json-sort">JSON Sorter</a>.
            </p>

            <h2>Pretty Print in Code</h2>
            <p>
              Most JSON libraries support pretty printing. Here's how to do it programmatically:
            </p>

            <h3>JavaScript</h3>
            <pre><code>{`// Format with 2-space indentation
const formatted = JSON.stringify(obj, null, 2);

// The third argument is the indent:
// - number: spaces (2, 4, etc.)
// - string: literal indent ("\\t" for tabs)`}</code></pre>

            <h3>Python</h3>
            <pre><code>{`import json

# Format with 2-space indentation
formatted = json.dumps(obj, indent=2)

# With sorted keys
formatted = json.dumps(obj, indent=2, sort_keys=True)`}</code></pre>

            <h3>Command Line (jq)</h3>
            <pre><code>{`# Pretty print a file
cat data.json | jq '.'

# Pretty print with sorted keys
cat data.json | jq -S '.'`}</code></pre>

            <h2>Why Pretty Print JSON?</h2>
            <ul>
              <li>
                <strong>Debugging</strong> — Quickly understand API responses and data structures
              </li>
              <li>
                <strong>Documentation</strong> — Create readable examples for docs and tutorials
              </li>
              <li>
                <strong>Code review</strong> — Make JSON changes easier to review
              </li>
              <li>
                <strong>Learning</strong> — Understand nested structures visually
              </li>
              <li>
                <strong>Configuration</strong> — Keep config files readable
              </li>
            </ul>

            <h2>Pretty Print vs Minify</h2>
            <p>
              These are opposite operations:
            </p>
            <table>
              <thead>
                <tr>
                  <th>Pretty Print</th>
                  <th>Minify</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Adds whitespace</td>
                  <td>Removes whitespace</td>
                </tr>
                <tr>
                  <td>Human-readable</td>
                  <td>Machine-optimized</td>
                </tr>
                <tr>
                  <td>Larger file size</td>
                  <td>Smaller file size</td>
                </tr>
                <tr>
                  <td>For development/debugging</td>
                  <td>For production/transfer</td>
                </tr>
              </tbody>
            </table>
            <p>
              Need to compress JSON instead? Use our <a href="/json-minify">JSON Minify</a> tool.
            </p>

            <h2>Related Tools</h2>
            <ul>
              <li><a href="/">JSON Validator</a> — Validate and format JSON with error detection</li>
              <li><a href="/json-minify">JSON Minify</a> — Compress JSON by removing whitespace</li>
              <li><a href="/json-sort">JSON Sorter</a> — Sort keys with more options</li>
              <li><a href="/benefits-of-using-a-json-beautifier">Benefits of JSON Beautification</a> — Learn more</li>
            </ul>

            <h2>Frequently Asked Questions</h2>
            
            <h3>What's the difference between pretty print and beautify?</h3>
            <p>
              Nothing — they're the same thing. "Pretty print," "beautify," and "format" 
              all refer to adding indentation and line breaks to make JSON readable.
            </p>

            <h3>Does pretty printing change the data?</h3>
            <p>
              No. Pretty printing only adds whitespace. The actual data (keys, values, 
              structure) remains identical. The formatted JSON is semantically equivalent 
              to the minified version.
            </p>

            <h3>What indentation should I use?</h3>
            <p>
              2 spaces is the most common convention, especially in JavaScript ecosystems. 
              Use 4 spaces if your project style guide requires it. The choice is purely 
              cosmetic — it doesn't affect the data.
            </p>

            <h3>Can I pretty print invalid JSON?</h3>
            <p>
              No. The JSON must be valid to be formatted. If you have invalid JSON, 
              this tool will show an error message indicating what's wrong. Fix the 
              syntax error first, then format.
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
