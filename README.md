# JSONLint.com

The JSON Validator, Formatter, and Toolkit for Developers

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)

## Overview

[**JSONLint**](https://jsonlint.com) is your go-to online solution for JSON validation, formatting, and conversion. Whether you're debugging APIs, transforming data formats, or generating code from JSON schemas, JSONLint has you covered.

> **Chrome Extension**: Check out our [JSON Formatter Chrome Extension](https://chrome.google.com/webstore/detail/json-formatter/ondecobpcidaehknoegeapmclapnkgcl) for formatting JSON directly in your browser. ([GitHub Repo](https://github.com/circlecell/jsonformatter))

## Features

### Core Tools (35+ Total)

**Validators & Formatters**
- **JSON Validator** — Real-time validation with precise error locations and line highlighting
- **Pretty Print** — Format JSON with customizable indentation (2/4 spaces, tabs)
- **Minify** — Compress JSON by removing all whitespace
- **JSON Sorter** — Sort object keys alphabetically (ascending/descending)
- **Escape/Unescape** — Escape JSON for embedding in strings or unescape stringified JSON
- **Stringify** — Convert JSON to escaped string format

**Viewers & Query Tools**
- **Tree Viewer** — Interactive collapsible tree visualization with color-coded types
- **Table Viewer** — Display JSON arrays as sortable HTML tables
- **JSON Diff** — Compare two JSON objects with highlighted differences
- **JSON Path Query** — Extract data using JSONPath expressions
- **Flatten/Unflatten** — Convert nested JSON to dot notation and back

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
- **Schema Validator** — Validate JSON against JSON Schema (Draft-07)
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
- Mobile responsive

## Privacy

🔒 **All JSON processing happens entirely in your browser.** Your data never leaves your machine or gets sent to any server.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Editor**: Monaco Editor with Shiki syntax highlighting
- **Validation**: Ajv (JSON Schema)
- **Utilities**: jsonpath-plus, fast-xml-parser, diff, xlsx

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
│   ├── json-to-csv/       # Converter tools
│   ├── json-to-typescript/ # Code generators
│   ├── json-schema/       # Schema tools
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
│   ├── content/          # Article markdown files
│   └── datasets/         # Dataset documentation (47 datasets)
├── lib/                   # Utility functions
│   ├── json-utils.ts     # JSON parsing/formatting
│   ├── dataset-utils.ts  # Dataset loading utilities
│   ├── shiki.ts          # Syntax highlighting
│   └── themes/           # Custom Shiki themes
├── public/               # Static assets
│   ├── datasets/         # JSON dataset files (47 datasets)
│   └── images/           # Logos, favicons, screenshots
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
3. The page will be available at the corresponding URL

### Adding Datasets

1. Create a JSON file in `public/datasets/`
2. Create a corresponding `.md` file in `docs/datasets/` with frontmatter
3. The dataset will appear at `/datasets/{name}` and in the datasets directory

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Created by [Todd Garland](https://jsonlint.com/about) — Founder of [BuySellAds](https://buysellads.com)

## Credits

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) by Microsoft
- [Douglas Crockford](https://www.crockford.com/) — JSON creator
- [Zach Carter](https://zaa.ch/) — Original jsonlint implementation

---

**[jsonlint.com](https://jsonlint.com)** — Making JSON easier since 2010.
