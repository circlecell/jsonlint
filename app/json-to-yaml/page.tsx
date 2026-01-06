import { Metadata } from 'next';
import { ToolNav } from '@/components/ToolNav';
import { JsonToYamlConverter } from './JsonToYamlConverter';

export const metadata: Metadata = {
  title: 'JSON to YAML Converter - Convert JSON to YAML Online | JSONLint',
  description:
    'Convert JSON to YAML instantly. Perfect for Kubernetes configs, Docker Compose files, and CI/CD pipelines. Free online tool.',
};

export default function JsonToYamlPage() {
  return (
    <>
      <ToolNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-4 flex justify-center">
          <div id="bsa-zone_1570746984891-3_123456"></div>
        </div>

        <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
          Paste your JSON below to convert it to YAML:
        </p>

        <JsonToYamlConverter />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6 mt-8">
          <div className="prose-custom">
            <h2>Why Convert JSON to YAML?</h2>
            <p>
              YAML is the preferred format for configuration files in DevOps tools like 
              Kubernetes, Docker Compose, Ansible, and GitHub Actions. While JSON works 
              programmatically, YAML is more readable for human-edited config files.
            </p>

            <h2>Example Conversion</h2>
            <p>JSON:</p>
            <pre><code>{`{
  "apiVersion": "v1",
  "kind": "Service",
  "metadata": {
    "name": "my-service"
  },
  "spec": {
    "ports": [
      { "port": 80, "targetPort": 8080 }
    ]
  }
}`}</code></pre>

            <p>YAML:</p>
            <pre><code>{`apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  ports:
    - port: 80
      targetPort: 8080`}</code></pre>

            <h2>JSON vs YAML Syntax</h2>
            <table>
              <thead>
                <tr>
                  <th>JSON</th>
                  <th>YAML</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>{`{ "key": "value" }`}</code></td>
                  <td><code>key: value</code></td>
                </tr>
                <tr>
                  <td><code>{`["a", "b", "c"]`}</code></td>
                  <td><code>- a</code><br/><code>- b</code><br/><code>- c</code></td>
                </tr>
                <tr>
                  <td><code>{`"string"`}</code></td>
                  <td><code>string</code> (quotes optional)</td>
                </tr>
                <tr>
                  <td><code>true</code> / <code>false</code></td>
                  <td><code>true</code> / <code>false</code> (or yes/no)</td>
                </tr>
                <tr>
                  <td><code>null</code></td>
                  <td><code>null</code> or <code>~</code></td>
                </tr>
              </tbody>
            </table>

            <h2>Common Use Cases</h2>
            <ul>
              <li>
                <strong>Kubernetes manifests</strong> — Convert JSON API responses to YAML configs
              </li>
              <li>
                <strong>Docker Compose</strong> — Create docker-compose.yml from JSON templates
              </li>
              <li>
                <strong>CI/CD pipelines</strong> — GitHub Actions, GitLab CI, CircleCI configs
              </li>
              <li>
                <strong>Ansible playbooks</strong> — Convert JSON data to YAML format
              </li>
              <li>
                <strong>Helm charts</strong> — Generate values.yaml files
              </li>
            </ul>

            <h2>Special Characters in YAML</h2>
            <p>
              The converter automatically quotes strings that could be misinterpreted:
            </p>
            <ul>
              <li>Strings starting with numbers: <code>"123abc"</code></li>
              <li>Strings containing colons: <code>"host:port"</code></li>
              <li>Boolean-like strings: <code>"yes"</code>, <code>"no"</code>, <code>"true"</code></li>
              <li>Strings with special characters: <code>#</code>, <code>&</code>, <code>*</code></li>
            </ul>

            <h2>Programmatic Conversion</h2>
            
            <h3>JavaScript (Node.js)</h3>
            <pre><code>{`const yaml = require('js-yaml');

const jsonData = { name: 'example', count: 42 };
const yamlString = yaml.dump(jsonData);
console.log(yamlString);`}</code></pre>

            <h3>Python</h3>
            <pre><code>{`import json
import yaml

json_data = {"name": "example", "count": 42}
yaml_string = yaml.dump(json_data, default_flow_style=False)
print(yaml_string)`}</code></pre>

            <h3>Command Line (with yq)</h3>
            <pre><code>{`# Using yq
cat data.json | yq -P > data.yaml

# Or directly
yq -P data.json`}</code></pre>

            <h2>Pro Tips</h2>
            <ul>
              <li>
                💡 <strong>Validate your JSON first</strong> — Use the <a href="/">JSON Validator</a> to 
                catch syntax errors before converting
              </li>
              <li>
                💡 <strong>Check indentation</strong> — YAML is indentation-sensitive. Our output 
                uses 2-space indentation (Kubernetes standard)
              </li>
              <li>
                💡 <strong>Comments don't transfer</strong> — JSON doesn't support comments, 
                so add them manually after converting
              </li>
            </ul>

            <h2>Related Tools</h2>
            <ul>
              <li><a href="/yaml-to-json">YAML to JSON</a> — Convert YAML back to JSON</li>
              <li><a href="/">JSON Validator</a> — Validate your JSON first</li>
              <li><a href="/json-diff">JSON Diff</a> — Compare JSON documents</li>
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
