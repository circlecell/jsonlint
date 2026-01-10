import { Metadata } from 'next';
import { ToolNav } from '@/components/ToolNav';
import { Container } from '@/components/Container';
import { JsonSchemaValidator } from './JsonSchemaValidator';

export const metadata: Metadata = {
  title: 'JSON Schema Validator - Validate JSON Against Schema | JSONLint',
  description:
    'Validate your JSON data against a JSON Schema. Catch structural errors, type mismatches, and missing required fields before they cause bugs.',
};

export default function JsonSchemaPage() {
  return (
    <>
      <ToolNav />

      <Container className="py-4">
        {/* Top ad zone */}
        <div className="mb-4 flex justify-center">
          <div id="bsa-zone_1570746984891-3_123456"></div>
        </div>

        <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
          Paste your schema on the left and data on the right to validate:
        </p>

        <JsonSchemaValidator />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6 mt-8">
          <div className="prose-custom">
            <h2>What is JSON Schema?</h2>
            <p>
              JSON Schema is a declarative language for defining the structure of JSON data. 
              Think of it as TypeScript types, but for JSON—you define what properties exist, 
              their types, and any constraints. Then you can validate any JSON document against 
              that schema.
            </p>

            <h2>When to Use Schema Validation</h2>
            <ul>
              <li>
                <strong>API request validation</strong> — Reject malformed requests before 
                they hit your business logic
              </li>
              <li>
                <strong>Configuration files</strong> — Catch typos in config before deployment
              </li>
              <li>
                <strong>Form data</strong> — Validate user input on both client and server
              </li>
              <li>
                <strong>Data pipelines</strong> — Ensure incoming data matches expected format
              </li>
              <li>
                <strong>API documentation</strong> — Schemas serve as living documentation
              </li>
            </ul>

            <h2>Quick Reference</h2>
            
            <h3>Basic Types</h3>
            <pre><code>{`{ "type": "string" }
{ "type": "number" }
{ "type": "integer" }
{ "type": "boolean" }
{ "type": "null" }
{ "type": "array" }
{ "type": "object" }`}</code></pre>

            <h3>String Constraints</h3>
            <pre><code>{`{
  "type": "string",
  "minLength": 1,
  "maxLength": 100,
  "pattern": "^[a-z]+$",
  "format": "email"  // or: uri, date-time, uuid
}`}</code></pre>

            <h3>Number Constraints</h3>
            <pre><code>{`{
  "type": "number",
  "minimum": 0,
  "maximum": 100,
  "exclusiveMinimum": 0,
  "multipleOf": 0.01
}`}</code></pre>

            <h3>Object with Required Properties</h3>
            <pre><code>{`{
  "type": "object",
  "properties": {
    "id": { "type": "integer" },
    "name": { "type": "string" },
    "email": { "type": "string", "format": "email" }
  },
  "required": ["id", "name"],
  "additionalProperties": false
}`}</code></pre>

            <h3>Array Validation</h3>
            <pre><code>{`{
  "type": "array",
  "items": { "type": "string" },
  "minItems": 1,
  "maxItems": 10,
  "uniqueItems": true
}`}</code></pre>

            <h2>Complete Example</h2>
            <p>Here's a schema for a user profile API response:</p>
            <pre><code>{`{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "id": { 
      "type": "integer",
      "minimum": 1
    },
    "username": { 
      "type": "string",
      "minLength": 3,
      "maxLength": 20,
      "pattern": "^[a-zA-Z0-9_]+$"
    },
    "email": { 
      "type": "string", 
      "format": "email" 
    },
    "role": { 
      "type": "string",
      "enum": ["admin", "user", "guest"]
    },
    "profile": {
      "type": "object",
      "properties": {
        "bio": { "type": "string", "maxLength": 500 },
        "avatar": { "type": "string", "format": "uri" }
      }
    },
    "createdAt": { 
      "type": "string", 
      "format": "date-time" 
    }
  },
  "required": ["id", "username", "email", "role"],
  "additionalProperties": false
}`}</code></pre>

            <h2>Understanding Validation Errors</h2>
            <p>When validation fails, you'll see errors like:</p>
            <ul>
              <li>
                <code>must have required property 'name'</code> — A required field is missing
              </li>
              <li>
                <code>must be string</code> — Wrong type (e.g., number instead of string)
              </li>
              <li>
                <code>must match format "email"</code> — String doesn't match the format
              </li>
              <li>
                <code>must NOT have additional properties</code> — Unknown field when 
                <code>additionalProperties: false</code>
              </li>
              <li>
                <code>must be {'>='} 0</code> — Number violates minimum constraint
              </li>
            </ul>

            <h2>Pro Tips</h2>
            <ul>
              <li>
                💡 <strong>Start strict</strong> — Use <code>"additionalProperties": false</code> to 
                catch typos in property names. You can always loosen later.
              </li>
              <li>
                💡 <strong>Use enums for known values</strong> — Instead of just <code>string</code>, 
                use <code>"enum": ["active", "inactive"]</code> when you know the valid values.
              </li>
              <li>
                💡 <strong>Add descriptions</strong> — Include <code>"description"</code> fields 
                for documentation that travels with your schema.
              </li>
              <li>
                💡 <strong>Test edge cases</strong> — Validate with empty objects, null values, 
                and boundary numbers to ensure your schema handles them correctly.
              </li>
            </ul>

            <h2>Supported Draft Version</h2>
            <p>
              This validator uses <a href="https://ajv.js.org/" target="_blank" rel="noopener">Ajv</a> and 
              supports JSON Schema draft-07 by default. Most draft-04 and draft-06 schemas will also work.
            </p>

            <h2>Related Tools</h2>
            <ul>
              <li><a href="/">JSON Validator</a> — Validate JSON syntax</li>
              <li><a href="/json-diff">JSON Diff</a> — Compare two JSON documents</li>
              <li><a href="/json-path">JSON Path Query</a> — Extract values from JSON</li>
            </ul>

            <h2>Learn More</h2>
            <ul>
              <li><a href="https://json-schema.org/" target="_blank" rel="noopener">json-schema.org</a> — Official specification</li>
              <li><a href="https://json-schema.org/understanding-json-schema/" target="_blank" rel="noopener">Understanding JSON Schema</a> — Free online book</li>
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
