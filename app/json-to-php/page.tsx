import { Metadata } from 'next';
import { ToolNav } from '@/components/ToolNav';
import { JsonToPhpConverter } from './JsonToPhpConverter';

export const metadata: Metadata = {
  title: 'JSON to PHP Converter - Generate PHP Classes Online | JSONLint',
  description:
    'Convert JSON to PHP classes with typed properties and constructor promotion. Generate PHP 8+ compatible code from JSON data.',
};

export default function JsonToPhpPage() {
  return (
    <>
      <ToolNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-4 flex justify-center">
          <div id="bsa-zone_1570746984891-3_123456"></div>
        </div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          JSON to PHP Converter
        </h1>
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
          Generate PHP classes from JSON data. Paste your JSON:
        </p>

        <JsonToPhpConverter />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6 mt-8">
          <div className="prose-custom">
            <h2>Generate PHP Classes from JSON</h2>
            <p>
              This tool converts JSON data into PHP class definitions. It supports 
              modern PHP 8+ features like constructor property promotion and typed 
              properties.
            </p>

            <h2>Output Options</h2>
            
            <h3>PHP 8+ Constructor Promotion</h3>
            <p>Concise syntax with properties declared directly in the constructor:</p>
            <pre><code>{`class User
{
    public function __construct(
        public int $id,
        public string $userName,
        public bool $isActive
    ) {}
}`}</code></pre>

            <h3>Traditional PHP Class</h3>
            <p>Classic style with separate properties and constructor:</p>
            <pre><code>{`class User
{
    private int $id;
    private string $userName;
    private bool $isActive;

    public function __construct(int $id, string $userName, bool $isActive)
    {
        $this->id = $id;
        $this->userName = $userName;
        $this->isActive = $isActive;
    }
}`}</code></pre>

            <h2>Type Mapping</h2>
            <table>
              <thead>
                <tr>
                  <th>JSON</th>
                  <th>PHP</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>string</td><td><code>string</code></td></tr>
                <tr><td>integer</td><td><code>int</code></td></tr>
                <tr><td>decimal</td><td><code>float</code></td></tr>
                <tr><td>boolean</td><td><code>bool</code></td></tr>
                <tr><td>null</td><td><code>?string</code></td></tr>
                <tr><td>array</td><td><code>array</code></td></tr>
                <tr><td>object</td><td>Nested class</td></tr>
              </tbody>
            </table>

            <h2>Using Generated Classes</h2>
            <pre><code>{`// Create from array
$data = json_decode($jsonString, true);
$user = new User(
    $data['id'],
    $data['userName'],
    $data['isActive']
);

// Access properties
echo $user->userName;`}</code></pre>

            <h2>With JSON Serialization</h2>
            <pre><code>{`// Add JsonSerializable interface
class User implements JsonSerializable
{
    // ... properties and constructor ...
    
    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'userName' => $this->userName,
            'isActive' => $this->isActive,
        ];
    }
}

// Serialize back to JSON
echo json_encode($user);`}</code></pre>

            <h2>Related Tools</h2>
            <ul>
              <li><a href="/">JSON Validator</a> — Validate JSON before converting</li>
              <li><a href="/json-to-java">JSON to Java</a> — Generate Java POJOs</li>
              <li><a href="/json-to-python">JSON to Python</a> — Generate Python dataclasses</li>
              <li><a href="/json-to-csharp">JSON to C#</a> — Generate C# classes</li>
            </ul>

            <h2>Frequently Asked Questions</h2>
            
            <h3>What PHP version is required?</h3>
            <p>
              Constructor promotion requires PHP 8.0+. Typed properties require PHP 7.4+. 
              Disable these options for older PHP versions.
            </p>

            <h3>How do I handle arrays of objects?</h3>
            <p>
              PHP doesn't support generic array types in type hints. Arrays are typed 
              as <code>array</code>. Add PHPDoc annotations manually for IDE support:
              <code>{"/** @var User[] */"}</code>
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
