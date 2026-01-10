import { Metadata } from 'next';
import { ToolNav } from '@/components/ToolNav';
import { Container } from '@/components/Container';
import { JsonToSwiftConverter } from './JsonToSwiftConverter';

export const metadata: Metadata = {
  title: 'JSON to Swift Converter - Generate Codable Structs Online | JSONLint',
  description:
    'Convert JSON to Swift structs with Codable support. Generate CodingKeys automatically for snake_case to camelCase mapping.',
};

export default function JsonToSwiftPage() {
  return (
    <>
      <ToolNav />

      <Container className="py-4">
        <div className="mb-4 flex justify-center">
          <div id="bsa-zone_1570746984891-3_123456"></div>
        </div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          JSON to Swift Converter
        </h1>
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
          Generate Swift structs from JSON. Paste your JSON:
        </p>

        <JsonToSwiftConverter />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6 mt-8">
          <div className="prose-custom">
            <h2>Generate Swift Codable Structs</h2>
            <p>
              This tool converts JSON to Swift structs conforming to the Codable protocol. 
              It automatically generates CodingKeys for property name mapping.
            </p>

            <h2>Example Output</h2>
            <pre><code>{`struct User: Codable {
    let id: Int
    let userName: String
    let isActive: Bool

    enum CodingKeys: String, CodingKey {
        case id
        case userName = "user_name"
        case isActive = "is_active"
    }
}`}</code></pre>

            <h2>Type Mapping</h2>
            <table>
              <thead>
                <tr><th>JSON</th><th>Swift</th></tr>
              </thead>
              <tbody>
                <tr><td>string</td><td><code>String</code></td></tr>
                <tr><td>integer</td><td><code>Int</code></td></tr>
                <tr><td>decimal</td><td><code>Double</code></td></tr>
                <tr><td>boolean</td><td><code>Bool</code></td></tr>
                <tr><td>null</td><td><code>String?</code></td></tr>
                <tr><td>array</td><td><code>[T]</code></td></tr>
                <tr><td>object</td><td>Nested struct</td></tr>
              </tbody>
            </table>

            <h2>Using Generated Code</h2>
            <pre><code>{`let jsonData = """
{"id": 1, "user_name": "john"}
""".data(using: .utf8)!

let decoder = JSONDecoder()
let user = try decoder.decode(User.self, from: jsonData)
print(user.userName) // "john"`}</code></pre>

            <h2>Related Tools</h2>
            <ul>
              <li><a href="/json-to-kotlin">JSON to Kotlin</a> — For Android development</li>
              <li><a href="/json-to-typescript">JSON to TypeScript</a> — For web apps</li>
              <li><a href="/">JSON Validator</a> — Validate JSON first</li>
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
