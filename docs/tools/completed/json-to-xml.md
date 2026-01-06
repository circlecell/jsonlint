# JSON to XML Converter

## Overview
| Attribute | Value |
|-----------|-------|
| **URL** | `/json-to-xml` |
| **Target Keyword** | "json to xml" |
| **Monthly Volume** | 2,100 |
| **Keyword Difficulty** | 18 |
| **Priority** | Tier 1 - Quick Win |
| **Estimated Time** | 2-3 hours |
| **Status** | Pending |

## Tool Description
Convert JSON data to XML format. Inverse of existing XML to JSON tool.

## Technical Implementation

### Core Functionality
```typescript
function jsonToXml(json: object, rootName: string = 'root'): string {
  // Handle arrays, objects, primitives
  // Configurable options:
  // - Root element name
  // - Indentation (2/4 spaces, tabs)
  // - Attribute handling (convert _attr properties)
  // - Array item naming
  // - Declaration (<?xml version="1.0"?>)
  // - CDATA for special characters
}
```

### Options to Include
- [ ] Root element name (default: "root")
- [ ] Indentation style (2 spaces, 4 spaces, tabs, minified)
- [ ] Include XML declaration
- [ ] Pretty print vs minified
- [ ] Array item element name (default: "item")
- [ ] Handle null values (omit, empty tag, xsi:nil)

### Edge Cases
- Nested arrays
- Mixed content (arrays with objects and primitives)
- Special characters (escape to entities)
- Empty objects/arrays
- Numeric keys (prefix with underscore)
- Keys with spaces or special chars

### Reference Implementation
Look at: `/app/xml-to-json/XmlToJsonConverter.tsx` for patterns

### Dependencies
- None required (pure JS/TS implementation)
- Optional: `xmlbuilder2` for robust XML generation

## SEO Content Requirements

### Page Title
```
JSON to XML Converter - Free Online Tool | JSONLint
```

### Meta Description
```
Convert JSON to XML instantly with our free online converter. Supports nested objects, arrays, custom root elements, and formatted output. No installation required.
```

### H1
```
JSON to XML Converter
```

### Content Structure (800-1,200 words)

#### Section 1: Introduction (100 words)
- What the tool does
- Why convert JSON to XML
- Key features

#### Section 2: How to Use (150 words)
- Step-by-step instructions
- Options explanation
- Example workflow

#### Section 3: JSON vs XML Comparison (200 words)
- When XML is preferred
- Use cases for conversion
- Link to /json-vs-xml article

#### Section 4: Conversion Rules (200 words)
- How objects map to elements
- How arrays are handled
- How primitives are converted
- Attribute handling

#### Section 5: Code Examples (200 words)
```json
// Input
{
  "book": {
    "title": "1984",
    "author": "George Orwell",
    "year": 1949
  }
}
```
```xml
<!-- Output -->
<?xml version="1.0" encoding="UTF-8"?>
<root>
  <book>
    <title>1984</title>
    <author>George Orwell</author>
    <year>1949</year>
  </book>
</root>
```

#### Section 6: Common Use Cases (150 words)
- Legacy system integration
- SOAP web services
- Configuration file conversion
- Data interchange with XML-based systems

#### Section 7: FAQ (3-5 questions)
1. How are JSON arrays converted to XML?
2. Can I customize the root element name?
3. How are null values handled?
4. Does it preserve data types?
5. Can I convert XML back to JSON?

## Internal Linking

### Links TO this page (update these)
- `/xml-to-json` — Add "Convert back to JSON" link
- `/json-vs-xml` — Add tool link in conversion section
- `/json-to-yaml` — Add as related converter
- Homepage `/` — Already in footer

### Links FROM this page (include these)
- `/xml-to-json` — "Convert XML back to JSON"
- `/json-vs-xml` — "Learn about JSON vs XML differences"
- `/` — "Validate your JSON first"
- `/json-minify` — "Minify JSON before converting"
- `/json-to-yaml` — "Or convert to YAML instead"

## Footer/Header Updates

### Footer
Add to Converters column:
```typescript
{ href: '/json-to-xml', label: 'JSON to XML' },
```

### Header
Add to Convert dropdown (high volume justifies inclusion):
```typescript
{ href: '/json-to-xml', label: 'JSON → XML' },
```

## Files to Create/Modify

### Create
- [ ] `/app/json-to-xml/page.tsx`
- [ ] `/app/json-to-xml/JsonToXmlConverter.tsx`

### Modify
- [ ] `/components/Footer.tsx` — Add link
- [ ] `/components/Header.tsx` — Add to dropdown
- [ ] `/app/xml-to-json/page.tsx` — Add cross-link
- [ ] `/docs/content/completed/json-vs-xml.md` — Add tool link

## Testing Checklist
- [ ] Basic object conversion
- [ ] Nested objects
- [ ] Arrays of objects
- [ ] Arrays of primitives
- [ ] Mixed arrays
- [ ] Empty objects/arrays
- [ ] Special characters (& < > " ')
- [ ] Unicode characters
- [ ] Large JSON files (performance)
- [ ] Invalid JSON (error handling)
- [ ] All options work correctly
- [ ] Copy to clipboard
- [ ] Download as .xml file
