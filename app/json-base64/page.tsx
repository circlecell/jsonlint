import { Metadata } from 'next';
import { ToolNav } from '@/components/ToolNav';
import { Container } from '@/components/Container';
import { Base64Converter } from './Base64Converter';

export const metadata: Metadata = {
  title: 'JSON Base64 Encode/Decode - Convert JSON to Base64 | JSONLint',
  description:
    'Encode JSON to Base64 or decode Base64 back to JSON. Free online Base64 converter with validation.',
};

export default function JsonBase64Page() {
  return (
    <>
      <ToolNav />

      <Container className="py-4">
        <div className="mb-4 flex justify-center">
          <div id="bsa-zone_1570746984891-3_123456"></div>
        </div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          JSON Base64 Encode/Decode
        </h1>
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
          Encode JSON to Base64 or decode Base64 strings back to JSON:
        </p>

        <Base64Converter />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6 mt-8">
          <div className="prose-custom">
            <h2>What is Base64?</h2>
            <p>
              Base64 is a binary-to-text encoding scheme that converts binary data into ASCII characters. 
              It&apos;s commonly used to embed binary data in text-based formats like JSON, XML, or HTML.
            </p>

            <h2>Why Base64 Encode JSON?</h2>
            <p>Common use cases for Base64-encoded JSON:</p>
            <ul>
              <li><strong>API Authentication</strong> — Many APIs expect credentials as Base64-encoded JSON</li>
              <li><strong>JWT Tokens</strong> — JWT payloads are Base64-encoded JSON</li>
              <li><strong>Data URIs</strong> — Embedding data in URLs or HTML</li>
              <li><strong>Cookie Storage</strong> — Storing complex data in cookies</li>
              <li><strong>Query Parameters</strong> — Passing JSON through URLs safely</li>
            </ul>

            <h2>Example</h2>
            <p>Original JSON:</p>
            <pre><code>{`{"name": "John", "role": "admin"}`}</code></pre>
            
            <p>Base64 encoded:</p>
            <pre><code>eyJuYW1lIjogIkpvaG4iLCAicm9sZSI6ICJhZG1pbiJ9</code></pre>

            <h2>Base64 in Code</h2>
            
            <h3>JavaScript</h3>
            <pre><code>{`// Encode JSON to Base64
const json = { name: "John", role: "admin" };
const base64 = btoa(JSON.stringify(json));

// Decode Base64 to JSON
const decoded = JSON.parse(atob(base64));`}</code></pre>

            <h3>Python</h3>
            <pre><code>{`import base64
import json

# Encode
data = {"name": "John", "role": "admin"}
encoded = base64.b64encode(json.dumps(data).encode()).decode()

# Decode
decoded = json.loads(base64.b64decode(encoded).decode())`}</code></pre>

            <h3>Command Line</h3>
            <pre><code>{`# Encode
echo '{"name":"John"}' | base64

# Decode
echo 'eyJuYW1lIjoiSm9obiJ9' | base64 -d`}</code></pre>

            <h2>Base64 URL-Safe Encoding</h2>
            <p>
              Standard Base64 uses <code>+</code> and <code>/</code> characters, which have special 
              meaning in URLs. URL-safe Base64 replaces these with <code>-</code> and <code>_</code>.
            </p>
            <table>
              <thead>
                <tr>
                  <th>Standard</th>
                  <th>URL-Safe</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>+</code></td>
                  <td><code>-</code></td>
                </tr>
                <tr>
                  <td><code>/</code></td>
                  <td><code>_</code></td>
                </tr>
                <tr>
                  <td><code>=</code> (padding)</td>
                  <td>Often omitted</td>
                </tr>
              </tbody>
            </table>

            <h2>Common Mistakes</h2>
            <ul>
              <li>
                <strong>Encoding twice</strong> — If your JSON is already Base64, encoding again 
                creates double-encoding issues
              </li>
              <li>
                <strong>Character encoding</strong> — Always use UTF-8 when encoding strings 
                with non-ASCII characters
              </li>
              <li>
                <strong>Padding issues</strong> — Some systems strip <code>=</code> padding, 
                which can cause decode errors
              </li>
            </ul>

            <h2>Related Tools</h2>
            <ul>
              <li><a href="/jwt-decoder">JWT Decoder</a> — Decode JWT tokens (which use Base64)</li>
              <li><a href="/json-escape">JSON Escape</a> — Escape special characters</li>
              <li><a href="/">JSON Validator</a> — Validate JSON syntax</li>
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
