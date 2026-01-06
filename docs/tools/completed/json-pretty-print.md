# JSON Pretty Print

## Overview
| Attribute | Value |
|-----------|-------|
| **URL** | `/json-pretty-print` |
| **Target Keyword** | "json pretty print", "pretty print json" |
| **Monthly Volume** | 1,200 |
| **Keyword Difficulty** | 15 |
| **Priority** | Tier 1 - Quick Win |
| **Estimated Time** | 1 hour |
| **Status** | Pending |

## Tool Description
Format JSON with customizable indentation. This can largely reuse the main validator with formatting-focused UI and SEO content.

## Technical Implementation

### Approach Options

**Option A: Alias Route (Recommended)**
- Create page that wraps existing JsonValidator component
- Pre-set formatting options
- Different SEO content/title

**Option B: Dedicated Component**
- Simpler UI focused just on formatting
- No validation messages (or minimal)
- Faster/cleaner for users who just want to format

### Core Functionality
```typescript
// Reuse existing JSON formatting logic
function prettyPrint(json: string, indent: number = 2): string {
  const parsed = JSON.parse(json);
  return JSON.stringify(parsed, null, indent);
}
```

### Options to Include
- [ ] Indentation: 2 spaces, 4 spaces, tabs
- [ ] Sort keys alphabetically
- [ ] Collapse short arrays on one line
- [ ] Remove trailing whitespace

### Reference Implementation
- Main validator already does this
- `/app/json-minify/` for simpler dedicated tool pattern

## SEO Content Requirements

### Page Title
```
JSON Pretty Print - Format & Beautify JSON Online | JSONLint
```

### Meta Description
```
Pretty print JSON instantly with our free online formatter. Customize indentation, sort keys, and beautify minified JSON. No signup required.
```

### H1
```
JSON Pretty Print
```

### Content Structure (800-1,000 words)

#### Section 1: Introduction (100 words)
- What pretty printing means
- Why format JSON
- Tool features

#### Section 2: How to Use (100 words)
- Paste JSON
- Select indentation
- Copy formatted result

#### Section 3: What is Pretty Printing? (150 words)
- Definition
- Readability benefits
- Debugging advantages

#### Section 4: Formatting Options (150 words)
- 2 spaces vs 4 spaces vs tabs
- When to use each
- Industry conventions

#### Section 5: Before and After Example (150 words)
```json
// Before (minified)
{"name":"John","age":30,"city":"New York","hobbies":["reading","gaming"]}

// After (pretty printed)
{
  "name": "John",
  "age": 30,
  "city": "New York",
  "hobbies": [
    "reading",
    "gaming"
  ]
}
```

#### Section 6: Pretty Print in Code (150 words)
- JavaScript: `JSON.stringify(obj, null, 2)`
- Python: `json.dumps(obj, indent=2)`
- Command line: `jq .`

#### Section 7: FAQ (3-4 questions)
1. What's the difference between pretty print and beautify?
2. Does pretty printing change the data?
3. What indentation should I use?
4. Can I pretty print invalid JSON?

## Internal Linking

### Links TO this page (update these)
- `/json-minify` — "Need to format instead? Pretty Print"
- `/` — Can mention in formatting section
- `/benefits-of-using-a-json-beautifier` — Direct link

### Links FROM this page (include these)
- `/` — "Validate and format JSON"
- `/json-minify` — "Need to compress? JSON Minify"
- `/benefits-of-using-a-json-beautifier` — "Benefits of formatting"
- `/json-sort` — "Sort keys alphabetically" (when built)

## Footer/Header Updates

### Footer
Do NOT add to footer (validator already covers this functionality)

### Header
Do NOT add to header (avoid cluttering with redundant tools)

## Files to Create/Modify

### Create
- [ ] `/app/json-pretty-print/page.tsx`
- [ ] `/app/json-pretty-print/JsonPrettyPrinter.tsx` (or reuse validator)

### Modify
- [ ] `/app/json-minify/page.tsx` — Add cross-link
- [ ] `/docs/content/completed/benefits-of-using-a-json-beautifier.md` — Add tool link

## Testing Checklist
- [ ] Basic formatting
- [ ] Different indentation levels
- [ ] Large JSON files
- [ ] Already formatted JSON
- [ ] Invalid JSON (error handling)
- [ ] Copy to clipboard
- [ ] Sort keys option (if included)
