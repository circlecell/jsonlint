# JSONLint Content Generation Prompts

Use these prompts with Claude to generate improved content for JSONLint. Each prompt is designed to produce specific, high-quality content that avoids generic AI writing patterns.

---

## Master Context (Include with every prompt)

```
You are writing content for JSONLint.com, a developer tool website that has been helping developers validate and format JSON since 2010. The site receives millions of visits from developers worldwide.

VOICE & STYLE:
- Direct and practical - developers are busy, get to the point
- Technical but accessible - assume competence, explain when necessary  
- Confident but not arrogant - we're a utility, not a personality
- Use "you" and "your" - speak to the reader directly
- No fluff phrases like "In today's world" or "It's important to note"
- No excessive hedging - be definitive when appropriate

FORMAT PREFERENCES:
- Lead with the answer or solution, then explain
- Use code examples frequently (they're more valuable than prose)
- Keep paragraphs to 2-3 sentences max
- Use tables for comparisons
- Include practical tips marked with "💡 Pro tip:" 
- End sections with clear takeaways

SEO CONSIDERATIONS:
- Include the primary keyword naturally in the first paragraph
- Use subheadings (H2, H3) that include related keywords
- Link to relevant JSONLint tools using: [Tool Name](/)
- Target 1,500-2,500 words for articles

THINGS TO AVOID:
- Generic statements that could apply to any tool
- Overly promotional language
- Outdated references (mention modern tools/frameworks)
- Walls of bullet points without context
- Conclusions that just restate the introduction
```

---

## Prompt 1: Homepage Content Refresh

```
Using the master context above, rewrite the homepage content for JSONLint. The content appears below the JSON editor/validator tool.

CURRENT SECTIONS TO IMPROVE:
1. About the JSONLint Editor (brief intro)
2. What Is JSON? (modernize for 2024+)
3. Why Use JSON? (focus on current use cases)
4. Proper JSON Format (make scannable, add examples)
5. Why Use JSONLint? (specific value props for our tools)
6. Tips & Tricks (expand with more power-user features)
7. Common Errors (add 5 more with actual error messages)

NEW SECTIONS TO ADD:
8. Quick Reference Card (condensed syntax rules)
9. Our Tools (brief intro to Diff, Schema, Path, etc.)

REQUIREMENTS:
- Total length: 2,000-2,500 words
- Include at least 10 code examples
- Add a "Quick Reference" box that could be screenshot-worthy
- Mention specific JSONLint features (line numbers, error highlighting, URL input)
- Include internal links to: /json-diff, /json-schema, /json-path, /xml-to-json
- Reference external authority: json.org, RFC 8259

The content should make a developer think "this is actually useful" not "this is SEO filler."
```

---

## Prompt 2: Tool Page Content (JSON Diff)

```
Using the master context above, write the content for the JSON Diff tool page.

STRUCTURE:
1. **Hero intro** (2-3 sentences): What is JSON Diff and when to use it
2. **Use cases** (with examples):
   - Comparing API responses (before/after)
   - Reviewing config file changes
   - Debugging data transformations
   - Code review for JSON fixtures
3. **How to use** (step-by-step):
   - Paste or upload two JSON documents
   - Click Compare
   - Understanding the output (additions, deletions, changes)
4. **Pro tips**:
   - Swap button for quick comparison reversal
   - Handling large files
   - Ignoring whitespace differences
5. **Common questions**:
   - "Why are the objects showing as different when they look the same?"
   - "Can I compare JSON from URLs?"
   - "How do I share a diff?"
6. **Related tools**: Links to Schema Validator, JSON Path

REQUIREMENTS:
- Length: 600-800 words
- Include 2-3 example JSON pairs that demonstrate different diff scenarios
- Mention keyboard shortcuts if any
- Add comparison to similar tools (explain why JSONLint's approach)
```

---

## Prompt 3: Tool Page Content (JSON Schema Validator)

```
Using the master context above, write content for the JSON Schema Validator tool page.

STRUCTURE:
1. **Hero intro**: What is JSON Schema and why validate against it
2. **When to use schema validation**:
   - API request/response validation
   - Configuration file validation
   - Form data validation
   - Database document validation
3. **Schema basics quick reference**:
   - type, properties, required
   - String formats (email, uri, date-time)
   - Number constraints (minimum, maximum)
   - Array validation (items, minItems)
   - Nested objects
4. **Step-by-step usage**:
   - Paste your schema (left panel)
   - Paste data to validate (right panel)
   - Understanding validation errors
5. **Example schemas** (provide 3 complete examples):
   - User profile schema
   - API error response schema
   - Configuration file schema
6. **Pro tips**:
   - Using $ref for reusable definitions
   - additionalProperties: false for strict validation
   - Default values
7. **Resources**: Links to json-schema.org, draft versions

REQUIREMENTS:
- Length: 800-1,000 words
- Include 3 complete, copy-paste-ready schema examples
- Explain common validation errors and how to fix them
- Mention which JSON Schema draft version is supported
```

---

## Prompt 4: Tool Page Content (JSON Path Query)

```
Using the master context above, write content for the JSON Path Query tool page.

STRUCTURE:
1. **Hero intro**: What is JSONPath and when you need it
2. **JSONPath vs alternatives**:
   - JSONPath vs JavaScript dot notation
   - JSONPath vs jq
   - When each is appropriate
3. **Syntax quick reference** (table format):
   | Expression | Description | Example |
   |------------|-------------|---------|
   | $ | Root object | $.store |
   | . | Child operator | $.store.book |
   | .. | Recursive descent | $..author |
   | [n] | Array index | $.store.book[0] |
   | [*] | Wildcard | $.store.book[*] |
   | [?(@.expr)] | Filter | $..book[?(@.price<10)] |
4. **Practical examples** (5-6 scenarios):
   - Extract all values of a specific key
   - Filter array by condition
   - Get nested values
   - Select multiple paths
   - Handle missing keys
5. **Step-by-step usage**
6. **Pro tips**:
   - Testing expressions incrementally
   - Performance with large documents
   - Common gotchas
7. **Real-world use cases**:
   - Extracting data from API responses
   - Log file analysis
   - Configuration extraction

REQUIREMENTS:
- Length: 800-1,000 words
- Include a sample JSON document used throughout examples
- Provide 10+ JSONPath expressions with explanations
- Show expected output for each expression
```

---

## Prompt 5: Expanded Common Mistakes Article

```
Using the master context above, expand the "Common JSON Mistakes" article.

CURRENT CONTENT: 10 mistakes with basic examples
TARGET: 20 mistakes organized by category, with deeper explanations

STRUCTURE:

## Syntax Errors (expand existing)
1. Trailing commas
2. Single quotes
3. Unquoted keys
4. Comments
5. Missing commas

## Data Type Errors (add new)
6. Using undefined
7. NaN and Infinity
8. Incorrect boolean/null case
9. Leading zeros
10. Numeric precision issues (large numbers, floats)
11. Date handling mistakes

## String Errors (add new)
12. Unescaped special characters
13. Multi-line strings
14. Unicode issues
15. Control characters

## Structural Errors (add new)
16. Duplicate keys
17. Circular references
18. Empty structures vs null
19. Array vs object confusion
20. Deep nesting issues

FOR EACH MISTAKE:
- Wrong example with syntax highlighting
- Correct example
- Why this happens (context)
- How JSONLint helps catch it
- 💡 Pro tip for avoiding it

REQUIREMENTS:
- Length: 2,000-2,500 words
- Include actual error messages from JSONLint
- Add a "Mistake Frequency" indicator (🔴 Very Common, 🟡 Common, 🟢 Rare)
- Include a summary table at the end
- Link to the validator tool throughout
```

---

## Prompt 6: New Article - JSON Schema Practical Guide

```
Using the master context above, write a comprehensive guide to JSON Schema.

TARGET AUDIENCE: Developers who know JSON but haven't used JSON Schema

STRUCTURE:

## Why JSON Schema?
- The problem: validating JSON structure
- Schema as documentation
- Schema as contract (API design)

## Getting Started
- Your first schema (5-line example)
- Validating with JSONLint
- Understanding validation errors

## Core Keywords Deep Dive
### Type System
- string, number, integer, boolean, null, array, object
- Type coercion gotchas

### String Validation
- minLength, maxLength, pattern
- format (email, uri, date-time, uuid)
- Custom patterns

### Number Validation  
- minimum, maximum, exclusiveMinimum
- multipleOf
- Integer vs number

### Object Validation
- properties, required
- additionalProperties
- patternProperties
- propertyNames
- minProperties, maxProperties

### Array Validation
- items (single schema vs tuple)
- contains
- minItems, maxItems
- uniqueItems

## Advanced Features
- $ref and definitions
- allOf, anyOf, oneOf, not
- if/then/else
- Recursive schemas

## Real-World Schemas
Provide 3 complete, production-ready schemas:
1. User registration API request
2. E-commerce product catalog
3. Application configuration file

## Schema Design Best Practices
- Start strict, loosen as needed
- Use descriptions for documentation
- Version your schemas
- Test with edge cases

## Tools & Ecosystem
- JSON Schema validators by language
- Schema generators
- IDEs with schema support

REQUIREMENTS:
- Length: 3,000-3,500 words
- 15+ code examples
- Comparison tables where appropriate
- Link to /json-schema tool
- Include common pitfalls section
```

---

## Prompt 7: Dataset Page Enhancement Template

```
Using the master context above, write enhanced documentation for a JSON dataset.

DATASET: [US States / Programming Languages / Emoticons]

STRUCTURE:

## Overview
- What this dataset contains (1-2 sentences)
- Quick stats: X items, Y KB, last updated

## Schema
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| ... | ... | ... | ... |

## Sample Data
(First 2-3 items, formatted)

## Usage Examples

### JavaScript/Node.js
```javascript
// Fetch and use the dataset
const response = await fetch('https://jsonlint.com/datasets/[name].json');
const data = await response.json();
// Example operation
```

### Python
```python
import requests
data = requests.get('https://jsonlint.com/datasets/[name].json').json()
# Example operation
```

### cURL
```bash
curl https://jsonlint.com/datasets/[name].json | jq '.[0]'
```

## Use Cases
- [Specific use case 1 with brief example]
- [Specific use case 2 with brief example]
- [Specific use case 3 with brief example]

## Data Quality
- Source: [Where this data came from]
- Accuracy: [Any caveats]
- Updates: [How often, if ever]

## Contributing
Want to add data or fix an error? [GitHub link]

## Related Datasets
- [Link to other datasets]

REQUIREMENTS:
- Length: 400-600 words
- Include working code examples in 3 languages
- Be specific about data source/accuracy
- Include at least 3 concrete use cases
```

---

## Prompt 8: New Article - JSON vs YAML

```
Using the master context above, write a comparison article between JSON and YAML.

TARGET AUDIENCE: Developers choosing between formats for a project

STRUCTURE:

## TL;DR Decision Matrix
| Use Case | Recommended | Why |
|----------|-------------|-----|
| API responses | JSON | ... |
| Config files | YAML | ... |
| ... | ... | ... |

## The Formats at a Glance
Side-by-side comparison of the same data in both formats

## Syntax Comparison
### Data Types
### Comments  
### Multi-line Strings
### Anchors & References (YAML-only)
### Strictness

## Parsing & Performance
- Parse speed benchmarks
- Error handling differences
- Library availability

## When to Choose JSON
- Machine-to-machine communication
- When strictness matters
- Browser environments
- When you need to embed in other formats

## When to Choose YAML
- Human-edited configuration
- When you need comments
- Kubernetes/Docker configs
- When readability trumps parsing speed

## The Hybrid Approach
- JSON for APIs, YAML for config
- Converting between formats
- Tools that support both

## Common Migration Scenarios
- Converting existing JSON configs to YAML
- Converting YAML to JSON for APIs

## Gotchas & Pitfalls
- YAML's "Norway problem" (NO parsed as false)
- JSON's lack of comments workaround
- Indentation sensitivity

REQUIREMENTS:
- Length: 1,800-2,200 words
- Include conversion examples
- Be balanced (don't favor one over the other)
- Include real-world tool examples (package.json vs yaml configs)
- Link to XML to JSON converter
```

---

## Usage Instructions

1. **Copy the Master Context** at the top of each conversation
2. **Paste the specific prompt** for the content you need
3. **Review the output** for:
   - Accuracy of technical claims
   - Code example correctness
   - Appropriate length
   - Internal linking opportunities
4. **Iterate** by asking for specific sections to be expanded or revised
5. **Final check**: Ensure the content doesn't sound generic or AI-generated

---

## Quality Checklist

Before publishing any content, verify:

- [ ] Code examples are syntactically correct
- [ ] All internal links work
- [ ] External links are to authoritative sources
- [ ] No generic filler phrases
- [ ] Practical value is immediately clear
- [ ] Length matches target
- [ ] Headers include relevant keywords
- [ ] At least one unique insight or tip
- [ ] Call-to-action to use a tool
