import { Metadata } from 'next';
import { ToolNav } from '@/components/ToolNav';
import { Container } from '@/components/Container';
import { JsonToRustConverter } from './JsonToRustConverter';

export const metadata: Metadata = {
  title: 'JSON to Rust Converter - Generate Serde Structs Online | JSONLint',
  description:
    'Convert JSON to Rust structs with Serde derive macros. Generate type-safe Rust code with automatic field renaming.',
};

export default function JsonToRustPage() {
  return (
    <>
      <ToolNav />

      <Container className="py-4">
        <div className="mb-4 flex justify-center">
          <div id="bsa-zone_1570746984891-3_123456"></div>
        </div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          JSON to Rust Converter
        </h1>
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
          Generate Rust structs from JSON. Paste your JSON:
        </p>

        <JsonToRustConverter />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6 mt-8">
          <div className="prose-custom">
            <h2>Generate Rust Structs from JSON</h2>
            <p>
              This tool converts JSON to Rust structs with Serde derive macros for 
              serialization and deserialization.
            </p>

            <h2>Example Output</h2>
            <pre><code>{`use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct User {
    pub id: i32,
    pub user_name: String,
    pub is_active: bool,
}`}</code></pre>

            <h2>Type Mapping</h2>
            <table>
              <thead>
                <tr><th>JSON</th><th>Rust</th></tr>
              </thead>
              <tbody>
                <tr><td>string</td><td><code>String</code></td></tr>
                <tr><td>integer</td><td><code>i32</code> / <code>i64</code></td></tr>
                <tr><td>decimal</td><td><code>f64</code></td></tr>
                <tr><td>boolean</td><td><code>bool</code></td></tr>
                <tr><td>null</td><td><code>Option&lt;String&gt;</code></td></tr>
                <tr><td>array</td><td><code>Vec&lt;T&gt;</code></td></tr>
                <tr><td>object</td><td>Nested struct</td></tr>
              </tbody>
            </table>

            <h2>Using Generated Code</h2>
            <pre><code>{`// Add to Cargo.toml:
// serde = { version = "1.0", features = ["derive"] }
// serde_json = "1.0"

let json = r#"{"id": 1, "userName": "john"}"#;
let user: User = serde_json::from_str(json)?;
println!("{:?}", user);`}</code></pre>

            <h2>Related Tools</h2>
            <ul>
              <li><a href="/json-to-go">JSON to Go</a> — Generate Go structs</li>
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
