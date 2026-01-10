# Reddit User Research: JSON Tool Gaps

## Research Summary
Analyzed Reddit discussions from r/learnprogramming, r/webdev, r/javascript, and r/node to identify unmet needs in the JSON tooling space.

---

## High-Priority Gaps (Not Currently Offered)

### 1. JSON Repair Tool
**User Pain**: LLM outputs and copy-pasted JSON often have issues:
- Trailing commas
- Single quotes instead of double quotes
- Unquoted keys
- Markdown code block wrappers (```json ... ```)
- Truncated/incomplete JSON

**Solution**: A "JSON Repair" tool that attempts to fix common issues automatically with before/after preview.

---

### 2. JSONC / JSON5 Support (JSON with Comments)
**User Pain**: "Why did YAML become preferred? Because JSON doesn't support comments"
- Developers want comments in config files
- Need to strip comments before using in production

**Solution**: 
- JSONC → JSON converter (strip comments)
- JSON5 support
- Comment-preserving pretty print

---

### 3. Token Counter for LLM Use
**User Pain**: "You're paying for punctuation... Switching from JSON to TOON cut token count by 45%"
- AI/LLM developers need to optimize JSON for token limits
- No easy way to see token cost of JSON

**Solution**: Token counter showing:
- GPT-3.5/4 token count
- Claude token count  
- Comparison of minified vs pretty-printed
- Suggestions for reducing tokens

---

### 4. JSON Size/Complexity Analyzer
**User Pain**: "Working with large JSON and navigating is pretty bad"

**Solution**: Analyzer showing:
- Total size (bytes, KB, MB)
- Depth levels
- Number of keys/values
- Largest nested objects
- Memory estimate for parsing

---

### 5. Better Error Messages with Visual Pinpointing
**User Pain**: "Position 142 is useless without visual mapping"
- Current errors just say "line X, column Y"
- No help understanding WHY it's wrong

**Solution**: Enhanced error display:
- Highlight exact character causing error
- Show "Did you mean...?" suggestions
- Common mistake detection (trailing comma, single quotes, etc.)
- Visual arrow pointing to the problem

---

### 6. JSON Path Finder / Search with Context
**User Pain**: "Looking for `baz` but multiple exist in different paths"

**Solution**: Enhanced search tool:
- Search for key or value
- Show full path for each result (e.g., `$.users[0].address.city`)
- Show surrounding context
- Click to navigate in tree view
- Copy path to clipboard

---

### 7. Streaming/Large File Support
**User Pain**: "500GB JSON files require streaming parsers"

**Solution**: 
- Chunked validation (don't load entire file)
- First N records preview
- Memory-efficient tree view
- "Validate structure only" mode

---

### 8. i18n / Translation JSON Tools
**User Pain**: "Managing translation JSON files across 100+ languages"

**Solution**:
- Compare two locale JSON files
- Find missing keys
- Find untranslated values (same as source)
- Bulk key rename
- Export keys as CSV for translators

---

## Medium-Priority Gaps

### 9. JSON-in-Logs Extractor
Extract valid JSON objects from log files that contain mixed content.

### 10. Semantic JSON Diff
Current diff shows text changes. Need diff that understands:
- Reordered keys (same content, different order)
- Array item moves
- Type changes (string "123" vs number 123)

### 11. JSON to Zod/Valibot Schema
TypeScript developers increasingly use Zod for runtime validation. Generate Zod schemas from JSON samples.

### 12. API Response Visualizer
For exploring unknown API responses:
- Auto-detect pagination patterns
- Identify nullable fields
- Show sample values for each field

---

## What JSONLint Already Does Well
- Basic validation
- Pretty print / minify
- Tree view
- JSON Path queries
- Schema validation
- Many format conversions (CSV, YAML, XML, TypeScript, etc.)
- JSON diff

---

## Recommended Priority Order

1. **JSON Repair** - High demand, differentiator, helps LLM users
2. **JSONC/JSON5 Support** - Constant complaints about no comments
3. **Token Counter** - Growing AI/LLM use case
4. **Better Error Messages** - Universal pain point
5. **JSON Path Search** - Productivity feature for large files
6. **Size Analyzer** - Quick win, useful for optimization

---

## Competitive Notes
- jsontranslator.com - New tool specifically for i18n
- TOON format - Alternative to JSON for LLM use (45% fewer tokens)
- Most JSON validators focus on "is it valid?" not "how do I fix it?"
