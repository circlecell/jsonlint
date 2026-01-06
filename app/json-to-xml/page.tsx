import { Metadata } from 'next';
import { ToolNav } from '@/components/ToolNav';
import { JsonToXmlConverter } from './JsonToXmlConverter';

export const metadata: Metadata = {
  title: 'JSON to XML Converter - Free Online Tool | JSONLint',
  description:
    'Convert JSON to XML instantly with our free online converter. Supports nested objects, arrays, custom root elements, and formatted output. No installation required.',
};

export default function JsonToXmlPage() {
  return (
    <>
      <ToolNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-4 flex justify-center">
          <div id="bsa-zone_1570746984891-3_123456"></div>
        </div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          JSON to XML Converter
        </h1>
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
          Convert your JSON data to XML format. Paste JSON below and click convert:
        </p>

        <JsonToXmlConverter />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6 mt-8">
          <div className="prose-custom">
            <h2>Why Convert JSON to XML?</h2>
            <p>
              While JSON has become the standard for web APIs, XML remains essential in many 
              enterprise systems, legacy integrations, and industry standards. You might need 
              to convert JSON to XML when:
            </p>
            <ul>
              <li>
                <strong>Integrating with SOAP services</strong> — Many enterprise APIs still use XML-based SOAP
              </li>
              <li>
                <strong>Working with legacy systems</strong> — Older applications often expect XML input
              </li>
              <li>
                <strong>Generating configuration files</strong> — Some tools require XML configs (Maven, Android, etc.)
              </li>
              <li>
                <strong>Industry compliance</strong> — Healthcare (HL7), finance (FIXML), and government systems often mandate XML
              </li>
            </ul>

            <h2>How JSON Maps to XML</h2>
            <p>Understanding the conversion rules helps you work with the output:</p>

            <h3>Objects become elements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>JSON:</p>
                <pre><code>{`{
  "person": {
    "name": "Alice",
    "age": 30
  }
}`}</code></pre>
              </div>
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>XML:</p>
                <pre><code>{`<?xml version="1.0"?>
<root>
  <person>
    <name>Alice</name>
    <age>30</age>
  </person>
</root>`}</code></pre>
              </div>
            </div>

            <h3>Arrays repeat the element</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>JSON:</p>
                <pre><code>{`{
  "colors": ["red", "green", "blue"]
}`}</code></pre>
              </div>
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>XML:</p>
                <pre><code>{`<root>
  <colors>red</colors>
  <colors>green</colors>
  <colors>blue</colors>
</root>`}</code></pre>
              </div>
            </div>

            <h3>Primitives become text content</h3>
            <p>
              Strings, numbers, booleans, and null values are converted to element text content. 
              Special characters like <code>&lt;</code>, <code>&gt;</code>, and <code>&amp;</code> 
              are automatically escaped.
            </p>

            <h2>Conversion Options</h2>
            <ul>
              <li>
                <strong>Root element name</strong> — Customize the wrapper element (default: "root")
              </li>
              <li>
                <strong>Indentation</strong> — Output is formatted with 2-space indentation for readability
              </li>
              <li>
                <strong>XML declaration</strong> — Includes <code>&lt;?xml version="1.0"?&gt;</code> header
              </li>
            </ul>

            <h2>Handling Edge Cases</h2>
            
            <h3>Empty values</h3>
            <p>
              Null values and empty objects become self-closing tags: <code>&lt;field/&gt;</code>
            </p>

            <h3>Special characters in keys</h3>
            <p>
              JSON keys with spaces or special characters are sanitized to valid XML element names. 
              Characters that aren't alphanumeric, underscore, or hyphen are replaced with underscores.
            </p>

            <h3>Deeply nested structures</h3>
            <p>
              The converter handles arbitrary nesting depth. Each level adds indentation for readability.
            </p>

            <h2>JSON vs XML: Key Differences</h2>
            <p>
              Understanding these differences helps when working with converted data:
            </p>
            <ul>
              <li>
                <strong>No native arrays in XML</strong> — Arrays become repeated elements with the same name
              </li>
              <li>
                <strong>No data types</strong> — XML treats everything as text; numbers become strings
              </li>
              <li>
                <strong>Attributes vs elements</strong> — This converter uses elements only; attributes require manual adjustment
              </li>
              <li>
                <strong>Namespaces</strong> — Not generated automatically; add manually if needed
              </li>
            </ul>
            <p>
              For a detailed comparison, see our <a href="/json-vs-xml">JSON vs XML guide</a>.
            </p>

            <h2>Programmatic Conversion</h2>
            <p>Need to convert in code? Here are examples:</p>
            
            <h3>JavaScript</h3>
            <pre><code>{`// Using xmlbuilder2
import { create } from 'xmlbuilder2';

const json = { name: "Alice", age: 30 };
const xml = create({ root: json }).end({ prettyPrint: true });`}</code></pre>

            <h3>Python</h3>
            <pre><code>{`import dicttoxml
import json

data = {"name": "Alice", "age": 30}
xml = dicttoxml.dicttoxml(data, root=True, attr_type=False)`}</code></pre>

            <h2>Related Tools</h2>
            <ul>
              <li><a href="/xml-to-json">XML to JSON Converter</a> — Convert XML back to JSON</li>
              <li><a href="/">JSON Validator</a> — Validate your JSON before converting</li>
              <li><a href="/json-to-yaml">JSON to YAML</a> — Alternative format conversion</li>
              <li><a href="/json-vs-xml">JSON vs XML Guide</a> — When to use each format</li>
            </ul>

            <h2>Frequently Asked Questions</h2>
            
            <h3>How are JSON arrays converted to XML?</h3>
            <p>
              Each array item becomes a separate XML element with the same tag name. For example, 
              <code>["a", "b"]</code> in a key called "items" becomes 
              <code>&lt;items&gt;a&lt;/items&gt;&lt;items&gt;b&lt;/items&gt;</code>.
            </p>

            <h3>Can I customize the root element name?</h3>
            <p>
              Yes! Use the "Root element" input field above the convert button to specify any valid 
              XML element name.
            </p>

            <h3>Does the converter preserve data types?</h3>
            <p>
              XML doesn't have native data types like JSON. Numbers and booleans become text content. 
              You'll need to parse them in your application code.
            </p>

            <h3>How do I add XML attributes?</h3>
            <p>
              This converter creates elements only. To add attributes, manually edit the output or 
              use a library that supports attribute mapping conventions.
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
