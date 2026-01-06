import { Metadata } from 'next';
import { ToolNav } from '@/components/ToolNav';
import { JsonToKotlinConverter } from './JsonToKotlinConverter';

export const metadata: Metadata = {
  title: 'JSON to Kotlin Converter - Generate Data Classes Online | JSONLint',
  description:
    'Convert JSON to Kotlin data classes with kotlinx.serialization, Moshi, or Gson support. Generate type-safe Kotlin code instantly.',
};

export default function JsonToKotlinPage() {
  return (
    <>
      <ToolNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-4 flex justify-center">
          <div id="bsa-zone_1570746984891-3_123456"></div>
        </div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          JSON to Kotlin Converter
        </h1>
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
          Generate Kotlin data classes from JSON. Paste your JSON:
        </p>

        <JsonToKotlinConverter />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6 mt-8">
          <div className="prose-custom">
            <h2>Generate Kotlin Data Classes</h2>
            <p>
              This tool converts JSON to Kotlin data classes with support for popular 
              serialization libraries: kotlinx.serialization, Moshi, and Gson.
            </p>

            <h2>Example Output</h2>
            <pre><code>{`@Serializable
data class User(
    val id: Int,
    @SerialName("user_name") val userName: String,
    val email: String,
    @SerialName("is_active") val isActive: Boolean
)`}</code></pre>

            <h2>Serialization Options</h2>
            <table>
              <thead>
                <tr>
                  <th>Library</th>
                  <th>Annotation</th>
                  <th>Best For</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>kotlinx.serialization</td>
                  <td><code>@Serializable</code></td>
                  <td>Kotlin Multiplatform, modern projects</td>
                </tr>
                <tr>
                  <td>Moshi</td>
                  <td><code>@Json</code></td>
                  <td>Android, Square ecosystem</td>
                </tr>
                <tr>
                  <td>Gson</td>
                  <td><code>@SerializedName</code></td>
                  <td>Legacy Android projects</td>
                </tr>
              </tbody>
            </table>

            <h2>Type Mapping</h2>
            <table>
              <thead>
                <tr><th>JSON</th><th>Kotlin</th></tr>
              </thead>
              <tbody>
                <tr><td>string</td><td><code>String</code></td></tr>
                <tr><td>integer</td><td><code>Int</code> / <code>Long</code></td></tr>
                <tr><td>decimal</td><td><code>Double</code></td></tr>
                <tr><td>boolean</td><td><code>Boolean</code></td></tr>
                <tr><td>null</td><td><code>String?</code></td></tr>
                <tr><td>array</td><td><code>List&lt;T&gt;</code></td></tr>
                <tr><td>object</td><td>Nested data class</td></tr>
              </tbody>
            </table>

            <h2>Related Tools</h2>
            <ul>
              <li><a href="/json-to-java">JSON to Java</a> — Generate Java POJOs</li>
              <li><a href="/json-to-swift">JSON to Swift</a> — Generate Swift structs</li>
              <li><a href="/json-to-typescript">JSON to TypeScript</a> — Generate TS interfaces</li>
              <li><a href="/">JSON Validator</a> — Validate JSON first</li>
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
