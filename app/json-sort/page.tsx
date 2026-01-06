import { Metadata } from 'next';
import { ToolNav } from '@/components/ToolNav';
import { JsonSorter } from './JsonSorter';

export const metadata: Metadata = {
  title: 'JSON Sorter - Sort Keys Alphabetically Online | JSONLint',
  description:
    'Sort JSON keys alphabetically with our free online tool. Supports nested objects, ascending/descending order, and case-insensitive sorting.',
};

export default function JsonSortPage() {
  return (
    <>
      <ToolNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-4 flex justify-center">
          <div id="bsa-zone_1570746984891-3_123456"></div>
        </div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          JSON Sorter
        </h1>
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
          Sort JSON object keys alphabetically. Paste your JSON and configure sorting options:
        </p>

        <JsonSorter />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6 mt-8">
          <div className="prose-custom">
            <h2>Why Sort JSON Keys?</h2>
            <p>
              Sorting JSON keys alphabetically provides several benefits for developers 
              and teams working with JSON data:
            </p>
            <ul>
              <li>
                <strong>Easier comparison</strong> — Sorted keys make it easy to diff two JSON files 
                and spot differences
              </li>
              <li>
                <strong>Consistent output</strong> — APIs and tools produce predictable JSON regardless 
                of insertion order
              </li>
              <li>
                <strong>Better readability</strong> — Alphabetical organization helps you find keys quickly
              </li>
              <li>
                <strong>Version control friendly</strong> — Reduces noise in git diffs when JSON changes
              </li>
              <li>
                <strong>Testing</strong> — Makes snapshot testing more reliable
              </li>
            </ul>

            <h2>Sort Options Explained</h2>
            
            <h3>Ascending vs Descending</h3>
            <p>
              <strong>Ascending (A→Z)</strong> sorts keys from a to z. Most common choice.<br />
              <strong>Descending (Z→A)</strong> sorts keys from z to a.
            </p>

            <h3>Recursive Sorting</h3>
            <p>
              When enabled, nested objects are also sorted. The tool traverses the entire 
              JSON structure and sorts keys at every level.
            </p>
            <pre><code>{`// Before (recursive enabled)
{
  "zebra": { "z": 1, "a": 2 },
  "apple": { "b": 3, "a": 4 }
}

// After
{
  "apple": { "a": 4, "b": 3 },
  "zebra": { "a": 2, "z": 1 }
}`}</code></pre>

            <h3>Case Insensitive</h3>
            <p>
              By default, uppercase letters sort before lowercase (ASCII order). 
              Enable case-insensitive sorting to ignore case:
            </p>
            <pre><code>{`// Case sensitive (default)
"Apple", "Zebra", "apple" → "Apple", "Zebra", "apple"

// Case insensitive
"Apple", "Zebra", "apple" → "Apple", "apple", "Zebra"`}</code></pre>

            <h3>Sort Array Values</h3>
            <p>
              When enabled, arrays containing primitive values (strings, numbers) are also sorted. 
              Arrays of objects are not reordered — only their internal keys are sorted.
            </p>
            <pre><code>{`// Sort array values enabled
{ "tags": ["zebra", "apple", "mango"] }
→ { "tags": ["apple", "mango", "zebra"] }`}</code></pre>

            <h2>Example</h2>
            <p>Input JSON:</p>
            <pre><code>{`{
  "name": "John",
  "age": 30,
  "address": {
    "zip": "10001",
    "city": "New York"
  }
}`}</code></pre>

            <p>Sorted output:</p>
            <pre><code>{`{
  "address": {
    "city": "New York",
    "zip": "10001"
  },
  "age": 30,
  "name": "John"
}`}</code></pre>

            <h2>Sorting in Code</h2>
            
            <h3>JavaScript</h3>
            <pre><code>{`function sortObject(obj) {
  if (Array.isArray(obj)) {
    return obj.map(sortObject);
  }
  if (typeof obj === 'object' && obj !== null) {
    return Object.keys(obj)
      .sort()
      .reduce((sorted, key) => {
        sorted[key] = sortObject(obj[key]);
        return sorted;
      }, {});
  }
  return obj;
}

const sorted = sortObject(myJson);`}</code></pre>

            <h3>Python</h3>
            <pre><code>{`import json

def sort_json(obj):
    if isinstance(obj, dict):
        return {k: sort_json(v) for k, v in sorted(obj.items())}
    if isinstance(obj, list):
        return [sort_json(item) for item in obj]
    return obj

sorted_data = sort_json(data)
print(json.dumps(sorted_data, indent=2))`}</code></pre>

            <h3>Command Line (jq)</h3>
            <pre><code>{`# Sort keys recursively
jq -S '.' input.json > sorted.json`}</code></pre>

            <h2>Use Cases</h2>
            
            <h3>Comparing API Responses</h3>
            <p>
              APIs may return keys in different orders. Sort both responses before comparing 
                to focus on actual data differences.
            </p>

            <h3>Configuration Files</h3>
            <p>
              Keep configuration files sorted for easier maintenance and cleaner version history.
            </p>

            <h3>Test Fixtures</h3>
            <p>
              Sorted test data makes snapshot tests more stable and failures easier to diagnose.
            </p>

            <h2>Does Sorting Change the Data?</h2>
            <p>
              No! Sorting only changes the order of keys in objects. All values, data types, 
              and structure remain identical. JSON objects are unordered by specification, 
              so the sorted version is semantically equivalent.
            </p>
            <p>
              However, note that array order IS significant. The "Sort array values" option 
              is disabled by default because reordering array elements could change your data's meaning.
            </p>

            <h2>Related Tools</h2>
            <ul>
              <li><a href="/json-diff">JSON Diff</a> — Compare two JSON files after sorting</li>
              <li><a href="/">JSON Validator</a> — Validate your JSON</li>
              <li><a href="/json-minify">JSON Minify</a> — Compress after sorting</li>
              <li><a href="/json-pretty-print">JSON Pretty Print</a> — Format with sorting</li>
            </ul>

            <h2>Frequently Asked Questions</h2>
            
            <h3>Does sorting change the JSON data?</h3>
            <p>
              No. Object key order is not significant in JSON. The sorted version contains 
              exactly the same data, just with keys in alphabetical order.
            </p>

            <h3>How are nested objects handled?</h3>
            <p>
              Enable "Recursive" to sort keys in nested objects too. When disabled, only 
              top-level keys are sorted.
            </p>

            <h3>Can I sort array values?</h3>
            <p>
              Yes, enable "Sort array values" to sort arrays of primitives (strings, numbers). 
              Arrays of objects are not reordered.
            </p>

            <h3>What about numeric keys?</h3>
            <p>
              Numeric keys are sorted as strings by default. "10" comes before "2" alphabetically. 
              If you need numeric sorting, you'll need custom code.
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
