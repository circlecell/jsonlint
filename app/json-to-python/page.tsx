import { Metadata } from 'next';
import { ToolNav } from '@/components/ToolNav';
import { Container } from '@/components/Container';
import { JsonToPythonConverter } from './JsonToPythonConverter';

export const metadata: Metadata = {
  title: 'JSON to Python Converter - Generate Dataclasses Online | JSONLint',
  description:
    'Convert JSON to Python dataclasses, Pydantic models, or TypedDict. Generate type-annotated Python code with snake_case conversion.',
};

export default function JsonToPythonPage() {
  return (
    <>
      <ToolNav />

      <Container className="py-4">
        <div className="mb-4 flex justify-center">
          <div id="bsa-zone_1570746984891-3_123456"></div>
        </div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          JSON to Python Converter
        </h1>
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
          Generate Python classes from JSON data. Supports dataclasses, Pydantic, and TypedDict:
        </p>

        <JsonToPythonConverter />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6 mt-8">
          <div className="prose-custom">
            <h2>Generate Python Classes from JSON</h2>
            <p>
              This tool converts JSON data into type-annotated Python classes. Choose from 
              dataclasses, Pydantic models, or TypedDict depending on your use case.
            </p>

            <h2>Output Formats</h2>
            
            <h3>dataclass (Python 3.7+)</h3>
            <p>
              Standard library solution for data classes. Simple, no dependencies:
            </p>
            <pre><code>{`from dataclasses import dataclass
from typing import List, Optional

@dataclass
class User:
    id: int
    user_name: str
    email: str
    tags: List[str]
    profile: Optional[Profile] = None`}</code></pre>

            <h3>Pydantic</h3>
            <p>
              Powerful data validation library, popular with FastAPI:
            </p>
            <pre><code>{`from pydantic import BaseModel, Field
from typing import List, Optional

class User(BaseModel):
    id: int
    user_name: str = Field(..., alias="userName")
    email: str
    tags: List[str]
    
    class Config:
        populate_by_name = True`}</code></pre>

            <h3>TypedDict</h3>
            <p>
              Type hints for dictionaries, useful for type checking without runtime overhead:
            </p>
            <pre><code>{`from typing import TypedDict, List

class User(TypedDict):
    id: int
    user_name: str
    email: str
    tags: List[str]`}</code></pre>

            <h2>When to Use Each Format</h2>
            <table>
              <thead>
                <tr>
                  <th>Format</th>
                  <th>Best For</th>
                  <th>Features</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>dataclass</td>
                  <td>General purpose, no deps</td>
                  <td>Auto __init__, __repr__, __eq__</td>
                </tr>
                <tr>
                  <td>Pydantic</td>
                  <td>API validation, FastAPI</td>
                  <td>Validation, serialization, aliases</td>
                </tr>
                <tr>
                  <td>TypedDict</td>
                  <td>Type checking only</td>
                  <td>Dict compatibility, no overhead</td>
                </tr>
              </tbody>
            </table>

            <h2>Options Explained</h2>
            
            <h3>snake_case conversion</h3>
            <p>
              Converts camelCase JSON keys to Python's preferred snake_case:
            </p>
            <pre><code>{`// JSON: "firstName"
# Python: first_name`}</code></pre>
            <p>
              For Pydantic, this adds <code>Field(alias="...")</code> to map between formats.
            </p>

            <h3>Optional for nulls</h3>
            <p>
              When enabled, null values become <code>Optional[T]</code> with a default of <code>None</code>.
            </p>

            <h2>Type Mapping</h2>
            <table>
              <thead>
                <tr>
                  <th>JSON</th>
                  <th>Python</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>string</td><td><code>str</code></td></tr>
                <tr><td>integer</td><td><code>int</code></td></tr>
                <tr><td>float</td><td><code>float</code></td></tr>
                <tr><td>boolean</td><td><code>bool</code></td></tr>
                <tr><td>null</td><td><code>Optional[T]</code> or <code>None</code></td></tr>
                <tr><td>array</td><td><code>List[T]</code></td></tr>
                <tr><td>object</td><td>Nested class</td></tr>
              </tbody>
            </table>

            <h2>Using Generated Classes</h2>
            
            <h3>With dataclass</h3>
            <pre><code>{`import json

# Parse JSON
data = json.loads(json_string)
user = User(**data)

# Access fields
print(user.user_name)

# Convert back to dict
from dataclasses import asdict
user_dict = asdict(user)`}</code></pre>

            <h3>With Pydantic</h3>
            <pre><code>{`# Parse JSON directly
user = User.model_validate_json(json_string)

# Or from dict
user = User(**data)

# Convert to JSON
json_output = user.model_dump_json()

# With aliases (original JSON keys)
json_output = user.model_dump_json(by_alias=True)`}</code></pre>

            <h2>Working with APIs</h2>
            <p>
              For comprehensive JSON handling in Python, see our 
              <a href="/python-json"> Python JSON Guide</a> which covers parsing, 
              serialization, and common patterns.
            </p>

            <h2>Related Tools</h2>
            <ul>
              <li><a href="/python-json">Python JSON Guide</a> — Complete guide to JSON in Python</li>
              <li><a href="/">JSON Validator</a> — Validate JSON before converting</li>
              <li><a href="/json-to-java">JSON to Java</a> — Generate Java POJOs</li>
              <li><a href="/json-to-typescript">JSON to TypeScript</a> — Generate TS interfaces</li>
              <li><a href="/json-schema-generator">JSON Schema Generator</a> — Create schema from data</li>
            </ul>

            <h2>Frequently Asked Questions</h2>
            
            <h3>Should I use dataclass or Pydantic?</h3>
            <p>
              Use <strong>dataclass</strong> for simple data containers without validation needs. 
              Use <strong>Pydantic</strong> when you need validation, serialization, or are building 
              APIs with FastAPI. Pydantic adds ~2ms overhead per parse but catches errors early.
            </p>

            <h3>What Python version do I need?</h3>
            <p>
              Dataclasses require Python 3.7+. Pydantic v2 requires Python 3.8+. TypedDict 
              requires Python 3.8+ (or typing_extensions for 3.7).
            </p>

            <h3>How do I handle nested objects?</h3>
            <p>
              The converter automatically generates separate classes for nested objects 
              and uses them as type annotations. Dependencies are ordered correctly in the output.
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
