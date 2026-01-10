import { Metadata } from 'next';
import { ToolNav } from '@/components/ToolNav';
import { Container } from '@/components/Container';
import { JsoncConverter } from './JsoncConverter';

export const metadata: Metadata = {
  title: 'JSONC to JSON Converter - Remove Comments from JSON | JSONLint',
  description:
    'Convert JSONC (JSON with Comments) and JSON5 to standard JSON. Strip comments, remove trailing commas, and fix syntax for production use.',
  keywords: [
    'jsonc',
    'json with comments',
    'json5',
    'remove json comments',
    'strip comments',
    'jsonc to json',
    'json5 to json',
    'config file',
    'tsconfig',
    'vscode settings',
  ],
  openGraph: {
    title: 'JSONC to JSON Converter - Remove Comments',
    description: 'Convert JSON with comments to standard JSON for production use.',
  },
};

export default function JsoncToJsonPage() {
  return (
    <>
      <ToolNav />

      <Container className="py-4">
        <div className="mb-4 flex justify-center">
          <div id="bsa-zone_1570746984891-3_123456"></div>
        </div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          JSONC to JSON Converter
        </h1>
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
          Convert JSON with comments (JSONC) or JSON5 to standard JSON. Perfect for preparing 
          config files for production or API use.
        </p>

        <JsoncConverter />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6 mt-8">
          <div className="prose-custom">
            <h2>What is JSONC?</h2>
            <p>
              JSONC (JSON with Comments) is an extension of JSON that allows JavaScript-style 
              comments. It's widely used in configuration files where documentation is helpful:
            </p>
            <ul>
              <li><strong>VS Code settings</strong> — <code>settings.json</code>, <code>tasks.json</code></li>
              <li><strong>TypeScript config</strong> — <code>tsconfig.json</code></li>
              <li><strong>ESLint config</strong> — <code>.eslintrc.json</code></li>
              <li><strong>And many more...</strong></li>
            </ul>
            <p>
              Standard JSON parsers don't support comments, so you need to strip them before 
              using the data in production code or sending to APIs.
            </p>

            <h2>JSONC vs JSON5 vs Standard JSON</h2>
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>JSON</th>
                  <th>JSONC</th>
                  <th>JSON5</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Single-line comments (<code>//</code>)</td>
                  <td>❌</td>
                  <td>✅</td>
                  <td>✅</td>
                </tr>
                <tr>
                  <td>Multi-line comments (<code>/* */</code>)</td>
                  <td>❌</td>
                  <td>✅</td>
                  <td>✅</td>
                </tr>
                <tr>
                  <td>Trailing commas</td>
                  <td>❌</td>
                  <td>✅</td>
                  <td>✅</td>
                </tr>
                <tr>
                  <td>Unquoted keys</td>
                  <td>❌</td>
                  <td>❌</td>
                  <td>✅</td>
                </tr>
                <tr>
                  <td>Single quotes</td>
                  <td>❌</td>
                  <td>❌</td>
                  <td>✅</td>
                </tr>
                <tr>
                  <td>Hex numbers</td>
                  <td>❌</td>
                  <td>❌</td>
                  <td>✅</td>
                </tr>
                <tr>
                  <td>Multi-line strings</td>
                  <td>❌</td>
                  <td>❌</td>
                  <td>✅</td>
                </tr>
              </tbody>
            </table>
            <p>
              This tool converts both JSONC and JSON5 to standard JSON, handling all the 
              features listed above.
            </p>

            <h2>Comment Syntax</h2>
            
            <h3>Single-line comments</h3>
            <p>Start with <code>//</code> and continue to the end of the line:</p>
            <pre><code>{`{
  "port": 3000, // Server port
  "host": "localhost" // Only for development
}`}</code></pre>

            <h3>Multi-line comments</h3>
            <p>Enclosed in <code>/* */</code>, can span multiple lines:</p>
            <pre><code>{`{
  /*
   * Database configuration
   * Update these values for production
   */
  "database": {
    "host": "localhost",
    "port": 5432
  }
}`}</code></pre>

            <h2>Why Remove Comments?</h2>
            <p>
              While comments are great for documentation, they cause problems in certain contexts:
            </p>
            <ul>
              <li>
                <strong>JSON.parse() fails</strong> — JavaScript's built-in parser doesn't support comments
              </li>
              <li>
                <strong>APIs reject them</strong> — Most REST APIs expect standard JSON
              </li>
              <li>
                <strong>Smaller payloads</strong> — Comments add bytes that aren't needed at runtime
              </li>
              <li>
                <strong>Interoperability</strong> — Other languages' JSON parsers don't support comments
              </li>
            </ul>

            <h2>Programmatic Conversion</h2>
            
            <h3>JavaScript/Node.js</h3>
            <pre><code>{`// Option 1: Use jsonc-parser (VS Code's parser)
import { parse } from 'jsonc-parser';

const jsonc = '{"a": 1} // comment';
const result = parse(jsonc);

// Option 2: Use strip-json-comments
import stripJsonComments from 'strip-json-comments';

const json = stripJsonComments(jsonc);
const data = JSON.parse(json);

// Option 3: Use json5 library
import JSON5 from 'json5';

const data = JSON5.parse('{"a": 1,}'); // handles trailing commas too`}</code></pre>

            <h3>Python</h3>
            <pre><code>{`# Using pyjson5 library
import pyjson5

data = pyjson5.load(open('config.json5'))

# Or commentjson for just comments
import commentjson

data = commentjson.load(open('config.jsonc'))`}</code></pre>

            <h3>Command Line</h3>
            <pre><code>{`# Using Node.js
npx strip-json-comments-cli config.jsonc > config.json

# Using jq (after stripping comments manually)
cat config.json | jq '.'`}</code></pre>

            <h2>Best Practices</h2>
            <ul>
              <li>
                <strong>Use JSONC for config files</strong> — Comments make configs self-documenting
              </li>
              <li>
                <strong>Convert before deployment</strong> — Strip comments in your build process
              </li>
              <li>
                <strong>Don't store secrets in comments</strong> — They're still in the file!
              </li>
              <li>
                <strong>Keep comments concise</strong> — Long comments belong in external docs
              </li>
            </ul>

            <h2>Common Use Cases</h2>
            
            <h3>VS Code Settings</h3>
            <p>
              VS Code's <code>settings.json</code> supports JSONC, but if you need to 
              process these settings programmatically, you'll need to strip the comments first.
            </p>

            <h3>TypeScript Configuration</h3>
            <p>
              <code>tsconfig.json</code> supports comments, but tools that read it programmatically 
              might not. Use this converter to create a comment-free version.
            </p>

            <h3>API Requests</h3>
            <p>
              If you're copying configuration from a JSONC file to use in an API request, 
              this tool removes the comments so the request doesn't fail.
            </p>

            <h2>Related Tools</h2>
            <ul>
              <li><a href="/">JSON Validator</a> — Validate the converted JSON</li>
              <li><a href="/json-repair">JSON Repair</a> — Fix other JSON syntax issues</li>
              <li><a href="/json-pretty-print">JSON Pretty Print</a> — Format the output</li>
              <li><a href="/json-minify">JSON Minify</a> — Compress for production</li>
            </ul>

            <h2>Frequently Asked Questions</h2>
            
            <h3>Why doesn't JSON support comments?</h3>
            <p>
              Douglas Crockford (JSON's creator) intentionally excluded comments to prevent 
              them from being used for parsing directives, which would complicate the format. 
              JSON was designed to be simple and unambiguous.
            </p>

            <h3>Can I add comments back after conversion?</h3>
            <p>
              No — once comments are stripped, the information is lost. Keep your source JSONC 
              file and only convert to JSON when needed for deployment or APIs.
            </p>

            <h3>Is JSONC the same as JSON5?</h3>
            <p>
              No. JSONC only adds comments and trailing commas. JSON5 is a larger superset 
              that also allows unquoted keys, single quotes, hex numbers, and multi-line strings. 
              This tool handles both.
            </p>

            <h3>Will this tool modify my data?</h3>
            <p>
              Only comments and trailing commas are removed. The actual data values remain 
              unchanged. However, formatting (whitespace, indentation) may change.
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
