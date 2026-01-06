import { Metadata } from 'next';
import { ToolNav } from '@/components/ToolNav';
import { JsonToGoConverter } from './JsonToGoConverter';

export const metadata: Metadata = {
  title: 'JSON to Go Converter - Generate Structs Online | JSONLint',
  description:
    'Convert JSON to Go structs instantly. Generate type-safe Go code with json tags, omitempty support, and proper type inference.',
};

export default function JsonToGoPage() {
  return (
    <>
      <ToolNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-4 flex justify-center">
          <div id="bsa-zone_1570746984891-3_123456"></div>
        </div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          JSON to Go Converter
        </h1>
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
          Generate Go structs from JSON data. Paste your JSON and configure options:
        </p>

        <JsonToGoConverter />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6 mt-8">
          <div className="prose-custom">
            <h2>Generate Go Structs from JSON</h2>
            <p>
              This tool converts JSON data into Go struct definitions with proper json tags. 
              It infers types automatically and handles nested objects by generating 
              separate struct types.
            </p>

            <h2>Example Output</h2>
            <p>From this JSON:</p>
            <pre><code>{`{
  "id": 1,
  "user_name": "john",
  "is_active": true
}`}</code></pre>

            <p>The converter generates:</p>
            <pre><code>{`package main

type Root struct {
	ID       int    \`json:"id,omitempty"\`
	UserName string \`json:"user_name,omitempty"\`
	IsActive bool   \`json:"is_active,omitempty"\`
}`}</code></pre>

            <h2>Options Explained</h2>
            
            <h3>omitempty</h3>
            <p>
              Adds <code>,omitempty</code> to json tags. When marshaling to JSON, 
              fields with zero values (empty string, 0, false) are omitted:
            </p>
            <pre><code>{`// With omitempty
type User struct {
    Name string \`json:"name,omitempty"\`
}

// {} if Name is empty
// {"name":"John"} if Name has value`}</code></pre>

            <h3>Pointer types</h3>
            <p>
              Uses pointer types for nested structs and optional fields. Helpful for 
              distinguishing between "not set" (nil) and "set to zero value":
            </p>
            <pre><code>{`type User struct {
    Age     *int     \`json:"age,omitempty"\`
    Profile *Profile \`json:"profile,omitempty"\`
}`}</code></pre>

            <h2>Type Mapping</h2>
            <table>
              <thead>
                <tr>
                  <th>JSON</th>
                  <th>Go</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>string</td><td><code>string</code></td><td></td></tr>
                <tr><td>integer</td><td><code>int</code> / <code>int64</code></td><td>int64 for large values</td></tr>
                <tr><td>float</td><td><code>float64</code></td><td></td></tr>
                <tr><td>boolean</td><td><code>bool</code></td><td></td></tr>
                <tr><td>null</td><td><code>interface{}</code> or pointer</td><td></td></tr>
                <tr><td>array</td><td><code>[]T</code></td><td>Type from first element</td></tr>
                <tr><td>object</td><td>Nested struct</td><td></td></tr>
              </tbody>
            </table>

            <h2>Using Generated Structs</h2>
            
            <h3>Unmarshal JSON</h3>
            <pre><code>{`import "encoding/json"

jsonData := []byte(\`{"id": 1, "user_name": "john"}\`)
var user Root
err := json.Unmarshal(jsonData, &user)
if err != nil {
    log.Fatal(err)
}
fmt.Println(user.UserName) // "john"`}</code></pre>

            <h3>Marshal to JSON</h3>
            <pre><code>{`user := Root{
    ID:       1,
    UserName: "john",
    IsActive: true,
}
jsonBytes, err := json.Marshal(user)
// {"id":1,"user_name":"john","is_active":true}`}</code></pre>

            <h3>With HTTP APIs</h3>
            <pre><code>{`resp, err := http.Get("https://api.example.com/user")
if err != nil {
    log.Fatal(err)
}
defer resp.Body.Close()

var user Root
err = json.NewDecoder(resp.Body).Decode(&user)`}</code></pre>

            <h2>Go Naming Conventions</h2>
            <p>
              The converter follows Go conventions:
            </p>
            <ul>
              <li><strong>Exported fields</strong> — PascalCase (capitalized) for JSON access</li>
              <li><strong>JSON tags</strong> — Preserve original key names for serialization</li>
              <li><strong>Struct names</strong> — PascalCase from JSON key names</li>
            </ul>

            <h2>Handling Edge Cases</h2>
            
            <h3>Empty arrays</h3>
            <p>
              Empty arrays become <code>[]interface{}</code> since the element type 
              can't be inferred. Update manually to the correct type.
            </p>

            <h3>Mixed-type arrays</h3>
            <p>
              If an array contains different types, it becomes <code>[]interface{}</code>. 
              Consider restructuring your data or using custom unmarshal logic.
            </p>

            <h3>Null values</h3>
            <p>
              Null values become <code>interface{}</code> by default, or pointer types 
              if that option is enabled.
            </p>

            <h2>Related Tools</h2>
            <ul>
              <li><a href="/">JSON Validator</a> — Validate JSON before converting</li>
              <li><a href="/json-to-java">JSON to Java</a> — Generate Java POJOs</li>
              <li><a href="/json-to-python">JSON to Python</a> — Generate Python dataclasses</li>
              <li><a href="/json-to-typescript">JSON to TypeScript</a> — Generate TS interfaces</li>
              <li><a href="/json-schema-generator">JSON Schema Generator</a> — Create schema from data</li>
            </ul>

            <h2>Frequently Asked Questions</h2>
            
            <h3>Should I use omitempty?</h3>
            <p>
              Use <code>omitempty</code> when you want to exclude zero-value fields from JSON output. 
              Don't use it when zero values are meaningful (e.g., a counter that can be 0).
            </p>

            <h3>When should I use pointer types?</h3>
            <p>
              Use pointers when you need to distinguish between "field not set" (nil) and 
              "field set to zero value" (0, "", false). Common for optional API fields.
            </p>

            <h3>How do I handle custom types?</h3>
            <p>
              The generated structs use basic types. For custom types (like time.Time for dates), 
              manually update the struct and implement custom UnmarshalJSON if needed.
            </p>
          </div>
          
          <aside className="hidden lg:block">
            <div id="bsa-zone_1605730077127-6_123456"></div>
          </aside>
        </div>
      </div>
    </>
  );
}
