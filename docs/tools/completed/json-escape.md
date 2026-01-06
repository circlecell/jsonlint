# JSON Escape

## Overview
| Attribute | Value |
|-----------|-------|
| **URL** | `/json-escape` |
| **Target Keyword** | "json escape", "escape json string" |
| **Monthly Volume** | 400 |
| **Keyword Difficulty** | 5 |
| **Priority** | Tier 1 - Quick Win |
| **Estimated Time** | 1-2 hours |
| **Status** | Pending |

## Tool Description
Escape special characters in strings for JSON. Inverse of the existing JSON Unescape tool. Converts raw text into valid JSON string format.

## Technical Implementation

### Core Functionality
```typescript
function escapeJsonString(input: string): string {
  return input
    .replace(/\\/g, '\\\\')   // Backslash first!
    .replace(/"/g, '\\"')     // Double quotes
    .replace(/\n/g, '\\n')    // Newlines
    .replace(/\r/g, '\\r')    // Carriage returns
    .replace(/\t/g, '\\t')    // Tabs
    .replace(/\f/g, '\\f')    // Form feeds
    .replace(/\b/g, '\\b');   // Backspaces
}

// For full JSON string (adds quotes)
function toJsonString(input: string): string {
  return '"' + escapeJsonString(input) + '"';
}
```

### Options to Include
- [ ] Output format: escaped string only vs full JSON string with quotes
- [ ] Escape Unicode characters (\uXXXX)
- [ ] Escape forward slashes (optional in JSON)
- [ ] Show character count

### Edge Cases
- Empty string
- Already escaped content
- Unicode characters
- Control characters
- Very long strings

### Reference Implementation
Look at: `/app/json-unescape/JsonUnescaper.tsx` (inverse logic)

## SEO Content Requirements

### Page Title
```
JSON Escape - Escape Special Characters Online | JSONLint
```

### Meta Description
```
Escape special characters for JSON strings. Convert newlines, quotes, backslashes, and tabs to their escaped equivalents. Free online tool.
```

### H1
```
JSON Escape Tool
```

### Content Structure (600-800 words)

#### Section 1: Introduction (80 words)
- What escaping means
- Why it's necessary
- Tool features

#### Section 2: How to Use (80 words)
- Paste text
- Click escape
- Copy result

#### Section 3: Characters That Need Escaping (150 words)
| Character | Escaped | Description |
|-----------|---------|-------------|
| `"` | `\"` | Double quote |
| `\` | `\\` | Backslash |
| Newline | `\n` | Line break |
| Tab | `\t` | Tab character |
| Carriage return | `\r` | CR |
| Backspace | `\b` | BS |
| Form feed | `\f` | FF |

#### Section 4: Example (100 words)
```
// Input (raw text)
Hello "World"
Line 2	with tab

// Output (escaped)
Hello \"World\"\nLine 2\twith tab

// As JSON string
"Hello \"World\"\nLine 2\twith tab"
```

#### Section 5: When to Use (100 words)
- Building JSON manually
- Embedding text in JSON
- API request bodies
- Configuration values

#### Section 6: Escaping in Code (100 words)
- JavaScript: `JSON.stringify(str)`
- Python: `json.dumps(str)`
- Note: Use library functions when possible

#### Section 7: FAQ (3 questions)
1. What's the difference between escape and stringify?
2. Do I need to escape forward slashes?
3. How do I escape Unicode characters?

## Internal Linking

### Links TO this page (update these)
- `/json-unescape` — "Need to escape? JSON Escape"
- `/json-stringify` — "See also: JSON Escape"

### Links FROM this page (include these)
- `/json-unescape` — "Unescape JSON strings"
- `/json-stringify` — "Stringify entire objects"
- `/` — "Validate your JSON"
- `/common-mistakes-in-json-and-how-to-avoid-them` — "Common escaping mistakes"

## Footer/Header Updates

### Footer
Add to Tools column (near Unescape):
```typescript
{ href: '/json-escape', label: 'JSON Escape' },
```

### Header
Do not add (low volume)

## Files to Create/Modify

### Create
- [ ] `/app/json-escape/page.tsx`
- [ ] `/app/json-escape/JsonEscaper.tsx`

### Modify
- [ ] `/components/Footer.tsx` — Add link
- [ ] `/app/json-unescape/page.tsx` — Add cross-link

## Testing Checklist
- [ ] Double quotes
- [ ] Backslashes
- [ ] Newlines (\n)
- [ ] Carriage returns (\r)
- [ ] Tabs
- [ ] Mixed special characters
- [ ] Unicode characters
- [ ] Empty string
- [ ] Already escaped input
- [ ] Very long strings
- [ ] Copy to clipboard
