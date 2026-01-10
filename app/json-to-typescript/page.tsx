import { Metadata } from 'next';
import { ToolNav } from '@/components/ToolNav';
import { Container } from '@/components/Container';
import { JsonToTypescriptConverter } from './JsonToTypescriptConverter';

export const metadata: Metadata = {
  title: 'JSON to TypeScript - Generate TypeScript Interfaces | JSONLint',
  description:
    'Convert JSON to TypeScript interfaces instantly. Generate type-safe interfaces from API responses and JSON data. Free online tool.',
};

export default function JsonToTypescriptPage() {
  return (
    <>
      <ToolNav />

      <Container className="py-4">
        <div className="mb-4 flex justify-center">
          <div id="bsa-zone_1570746984891-3_123456"></div>
        </div>

        <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
          Paste your JSON below to generate TypeScript interfaces:
        </p>

        <JsonToTypescriptConverter />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6 mt-8">
          <div className="prose-custom">
            <h2>Why Generate TypeScript from JSON?</h2>
            <p>
              TypeScript interfaces provide type safety for your JSON data. Instead of 
              manually writing interfaces, generate them automatically from API responses 
              or sample JSON data.
            </p>

            <h2>Example Conversion</h2>
            <p>Input JSON:</p>
            <pre><code>{`{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "isActive": true
}`}</code></pre>

            <p>Generated TypeScript:</p>
            <pre><code>{`interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}`}</code></pre>

            <h2>Features</h2>
            <ul>
              <li>
                <strong>Nested object support</strong> — Creates separate interfaces for nested objects
              </li>
              <li>
                <strong>Array type inference</strong> — Detects array item types automatically
              </li>
              <li>
                <strong>Custom root name</strong> — Name your root interface anything you want
              </li>
              <li>
                <strong>Special character handling</strong> — Properly quotes keys with special characters
              </li>
            </ul>

            <h2>Type Inference Rules</h2>
            <table>
              <thead>
                <tr>
                  <th>JSON Value</th>
                  <th>TypeScript Type</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>&quot;string&quot;</code></td>
                  <td><code>string</code></td>
                </tr>
                <tr>
                  <td><code>123</code>, <code>45.67</code></td>
                  <td><code>number</code></td>
                </tr>
                <tr>
                  <td><code>true</code>, <code>false</code></td>
                  <td><code>boolean</code></td>
                </tr>
                <tr>
                  <td><code>null</code></td>
                  <td><code>null</code></td>
                </tr>
                <tr>
                  <td><code>[1, 2, 3]</code></td>
                  <td><code>number[]</code></td>
                </tr>
                <tr>
                  <td><code>[&quot;a&quot;, 1]</code></td>
                  <td><code>(string | number)[]</code></td>
                </tr>
                <tr>
                  <td><code>{`{ ... }`}</code></td>
                  <td>Separate interface</td>
                </tr>
              </tbody>
            </table>

            <h2>Handling Nested Objects</h2>
            <p>
              Nested objects automatically get their own interfaces with descriptive names:
            </p>
            <pre><code>{`// Input
{
  "user": {
    "profile": {
      "name": "John"
    }
  }
}

// Output
interface RootUserProfile {
  name: string;
}

interface RootUser {
  profile: RootUserProfile;
}

interface Root {
  user: RootUser;
}`}</code></pre>

            <h2>Working with API Responses</h2>
            <p>Common workflow for typing API data:</p>
            <ol>
              <li>Make an API request and copy the JSON response</li>
              <li>Paste it into this tool</li>
              <li>Name the root interface (e.g., <code>ApiResponse</code>)</li>
              <li>Copy the generated interfaces to your TypeScript project</li>
              <li>Use with <code>fetch</code> or your HTTP client</li>
            </ol>

            <pre><code>{`// Usage in TypeScript
const response = await fetch('/api/users');
const data: User[] = await response.json();

// Now you have full type safety
data.forEach(user => {
  console.log(user.name); // TypeScript knows this is a string
});`}</code></pre>

            <h2>Pro Tips</h2>
            <ul>
              <li>
                💡 <strong>Use representative data</strong> — Include all possible fields 
                in your sample JSON for complete interfaces
              </li>
              <li>
                💡 <strong>Handle optional fields</strong> — If a field might be missing, 
                manually add <code>?</code> after generation
              </li>
              <li>
                💡 <strong>Union types</strong> — For fields that can be multiple types, 
                consider using union types manually
              </li>
              <li>
                💡 <strong>Validate first</strong> — Use the <a href="/">JSON Validator</a> to 
                ensure your JSON is valid before converting
              </li>
            </ul>

            <h2>Limitations</h2>
            <ul>
              <li>Cannot detect optional properties (all properties are required)</li>
              <li>Cannot infer union types for non-array values</li>
              <li>Date strings are typed as <code>string</code>, not <code>Date</code></li>
            </ul>
            <p>
              For these cases, manually adjust the generated interfaces after copying.
            </p>

            <h2>Related Tools</h2>
            <ul>
              <li><a href="/">JSON Validator</a> — Validate your JSON first</li>
              <li><a href="/json-schema">JSON Schema Validator</a> — Another way to define JSON structure</li>
              <li><a href="/json-to-csv">JSON to CSV</a> — Export JSON data</li>
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
