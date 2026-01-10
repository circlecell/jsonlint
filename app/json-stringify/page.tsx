import { Metadata } from 'next';
import { ToolNav } from '@/components/ToolNav';
import { Container } from '@/components/Container';
import { JsonStringifier } from './JsonStringifier';

export const metadata: Metadata = {
  title: 'JSON Stringify - Escape JSON for Embedding | JSONLint',
  description:
    'Convert JSON to an escaped string for embedding in code, databases, or other JSON. Handles quotes, newlines, and special characters.',
};

export default function JsonStringifyPage() {
  return (
    <>
      <ToolNav />

      <Container className="py-4">
        {/* Top ad zone */}
        <div className="mb-4 flex justify-center">
          <div id="bsa-zone_1570746984891-3_123456"></div>
        </div>

        <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
          Paste JSON to escape it as a string, or paste an escaped string to unescape it:
        </p>

        <JsonStringifier />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6 mt-8">
          <div className="prose-custom">
            <h2>What is JSON Stringify?</h2>
            <p>
              JSON Stringify converts a JSON object into an escaped string. The result 
              can be safely embedded inside another string—in code, databases, or even 
              nested within other JSON. All quotes, newlines, and special characters 
              get escaped so they don't break the containing context.
            </p>

            <h2>Before and After</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                  Original JSON:
                </p>
                <pre><code>{`{
  "message": "Hello, World!",
  "count": 42
}`}</code></pre>
              </div>
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                  Stringified:
                </p>
                <pre><code>{`"{\\"message\\": \\"Hello, World!\\", \\"count\\": 42}"`}</code></pre>
              </div>
            </div>

            <h2>When You Need This</h2>
            
            <h3>Embedding JSON in JavaScript strings</h3>
            <pre><code>{`const jsonTemplate = "{\\"name\\": \\"$name\\", \\"id\\": $id}";
// Later: replace $name and $id with actual values`}</code></pre>

            <h3>Storing JSON in a database text field</h3>
            <p>
              Some databases or ORMs expect a plain string. Stringifying ensures quotes 
              and special chars don't corrupt the data.
            </p>

            <h3>Nesting JSON inside JSON</h3>
            <pre><code>{`{
  "type": "log",
  "payload": "{\\"level\\":\\"error\\",\\"msg\\":\\"Something failed\\"}"
}`}</code></pre>
            <p>
              The inner JSON is a string value, not a nested object. This pattern is 
              common in logging systems and message queues.
            </p>

            <h3>Sending JSON in URL parameters</h3>
            <p>
              While URL encoding is usually better, sometimes you need to pass JSON 
              as a query parameter. Stringifying is the first step.
            </p>

            <h2>Characters That Get Escaped</h2>
            <table>
              <thead>
                <tr>
                  <th>Character</th>
                  <th>Escaped As</th>
                  <th>Why</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>"</code></td>
                  <td><code>\\"</code></td>
                  <td>Would end the string</td>
                </tr>
                <tr>
                  <td><code>\\</code></td>
                  <td><code>\\\\</code></td>
                  <td>Escape character itself</td>
                </tr>
                <tr>
                  <td>Newline</td>
                  <td><code>\\n</code></td>
                  <td>Invalid in JSON strings</td>
                </tr>
                <tr>
                  <td>Tab</td>
                  <td><code>\\t</code></td>
                  <td>Control character</td>
                </tr>
                <tr>
                  <td>Carriage return</td>
                  <td><code>\\r</code></td>
                  <td>Control character</td>
                </tr>
              </tbody>
            </table>

            <h2>Stringify vs. Serialize</h2>
            <p>
              These terms are often used interchangeably, but technically:
            </p>
            <ul>
              <li>
                <strong>JSON.stringify()</strong> — Converts a JavaScript object to a JSON string
              </li>
              <li>
                <strong>This tool</strong> — Takes JSON (already a string) and escapes it for embedding
              </li>
            </ul>
            <p>
              If you have a JavaScript object and want JSON, use <code>JSON.stringify(obj)</code>. 
              If you have JSON text and need it escaped, use this tool.
            </p>

            <h2>Programmatic Usage</h2>
            <p>In JavaScript, double-stringify to get the escaped version:</p>
            <pre><code>{`const obj = { message: "Hello" };
const json = JSON.stringify(obj);        // '{"message":"Hello"}'
const escaped = JSON.stringify(json);    // '"{\\"message\\":\\"Hello\\"}"'`}</code></pre>

            <p>To reverse (unescape):</p>
            <pre><code>{`const escaped = '"{\\"message\\":\\"Hello\\"}"';
const json = JSON.parse(escaped);        // '{"message":"Hello"}'
const obj = JSON.parse(json);            // { message: "Hello" }`}</code></pre>

            <h2>Pro Tips</h2>
            <ul>
              <li>
                💡 <strong>Check for double-escaping</strong> — If you see <code>\\\\n</code> instead 
                of <code>\\n</code>, you've stringified twice
              </li>
              <li>
                💡 <strong>Validate after unescaping</strong> — Use the <a href="/">JSON Validator</a> to 
                confirm you got valid JSON back
              </li>
              <li>
                💡 <strong>Watch for encoding issues</strong> — Non-ASCII characters might need 
                additional handling depending on your system
              </li>
            </ul>

            <h2>Related Tools</h2>
            <ul>
              <li><a href="/">JSON Validator</a> — Validate and format JSON</li>
              <li><a href="/json-diff">JSON Diff</a> — Compare JSON documents</li>
              <li><a href="/xml-to-json">XML to JSON</a> — Convert XML to JSON</li>
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
