import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'JSONLint Pro - Native JSON Editor for macOS | JSONLint',
  description:
    'Professional-grade JSON toolkit for macOS. Validate, format, repair, and convert JSON with native performance. Works offline, handles large files, integrates with your workflow.',
  keywords: [
    'json validator mac',
    'json editor macos',
    'json formatter mac',
    'json to yaml converter',
    'json pretty print mac',
    'json minifier mac',
    'json repair tool',
    'macos developer tools',
    'native json app',
    'json desktop app',
  ],
  openGraph: {
    title: 'JSONLint Pro - Native JSON Editor for macOS',
    description: 'Professional-grade JSON toolkit for macOS. Works offline, blazing fast, native performance.',
    images: ['/images/jsonlint-pro-og.png'],
  },
};

export default function ProPage() {
  return (
    <div style={{ background: 'var(--bg-primary)' }}>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse at top, var(--accent-blue) 0%, transparent 50%)',
          }}
        />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            {/* App Icon */}
            <div className="mb-8 flex justify-center">
              <div 
                className="w-32 h-32 rounded-[28px] shadow-2xl flex items-center justify-center"
                style={{ 
                  background: 'linear-gradient(135deg, #1a1d23 0%, #2d3748 100%)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <span className="text-5xl font-bold" style={{ color: 'var(--accent-green)' }}>
                  {'{}'}
                </span>
              </div>
            </div>

            <h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
              style={{ color: 'var(--text-primary)' }}
            >
              JSONLint Pro
            </h1>
            
            <p 
              className="text-xl sm:text-2xl mb-4 max-w-2xl mx-auto"
              style={{ color: 'var(--text-secondary)' }}
            >
              Professional JSON toolkit for macOS
            </p>
            
            <p 
              className="text-lg mb-8 max-w-xl mx-auto"
              style={{ color: 'var(--text-muted)' }}
            >
              Native performance. Works offline. Handles large files without breaking a sweat.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <a
                href="#download"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105"
                style={{
                  background: 'var(--accent-blue)',
                  color: 'white',
                }}
              >
                <AppleIcon className="w-6 h-6" />
                Download for Mac
              </a>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                macOS 12.0+ &bull; Universal Binary
              </span>
            </div>

            {/* App Screenshot Placeholder */}
            <div 
              className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl border"
              style={{ 
                borderColor: 'var(--border-primary)',
                background: 'var(--bg-secondary)',
              }}
            >
              <div 
                className="h-8 flex items-center gap-2 px-4"
                style={{ background: 'var(--bg-tertiary)' }}
              >
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                  JSONLint Pro
                </span>
              </div>
              <div className="p-6 font-mono text-sm text-left">
                <pre style={{ color: 'var(--text-secondary)' }}>
{`{
  `}<span style={{ color: 'var(--accent-green)' }}>"name"</span>{`: `}<span style={{ color: 'var(--accent-blue)' }}>"JSONLint Pro"</span>{`,
  `}<span style={{ color: 'var(--accent-green)' }}>"platform"</span>{`: `}<span style={{ color: 'var(--accent-blue)' }}>"macOS"</span>{`,
  `}<span style={{ color: 'var(--accent-green)' }}>"features"</span>{`: [`}<span style={{ color: 'var(--accent-blue)' }}>"validate"</span>{`, `}<span style={{ color: 'var(--accent-blue)' }}>"format"</span>{`, `}<span style={{ color: 'var(--accent-blue)' }}>"repair"</span>{`, `}<span style={{ color: 'var(--accent-blue)' }}>"convert"</span>{`],
  `}<span style={{ color: 'var(--accent-green)' }}>"offline"</span>{`: `}<span style={{ color: 'var(--accent-purple)' }}>true</span>{`,
  `}<span style={{ color: 'var(--accent-green)' }}>"native"</span>{`: `}<span style={{ color: 'var(--accent-purple)' }}>true</span>{`,
  `}<span style={{ color: 'var(--accent-green)' }}>"blazingFast"</span>{`: `}<span style={{ color: 'var(--accent-purple)' }}>true</span>{`
}`}
                </pre>
                <div 
                  className="mt-4 pt-4 border-t flex items-center gap-2"
                  style={{ borderColor: 'var(--border-primary)' }}
                >
                  <CheckCircleIcon className="w-5 h-5 text-accent-green" />
                  <span style={{ color: 'var(--accent-green)' }}>Valid JSON</span>
                  <span className="ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>
                    186 bytes &bull; 7 keys &bull; depth 2
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 sm:py-24" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 
            className="text-3xl sm:text-4xl font-bold text-center mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Everything you need for JSON
          </h2>
          <p 
            className="text-center text-lg mb-12 max-w-2xl mx-auto"
            style={{ color: 'var(--text-muted)' }}
          >
            A complete toolkit for developers who work with JSON daily
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<CheckIcon />}
              title="Real-time Validation"
              description="Instant validation as you type with clear error messages and line numbers. Validates against RFC 8259."
            />
            <FeatureCard
              icon={<WrenchIcon />}
              title="Smart Repair"
              description="Auto-fix trailing commas, single quotes, unquoted keys, comments, and more. One click to fix common issues."
            />
            <FeatureCard
              icon={<SparklesIcon />}
              title="Format & Minify"
              description="Pretty-print with customizable indentation or minify for production. Sort keys alphabetically."
            />
            <FeatureCard
              icon={<ArrowsIcon />}
              title="Format Conversions"
              description="Convert JSON to YAML, CSV, TypeScript interfaces, or Swift Codable structs instantly."
            />
            <FeatureCard
              icon={<TreeIcon />}
              title="Tree View"
              description="Visual tree structure with collapsible nodes. Click to copy JSONPath for any value."
            />
            <FeatureCard
              icon={<MoonIcon />}
              title="Dark Mode"
              description="Beautiful syntax highlighting in both light and dark modes. VS Code-inspired color scheme."
            />
            <FeatureCard
              icon={<BoltIcon />}
              title="Native Performance"
              description="Built with SwiftUI for native macOS performance. Handle multi-MB files without lag."
            />
            <FeatureCard
              icon={<WifiOffIcon />}
              title="Works Offline"
              description="No internet required. Your data never leaves your machine. Complete privacy."
            />
            <FeatureCard
              icon={<DocumentIcon />}
              title="Sample Datasets"
              description="14 built-in sample datasets for testing: users, products, GeoJSON, GraphQL, and more."
            />
          </div>
        </div>
      </section>

      {/* Smart Repair Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 
                className="text-3xl sm:text-4xl font-bold mb-6"
                style={{ color: 'var(--text-primary)' }}
              >
                Smart JSON Repair
              </h2>
              <p 
                className="text-lg mb-6"
                style={{ color: 'var(--text-secondary)' }}
              >
                Paste broken JSON and let JSONLint Pro fix it automatically. No more manual editing for common mistakes.
              </p>
              
              <ul className="space-y-3">
                {[
                  'Trailing commas',
                  'Single quotes to double quotes',
                  'Unquoted property keys',
                  'Smart/curly quotes to straight quotes',
                  'JavaScript comments removal',
                  'undefined to null conversion',
                  'NaN/Infinity to null conversion',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-accent-green flex-shrink-0" />
                    <span style={{ color: 'var(--text-secondary)' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div 
              className="rounded-xl overflow-hidden border"
              style={{ 
                borderColor: 'var(--border-primary)',
                background: 'var(--bg-secondary)',
              }}
            >
              <div className="p-4 border-b" style={{ borderColor: 'var(--border-primary)' }}>
                <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                  Before
                </span>
              </div>
              <pre className="p-4 text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
{`{
  name: 'John Doe',  // unquoted key, single quotes
  "age": 30,
  "active": true,    // trailing comma
}`}
              </pre>
              <div 
                className="p-4 border-t border-b flex items-center gap-2"
                style={{ 
                  borderColor: 'var(--border-primary)',
                  background: 'var(--bg-tertiary)',
                }}
              >
                <ArrowDownIcon className="w-5 h-5" style={{ color: 'var(--accent-blue)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--accent-blue)' }}>
                  One-click repair
                </span>
              </div>
              <div className="p-4 border-b" style={{ borderColor: 'var(--border-primary)' }}>
                <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                  After
                </span>
              </div>
              <pre className="p-4 text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
{`{
  "name": "John Doe",
  "age": 30,
  "active": true
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Section */}
      <section className="py-16 sm:py-24" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 
            className="text-3xl sm:text-4xl font-bold text-center mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Blazing Fast Performance
          </h2>
          <p 
            className="text-center text-lg mb-12 max-w-2xl mx-auto"
            style={{ color: 'var(--text-muted)' }}
          >
            Native Swift code means no JavaScript overhead. Handle large files that would crash a browser.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div 
              className="p-6 rounded-xl"
              style={{ 
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-primary)',
              }}
            >
              <h3 
                className="text-lg font-semibold mb-4"
                style={{ color: 'var(--text-primary)' }}
              >
                Validation Speed
              </h3>
              <div className="space-y-3">
                <PerformanceRow size="1 KB" time="< 1ms" />
                <PerformanceRow size="10 KB" time="< 5ms" />
                <PerformanceRow size="100 KB" time="< 50ms" />
                <PerformanceRow size="1 MB" time="< 500ms" />
              </div>
            </div>

            <div 
              className="p-6 rounded-xl"
              style={{ 
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-primary)',
              }}
            >
              <h3 
                className="text-lg font-semibold mb-4"
                style={{ color: 'var(--text-primary)' }}
              >
                Formatting Speed
              </h3>
              <div className="space-y-3">
                <PerformanceRow size="1 KB" time="< 2ms" />
                <PerformanceRow size="10 KB" time="< 10ms" />
                <PerformanceRow size="100 KB" time="< 100ms" />
                <PerformanceRow size="1 MB" time="< 1 sec" />
              </div>
            </div>

            <div 
              className="p-6 rounded-xl"
              style={{ 
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-primary)',
              }}
            >
              <h3 
                className="text-lg font-semibold mb-4"
                style={{ color: 'var(--text-primary)' }}
              >
                Conversions
              </h3>
              <div className="space-y-3">
                <PerformanceRow size="YAML" time="< 50ms" label="per 10KB" />
                <PerformanceRow size="CSV" time="< 20ms" label="per 10KB" />
                <PerformanceRow size="TypeScript" time="< 10ms" label="per 10KB" />
                <PerformanceRow size="Swift" time="< 10ms" label="per 10KB" />
              </div>
            </div>
          </div>

          <p 
            className="text-center text-sm mt-8"
            style={{ color: 'var(--text-muted)' }}
          >
            Benchmarked on Apple Silicon (M1). Performance may vary on Intel Macs.
          </p>
        </div>
      </section>

      {/* Conversions Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 
            className="text-3xl sm:text-4xl font-bold text-center mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Convert to Any Format
          </h2>
          <p 
            className="text-center text-lg mb-12 max-w-2xl mx-auto"
            style={{ color: 'var(--text-muted)' }}
          >
            Transform JSON into the format you need with a single click
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <ConversionExample
              from="JSON"
              to="TypeScript"
              input={`{
  "id": 123,
  "name": "John",
  "active": true
}`}
              output={`interface Root {
  id: number;
  name: string;
  active: boolean;
}`}
            />
            <ConversionExample
              from="JSON"
              to="YAML"
              input={`{
  "database": {
    "host": "localhost",
    "port": 5432
  }
}`}
              output={`database:
  host: localhost
  port: 5432`}
            />
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="py-16 sm:py-24" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 
            className="text-3xl sm:text-4xl font-bold mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            Ready to get started?
          </h2>
          <p 
            className="text-lg mb-8"
            style={{ color: 'var(--text-secondary)' }}
          >
            Download JSONLint Pro and experience professional JSON editing on your Mac.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <a
              href="https://apps.apple.com/app/jsonlint-pro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105"
              style={{
                background: 'var(--text-primary)',
                color: 'var(--bg-primary)',
              }}
            >
              <AppleIcon className="w-7 h-7" />
              <div className="text-left">
                <div className="text-xs opacity-80">Download on the</div>
                <div className="text-lg font-bold -mt-1">Mac App Store</div>
              </div>
            </a>
          </div>

          <div 
            className="flex flex-wrap justify-center gap-6 text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            <span className="flex items-center gap-2">
              <CheckIcon className="w-4 h-4 text-accent-green" />
              macOS 12.0+
            </span>
            <span className="flex items-center gap-2">
              <CheckIcon className="w-4 h-4 text-accent-green" />
              Universal Binary
            </span>
            <span className="flex items-center gap-2">
              <CheckIcon className="w-4 h-4 text-accent-green" />
              ~5 MB Download
            </span>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 
            className="text-3xl sm:text-4xl font-bold text-center mb-12"
            style={{ color: 'var(--text-primary)' }}
          >
            Why go native?
          </h2>

          <div 
            className="rounded-xl overflow-hidden border"
            style={{ 
              borderColor: 'var(--border-primary)',
              background: 'var(--bg-secondary)',
            }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--bg-tertiary)' }}>
                  <th className="text-left p-4 font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Feature
                  </th>
                  <th className="text-center p-4 font-semibold" style={{ color: 'var(--accent-blue)' }}>
                    JSONLint Pro
                  </th>
                  <th className="text-center p-4 font-semibold" style={{ color: 'var(--text-muted)' }}>
                    Web Tools
                  </th>
                </tr>
              </thead>
              <tbody style={{ color: 'var(--text-secondary)' }}>
                <ComparisonRow feature="Works offline" pro={true} web={false} />
                <ComparisonRow feature="Large file support (10MB+)" pro={true} web={false} />
                <ComparisonRow feature="Native keyboard shortcuts" pro={true} web={false} />
                <ComparisonRow feature="Data stays on device" pro={true} web="Varies" />
                <ComparisonRow feature="macOS Services integration" pro={true} web={false} />
                <ComparisonRow feature="Tab-based workflow" pro={true} web="Some" />
                <ComparisonRow feature="Drag & drop files" pro={true} web={true} />
                <ComparisonRow feature="Format conversions" pro={true} web={true} />
                <ComparisonRow feature="Free to use" pro={true} web={true} />
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Web Alternative */}
      <section className="py-16" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p style={{ color: 'var(--text-muted)' }}>
            Prefer the web? The{' '}
            <Link href="/" className="text-accent-blue hover:underline">
              JSONLint web validator
            </Link>
            {' '}is always free with 40+ tools for JSON validation, formatting, and conversion.
          </p>
        </div>
      </section>
    </div>
  );
}

// Components

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <div 
      className="p-6 rounded-xl transition-all hover:scale-[1.02]"
      style={{ 
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-primary)',
      }}
    >
      <div 
        className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
        style={{ background: 'var(--bg-tertiary)' }}
      >
        <span style={{ color: 'var(--accent-blue)' }}>{icon}</span>
      </div>
      <h3 
        className="text-lg font-semibold mb-2"
        style={{ color: 'var(--text-primary)' }}
      >
        {title}
      </h3>
      <p style={{ color: 'var(--text-muted)' }}>{description}</p>
    </div>
  );
}

function PerformanceRow({ 
  size, 
  time, 
  label 
}: { 
  size: string; 
  time: string; 
  label?: string;
}) {
  return (
    <div className="flex justify-between items-center">
      <span style={{ color: 'var(--text-secondary)' }}>{size}</span>
      <span className="font-mono text-sm" style={{ color: 'var(--accent-green)' }}>
        {time}
        {label && <span className="text-xs ml-1" style={{ color: 'var(--text-muted)' }}>{label}</span>}
      </span>
    </div>
  );
}

function ConversionExample({
  from,
  to,
  input,
  output,
}: {
  from: string;
  to: string;
  input: string;
  output: string;
}) {
  return (
    <div 
      className="rounded-xl overflow-hidden border"
      style={{ 
        borderColor: 'var(--border-primary)',
        background: 'var(--bg-secondary)',
      }}
    >
      <div 
        className="flex items-center justify-between p-3 border-b"
        style={{ 
          borderColor: 'var(--border-primary)',
          background: 'var(--bg-tertiary)',
        }}
      >
        <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
          {from}
        </span>
        <span style={{ color: 'var(--text-muted)' }}>&rarr;</span>
        <span className="text-sm font-medium" style={{ color: 'var(--accent-blue)' }}>
          {to}
        </span>
      </div>
      <div className="grid grid-cols-2 divide-x" style={{ borderColor: 'var(--border-primary)' }}>
        <pre 
          className="p-4 text-xs font-mono overflow-auto"
          style={{ color: 'var(--text-secondary)' }}
        >
          {input}
        </pre>
        <pre 
          className="p-4 text-xs font-mono overflow-auto"
          style={{ color: 'var(--text-secondary)' }}
        >
          {output}
        </pre>
      </div>
    </div>
  );
}

function ComparisonRow({
  feature,
  pro,
  web,
}: {
  feature: string;
  pro: boolean | string;
  web: boolean | string;
}) {
  return (
    <tr className="border-t" style={{ borderColor: 'var(--border-primary)' }}>
      <td className="p-4">{feature}</td>
      <td className="p-4 text-center">
        {pro === true ? (
          <CheckIcon className="w-5 h-5 mx-auto text-accent-green" />
        ) : pro === false ? (
          <XIcon className="w-5 h-5 mx-auto text-accent-red" />
        ) : (
          <span style={{ color: 'var(--text-muted)' }}>{pro}</span>
        )}
      </td>
      <td className="p-4 text-center">
        {web === true ? (
          <CheckIcon className="w-5 h-5 mx-auto text-accent-green" />
        ) : web === false ? (
          <XIcon className="w-5 h-5 mx-auto text-accent-red" />
        ) : (
          <span style={{ color: 'var(--text-muted)' }}>{web}</span>
        )}
      </td>
    </tr>
  );
}

// Icons

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function WrenchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="M5 19l.5 1.5L7 21l-1.5.5L5 23l-.5-1.5L3 21l1.5-.5L5 19z" />
      <path d="M19 11l.5 1.5L21 13l-1.5.5L19 15l-.5-1.5L17 13l1.5-.5L19 11z" />
    </svg>
  );
}

function ArrowsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
    </svg>
  );
}

function TreeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M12 3v18M3 9h18M3 15h18" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function BoltIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function WifiOffIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
      <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
      <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
      <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <line x1="12" y1="20" x2="12.01" y2="20" />
    </svg>
  );
}

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function ArrowDownIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={style}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </svg>
  );
}
