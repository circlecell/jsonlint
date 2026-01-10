import { Metadata } from 'next';
import { ToolNav } from '@/components/ToolNav';
import { Container } from '@/components/Container';
import { ErrorAnalyzer } from './ErrorAnalyzer';

export const metadata: Metadata = {
  title: 'JSON Error Analyzer - Understand & Fix JSON Errors | JSONLint',
  description:
    'Get detailed explanations for JSON syntax errors. Understand exactly what went wrong and how to fix it with helpful suggestions and auto-fix options.',
  keywords: [
    'json error',
    'json syntax error',
    'json parse error',
    'fix json error',
    'json debugger',
    'unexpected token',
    'json help',
    'json troubleshoot',
    'invalid json',
  ],
  openGraph: {
    title: 'JSON Error Analyzer - Understand & Fix Errors',
    description: 'Get detailed, helpful explanations for JSON syntax errors.',
  },
};

export default function JsonErrorAnalyzerPage() {
  return (
    <>
      <ToolNav />

      <Container className="py-4">
        <div className="mb-4 flex justify-center">
          <div id="bsa-zone_1570746984891-3_123456"></div>
        </div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          JSON Error Analyzer
        </h1>
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
          Don't just see "Unexpected token" — understand exactly what's wrong and how to fix it.
          Get detailed explanations, visual highlighting, and auto-fix suggestions.
        </p>

        <ErrorAnalyzer />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6 mt-8">
          <div className="prose-custom">
            <h2>Why "Unexpected Token" Isn't Helpful</h2>
            <p>
              We've all seen it: <code>SyntaxError: Unexpected token at position 142</code>. But what 
              does that actually mean? This tool goes beyond the cryptic error message to tell you:
            </p>
            <ul>
              <li><strong>Exactly where</strong> the error is (line and column)</li>
              <li><strong>What character</strong> is causing the problem</li>
              <li><strong>Why</strong> it's wrong in plain English</li>
              <li><strong>How to fix it</strong> with specific suggestions</li>
              <li><strong>Auto-fix</strong> for common issues</li>
            </ul>

            <h2>Common JSON Errors Explained</h2>
            
            <h3>Trailing Commas</h3>
            <p>
              JavaScript allows trailing commas, but JSON doesn't:
            </p>
            <pre><code>{`// Wrong - trailing comma after "active"
{
  "name": "John",
  "active": true,  ← Remove this comma
}

// Correct
{
  "name": "John",
  "active": true
}`}</code></pre>
            <p>
              <strong>Why:</strong> JSON was designed to be a strict subset of JavaScript with 
              unambiguous parsing rules. Trailing commas were excluded to keep the format simple.
            </p>

            <h3>Single Quotes Instead of Double Quotes</h3>
            <p>
              JSON requires double quotes for all strings:
            </p>
            <pre><code>{`// Wrong - single quotes
{'name': 'John'}

// Correct - double quotes
{"name": "John"}`}</code></pre>
            <p>
              <strong>Why:</strong> The JSON specification mandates double quotes. This prevents 
              ambiguity and ensures consistent parsing across all platforms.
            </p>

            <h3>Unquoted Property Names</h3>
            <p>
              JavaScript lets you write <code>{`{name: "John"}`}</code>, but JSON doesn't:
            </p>
            <pre><code>{`// Wrong - unquoted key
{name: "John"}

// Correct - quoted key
{"name": "John"}`}</code></pre>
            <p>
              <strong>Why:</strong> Requiring quotes ensures that keys can contain any valid 
              string, including spaces and special characters.
            </p>

            <h3>Missing Commas Between Elements</h3>
            <p>
              Easy to miss when editing JSON by hand:
            </p>
            <pre><code>{`// Wrong - missing comma
{
  "name": "John"  ← Missing comma here
  "age": 30
}

// Correct
{
  "name": "John",
  "age": 30
}`}</code></pre>

            <h3>Invalid Values</h3>
            <p>
              Some JavaScript values aren't valid in JSON:
            </p>
            <pre><code>{`// Wrong - undefined isn't valid JSON
{"value": undefined}

// Wrong - NaN and Infinity aren't valid
{"value": NaN}
{"value": Infinity}

// Correct - use null or strings
{"value": null}
{"value": "NaN"}
{"value": "Infinity"}`}</code></pre>

            <h3>Control Characters in Strings</h3>
            <p>
              Raw tabs, newlines, and other control characters must be escaped:
            </p>
            <pre><code>{`// Wrong - literal newline in string
{"text": "line 1
line 2"}

// Correct - escaped newline
{"text": "line 1\\nline 2"}`}</code></pre>

            <h2>Understanding Error Positions</h2>
            <p>
              When JSON parsers report an error "at position 142", they're counting from the 
              start of the string. This tool converts that to line and column numbers, which 
              are much easier to find in your editor.
            </p>
            <p>
              <strong>Important:</strong> The error position is usually where the parser 
              <em>detected</em> the problem, not necessarily where the actual mistake is. 
              For example, a missing comma might not be detected until the parser hits 
              the next property name.
            </p>

            <h2>Tips for Debugging JSON</h2>
            <ol>
              <li>
                <strong>Start with valid JSON</strong> — Use the <a href="/json-repair">JSON Repair</a> tool 
                to auto-fix common issues before debugging manually.
              </li>
              <li>
                <strong>Check the line above</strong> — Often the real error is on the line 
                <em>before</em> where it's reported (like a missing comma).
              </li>
              <li>
                <strong>Look for copy-paste issues</strong> — JSON from JavaScript code often 
                has single quotes or trailing commas that need fixing.
              </li>
              <li>
                <strong>Validate incrementally</strong> — If you have a large JSON file, try 
                validating smaller sections to isolate the problem.
              </li>
              <li>
                <strong>Use syntax highlighting</strong> — A good editor will show mismatched 
                brackets and unclosed strings visually.
              </li>
            </ol>

            <h2>Error Messages by Browser</h2>
            <p>
              Different JavaScript engines report JSON errors differently:
            </p>
            <table>
              <thead>
                <tr>
                  <th>Browser</th>
                  <th>Example Error Message</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Chrome/Node</td>
                  <td><code>Unexpected token , at position 42</code></td>
                </tr>
                <tr>
                  <td>Firefox</td>
                  <td><code>JSON.parse: expected property name at line 3 column 5</code></td>
                </tr>
                <tr>
                  <td>Safari</td>
                  <td><code>JSON Parse error: Expected {`'}'`}</code></td>
                </tr>
              </tbody>
            </table>
            <p>
              This tool normalizes these messages into a consistent, helpful format.
            </p>

            <h2>Programmatic Error Handling</h2>
            <pre><code>{`// JavaScript - wrapping JSON.parse for better errors
function parseJSONWithDetails(text) {
  try {
    return { success: true, data: JSON.parse(text) };
  } catch (e) {
    const posMatch = e.message.match(/position (\\d+)/);
    if (posMatch) {
      const pos = parseInt(posMatch[1], 10);
      const lines = text.substring(0, pos).split('\\n');
      return {
        success: false,
        error: e.message,
        line: lines.length,
        column: lines[lines.length - 1].length + 1,
        context: text.substring(pos - 20, pos + 20)
      };
    }
    return { success: false, error: e.message };
  }
}`}</code></pre>

            <h2>Related Tools</h2>
            <ul>
              <li><a href="/">JSON Validator</a> — Quick validation with error highlighting</li>
              <li><a href="/json-repair">JSON Repair</a> — Automatically fix common issues</li>
              <li><a href="/jsonc-to-json">JSONC to JSON</a> — Strip comments from config files</li>
              <li><a href="/json-pretty-print">JSON Pretty Print</a> — Format JSON for readability</li>
            </ul>

            <h2>Frequently Asked Questions</h2>
            
            <h3>Why does the error say line 1 when my JSON is 100 lines?</h3>
            <p>
              This usually happens with minified JSON (no newlines). The entire content is 
              technically on "line 1". The column number and position will help you find 
              the actual location.
            </p>

            <h3>The error position seems wrong. Why?</h3>
            <p>
              JSON parsers report where they <em>detected</em> an error, not where the 
              mistake actually is. For example, if you forget a comma, the parser won't 
              know until it sees the next unexpected token.
            </p>

            <h3>Can this fix all JSON errors?</h3>
            <p>
              Auto-fix works for common structural issues (trailing commas, single quotes, 
              unquoted keys). For more complex problems, use the <a href="/json-repair">JSON Repair</a> tool 
              or fix manually using the suggestions provided.
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
