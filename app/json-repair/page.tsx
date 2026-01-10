import { Metadata } from 'next';
import { ToolNav } from '@/components/ToolNav';
import { Container } from '@/components/Container';
import { JsonRepairer } from './JsonRepairer';

export const metadata: Metadata = {
  title: 'JSON Repair - Fix Broken JSON Online | JSONLint',
  description:
    'Automatically repair broken JSON. Fix trailing commas, single quotes, unquoted keys, missing brackets, and malformed LLM outputs. Free online tool.',
  keywords: [
    'json repair',
    'fix json',
    'broken json',
    'invalid json',
    'json fixer',
    'trailing comma',
    'chatgpt json',
    'llm json output',
    'malformed json',
  ],
  openGraph: {
    title: 'JSON Repair - Fix Broken JSON Online',
    description: 'Automatically repair broken JSON with intelligent fixes for common issues.',
  },
};

export default function JsonRepairPage() {
  return (
    <>
      <ToolNav />

      <Container className="py-4">
        <div className="mb-4 flex justify-center">
          <div id="bsa-zone_1570746984891-3_123456"></div>
        </div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          JSON Repair Tool
        </h1>
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
          Automatically fix common JSON issues. Perfect for cleaning up LLM outputs, 
          copy-pasted code, or hand-edited configuration files.
        </p>

        <JsonRepairer />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6 mt-8">
          <div className="prose-custom">
            <h2>What is JSON Repair?</h2>
            <p>
              JSON Repair automatically fixes common syntax errors that make JSON invalid. Unlike 
              a validator that just tells you something is wrong, this tool actually <strong>fixes 
              the problems</strong> and gives you working JSON.
            </p>
            <p>
              This is especially useful when working with:
            </p>
            <ul>
              <li><strong>LLM/AI outputs</strong> — ChatGPT, Claude, and other models sometimes return malformed JSON</li>
              <li><strong>Copy-pasted code</strong> — JSON copied from JavaScript often has trailing commas or single quotes</li>
              <li><strong>Hand-edited configs</strong> — Easy to forget a comma or add an extra one</li>
              <li><strong>API responses</strong> — Truncated or corrupted responses from network issues</li>
            </ul>

            <h2>Issues We Automatically Fix</h2>
            
            <h3>Trailing Commas</h3>
            <p>
              JavaScript allows trailing commas, but JSON doesn't. We remove them automatically:
            </p>
            <pre><code>{`// Before (invalid)
{
  "name": "John",
  "age": 30,  ← trailing comma
}

// After (valid)
{
  "name": "John",
  "age": 30
}`}</code></pre>

            <h3>Single Quotes</h3>
            <p>
              JSON requires double quotes. We convert single quotes to double:
            </p>
            <pre><code>{`// Before (invalid)
{'name': 'John'}

// After (valid)
{"name": "John"}`}</code></pre>

            <h3>Unquoted Keys</h3>
            <p>
              JavaScript object keys can be unquoted, but JSON requires quotes:
            </p>
            <pre><code>{`// Before (invalid)
{name: "John", age: 30}

// After (valid)
{"name": "John", "age": 30}`}</code></pre>

            <h3>Comments</h3>
            <p>
              JSON doesn't support comments, but many config files include them. We strip them out:
            </p>
            <pre><code>{`// Before (invalid)
{
  "debug": true, // enable debug mode
  /* timeout in ms */
  "timeout": 5000
}

// After (valid)
{
  "debug": true,
  "timeout": 5000
}`}</code></pre>

            <h3>Markdown Code Blocks</h3>
            <p>
              LLMs often wrap JSON in markdown code blocks. We extract the JSON:
            </p>
            <pre><code>{`// Before (invalid)
\`\`\`json
{"name": "John"}
\`\`\`

// After (valid)
{"name": "John"}`}</code></pre>

            <h3>Truncated JSON</h3>
            <p>
              When JSON is cut off mid-stream (common with LLM outputs), we add missing brackets:
            </p>
            <pre><code>{`// Before (truncated)
{"users": [{"name": "John"}, {"name": "Jane"

// After (completed)
{"users": [{"name": "John"}, {"name": "Jane"}]}`}</code></pre>

            <h3>Missing Commas</h3>
            <p>
              We detect and add missing commas between elements:
            </p>
            <pre><code>{`// Before (invalid)
{"a": 1 "b": 2 "c": 3}

// After (valid)
{"a": 1, "b": 2, "c": 3}`}</code></pre>

            <h2>Working with LLM Outputs</h2>
            <p>
              Large Language Models like ChatGPT, Claude, and GPT-4 are incredibly useful for 
              generating structured data, but they sometimes produce invalid JSON. Common issues include:
            </p>
            <ul>
              <li>Wrapping JSON in markdown code blocks (<code>```json ... ```</code>)</li>
              <li>Adding explanatory text before or after the JSON</li>
              <li>Truncating output mid-object due to token limits</li>
              <li>Using JavaScript-style syntax instead of strict JSON</li>
            </ul>
            <p>
              This repair tool handles all of these cases, making it perfect for AI/LLM workflows.
            </p>

            <h2>Programmatic JSON Repair</h2>
            <p>
              Need to repair JSON in code? Here are some approaches:
            </p>

            <h3>JavaScript/TypeScript</h3>
            <pre><code>{`// Using the jsonrepair library (what this tool uses)
import { jsonrepair } from 'jsonrepair';

const broken = "{'name': 'John', 'age': 30,}";
const fixed = jsonrepair(broken);
console.log(fixed); // {"name": "John", "age": 30}

// Parse the repaired JSON
const data = JSON.parse(fixed);`}</code></pre>

            <h3>Python</h3>
            <pre><code>{`# Using json-repair library
from json_repair import repair_json

broken = "{'name': 'John', 'age': 30,}"
fixed = repair_json(broken)
print(fixed)  # {"name": "John", "age": 30}`}</code></pre>

            <h2>When NOT to Use Repair</h2>
            <p>
              JSON repair is great for quick fixes, but be careful:
            </p>
            <ul>
              <li>
                <strong>Don't use for security-critical data</strong> — The repair might change 
                the meaning of the data in unexpected ways
              </li>
              <li>
                <strong>Always validate the result</strong> — Make sure the repaired JSON has 
                the structure you expect
              </li>
              <li>
                <strong>Fix the source</strong> — If you're repeatedly repairing JSON from the 
                same source, fix the source instead
              </li>
            </ul>

            <h2>JSON5 Alternative</h2>
            <p>
              If you're writing configuration files and want a more lenient syntax, consider using{' '}
              <a href="https://json5.org/">JSON5</a>. It's a superset of JSON that allows:
            </p>
            <ul>
              <li>Comments (single and multi-line)</li>
              <li>Trailing commas</li>
              <li>Unquoted keys</li>
              <li>Single quotes</li>
              <li>Multi-line strings</li>
            </ul>
            <p>
              We also have a <a href="/json5-to-json">JSON5 to JSON converter</a> if you need 
              to convert JSON5 to standard JSON.
            </p>

            <h2>Related Tools</h2>
            <ul>
              <li><a href="/">JSON Validator</a> — Validate JSON and see detailed error messages</li>
              <li><a href="/json-pretty-print">JSON Pretty Print</a> — Format repaired JSON nicely</li>
              <li><a href="/json-minify">JSON Minify</a> — Compress JSON after repair</li>
              <li><a href="/json-escape">JSON Escape</a> — Escape special characters in strings</li>
            </ul>

            <h2>Frequently Asked Questions</h2>
            
            <h3>Can this fix any broken JSON?</h3>
            <p>
              Not always. The tool can fix common syntax issues, but if the data structure itself 
              is corrupted (wrong values, missing fields), it can't know what the correct data 
              should be. It fixes <em>syntax</em>, not <em>semantics</em>.
            </p>

            <h3>Is the repaired JSON guaranteed to be correct?</h3>
            <p>
              The repaired JSON will be valid JSON (parseable), but you should always verify that 
              the data structure matches what you expect. The repair process makes its best guess 
              about what you intended.
            </p>

            <h3>Why do LLMs produce broken JSON?</h3>
            <p>
              LLMs are trained on text that includes both valid JSON and JavaScript object literals. 
              They sometimes mix the two syntaxes. Additionally, token limits can cause truncation, 
              and the model might add explanatory text around the JSON.
            </p>

            <h3>Can I use this in production?</h3>
            <p>
              For quick fixes and development, absolutely. For production systems, consider using 
              the <code>jsonrepair</code> npm package directly with proper error handling and validation.
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
