import { Metadata } from 'next';
import { ToolNav } from '@/components/ToolNav';
import { JsonTreeViewer } from './JsonTreeViewer';

export const metadata: Metadata = {
  title: 'JSON Tree Viewer - Visualize JSON Structure Online | JSONLint',
  description:
    'Visualize JSON data as an interactive tree structure. Expand/collapse nodes, explore nested objects, and understand complex JSON hierarchies.',
};

export default function JsonTreePage() {
  return (
    <>
      <ToolNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-4 flex justify-center">
          <div id="bsa-zone_1570746984891-3_123456"></div>
        </div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          JSON Tree Viewer
        </h1>
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
          Visualize JSON as an interactive collapsible tree. Paste your JSON:
        </p>

        <JsonTreeViewer />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6 mt-8">
          <div className="prose-custom">
            <h2>Visualize JSON Structure</h2>
            <p>
              The JSON Tree Viewer transforms raw JSON text into an interactive tree 
              structure. Click on nodes to expand or collapse them, making it easy to 
              navigate complex nested data.
            </p>

            <h2>How to Use</h2>
            <ol>
              <li><strong>Paste your JSON</strong> in the left panel</li>
              <li><strong>Click "View Tree"</strong> to generate the visualization</li>
              <li><strong>Click nodes</strong> to expand/collapse sections</li>
              <li>Use <strong>Expand All / Collapse All</strong> buttons for quick navigation</li>
            </ol>

            <h2>Color Legend</h2>
            <table>
              <thead>
                <tr>
                  <th>Color</th>
                  <th>Type</th>
                  <th>Example</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Red</td>
                  <td>Keys (property names)</td>
                  <td><code>"name"</code></td>
                </tr>
                <tr>
                  <td>Green</td>
                  <td>Strings</td>
                  <td><code>"hello"</code></td>
                </tr>
                <tr>
                  <td>Blue</td>
                  <td>Numbers</td>
                  <td><code>42</code></td>
                </tr>
                <tr>
                  <td>Purple</td>
                  <td>Booleans & null</td>
                  <td><code>true</code>, <code>null</code></td>
                </tr>
                <tr>
                  <td>Gray</td>
                  <td>Brackets & structure</td>
                  <td><code>{"{ }"}</code>, <code>[ ]</code></td>
                </tr>
              </tbody>
            </table>

            <h2>Why Use a Tree View?</h2>
            <ul>
              <li>
                <strong>Navigate complex data</strong> — Collapse irrelevant sections 
                to focus on what matters
              </li>
              <li>
                <strong>Understand structure</strong> — See the hierarchy at a glance 
                without counting brackets
              </li>
              <li>
                <strong>Debug APIs</strong> — Quickly find nested fields in 
                API responses
              </li>
              <li>
                <strong>Learn JSON</strong> — Visual representation helps 
                beginners understand JSON structure
              </li>
            </ul>

            <h2>Node Information</h2>
            <p>
              Each collapsible node shows a summary when collapsed:
            </p>
            <ul>
              <li><code>Object{"{3}"}</code> — Object with 3 properties</li>
              <li><code>Array(5)</code> — Array with 5 elements</li>
            </ul>
            <p>
              The statistics bar shows total counts of objects, arrays, and primitive values.
            </p>

            <h2>Tree View vs Text View</h2>
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Tree View</th>
                  <th>Text View</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Navigation</td>
                  <td>Click to expand/collapse</td>
                  <td>Scroll through text</td>
                </tr>
                <tr>
                  <td>Large files</td>
                  <td>Better (collapse sections)</td>
                  <td>Harder to navigate</td>
                </tr>
                <tr>
                  <td>Editing</td>
                  <td>View only</td>
                  <td>Edit directly</td>
                </tr>
                <tr>
                  <td>Copy/paste</td>
                  <td>Paste input, view output</td>
                  <td>Copy any section</td>
                </tr>
              </tbody>
            </table>

            <h2>Tips for Large JSON</h2>
            <ul>
              <li>Use <strong>Collapse All</strong> first, then expand specific sections</li>
              <li>Look at the stats to understand the data size</li>
              <li>For very large files (1MB+), consider using a dedicated JSON viewer application</li>
            </ul>

            <h2>Related Tools</h2>
            <ul>
              <li><a href="/">JSON Validator</a> — Validate and format JSON</li>
              <li><a href="/json-pretty-print">JSON Pretty Print</a> — Format as indented text</li>
              <li><a href="/json-path">JSON Path</a> — Query specific values</li>
              <li><a href="/json-to-table">JSON to Table</a> — View as spreadsheet</li>
            </ul>

            <h2>Frequently Asked Questions</h2>
            
            <h3>Can I edit JSON in the tree view?</h3>
            <p>
              The tree view is read-only for visualization. Edit your JSON in the 
              left panel and click "View Tree" to update the visualization.
            </p>

            <h3>Why do some nodes not expand?</h3>
            <p>
              Empty objects <code>{"{}"}</code> and arrays <code>[]</code> have no 
              children to expand. The node displays without an expand arrow.
            </p>

            <h3>Is there a size limit?</h3>
            <p>
              The tool runs in your browser, so very large JSON (several MB) may 
              cause performance issues. For huge files, consider using desktop tools 
              or command-line utilities like <code>jq</code>.
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
