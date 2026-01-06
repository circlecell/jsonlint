import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'All JSON Tools - Validators, Converters, Formatters | JSONLint',
  description:
    'Complete collection of free JSON tools: validate, format, convert, compare, and transform JSON data. 30+ tools for developers.',
  openGraph: {
    title: 'All JSON Tools | JSONLint',
    description: 'Complete collection of free JSON tools for developers.',
  },
};

const toolCategories = [
  {
    name: 'Validate & Format',
    description: 'Check syntax, format, and clean up your JSON',
    icon: CheckIcon,
    color: 'var(--accent-green)',
    tools: [
      { name: 'JSON Validator', href: '/', description: 'Validate and format JSON with error highlighting' },
      { name: 'Pretty Print', href: '/json-pretty-print', description: 'Format JSON with customizable indentation' },
      { name: 'Minify', href: '/json-minify', description: 'Compress JSON by removing whitespace' },
      { name: 'Sort Keys', href: '/json-sort', description: 'Alphabetically sort object keys' },
      { name: 'Escape', href: '/json-escape', description: 'Escape JSON for embedding in strings' },
      { name: 'Unescape', href: '/json-unescape', description: 'Unescape stringified JSON' },
      { name: 'Stringify', href: '/json-stringify', description: 'Convert to escaped string format' },
    ],
  },
  {
    name: 'View & Query',
    description: 'Explore and extract data from JSON',
    icon: SearchIcon,
    color: 'var(--accent-blue)',
    tools: [
      { name: 'Tree Viewer', href: '/json-tree', description: 'Interactive collapsible tree visualization' },
      { name: 'Table Viewer', href: '/json-to-table', description: 'Display arrays as sortable tables' },
      { name: 'JSON Diff', href: '/json-diff', description: 'Compare two JSON objects side-by-side' },
      { name: 'JSON Path', href: '/json-path', description: 'Query data using JSONPath expressions' },
      { name: 'Flatten', href: '/json-flatten', description: 'Convert nested JSON to dot notation' },
    ],
  },
  {
    name: 'Data Converters',
    description: 'Convert between JSON and other formats',
    icon: ArrowsIcon,
    color: 'var(--accent-amber)',
    tools: [
      { name: 'JSON to CSV', href: '/json-to-csv', description: 'Convert JSON arrays to CSV format' },
      { name: 'CSV to JSON', href: '/csv-to-json', description: 'Parse CSV files into JSON' },
      { name: 'JSON to Excel', href: '/json-to-excel', description: 'Export JSON to Excel spreadsheet' },
      { name: 'Excel to JSON', href: '/excel-to-json', description: 'Import Excel data as JSON' },
      { name: 'JSON to YAML', href: '/json-to-yaml', description: 'Convert JSON to YAML format' },
      { name: 'YAML to JSON', href: '/yaml-to-json', description: 'Parse YAML into JSON' },
      { name: 'JSON to XML', href: '/json-to-xml', description: 'Transform JSON to XML' },
      { name: 'XML to JSON', href: '/xml-to-json', description: 'Parse XML into JSON structure' },
      { name: 'JSON to SQL', href: '/json-to-sql', description: 'Generate SQL INSERT statements' },
      { name: 'SQL to JSON', href: '/sql-to-json', description: 'Convert SQL tables to JSON' },
      { name: 'JSON to Markdown', href: '/json-to-markdown', description: 'Generate Markdown tables from JSON' },
    ],
  },
  {
    name: 'Code Generators',
    description: 'Generate type definitions and classes from JSON',
    icon: CodeIcon,
    color: 'var(--accent-purple)',
    tools: [
      { name: 'JSON to TypeScript', href: '/json-to-typescript', description: 'Generate TypeScript interfaces' },
      { name: 'JSON to Python', href: '/json-to-python', description: 'Generate Python dataclasses' },
      { name: 'JSON to Java', href: '/json-to-java', description: 'Generate Java POJO classes' },
      { name: 'JSON to C#', href: '/json-to-csharp', description: 'Generate C# classes' },
      { name: 'JSON to Go', href: '/json-to-go', description: 'Generate Go structs' },
      { name: 'JSON to Kotlin', href: '/json-to-kotlin', description: 'Generate Kotlin data classes' },
      { name: 'JSON to Swift', href: '/json-to-swift', description: 'Generate Swift Codable structs' },
      { name: 'JSON to Rust', href: '/json-to-rust', description: 'Generate Rust structs with serde' },
      { name: 'JSON to PHP', href: '/json-to-php', description: 'Generate PHP classes' },
    ],
  },
  {
    name: 'Schema Tools',
    description: 'Validate and generate JSON Schema',
    icon: ShieldIcon,
    color: 'var(--accent-red)',
    tools: [
      { name: 'Schema Validator', href: '/json-schema', description: 'Validate JSON against JSON Schema' },
      { name: 'Schema Generator', href: '/json-schema-generator', description: 'Auto-generate schema from data' },
    ],
  },
  {
    name: 'Encoding Tools',
    description: 'Encode and decode JSON data',
    icon: LockIcon,
    color: 'var(--text-secondary)',
    tools: [
      { name: 'Base64 Encode/Decode', href: '/json-base64', description: 'Encode or decode JSON as Base64' },
      { name: 'JWT Decoder', href: '/jwt-decoder', description: 'Decode and inspect JWT tokens' },
    ],
  },
];

export default function ToolsPage() {
  const totalTools = toolCategories.reduce((sum, cat) => sum + cat.tools.length, 0);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            All JSON Tools
          </h1>
          <p
            className="text-lg max-w-2xl mx-auto mb-4"
            style={{ color: 'var(--text-secondary)' }}
          >
            {totalTools} free tools to validate, format, convert, and transform JSON data.
            No signup required.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/" className="btn btn-primary">
              Open Validator
            </Link>
            <Link href="/learn" className="btn btn-secondary">
              Learn JSON
            </Link>
          </div>
        </header>

        {/* Tool Categories */}
        <div className="space-y-12">
          {toolCategories.map((category) => (
            <section key={category.name}>
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: 'var(--bg-tertiary)' }}
                >
                  <category.icon className="w-5 h-5" style={{ color: category.color }} />
                </div>
                <div>
                  <h2
                    className="text-xl font-semibold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {category.name}
                  </h2>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {category.description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.tools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="group p-4 rounded-lg border transition-all hover:border-[var(--accent-blue)] hover:shadow-lg"
                    style={{
                      background: 'var(--bg-secondary)',
                      borderColor: 'var(--border-primary)',
                    }}
                  >
                    <h3
                      className="font-medium mb-1 group-hover:text-[var(--accent-blue)] transition-colors"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {tool.name}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      {tool.description}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Bottom CTA */}
        <section
          className="mt-16 p-8 rounded-xl border text-center"
          style={{
            background: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)',
          }}
        >
          <h2
            className="text-2xl font-bold mb-3"
            style={{ color: 'var(--text-primary)' }}
          >
            Need JSON data to test with?
          </h2>
          <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
            Browse our collection of free JSON datasets for testing and learning.
          </p>
          <Link href="/datasets" className="btn btn-primary">
            Browse Datasets
          </Link>
        </section>
      </div>
    </div>
  );
}

// Icons
function CheckIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function SearchIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function ArrowsIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

function CodeIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function ShieldIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function LockIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
