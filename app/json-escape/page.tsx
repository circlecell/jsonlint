import { Metadata } from 'next';
import { ToolNav } from '@/components/ToolNav';
import { Container } from '@/components/Container';
import { JsonEscaper } from './JsonEscaper';

export const metadata: Metadata = {
  title: 'JSON Escape - Escape Special Characters Online | JSONLint',
  description:
    'Escape special characters for JSON strings. Convert newlines, quotes, backslashes, and tabs to their escaped equivalents. Free online tool.',
};

export default function JsonEscapePage() {
  return (
    <>
      <ToolNav />

      <Container className="py-4">
        <div className="mb-4 flex justify-center">
          <div id="bsa-zone_1570746984891-3_123456"></div>
        </div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          JSON Escape Tool
        </h1>
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
          Escape special characters to create valid JSON strings. Paste your text below:
        </p>

        <JsonEscaper />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6 mt-8">
          <div className="prose-custom">
            <h2>What is JSON Escaping?</h2>
            <p>
              JSON strings have strict rules about special characters. Certain characters must be 
              "escaped" with a backslash to be included in a JSON string. This tool automatically 
              converts raw text into a properly escaped JSON string value.
            </p>

            <h2>Characters That Need Escaping</h2>
            <p>The JSON specification requires these characters to be escaped:</p>
            <table>
              <thead>
                <tr>
                  <th>Character</th>
                  <th>Escaped</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>"</code></td>
                  <td><code>\"</code></td>
                  <td>Double quote — must be escaped inside strings</td>
                </tr>
                <tr>
                  <td><code>\</code></td>
                  <td><code>\\</code></td>
                  <td>Backslash — the escape character itself</td>
                </tr>
                <tr>
                  <td>Newline</td>
                  <td><code>\n</code></td>
                  <td>Line feed (LF)</td>
                </tr>
                <tr>
                  <td>Tab</td>
                  <td><code>\t</code></td>
                  <td>Horizontal tab</td>
                </tr>
                <tr>
                  <td>Carriage return</td>
                  <td><code>\r</code></td>
                  <td>CR (often paired with \n on Windows)</td>
                </tr>
                <tr>
                  <td>Backspace</td>
                  <td><code>\b</code></td>
                  <td>Rarely used</td>
                </tr>
                <tr>
                  <td>Form feed</td>
                  <td><code>\f</code></td>
                  <td>Page break (legacy)</td>
                </tr>
              </tbody>
            </table>

            <h2>Example</h2>
            <p>Raw text:</p>
            <pre><code>{`Hello "World"
Line 2 with	tab`}</code></pre>
            
            <p>After escaping:</p>
            <pre><code>{`"Hello \\"World\\"\\nLine 2 with\\ttab"`}</code></pre>

            <h2>When to Use This Tool</h2>
            <ul>
              <li>
                <strong>Building JSON manually</strong> — When concatenating strings into JSON
              </li>
              <li>
                <strong>Embedding text in JSON</strong> — Multi-line content, quotes in values
              </li>
              <li>
                <strong>API request bodies</strong> — Ensuring special characters don't break requests
              </li>
              <li>
                <strong>Configuration values</strong> — File paths with backslashes
              </li>
              <li>
                <strong>Debug JSON issues</strong> — Finding problematic characters
              </li>
            </ul>

            <h2>Escaping vs Stringify</h2>
            <p>
              This tool escapes a raw string. If you want to convert an entire JavaScript 
              object to a JSON string, use <a href="/json-stringify">JSON Stringify</a> instead. 
              The difference:
            </p>
            <ul>
              <li><strong>Escape</strong>: raw text → escaped string value</li>
              <li><strong>Stringify</strong>: JavaScript object → complete JSON</li>
            </ul>

            <h2>Options Explained</h2>
            
            <h3>Wrap in quotes</h3>
            <p>
              Enable this to get a complete JSON string value with surrounding quotes. 
              Disable it if you only need the escaped content to insert into an existing JSON structure.
            </p>

            <h3>Escape Unicode</h3>
            <p>
              When enabled, non-ASCII characters (é, 中, 🎉) are converted to <code>\uXXXX</code> format. 
              This ensures compatibility with systems that don't support UTF-8, though modern JSON 
              parsers handle Unicode natively.
            </p>

            <h2>Escaping in Code</h2>
            <p>
              In most cases, you should use your language's JSON library instead of manual escaping:
            </p>

            <h3>JavaScript</h3>
            <pre><code>{`// Don't do this:
const json = '{"name": "' + name + '"}';

// Do this instead:
const json = JSON.stringify({ name: name });

// Or just the string:
const escaped = JSON.stringify(text);`}</code></pre>

            <h3>Python</h3>
            <pre><code>{`import json

# Escape a string
escaped = json.dumps(text)

# Build complete JSON
data = json.dumps({"name": text})`}</code></pre>

            <h3>Why use libraries?</h3>
            <p>
              JSON libraries handle all edge cases correctly — Unicode, control characters, and 
              encoding issues. Manual string building is error-prone and can create security vulnerabilities.
            </p>

            <h2>Common Mistakes</h2>
            
            <h3>Forgetting to escape backslashes</h3>
            <p>
              Windows file paths like <code>C:\Users\Name</code> need double backslashes: 
              <code>C:\\Users\\Name</code>
            </p>

            <h3>Not escaping quotes</h3>
            <p>
              A value containing <code>"</code> breaks the JSON structure unless escaped as <code>\"</code>
            </p>

            <h3>Raw newlines in strings</h3>
            <p>
              Multi-line strings must use <code>\n</code> — literal newlines are invalid in JSON strings
            </p>

            <h2>Related Tools</h2>
            <ul>
              <li><a href="/json-unescape">JSON Unescape</a> — Reverse: convert escaped strings back to raw text</li>
              <li><a href="/json-stringify">JSON Stringify</a> — Convert objects to JSON strings</li>
              <li><a href="/">JSON Validator</a> — Validate your JSON after building it</li>
              <li><a href="/common-mistakes-in-json-and-how-to-avoid-them">Common JSON Mistakes</a> — Avoid escaping errors</li>
            </ul>

            <h2>Frequently Asked Questions</h2>
            
            <h3>What's the difference between escape and stringify?</h3>
            <p>
              Escape converts raw text into a valid JSON string value. Stringify converts an 
              entire JavaScript object into a JSON string. Use escape for embedding text; 
              use stringify for converting objects.
            </p>

            <h3>Do I need to escape forward slashes?</h3>
            <p>
              No. Forward slashes (<code>/</code>) are valid in JSON strings without escaping. 
              Some tools escape them as <code>\/</code> for HTML compatibility, but it's optional.
            </p>

            <h3>How do I escape Unicode characters?</h3>
            <p>
              Enable the "Escape Unicode" option to convert characters like <code>é</code> to 
              <code>\u00e9</code>. This is only needed for legacy systems — modern JSON parsers 
              handle UTF-8 natively.
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
