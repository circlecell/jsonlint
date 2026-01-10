import { Metadata } from 'next';
import { ToolNav } from '@/components/ToolNav';
import { Container } from '@/components/Container';
import { JsonSchemaGenerator } from './JsonSchemaGenerator';

export const metadata: Metadata = {
  title: 'JSON Schema Generator - Create Schema from JSON Online | JSONLint',
  description:
    'Generate JSON Schema from sample JSON data. Auto-detect formats (email, date, URI), set required fields, and export valid JSON Schema draft 2020-12.',
};

export default function JsonSchemaGeneratorPage() {
  return (
    <>
      <ToolNav />

      <Container className="py-4">
        <div className="mb-4 flex justify-center">
          <div id="bsa-zone_1570746984891-3_123456"></div>
        </div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          JSON Schema Generator
        </h1>
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
          Generate JSON Schema from sample data. Paste a JSON example to create a schema:
        </p>

        <JsonSchemaGenerator />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6 mt-8">
          <div className="prose-custom">
            <h2>What is JSON Schema?</h2>
            <p>
              JSON Schema is a vocabulary that allows you to validate, annotate, and 
              describe JSON data. It defines the structure, types, and constraints 
              that JSON documents must follow.
            </p>
            <p>
              This tool analyzes your sample JSON and generates a schema that matches 
              its structure. You can then use this schema to validate other JSON documents.
            </p>

            <h2>How It Works</h2>
            <ol>
              <li><strong>Paste sample JSON</strong> — Provide a representative example</li>
              <li><strong>Configure options</strong> — Set title, required fields, format detection</li>
              <li><strong>Generate</strong> — Get a JSON Schema (draft 2020-12)</li>
              <li><strong>Validate</strong> — Use the schema to validate other data</li>
            </ol>

            <h2>Generated Schema Features</h2>
            
            <h3>Type inference</h3>
            <p>The generator detects JSON types and maps them to schema types:</p>
            <table>
              <thead>
                <tr>
                  <th>JSON Value</th>
                  <th>Schema Type</th>
                </tr>
              </thead>
              <tbody>
                <tr><td><code>"hello"</code></td><td><code>"type": "string"</code></td></tr>
                <tr><td><code>42</code></td><td><code>"type": "integer"</code></td></tr>
                <tr><td><code>3.14</code></td><td><code>"type": "number"</code></td></tr>
                <tr><td><code>true</code></td><td><code>"type": "boolean"</code></td></tr>
                <tr><td><code>null</code></td><td><code>"type": "null"</code></td></tr>
                <tr><td><code>[...]</code></td><td><code>"type": "array"</code></td></tr>
                <tr><td><code>{"{...}"}</code></td><td><code>"type": "object"</code></td></tr>
              </tbody>
            </table>

            <h3>Format detection</h3>
            <p>
              When enabled, the generator recognizes common string formats:
            </p>
            <ul>
              <li><code>email</code> — user@example.com</li>
              <li><code>uri</code> — https://example.com</li>
              <li><code>date-time</code> — 2024-01-15T10:30:00Z</li>
              <li><code>date</code> — 2024-01-15</li>
              <li><code>time</code> — 10:30:00</li>
              <li><code>uuid</code> — 550e8400-e29b-41d4-a716-446655440000</li>
              <li><code>ipv4</code> — 192.168.1.1</li>
            </ul>

            <h2>Example</h2>
            <p>From this JSON:</p>
            <pre><code>{`{
  "name": "John",
  "email": "john@example.com",
  "age": 30
}`}</code></pre>

            <p>Generates this schema:</p>
            <pre><code>{`{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Generated Schema",
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "email": { "type": "string", "format": "email" },
    "age": { "type": "integer" }
  },
  "required": ["name", "email", "age"]
}`}</code></pre>

            <h2>Options Explained</h2>
            
            <h3>Mark all required</h3>
            <p>
              When enabled, all non-null properties are added to the <code>required</code> array. 
              Disable this for schemas where most fields are optional.
            </p>

            <h3>Detect formats</h3>
            <p>
              Automatically adds <code>format</code> keywords for recognized patterns like 
              emails and dates. Validators can use these for stricter validation.
            </p>

            <h3>Include examples</h3>
            <p>
              Adds <code>examples</code> arrays with values from your sample data. Useful 
              for documentation and API specifications.
            </p>

            <h2>Using the Generated Schema</h2>
            
            <h3>Validate with our tool</h3>
            <p>
              Copy the schema and paste it into our{' '}
              <a href="/json-schema">JSON Schema Validator</a> to validate other JSON documents.
            </p>

            <h3>JavaScript validation</h3>
            <pre><code>{`import Ajv from 'ajv';

const ajv = new Ajv();
const validate = ajv.compile(schema);

const valid = validate(data);
if (!valid) console.log(validate.errors);`}</code></pre>

            <h3>Python validation</h3>
            <pre><code>{`from jsonschema import validate, ValidationError

try:
    validate(instance=data, schema=schema)
except ValidationError as e:
    print(e.message)`}</code></pre>

            <h2>Limitations</h2>
            <ul>
              <li>
                <strong>Single sample</strong> — Schema is based on one example; 
                edge cases may not be covered
              </li>
              <li>
                <strong>No constraints</strong> — Doesn't infer min/max, patterns, or enums
              </li>
              <li>
                <strong>Array type from first element</strong> — Mixed-type arrays need manual adjustment
              </li>
            </ul>
            <p>
              After generating, review and enhance the schema with additional 
              constraints based on your requirements.
            </p>

            <h2>Related Tools</h2>
            <ul>
              <li><a href="/json-schema">JSON Schema Validator</a> — Validate JSON against schema</li>
              <li><a href="/">JSON Validator</a> — Basic JSON validation</li>
              <li><a href="/json-to-typescript">JSON to TypeScript</a> — Generate TS interfaces</li>
              <li><a href="/json-to-python">JSON to Python</a> — Generate Python dataclasses</li>
            </ul>

            <h2>Frequently Asked Questions</h2>
            
            <h3>What JSON Schema version is generated?</h3>
            <p>
              The generator outputs JSON Schema draft 2020-12, the latest version. 
              It's compatible with most modern validators.
            </p>

            <h3>How do I add custom validation rules?</h3>
            <p>
              Edit the generated schema manually. Add <code>minimum</code>, <code>maximum</code>, 
              <code>pattern</code>, <code>enum</code>, or other constraints as needed.
            </p>

            <h3>Can I generate from multiple samples?</h3>
            <p>
              Currently, the generator uses a single sample. For complex schemas with 
              optional fields, create a sample that includes all possible fields, 
              then manually mark optional ones.
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
