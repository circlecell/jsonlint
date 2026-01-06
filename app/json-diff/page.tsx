import { Metadata } from 'next';
import { ToolNav } from '@/components/ToolNav';
import { JsonDiff } from './JsonDiff';

export const metadata: Metadata = {
  title: 'JSON Diff - Compare Two JSON Objects | JSONLint',
  description:
    'Compare two JSON documents and see exactly what changed. Highlights additions, deletions, and modifications with line-by-line diff view.',
};

export default function JsonDiffPage() {
  return (
    <>
      <ToolNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Top ad zone */}
        <div className="mb-4 flex justify-center">
          <div id="bsa-zone_1570746984891-3_123456"></div>
        </div>

        <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
          Paste two JSON documents below to see exactly what's different:
        </p>

        <JsonDiff />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6 mt-8">
          <div className="prose-custom">
            <h2>When to Use JSON Diff</h2>
            <p>
              JSON Diff compares two JSON documents and highlights every difference—additions, 
              deletions, and changes. It's essential when you need to:
            </p>
            <ul>
              <li>
                <strong>Debug API responses</strong> — Compare what your API returned yesterday 
                vs. today to find unexpected changes
              </li>
              <li>
                <strong>Review configuration changes</strong> — Before deploying a config update, 
                see exactly what's different
              </li>
              <li>
                <strong>Validate data transformations</strong> — Confirm your ETL pipeline 
                produces the expected output
              </li>
              <li>
                <strong>Code review JSON fixtures</strong> — Quickly spot what changed in test 
                data files
              </li>
            </ul>

            <h2>Understanding the Output</h2>
            <p>The diff view uses standard conventions:</p>
            <ul>
              <li>
                <span className="text-accent-green font-mono">+ Green lines</span> — Added in the 
                second document
              </li>
              <li>
                <span className="text-accent-red font-mono">- Red lines</span> — Removed from 
                the first document
              </li>
              <li>
                <span style={{ color: 'var(--text-muted)' }} className="font-mono">Gray lines</span> — 
                Unchanged context
              </li>
            </ul>

            <h2>Example: Comparing API Responses</h2>
            <p>Say you're debugging why a user's profile looks different. Compare the two responses:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                  Yesterday's response:
                </p>
                <pre className="text-sm">{`{
  "id": 123,
  "name": "Alice",
  "role": "admin",
  "active": true
}`}</pre>
              </div>
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                  Today's response:
                </p>
                <pre className="text-sm">{`{
  "id": 123,
  "name": "Alice",
  "role": "viewer",
  "active": true,
  "lastLogin": "2024-01-15"
}`}</pre>
              </div>
            </div>
            
            <p>
              The diff immediately shows: <code>role</code> changed from "admin" to "viewer", 
              and <code>lastLogin</code> was added.
            </p>

            <h2>Pro Tips</h2>
            <ul>
              <li>
                💡 <strong>Order doesn't matter</strong> — JSON objects are unordered by spec. 
                <code>{`{"a":1,"b":2}`}</code> equals <code>{`{"b":2,"a":1}`}</code>. 
                Our diff normalizes this.
              </li>
              <li>
                💡 <strong>Format first</strong> — For cleaner diffs, paste minified JSON 
                and let us format it. This ensures consistent indentation.
              </li>
              <li>
                💡 <strong>Use the Swap button</strong> — Quickly reverse the comparison 
                direction if you pasted in the wrong order.
              </li>
            </ul>

            <h2>Common Questions</h2>
            
            <h3>Why do two identical-looking objects show as different?</h3>
            <p>
              Usually it's whitespace or key ordering. Try clicking "Format" on both sides first. 
              If they still differ, look for subtle type differences like <code>"1"</code> (string) 
              vs <code>1</code> (number).
            </p>

            <h3>Can I compare JSON from URLs?</h3>
            <p>
              Not directly in this tool, but you can use the <a href="/">JSON Validator</a> with 
              the <code>?url=</code> parameter to fetch JSON, then copy it here.
            </p>

            <h3>Is there a size limit?</h3>
            <p>
              The diff runs entirely in your browser. Files up to a few MB work fine; 
              very large files (10MB+) may slow down the comparison.
            </p>

            <h2>Related Tools</h2>
            <ul>
              <li>
                <a href="/json-sort">JSON Sorter</a> — Sort keys before comparing for consistent diffs
              </li>
              <li>
                <a href="/">JSON Validator</a> — Validate and format JSON
              </li>
              <li>
                <a href="/json-schema">JSON Schema Validator</a> — Validate structure against a schema
              </li>
              <li>
                <a href="/json-path">JSON Path Query</a> — Extract specific values from JSON
              </li>
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
