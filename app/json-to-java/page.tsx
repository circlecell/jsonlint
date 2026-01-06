import { Metadata } from 'next';
import { ToolNav } from '@/components/ToolNav';
import { JsonToJavaConverter } from './JsonToJavaConverter';

export const metadata: Metadata = {
  title: 'JSON to Java Converter - Generate POJO Classes Online | JSONLint',
  description:
    'Convert JSON to Java classes instantly. Generate POJOs with Lombok, Jackson, or Gson annotations. Supports Java 16+ records.',
};

export default function JsonToJavaPage() {
  return (
    <>
      <ToolNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-4 flex justify-center">
          <div id="bsa-zone_1570746984891-3_123456"></div>
        </div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          JSON to Java Converter
        </h1>
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
          Generate Java POJO classes from JSON data. Paste your JSON and configure options:
        </p>

        <JsonToJavaConverter />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6 mt-8">
          <div className="prose-custom">
            <h2>Generate Java Classes from JSON</h2>
            <p>
              This tool automatically generates Java class definitions from your JSON data. 
              It infers types from values, handles nested objects, and supports popular 
              libraries like Lombok, Jackson, and Gson.
            </p>

            <h2>Output Options</h2>
            
            <h3>Standard POJO with Lombok</h3>
            <p>
              Using Lombok's <code>@Data</code> annotation eliminates boilerplate by 
              auto-generating getters, setters, toString, equals, and hashCode:
            </p>
            <pre><code>{`@Data
public class User {
    @JsonProperty("user_name")
    private String userName;
    
    private Integer age;
    private List<String> roles;
}`}</code></pre>

            <h3>Java 16+ Records</h3>
            <p>
              Records are immutable data classes with concise syntax. Ideal for DTOs:
            </p>
            <pre><code>{`public record User(
    @JsonProperty("user_name") String userName,
    Integer age,
    List<String> roles
) {}`}</code></pre>

            <h3>Jackson vs Gson</h3>
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Jackson</th>
                  <th>Gson</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Annotation</td>
                  <td><code>@JsonProperty</code></td>
                  <td><code>@SerializedName</code></td>
                </tr>
                <tr>
                  <td>Speed</td>
                  <td>Faster for large payloads</td>
                  <td>Simpler for small data</td>
                </tr>
                <tr>
                  <td>Spring Boot</td>
                  <td>Default choice</td>
                  <td>Requires configuration</td>
                </tr>
              </tbody>
            </table>

            <h2>Type Inference</h2>
            <p>The converter maps JSON types to Java:</p>
            <table>
              <thead>
                <tr>
                  <th>JSON</th>
                  <th>Java</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>string</td>
                  <td><code>String</code></td>
                  <td></td>
                </tr>
                <tr>
                  <td>integer</td>
                  <td><code>Integer</code> / <code>Long</code></td>
                  <td>Long for values &gt; 2.1B</td>
                </tr>
                <tr>
                  <td>decimal</td>
                  <td><code>Double</code></td>
                  <td></td>
                </tr>
                <tr>
                  <td>boolean</td>
                  <td><code>Boolean</code></td>
                  <td></td>
                </tr>
                <tr>
                  <td>array</td>
                  <td><code>List&lt;T&gt;</code></td>
                  <td>Type from first element</td>
                </tr>
                <tr>
                  <td>object</td>
                  <td>Nested class</td>
                  <td>Separate class generated</td>
                </tr>
                <tr>
                  <td>null</td>
                  <td><code>Object</code></td>
                  <td></td>
                </tr>
              </tbody>
            </table>

            <h2>Example Conversion</h2>
            <p>Input JSON:</p>
            <pre><code>{`{
  "id": 1,
  "username": "john_doe",
  "profile": {
    "firstName": "John",
    "age": 30
  }
}`}</code></pre>

            <p>Generated Java (with Lombok + Jackson):</p>
            <pre><code>{`package com.example.model;

import java.util.List;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class Root {
    private Integer id;
    
    private String username;
    
    private Profile profile;
}

@Data
public class Profile {
    @JsonProperty("firstName")
    private String firstName;
    
    private Integer age;
}`}</code></pre>

            <h2>Using Generated Classes</h2>
            
            <h3>With Jackson</h3>
            <pre><code>{`ObjectMapper mapper = new ObjectMapper();

// Deserialize
String json = getJsonFromApi();
Root data = mapper.readValue(json, Root.class);

// Serialize
String output = mapper.writeValueAsString(data);`}</code></pre>

            <h3>With Gson</h3>
            <pre><code>{`Gson gson = new Gson();

// Deserialize
Root data = gson.fromJson(json, Root.class);

// Serialize
String output = gson.toJson(data);`}</code></pre>

            <h2>Best Practices</h2>
            <ul>
              <li>
                <strong>Use Lombok</strong> — Eliminates boilerplate getters/setters
              </li>
              <li>
                <strong>Use wrapper types</strong> — <code>Integer</code> instead of <code>int</code> 
                to handle nulls
              </li>
              <li>
                <strong>Add validation</strong> — Consider adding <code>@NotNull</code>, 
                <code>@Size</code> annotations manually
              </li>
              <li>
                <strong>Use records for DTOs</strong> — Immutable, thread-safe, less code
              </li>
            </ul>

            <h2>Related Tools</h2>
            <ul>
              <li><a href="/">JSON Validator</a> — Validate JSON before converting</li>
              <li><a href="/json-to-csharp">JSON to C#</a> — Generate C# classes</li>
              <li><a href="/json-to-typescript">JSON to TypeScript</a> — Generate TS interfaces</li>
              <li><a href="/json-to-python">JSON to Python</a> — Generate Python dataclasses</li>
              <li><a href="/json-schema">JSON Schema Validator</a> — Validate structure</li>
            </ul>

            <h2>Frequently Asked Questions</h2>
            
            <h3>Should I use Lombok or write getters/setters?</h3>
            <p>
              Lombok is recommended for most projects — it reduces boilerplate significantly. 
              However, some teams prefer explicit code for debugging or IDE support reasons.
            </p>

            <h3>When should I use Records vs Classes?</h3>
            <p>
              Use records for immutable data transfer objects (DTOs). Use classes when you 
              need mutability, inheritance, or complex behavior.
            </p>

            <h3>How do I handle null values?</h3>
            <p>
              The converter uses wrapper types (<code>Integer</code>, <code>Boolean</code>) 
              which can be null. For primitives that shouldn't be null, change to 
              <code>int</code>, <code>boolean</code> manually.
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
