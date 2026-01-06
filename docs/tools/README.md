# JSONLint Tools Documentation

This directory contains implementation prompts and documentation for all JSONLint tools.

## Structure

```
docs/tools/
├── README.md                 # This file
├── completed/                # Implemented tools (22)
│   └── [tool-name].md
└── pending/                  # Tools to implement (11)
    └── _[tool-name].md       # Underscore prefix = not yet built
```

## Completed Tools (22)

| Tool | URL | Volume | Status |
|------|-----|--------|--------|
| JSON Validator | `/` | 37,000 | ✅ |
| JSON to CSV | `/json-to-csv` | 7,500 | ✅ |
| CSV to JSON | `/csv-to-json` | 4,200 | ✅ |
| JSON to YAML | `/json-to-yaml` | 3,400 | ✅ |
| YAML to JSON | `/yaml-to-json` | 3,400 | ✅ |
| JSON Diff | `/json-diff` | 3,400 | ✅ |
| XML to JSON | `/xml-to-json` | 2,900 | ✅ |
| JSON to Excel | `/json-to-excel` | 2,500 | ✅ |
| JSON Unescape | `/json-unescape` | 2,100 | ✅ |
| JSON to XML | `/json-to-xml` | 2,100 | ✅ |
| JSON Schema Validator | `/json-schema` | 2,000 | ✅ |
| JSON to C# | `/json-to-csharp` | 1,900 | ✅ |
| JSON Path | `/json-path` | 1,300 | ✅ |
| JSON Pretty Print | `/json-pretty-print` | 1,200 | ✅ |
| JSON Minify | `/json-minify` | 700 | ✅ |
| JSON Sorter | `/json-sort` | 600 | ✅ |
| JSON Stringify | `/json-stringify` | 600 | ✅ |
| Excel to JSON | `/excel-to-json` | 600 | ✅ |
| JSON to Table | `/json-to-table` | 500 | ✅ |
| JSON Escape | `/json-escape` | 400 | ✅ |
| JSON to TypeScript | `/json-to-typescript` | 150 | ✅ |
| JSON Flatten | `/json-flatten` | 100 | ✅ |

## Pending Tools by Priority

### Code Generators (High ROI)
| Tool | URL | Volume | KD | Est. Time |
|------|-----|--------|-----|-----------|
| JSON to Java | `/json-to-java` | 600 | 12 | 2-3 hours |
| JSON to Python | `/json-to-python` | 500 | 8 | 2-3 hours |
| JSON to Go | `/json-to-go` | 400 | 6 | 2-3 hours |
| JSON Schema Generator | `/json-schema-generator` | 350 | 5 | 4-5 hours |
| JSON to PHP | `/json-to-php` | 300 | 5 | 2-3 hours |
| JSON Tree Viewer | `/json-tree` | 300 | 4 | 3-4 hours |
| JSON to Kotlin | `/json-to-kotlin` | 200 | 4 | 2-3 hours |
| JSON to Swift | `/json-to-swift` | 200 | 3 | 2-3 hours |
| JSON to Rust | `/json-to-rust` | 150 | 2 | 2-3 hours |

### Database Tools
| Tool | URL | Volume | KD | Est. Time |
|------|-----|--------|-----|-----------|
| JSON to SQL | `/json-to-sql` | 800 | 8 | 3-4 hours |
| SQL to JSON | `/sql-to-json` | 400 | 5 | 3-4 hours |

## Implementation Workflow

### 1. Before Building
- Read the tool's prompt file in `pending/`
- Review similar existing tools for patterns
- Check SEO requirements (title, description, content length)

### 2. Build the Tool
- Create `/app/[tool-name]/page.tsx` (metadata + layout)
- Create `/app/[tool-name]/[ToolName].tsx` (component)
- Follow existing patterns for consistency

### 3. SEO Content
Each tool page needs:
- **800-1,200 words** of educational content below the tool
- **H2/H3 structure** for featured snippets
- **Code examples** where relevant
- **Internal links** to related tools and articles
- **FAQ section** for People Also Ask

### 4. Internal Linking Updates
After adding a tool, update:
- `components/Footer.tsx` — Add to appropriate column
- `components/Header.tsx` — Add to dropdown if top-tier
- Related tool pages — Add cross-links
- Related articles — Add tool links

### 5. Documentation
- Move prompt from `pending/` to `completed/`
- Remove underscore prefix
- Update ROADMAP.md status

## SEO Checklist for Each Tool

```
□ Title tag: "[Action] - Free Online Tool | JSONLint"
□ Meta description: 120-155 chars with primary keyword
□ H1: Contains primary keyword
□ URL: Clean, keyword-rich slug
□ Content: 800-1,200 words
□ Internal links: 3-5 to related tools/articles
□ Code examples: 2-3 with syntax highlighting
□ FAQ section: 3-5 questions
□ Schema markup: SoftwareApplication (optional)
□ Footer updated
□ Header updated (if high-volume)
□ Cross-links added to related pages
```

## File Naming Convention

- Pending: `_json-to-xml.md` (underscore prefix)
- Completed: `json-to-xml.md` (no prefix)
- Component: `JsonToXmlConverter.tsx` (PascalCase)
- Route: `/json-to-xml` (kebab-case)
