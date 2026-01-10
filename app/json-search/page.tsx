import { Metadata } from 'next';
import { ToolNav } from '@/components/ToolNav';
import { Container } from '@/components/Container';
import { JsonSearcher } from './JsonSearcher';

export const metadata: Metadata = {
  title: 'JSON Search - Find Keys & Values in JSON | JSONLint',
  description:
    'Search and find keys and values in JSON documents. Full-text search with case sensitivity, exact match, and path extraction. Free online JSON search tool.',
  keywords: [
    'json search',
    'find in json',
    'json grep',
    'search json keys',
    'search json values',
    'json finder',
    'json text search',
    'json path finder',
  ],
  openGraph: {
    title: 'JSON Search Tool | JSONLint',
    description: 'Search for keys and values in JSON documents with full-text search capabilities.',
  },
};

export default function JsonSearchPage() {
  return (
    <>
      <ToolNav />

      <Container className="py-4">
        {/* Top ad zone */}
        <div className="mb-4 flex justify-center">
          <div id="bsa-zone_1570746984891-3_123456"></div>
        </div>

        <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
          Search for keys and values in your JSON. Results show the full path for easy extraction:
        </p>

        <JsonSearcher />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6 mt-8">
          <div className="prose-custom">
            <h2>JSON Search Tool</h2>
            <p>
              Our JSON Search tool lets you find keys and values anywhere in your JSON document 
              using simple text search. Unlike <a href="/json-path">JSONPath queries</a> that 
              require knowing the exact path, this tool searches the entire document and shows 
              you where matches are located.
            </p>

            <h2>Features</h2>
            <ul>
              <li><strong>Search keys</strong> — Find properties by name across nested objects</li>
              <li><strong>Search values</strong> — Find data by content (strings, numbers, booleans)</li>
              <li><strong>Case sensitivity</strong> — Toggle between case-sensitive and insensitive search</li>
              <li><strong>Exact match</strong> — Match whole words only, or find partial matches</li>
              <li><strong>Path extraction</strong> — Copy the full JSONPath to any match</li>
            </ul>

            <h2>When to Use JSON Search</h2>
            <p>
              Use this tool when you need to find something in a JSON document but don't know 
              exactly where it is:
            </p>
            <ul>
              <li>Finding all occurrences of a field name like "email" or "id"</li>
              <li>Locating a specific value in a large API response</li>
              <li>Discovering where a particular string appears in nested data</li>
              <li>Exploring unfamiliar JSON structures</li>
            </ul>

            <h2>Search vs. JSONPath Query</h2>
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>JSON Search</th>
                  <th><a href="/json-path">JSONPath</a></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Find by text</td>
                  <td>Yes</td>
                  <td>Limited</td>
                </tr>
                <tr>
                  <td>Requires path knowledge</td>
                  <td>No</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>Extract specific paths</td>
                  <td>Shows paths</td>
                  <td>Extracts values</td>
                </tr>
                <tr>
                  <td>Filter by conditions</td>
                  <td>No</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>Array slicing</td>
                  <td>No</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>Best for</td>
                  <td>Exploration</td>
                  <td>Extraction</td>
                </tr>
              </tbody>
            </table>

            <h2>Understanding Results</h2>
            <p>Each search result shows:</p>
            <ul>
              <li><strong>Path</strong> — The full JSONPath to the match (e.g., <code>$.users[0].email</code>)</li>
              <li><strong>Type</strong> — The data type (string, number, boolean, array, object, null)</li>
              <li><strong>Value</strong> — A preview of the matched value</li>
              <li><strong>Match type</strong> — Whether the match was in a key, value, or both</li>
            </ul>

            <h2>Example Use Cases</h2>
            
            <h3>Find All Email Fields</h3>
            <p>
              Search for "email" with "Search keys" enabled. This finds every property 
              named "email" regardless of nesting depth, whether it's in <code>$.user.email</code> 
              or <code>$.orders[0].customer.contact.email</code>.
            </p>

            <h3>Locate a Specific ID</h3>
            <p>
              Search for "abc123" with "Search values" enabled and "Exact match" on. 
              This finds the exact location of that ID in your document.
            </p>

            <h3>Find Configuration Values</h3>
            <p>
              Search for "true" or "enabled" to find all boolean flags and their paths. 
              Useful for understanding feature flags in config files.
            </p>

            <h2>Tips for Effective Searching</h2>
            <ul>
              <li>
                <strong>Start broad, then narrow</strong> — Begin with "Search keys" and 
                "Search values" both enabled, then toggle off one to reduce results
              </li>
              <li>
                <strong>Use exact match for IDs</strong> — When searching for specific 
                identifiers, enable "Exact match" to avoid partial matches
              </li>
              <li>
                <strong>Copy paths for code</strong> — Click "Copy path" to get a JSONPath 
                you can use in your code or in our <a href="/json-path">JSONPath tool</a>
              </li>
              <li>
                <strong>Combine with JSONPath</strong> — Use Search to find where data lives, 
                then use JSONPath to extract or filter it
              </li>
            </ul>

            <h2>Related Tools</h2>
            <ul>
              <li><a href="/json-path">JSON Path Query</a> — Extract values using JSONPath expressions</li>
              <li><a href="/json-tree">JSON Tree Viewer</a> — Visualize and explore JSON structure</li>
              <li><a href="/">JSON Validator</a> — Validate and format JSON</li>
              <li><a href="/json-diff">JSON Diff</a> — Compare two JSON documents</li>
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
