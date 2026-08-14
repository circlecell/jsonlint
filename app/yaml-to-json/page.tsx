import { Metadata } from 'next';
import { ToolNav } from '@/components/ToolNav';
import { Container } from '@/components/Container';
import { YamlToJsonConverter } from './YamlToJsonConverter';

export const metadata: Metadata = {
  title: 'YAML to JSON Converter - Convert YAML to JSON Online',
  description:
    'Convert YAML to JSON instantly. Transform Kubernetes configs, Docker Compose files, and CI/CD configs to JSON format. Free online tool.',
  alternates: { canonical: '/yaml-to-json' },
};

export default function YamlToJsonPage() {
  return (
    <>
      <ToolNav />

      <Container className="py-4">
        <div className="mb-4 flex justify-center">
          <div id="bsa-zone_1570746984891-3_123456"></div>
        </div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          YAML to JSON Converter
        </h1>

        <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
          Paste your YAML below to convert it to JSON:
        </p>

        <YamlToJsonConverter />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6 mt-8">
          <div className="prose-custom">
            <h2>Why Convert YAML to JSON?</h2>
            <p>
              While YAML is great for human-readable configs, JSON is the standard for 
              APIs, data interchange, and programmatic manipulation. Converting YAML to 
              JSON lets you use config data in applications and services.
            </p>

            <h2>Example Conversion</h2>
            <p>YAML:</p>
            <pre><code>{`server:
  host: localhost
  port: 8080
  ssl: true
database:
  connection: postgres://localhost/mydb
  pool_size: 10`}</code></pre>

            <p>JSON:</p>
            <pre><code>{`{
  "server": {
    "host": "localhost",
    "port": 8080,
    "ssl": true
  },
  "database": {
    "connection": "postgres://localhost/mydb",
    "pool_size": 10
  }
}`}</code></pre>

            <h2>YAML Features Supported</h2>
            <table>
              <thead>
                <tr>
                  <th>YAML Feature</th>
                  <th>JSON Equivalent</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Mappings (<code>key: value</code>)</td>
                  <td>Objects</td>
                </tr>
                <tr>
                  <td>Sequences (<code>- item</code>)</td>
                  <td>Arrays</td>
                </tr>
                <tr>
                  <td>Inline arrays <code>[a, b, c]</code></td>
                  <td>Arrays</td>
                </tr>
                <tr>
                  <td>Multi-line strings (<code>|</code>, <code>&gt;</code>)</td>
                  <td>Strings with newlines</td>
                </tr>
                <tr>
                  <td><code>true</code>/<code>yes</code>/<code>on</code></td>
                  <td><code>true</code></td>
                </tr>
                <tr>
                  <td><code>null</code>/<code>~</code></td>
                  <td><code>null</code></td>
                </tr>
              </tbody>
            </table>

            <h2>Common Use Cases</h2>
            <ul>
              <li>
                <strong>API integration</strong> — Convert YAML configs to JSON for REST API calls
              </li>
              <li>
                <strong>Kubernetes debugging</strong> — Get JSON output for <code>kubectl</code> commands
              </li>
              <li>
                <strong>Config validation</strong> — Validate YAML structure using JSON Schema
              </li>
              <li>
                <strong>Data processing</strong> — Parse YAML files in languages with better JSON support
              </li>
              <li>
                <strong>Documentation</strong> — Generate JSON examples from YAML source files
              </li>
            </ul>

            <h2>YAML Gotchas</h2>
            <p>YAML has some surprising behaviors that affect conversion:</p>
            
            <h3>The Norway Problem</h3>
            <pre><code>{`# YAML interprets these as booleans!
countries:
  - NO    # false
  - YES   # true`}</code></pre>
            <p>Solution: Quote values that look like booleans: <code>"NO"</code></p>

            <h3>Numbers vs Strings</h3>
            <pre><code>{`version: 1.0   # Number 1.0
version: "1.0" # String "1.0"
zip: 01234     # Octal number!
zip: "01234"   # String "01234"`}</code></pre>

            <h2>Programmatic Conversion</h2>
            
            <h3>JavaScript (Node.js)</h3>
            <pre><code>{`const yaml = require('js-yaml');
const fs = require('fs');

const doc = yaml.load(fs.readFileSync('config.yaml', 'utf8'));
const json = JSON.stringify(doc, null, 2);
console.log(json);`}</code></pre>

            <h3>Python</h3>
            <pre><code>{`import yaml
import json

with open('config.yaml') as f:
    data = yaml.safe_load(f)
    
json_string = json.dumps(data, indent=2)
print(json_string)`}</code></pre>

            <h3>Command Line (with yq)</h3>
            <pre><code>{`# Convert YAML file to JSON
yq -o=json config.yaml > config.json

# Or pipe from stdin
cat config.yaml | yq -o=json`}</code></pre>

            <h2>Pro Tips</h2>
            <ul>
              <li>
                💡 <strong>Watch indentation</strong> — YAML is whitespace-sensitive. 
                Inconsistent indentation causes parse errors.
              </li>
              <li>
                💡 <strong>Comments are lost</strong> — JSON doesn't support comments, 
                so YAML comments won't transfer.
              </li>
              <li>
                💡 <strong>Validate the output</strong> — Use the <a href="/">JSON Validator</a> to 
                ensure correct JSON syntax.
              </li>
            </ul>

            <h2>Related Tools</h2>
            <ul>
              <li><a href="/json-to-yaml">JSON to YAML</a> — Convert JSON to YAML</li>
              <li><a href="/">JSON Validator</a> — Validate your JSON output</li>
              <li><a href="/json-schema">JSON Schema Validator</a> — Validate structure</li>
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
