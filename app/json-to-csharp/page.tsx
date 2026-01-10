import { Metadata } from 'next';
import { ToolNav } from '@/components/ToolNav';
import { Container } from '@/components/Container';
import { JsonToCSharpConverter } from './JsonToCSharpConverter';

export const metadata: Metadata = {
  title: 'JSON to C# Converter - Generate Classes Online | JSONLint',
  description:
    'Convert JSON to C# classes instantly. Generate POCO classes or records with JsonProperty attributes. Supports Newtonsoft.Json and System.Text.Json.',
};

export default function JsonToCSharpPage() {
  return (
    <>
      <ToolNav />

      <Container className="py-4">
        <div className="mb-4 flex justify-center">
          <div id="bsa-zone_1570746984891-3_123456"></div>
        </div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          JSON to C# Converter
        </h1>
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
          Generate C# classes from JSON data. Paste your JSON and configure options:
        </p>

        <JsonToCSharpConverter />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6 mt-8">
          <div className="prose-custom">
            <h2>Generate C# Classes from JSON</h2>
            <p>
              This tool automatically generates C# class definitions from your JSON data. 
              It infers types from values, handles nested objects, and supports both 
              Newtonsoft.Json and System.Text.Json serialization attributes.
            </p>

            <h2>Output Options</h2>
            
            <h3>Standard POCO Classes</h3>
            <p>The default output generates plain old CLR object (POCO) classes with properties:</p>
            <pre><code>{`public class User
{
    [JsonProperty("name")]
    public string Name { get; set; }

    [JsonProperty("age")]
    public int Age { get; set; }
}`}</code></pre>

            <h3>C# 9+ Records</h3>
            <p>
              Enable "Use Records" for immutable, concise data types. Records are ideal for 
              DTOs and API response models:
            </p>
            <pre><code>{`public record User(string Name, int Age);`}</code></pre>

            <h3>Newtonsoft.Json vs System.Text.Json</h3>
            <p>Choose the serialization library your project uses:</p>
            <ul>
              <li>
                <strong>Newtonsoft.Json</strong> (default) — Uses <code>[JsonProperty]</code> attributes. 
                Most compatible, widely used in older projects.
              </li>
              <li>
                <strong>System.Text.Json</strong> — Uses <code>[JsonPropertyName]</code> attributes. 
                Built into .NET Core 3.0+ and .NET 5+, better performance.
              </li>
            </ul>

            <h2>Type Inference</h2>
            <p>The converter automatically infers C# types from JSON values:</p>
            <table>
              <thead>
                <tr>
                  <th>JSON Type</th>
                  <th>C# Type</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>string</td>
                  <td><code>string</code></td>
                  <td></td>
                </tr>
                <tr>
                  <td>integer</td>
                  <td><code>int</code> or <code>long</code></td>
                  <td>Uses <code>long</code> for values exceeding int range</td>
                </tr>
                <tr>
                  <td>decimal</td>
                  <td><code>double</code></td>
                  <td></td>
                </tr>
                <tr>
                  <td>boolean</td>
                  <td><code>bool</code></td>
                  <td></td>
                </tr>
                <tr>
                  <td>null</td>
                  <td><code>object?</code></td>
                  <td>Nullable reference type</td>
                </tr>
                <tr>
                  <td>array</td>
                  <td><code>List&lt;T&gt;</code></td>
                  <td>Type inferred from first element</td>
                </tr>
                <tr>
                  <td>object</td>
                  <td>Nested class</td>
                  <td>Generates separate class definition</td>
                </tr>
              </tbody>
            </table>

            <h2>Example Conversion</h2>
            <p>Given this JSON:</p>
            <pre><code>{`{
  "id": 1,
  "email": "user@example.com",
  "profile": {
    "displayName": "John",
    "avatarUrl": null
  },
  "roles": ["admin", "user"]
}`}</code></pre>

            <p>The converter generates:</p>
            <pre><code>{`using Newtonsoft.Json;
using System.Collections.Generic;

public class Root
{
    [JsonProperty("id")]
    public int Id { get; set; }

    [JsonProperty("email")]
    public string Email { get; set; }

    [JsonProperty("profile")]
    public Profile Profile { get; set; }

    [JsonProperty("roles")]
    public List<string> Roles { get; set; }
}

public class Profile
{
    [JsonProperty("displayName")]
    public string DisplayName { get; set; }

    [JsonProperty("avatarUrl")]
    public object? AvatarUrl { get; set; }
}`}</code></pre>

            <h2>Using Generated Classes</h2>
            
            <h3>Deserializing JSON with Newtonsoft.Json</h3>
            <pre><code>{`using Newtonsoft.Json;

string json = GetJsonFromApi();
var user = JsonConvert.DeserializeObject<Root>(json);
Console.WriteLine(user.Email);`}</code></pre>

            <h3>Deserializing with System.Text.Json</h3>
            <pre><code>{`using System.Text.Json;

string json = GetJsonFromApi();
var user = JsonSerializer.Deserialize<Root>(json);
Console.WriteLine(user.Email);`}</code></pre>

            <h2>Configuration Tips</h2>
            <ul>
              <li>
                <strong>PascalCase conversion</strong> — Enable to convert <code>userName</code> to 
                <code>UserName</code> following C# conventions
              </li>
              <li>
                <strong>Namespace</strong> — Add a namespace wrapper for better code organization
              </li>
              <li>
                <strong>JSON attributes</strong> — Enable when property names differ from JSON keys, 
                or disable for cleaner code when names match
              </li>
            </ul>

            <h2>Common Issues</h2>
            
            <h3>Empty arrays</h3>
            <p>
              Empty arrays generate <code>List&lt;object&gt;</code> since the element type can't be 
              inferred. Update to the correct type in your code.
            </p>

            <h3>Mixed-type arrays</h3>
            <p>
              If an array contains different types, the converter uses <code>List&lt;object&gt;</code>. 
              Consider using separate properties or a discriminated union pattern.
            </p>

            <h3>Reserved keywords</h3>
            <p>
              If your JSON contains C# reserved keywords as keys (like "class" or "event"), 
              you'll need to manually add the <code>@</code> prefix to the property name.
            </p>

            <h2>Related Tools</h2>
            <ul>
              <li><a href="/">JSON Validator</a> — Validate your JSON before converting</li>
              <li><a href="/json-to-typescript">JSON to TypeScript</a> — Generate TypeScript interfaces</li>
              <li><a href="/json-schema">JSON Schema Validator</a> — Validate with a schema</li>
            </ul>

            <h2>Frequently Asked Questions</h2>
            
            <h3>Should I use Newtonsoft.Json or System.Text.Json?</h3>
            <p>
              For new .NET 5+ projects, System.Text.Json is recommended — it's built-in and faster. 
              Use Newtonsoft.Json for older projects or when you need its advanced features 
              (custom converters, LINQ to JSON, etc.).
            </p>

            <h3>What's the difference between classes and records?</h3>
            <p>
              Records (C# 9+) are immutable by default and provide built-in value equality. 
              They're ideal for DTOs. Classes are mutable and better for entities that change over time.
            </p>

            <h3>How do I handle nullable types?</h3>
            <p>
              The converter uses nullable reference types (e.g., <code>string?</code>) for null values. 
              Enable nullable reference types in your project with 
              <code>&lt;Nullable&gt;enable&lt;/Nullable&gt;</code> in your .csproj file.
            </p>

            <h3>Can I add validation attributes?</h3>
            <p>
              The converter generates basic class structure only. Add <code>[Required]</code>, 
              <code>[MaxLength]</code>, and other validation attributes manually as needed.
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
