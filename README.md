# JSONLint.com

The JSON Validator, Formatter, and Toolkit for Developers

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![npm: @jsonlint/core](https://img.shields.io/npm/v/@jsonlint/core?label=%40jsonlint%2Fcore)](https://www.npmjs.com/package/@jsonlint/core)

## Overview

[**JSONLint**](https://jsonlint.com) is an online JSON validator, formatter, converter, and learning toolkit. It combines a multi-diagnostic parser, more than 40 browser-based tools, JSON Schema support, error-code references, practical guides, and free datasets.

> **Chrome Extension**: Check out our [JSON Formatter Chrome Extension](https://chrome.google.com/webstore/detail/json-formatter/ondecobpcidaehknoegeapmclapnkgcl) for formatting JSON directly in your browser. ([GitHub Repo](https://github.com/circlecell/jsonformatter))

## Open-source validation engine

The main validator is powered by [**@jsonlint/core**](https://github.com/toddynho/jsonlint-core), the open-source diagnostics engine extracted from JSONLint. One pass returns every error and warning with stable codes, precise offsets, and line/column locations.

```bash
npm install @jsonlint/core
```

JSONLint documents all 34 diagnostics at [jsonlint.com/errors](https://jsonlint.com/errors), with an explanation, invalid and corrected examples, and a suggested fix for each code.

## Features

### Core Tools (40+ Total)

**Validators & Formatters**
- **JSON Validator** — Reports every error and warning in one pass, with stable diagnostic codes, precise line/column locations, and linked explanations
- **Pretty Print** — Format JSON with customizable indentation (2/4 spaces, tabs)
- **Minify** — Compress JSON by removing all whitespace
- **JSON Sorter** — Sort object keys alphabetically (ascending/descending)
- **Escape/Unescape** — Escape JSON for embedding in strings or unescape stringified JSON
- **Stringify** — Convert JSON to escaped string format
- **JSON Repair** — Auto-fix broken JSON (trailing commas, single quotes, comments, truncated data)
- **JSONC to JSON** — Strip comments and trailing commas from JSONC/JSON5 files
- **Error Analyzer** — Detailed error explanations with suggestions and auto-fix

**Viewers & Query Tools**
- **Tree Viewer** — Interactive collapsible tree visualization with color-coded types
- **Table Viewer** — Display JSON arrays as sortable HTML tables
- **JSON Diff** — Compare two JSON objects with highlighted differences
- **JSON Path Query** — Extract data using JSONPath expressions
- **JSON Search** — Find keys and values with full-text search
- **Size Analyzer** — Analyze JSON size, depth, and structure complexity
- **Flatten/Unflatten** — Convert nested JSON to dot notation and back

**LLM & AI Tools**
- **Token Counter** — Count tokens for GPT-4, Claude, and other LLMs

**Encoding Tools**
- **Base64 Encode/Decode** — Encode JSON to Base64 or decode Base64 to JSON
- **JWT Decoder** — Decode and inspect JWT tokens (header, payload, signature)

**Data Converters**
| From | To |
|------|-----|
| JSON | CSV, Excel, YAML, XML, SQL, Markdown |
| CSV | JSON |
| Excel | JSON |
| YAML | JSON |
| XML | JSON |
| SQL (INSERT) | JSON |

**Code Generators**
Generate typed, production-ready code from JSON:
- **TypeScript** — Interfaces with optional/required properties
- **Python** — Dataclasses with type hints
- **Java** — POJOs with Jackson/Gson annotations
- **C#** — Classes with JsonProperty attributes
- **Go** — Structs with json tags
- **Kotlin** — Data classes with kotlinx.serialization/Moshi/Gson
- **Swift** — Codable structs with CodingKeys
- **Rust** — Serde-compatible structs with derive macros
- **PHP** — Classes with typed properties (PHP 8+)

**Schema Tools**
- **Schema Validator** — Validate against JSON Schema Draft 7, 2019-09, or 2020-12; the validator selects the matching Ajv implementation from `$schema`
- **Schema Generator** — Auto-generate JSON Schema from sample data

### Free JSON Datasets

JSONLint provides **47 free, open-source JSON datasets** for testing, learning, and development:

- **Reference Data** — Countries, languages, currencies, timezones, HTTP status codes
- **Development** — Programming languages, file extensions, config templates (package.json, tsconfig, ESLint)
- **Mock Data** — Users, products, orders, transactions, comments, notifications
- **Geography** — US states, continents, airports, mountains
- **Fun** — Emojis, emoticons, colors, lorem ipsum

Browse all datasets at [jsonlint.com/datasets](https://jsonlint.com/datasets)

### Editor Features

- Monaco Editor (VS Code's editor engine) with Shiki syntax highlighting
- Syntax highlighting and bracket matching
- Error highlighting on specific lines
- Drag and drop file upload
- Copy to clipboard
- Keyboard shortcuts (Ctrl/Cmd+Enter to validate, Ctrl/Cmd+Shift+F to format)
- Dark/light theme with system detection
- Full-width toggle for larger workspaces
- IME support for Chinese (Bopomofo/Zhuyin), Japanese, and Korean input
- Mobile responsive

### Smart Validation

The validator provides structured feedback beyond a single `JSON.parse()` exception:

- **Multi-diagnostic parsing** — Reports all detectable errors and warnings in one pass
- **Stable error codes** — Links each diagnostic to a dedicated `/errors/{CODE}` reference page
- **Helpful hints** — Covers uppercase literals, single quotes, unquoted keys, invalid escapes, missing separators, and more
- **JSONC-aware guidance** — Recognizes comments and trailing commas and suggests the appropriate conversion tools
- **Warnings** — Flags duplicate keys, precision loss, lone surrogates, and suspicious Windows-path escapes without marking otherwise-valid JSON as invalid
- **Preserves formatting** — Validation doesn't modify your input (no more 1.0 → 1 conversion)

## Privacy

🔒 **JSON documents are processed entirely in your browser.** Document contents are never included in telemetry or sent to JSONLint's servers.

To improve the validator, JSONLint records a document-free 10% sample containing only aggregate signals: document length, diagnostic count and codes, validation result, mode, and engine latency. The collector clamps and allowlists every field before writing to Cloudflare Analytics Engine. See [`lib/shadow-telemetry.ts`](lib/shadow-telemetry.ts) and [`workers/shadow/README.md`](workers/shadow/README.md).

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Editor**: Monaco Editor with Shiki syntax highlighting
- **JSON syntax validation**: [@jsonlint/core](https://www.npmjs.com/package/@jsonlint/core)
- **JSON Schema validation**: Ajv 8 with draft-specific 7, 2019-09, and 2020-12 builds
- **Utilities**: jsonpath-plus, fast-xml-parser, diff, and jsonrepair

## Local Development

```bash
# Clone the repository
git clone https://github.com/circlecell/jsonlint.git
cd jsonlint

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit `http://localhost:3000` to see the app.

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_BASE_URL=https://jsonlint.com
```

## Project Structure

```
jsonlint/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home (JSON Validator)
│   ├── tools/             # Tools directory page
│   ├── datasets/          # Datasets directory page
│   ├── learn/             # Learning resources
│   ├── errors/            # Diagnostic index and 34 error-code pages
│   ├── json-to-csv/       # Converter tools
│   ├── json-to-typescript/ # Code generators
│   ├── json-schema/       # Schema tools
│   ├── json-formatter/    # Formatter and Chrome-extension landing page
│   ├── jwt-decoder/       # JWT decoder tool
│   ├── json-base64/       # Base64 encode/decode
│   ├── about/             # About page
│   ├── sitemap.ts         # Dynamic sitemap generator
│   └── [...slug]/         # Dynamic content pages
├── components/            # React components
│   ├── Header.tsx         # Site header with navigation
│   ├── Footer.tsx         # Site footer
│   ├── JsonEditor.tsx     # Monaco editor wrapper
│   ├── JsonValidator.tsx  # Main validator
│   ├── ToolNav.tsx        # Tool navigation bar
│   ├── DatasetCard.tsx    # Dataset preview card
│   └── ArticleLayout.tsx  # Learn article layout
├── docs/                  # Documentation & content
│   ├── content/           # Article markdown files
│   └── datasets/          # Dataset documentation (47 datasets)
├── lib/                   # Utility functions
│   ├── jsonlint-core-integration.ts # Main validator adapter
│   ├── error-codes.ts     # Diagnostic reference catalog
│   ├── shadow-telemetry.ts # Document-free sampled metrics
│   ├── json-utils.ts      # Secondary parsing/formatting operations
│   ├── dataset-utils.ts   # Dataset loading utilities
│   └── themes/            # Custom Shiki themes
├── public/               # Static assets
│   ├── datasets/         # JSON dataset files (47 datasets)
│   └── images/           # Logos, favicons, screenshots
├── workers/shadow/       # Cloudflare telemetry collector and query helpers
└── styles/
    └── globals.css       # Global styles & theme variables
```

## URL Parameters

Pre-populate the editor using URL parameters:

- `?json={encoded-json}` — Load JSON directly
- `?url={url}` — Fetch JSON from a URL

Example:
```
https://jsonlint.com/?json=%7B%22hello%22%3A%22world%22%7D
```

## Contributing

We welcome contributions! If you have suggestions, feature requests, or found a bug:

1. [Create an Issue](https://github.com/circlecell/jsonlint/issues)
2. [Submit a Pull Request](https://github.com/circlecell/jsonlint/pulls)

### Adding a New Tool

1. Create a new folder in `app/` with the route name
2. Add the converter/tool component
3. Add the page to navigation in `components/ToolNav.tsx` and `components/Footer.tsx`
4. Add SEO content below the tool

### Adding Content Pages

1. Create a `.md` file in `docs/content/completed/`
2. Include frontmatter with `title` and `description`
3. The page will be available at the corresponding URL and added to Learn and the sitemap automatically

### Adding Datasets

1. Create a JSON file in `public/datasets/`
2. Create a corresponding `.md` file in `docs/datasets/` with frontmatter
3. The dataset will appear at `/datasets/{name}` and in the datasets directory

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Created by [Todd Garland](https://jsonlint.com/about) — Founder of [BuySellAds](https://buysellads.com)

## Credits

- [@jsonlint/core](https://github.com/toddynho/jsonlint-core) — Multi-diagnostic JSON parser used by the main validator
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) by Microsoft
- [Douglas Crockford](https://www.crockford.com/) — JSON creator
- [Zach Carter](https://zaa.ch/) — Original jsonlint implementation

---

**[jsonlint.com](https://jsonlint.com)** — Making JSON easier since 2010.
