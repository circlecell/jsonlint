import { Metadata } from 'next';
import { ToolNav } from '@/components/ToolNav';
import { Container } from '@/components/Container';
import { XmlToJsonConverter } from './XmlToJsonConverter';

export const metadata: Metadata = {
  title: 'XML to JSON Converter - Transform XML Data Online | JSONLint',
  description:
    'Convert XML to JSON instantly. Handles attributes, namespaces, and nested elements. Preview the result and copy or download the converted JSON.',
};

export default function XmlToJsonPage() {
  return (
    <>
      <ToolNav />

      <Container className="py-4">
        {/* Top ad zone */}
        <div className="mb-4 flex justify-center">
          <div id="bsa-zone_1570746984891-3_123456"></div>
        </div>

        <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
          Paste your XML below to convert it to JSON:
        </p>

        <XmlToJsonConverter />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6 mt-8">
          <div className="prose-custom">
            <h2>When to Convert XML to JSON</h2>
            <p>
              XML and JSON both represent structured data, but JSON has become the 
              preferred format for web APIs and modern applications. Convert XML to JSON when:
            </p>
            <ul>
              <li>
                <strong>Integrating with REST APIs</strong> — Most modern APIs expect JSON
              </li>
              <li>
                <strong>Working with JavaScript</strong> — JSON parses natively; XML requires a DOM parser
              </li>
              <li>
                <strong>Reducing payload size</strong> — JSON is typically 30-50% smaller than equivalent XML
              </li>
              <li>
                <strong>Migrating legacy systems</strong> — Convert old XML configs to JSON
              </li>
            </ul>

            <h2>How XML Maps to JSON</h2>
            <p>The converter handles XML structures like this:</p>

            <h3>Elements become properties</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>XML:</p>
                <pre><code>{`<person>
  <name>Alice</name>
  <age>30</age>
</person>`}</code></pre>
              </div>
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>JSON:</p>
                <pre><code>{`{
  "person": {
    "name": "Alice",
    "age": "30"
  }
}`}</code></pre>
              </div>
            </div>

            <h3>Attributes use @ prefix</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>XML:</p>
                <pre><code>{`<book id="123" lang="en">
  <title>JSON Guide</title>
</book>`}</code></pre>
              </div>
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>JSON:</p>
                <pre><code>{`{
  "book": {
    "@_id": "123",
    "@_lang": "en",
    "title": "JSON Guide"
  }
}`}</code></pre>
              </div>
            </div>

            <h3>Repeated elements become arrays</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>XML:</p>
                <pre><code>{`<items>
  <item>Apple</item>
  <item>Banana</item>
</items>`}</code></pre>
              </div>
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>JSON:</p>
                <pre><code>{`{
  "items": {
    "item": ["Apple", "Banana"]
  }
}`}</code></pre>
              </div>
            </div>

            <h2>Conversion Options</h2>
            <p>Our converter uses sensible defaults, but understanding the rules helps:</p>
            <ul>
              <li>
                <strong>Attributes</strong> — Prefixed with <code>@_</code> to distinguish from child elements
              </li>
              <li>
                <strong>Text content</strong> — Stored as <code>#text</code> when an element has both text and children
              </li>
              <li>
                <strong>Numbers</strong> — Kept as strings (JSON doesn't distinguish; convert in your code if needed)
              </li>
              <li>
                <strong>Empty elements</strong> — Converted to empty string <code>""</code>
              </li>
              <li>
                <strong>CDATA</strong> — Extracted as plain text
              </li>
            </ul>

            <h2>Common Pitfalls</h2>
            
            <h3>XML has features JSON doesn't support</h3>
            <ul>
              <li>
                <strong>Namespaces</strong> — Preserved but may need manual cleanup
              </li>
              <li>
                <strong>Comments</strong> — Discarded (JSON doesn't support comments)
              </li>
              <li>
                <strong>Processing instructions</strong> — Ignored
              </li>
              <li>
                <strong>Attribute order</strong> — Not guaranteed in JSON objects
              </li>
            </ul>

            <h3>Single vs. multiple elements</h3>
            <p>
              If your XML sometimes has one <code>&lt;item&gt;</code> and sometimes multiple, 
              the JSON structure changes (single object vs. array). Handle this in your code:
            </p>
            <pre><code>{`// Ensure items is always an array
const items = Array.isArray(data.items.item) 
  ? data.items.item 
  : [data.items.item];`}</code></pre>

            <h2>Pro Tips</h2>
            <ul>
              <li>
                💡 <strong>Validate both sides</strong> — Use the <a href="/">JSON Validator</a> to 
                check your output is valid JSON
              </li>
              <li>
                💡 <strong>Check for encoding issues</strong> — Ensure your XML is UTF-8 encoded
              </li>
              <li>
                💡 <strong>Test with edge cases</strong> — Empty elements, special characters, 
                deeply nested structures
              </li>
            </ul>

            <h2>Programmatic Conversion</h2>
            <p>Need to convert in code? Here are popular libraries:</p>
            <ul>
              <li><strong>JavaScript</strong>: <code>fast-xml-parser</code>, <code>xml2js</code></li>
              <li><strong>Python</strong>: <code>xmltodict</code></li>
              <li><strong>Java</strong>: Jackson XML module</li>
              <li><strong>Go</strong>: <code>encoding/xml</code> + custom mapping</li>
            </ul>

            <h2>Related Tools</h2>
            <ul>
              <li><a href="/json-to-xml">JSON to XML Converter</a> — Convert JSON back to XML</li>
              <li><a href="/">JSON Validator</a> — Validate the converted JSON</li>
              <li><a href="/json-path">JSON Path Query</a> — Extract data from the result</li>
              <li><a href="/json-schema">JSON Schema Validator</a> — Validate structure</li>
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
