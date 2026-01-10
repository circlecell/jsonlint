import { Metadata } from 'next';
import { ToolNav } from '@/components/ToolNav';
import { Container } from '@/components/Container';
import { JsonPathQuery } from './JsonPathQuery';

export const metadata: Metadata = {
  title: 'JSON Path Query - Extract Data from JSON | JSONLint',
  description:
    'Query and extract data from JSON using JSONPath expressions. Filter arrays, navigate nested objects, and find values anywhere in your JSON.',
};

export default function JsonPathPage() {
  return (
    <>
      <ToolNav />

      <Container className="py-4">
        {/* Top ad zone */}
        <div className="mb-4 flex justify-center">
          <div id="bsa-zone_1570746984891-3_123456"></div>
        </div>

        <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
          Enter a JSONPath expression to extract matching values from your JSON:
        </p>

        <JsonPathQuery />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6 mt-8">
          <div className="prose-custom">
            <h2>What is JSONPath?</h2>
            <p>
              JSONPath is XPath for JSON—a query language that lets you extract values from 
              JSON documents using path expressions. Instead of writing loops to find data, 
              you write a single expression like <code>$.users[*].email</code> to get all 
              user emails.
            </p>

            <h2>Syntax Quick Reference</h2>
            <table>
              <thead>
                <tr>
                  <th>Expression</th>
                  <th>Description</th>
                  <th>Example</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>$</code></td>
                  <td>Root object</td>
                  <td><code>$</code> → entire document</td>
                </tr>
                <tr>
                  <td><code>.</code></td>
                  <td>Child property</td>
                  <td><code>$.store</code> → store object</td>
                </tr>
                <tr>
                  <td><code>..</code></td>
                  <td>Recursive descent (find anywhere)</td>
                  <td><code>$..price</code> → all prices</td>
                </tr>
                <tr>
                  <td><code>[n]</code></td>
                  <td>Array index</td>
                  <td><code>$.items[0]</code> → first item</td>
                </tr>
                <tr>
                  <td><code>[*]</code></td>
                  <td>All elements</td>
                  <td><code>$.items[*]</code> → all items</td>
                </tr>
                <tr>
                  <td><code>[-1]</code></td>
                  <td>Last element</td>
                  <td><code>$.items[-1]</code> → last item</td>
                </tr>
                <tr>
                  <td><code>[0:3]</code></td>
                  <td>Array slice</td>
                  <td><code>$.items[0:3]</code> → first 3 items</td>
                </tr>
                <tr>
                  <td><code>[?(@.x)]</code></td>
                  <td>Filter expression</td>
                  <td><code>$..book[?(@.price&lt;10)]</code></td>
                </tr>
              </tbody>
            </table>

            <h2>Working Example</h2>
            <p>Consider this API response:</p>
            <pre><code>{`{
  "store": {
    "name": "TechMart",
    "products": [
      { "id": 1, "name": "Laptop", "price": 999, "inStock": true },
      { "id": 2, "name": "Mouse", "price": 29, "inStock": true },
      { "id": 3, "name": "Keyboard", "price": 79, "inStock": false },
      { "id": 4, "name": "Monitor", "price": 299, "inStock": true }
    ],
    "location": {
      "city": "San Francisco",
      "country": "USA"
    }
  }
}`}</code></pre>

            <h3>Example Queries</h3>
            <table>
              <thead>
                <tr>
                  <th>Query</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>$.store.name</code></td>
                  <td><code>"TechMart"</code></td>
                </tr>
                <tr>
                  <td><code>$.store.products[*].name</code></td>
                  <td><code>["Laptop", "Mouse", "Keyboard", "Monitor"]</code></td>
                </tr>
                <tr>
                  <td><code>$..price</code></td>
                  <td><code>[999, 29, 79, 299]</code></td>
                </tr>
                <tr>
                  <td><code>$.store.products[0]</code></td>
                  <td><code>{`{"id": 1, "name": "Laptop", ...}`}</code></td>
                </tr>
                <tr>
                  <td><code>$.store.products[-1].name</code></td>
                  <td><code>"Monitor"</code></td>
                </tr>
                <tr>
                  <td><code>$.store.products[0:2].name</code></td>
                  <td><code>["Laptop", "Mouse"]</code></td>
                </tr>
                <tr>
                  <td><code>$.store.products[?(@.price&lt;100)].name</code></td>
                  <td><code>["Mouse", "Keyboard"]</code></td>
                </tr>
                <tr>
                  <td><code>$.store.products[?(@.inStock==true)].name</code></td>
                  <td><code>["Laptop", "Mouse", "Monitor"]</code></td>
                </tr>
                <tr>
                  <td><code>$..city</code></td>
                  <td><code>["San Francisco"]</code></td>
                </tr>
              </tbody>
            </table>

            <h2>Filter Expressions</h2>
            <p>
              Filters (<code>[?()]</code>) let you select elements that match a condition. 
              Use <code>@</code> to reference the current element:
            </p>
            <ul>
              <li><code>[?(@.price &gt; 100)]</code> — Price greater than 100</li>
              <li><code>[?(@.price &lt;= 50)]</code> — Price 50 or less</li>
              <li><code>[?(@.inStock == true)]</code> — In stock items</li>
              <li><code>[?(@.name)]</code> — Has a name property</li>
              <li><code>[?(@.tags[*] == "sale")]</code> — Has "sale" in tags array</li>
            </ul>

            <h2>Real-World Use Cases</h2>
            
            <h3>Extract All Emails from API Response</h3>
            <pre><code>$..email</code></pre>
            <p>Finds every email field anywhere in the document—useful when you don't know the exact structure.</p>

            <h3>Get Failed Items from a Batch Response</h3>
            <pre><code>$.results[?(@.status == "failed")]</code></pre>
            <p>Filters to only the items that failed processing.</p>

            <h3>Find Products in a Price Range</h3>
            <pre><code>$.products[?(@.price &gt;= 10 && @.price &lt;= 50)]</code></pre>
            <p>Combines multiple conditions with <code>&&</code>.</p>

            <h3>Get Specific Fields from Nested Arrays</h3>
            <pre><code>$.orders[*].items[*].sku</code></pre>
            <p>Extracts SKUs from all items in all orders.</p>

            <h2>Pro Tips</h2>
            <ul>
              <li>
                💡 <strong>Start with <code>$</code> and build up</strong> — Test <code>$.store</code> 
                before trying <code>$.store.products[?(@.price&gt;100)].name</code>
              </li>
              <li>
                💡 <strong>Use <code>..</code> when you're not sure of the path</strong> — 
                <code>$..id</code> finds all IDs regardless of nesting depth
              </li>
              <li>
                💡 <strong>Filter returns an array</strong> — Even if one item matches, 
                you get <code>[item]</code> not <code>item</code>
              </li>
              <li>
                💡 <strong>Dot notation vs bracket notation</strong> — 
                <code>$.store.name</code> equals <code>$['store']['name']</code>. 
                Use brackets for special characters: <code>$['my-field']</code>
              </li>
            </ul>

            <h2>JSONPath vs Alternatives</h2>
            <table>
              <thead>
                <tr>
                  <th>Tool</th>
                  <th>Best For</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>JSONPath</td>
                  <td>Quick extraction, language-agnostic, browser-friendly</td>
                </tr>
                <tr>
                  <td>jq</td>
                  <td>Command-line processing, complex transformations</td>
                </tr>
                <tr>
                  <td>JavaScript</td>
                  <td>When you need full programming logic</td>
                </tr>
              </tbody>
            </table>

            <h2>Related Tools</h2>
            <ul>
              <li><a href="/">JSON Validator</a> — Validate and format JSON</li>
              <li><a href="/json-diff">JSON Diff</a> — Compare two JSON documents</li>
              <li><a href="/json-schema">JSON Schema Validator</a> — Validate against a schema</li>
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
