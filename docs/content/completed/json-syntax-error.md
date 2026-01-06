---
title: "JSON Syntax Error: How to Find and Fix It"
description: "Learn how to identify and fix JSON syntax errors quickly. This guide covers the most common causes with examples and solutions for every programming language."
date: "2024-01-15"
---

A **JSON syntax error** occurs when your JSON doesn't follow the strict formatting rules of the JSON specification. Unlike some formats that are forgiving, JSON requires exact syntax—a single misplaced character will cause the entire document to fail parsing.

This guide will help you quickly identify what's wrong and fix it.

## Finding the Error

### Step 1: Use the JSON Validator

The fastest way to find a syntax error is to paste your JSON into the [JSON Validator](/). It will:
- Highlight the exact line and character where the error occurs
- Explain what's wrong
- Show you the context around the error

### Step 2: Read the Error Message

Error messages tell you what the parser expected vs. what it found:

| Error Message | Meaning |
|---------------|---------|
| "Unexpected token" | Found a character that shouldn't be there |
| "Unexpected end of input" | JSON is incomplete (missing bracket or quote) |
| "Expected property name" | Missing quotes around a key |
| "Expected ':'" | Missing colon after a key |
| "Expected ',' or '}'" | Missing comma between properties |

### Step 3: Check the Position

Most parsers report the position where the error was detected:

```
SyntaxError: Unexpected token } at position 45
```

Count to that position in your JSON, but remember: **the actual error might be earlier**. A missing comma on line 3 might not be detected until line 5.

## The 8 Most Common Syntax Errors

### 1. Trailing Commas

**The most common error.** JSON doesn't allow commas after the last item:

```json
{
  "name": "Alice",
  "age": 30,   ← Error: trailing comma
}
```

**Fix:**
```json
{
  "name": "Alice",
  "age": 30
}
```

**In arrays too:**
```json
{
  "colors": ["red", "blue", "green",]  ← Error
}
```

### 2. Single Quotes

JSON requires double quotes. Single quotes are invalid:

```json
{
  'name': 'Alice'  ← Error: single quotes
}
```

**Fix:**
```json
{
  "name": "Alice"
}
```

### 3. Unquoted Keys

Unlike JavaScript objects, JSON keys must be quoted:

```json
{
  name: "Alice",     ← Error: unquoted key
  age: 30            ← Error: unquoted key
}
```

**Fix:**
```json
{
  "name": "Alice",
  "age": 30
}
```

### 4. Missing Commas

Forgetting commas between items:

```json
{
  "name": "Alice"    ← Missing comma
  "age": 30
}
```

**Fix:**
```json
{
  "name": "Alice",
  "age": 30
}
```

### 5. Unescaped Characters

Special characters inside strings must be escaped:

```json
{
  "path": "C:\Users\Alice",     ← Error: unescaped backslash
  "quote": "She said "hello""   ← Error: unescaped quote
}
```

**Fix:**
```json
{
  "path": "C:\\Users\\Alice",
  "quote": "She said \"hello\""
}
```

**Characters that need escaping:**
| Character | Escape Sequence |
|-----------|-----------------|
| `"` (quote) | `\"` |
| `\` (backslash) | `\\` |
| Newline | `\n` |
| Tab | `\t` |
| Carriage return | `\r` |

Use our [JSON Unescape tool](/json-unescape) to handle escape sequences.

### 6. Invalid Values

JSON only supports specific value types:

```json
{
  "callback": function() {},  ← Error: functions not allowed
  "missing": undefined,       ← Error: use null instead
  "notANumber": NaN,         ← Error: use null or string
  "infinite": Infinity       ← Error: use null or string
}
```

**Valid JSON values:**
- Strings: `"hello"`
- Numbers: `42`, `3.14`, `-17`, `1.2e10`
- Booleans: `true`, `false`
- Null: `null`
- Arrays: `[1, 2, 3]`
- Objects: `{"key": "value"}`

### 7. Wrong Boolean/Null Case

Booleans and null must be lowercase:

```json
{
  "active": True,    ← Error: should be true
  "verified": FALSE, ← Error: should be false
  "data": NULL       ← Error: should be null
}
```

**Fix:**
```json
{
  "active": true,
  "verified": false,
  "data": null
}
```

### 8. Comments

Standard JSON doesn't support comments:

```json
{
  // This is a comment     ← Error
  "name": "Alice",
  /* Another comment */    ← Error
  "age": 30
}
```

**Fix:** Remove all comments. See our [JSON Comments guide](/json-comments) for alternatives.

## Language-Specific Error Messages

### JavaScript

```javascript
try {
  JSON.parse('{"name": "Alice",}');
} catch (e) {
  console.log(e.message);
  // "Unexpected token } in JSON at position 17"
}
```

### Python

```python
import json
try:
    json.loads('{"name": "Alice",}')
except json.JSONDecodeError as e:
    print(f"Error at line {e.lineno}, column {e.colno}: {e.msg}")
    # "Error at line 1, column 18: Expecting property name enclosed in double quotes"
```

### Java (Jackson)

```java
try {
    new ObjectMapper().readTree("{\"name\": \"Alice\",}");
} catch (JsonProcessingException e) {
    System.out.println(e.getOriginalMessage());
    // "Unexpected character ('}' (code 125))"
}
```

### PHP

```php
$result = json_decode('{"name": "Alice",}');
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_last_error_msg();
    // "Syntax error"
}
```

## Debugging Strategies

### 1. Binary Search

For large JSON files, use binary search to find the error:
1. Delete the second half of the file
2. If it parses, the error is in the deleted half
3. If it doesn't parse, the error is in the first half
4. Repeat until you find it

### 2. Format First

Unformatted JSON is hard to debug:

```json
{"users":[{"name":"Alice","age":30},{"name":"Bob","age":25}],"total":2}
```

Format it first using the [JSON Validator](/) to see the structure:

```json
{
  "users": [
    {"name": "Alice", "age": 30},
    {"name": "Bob", "age": 25}
  ],
  "total": 2
}
```

### 3. Check Bracket Matching

Missing or extra brackets are common. Count them:
- Every `{` needs a `}`
- Every `[` needs a `]`
- Every `"` needs a closing `"`

Most code editors highlight matching brackets.

### 4. Look Before the Error

The parser reports where it detected the problem, not where the problem is:

```json
{
  "name": "Alice"
  "age": 30          ← Error reported here
}
```

The error is the missing comma on line 2, but it's detected on line 3.

### 5. Validate Incrementally

When building JSON programmatically, validate after each addition:

```javascript
let data = {};
console.log(JSON.stringify(data)); // Valid

data.name = "Alice";
console.log(JSON.stringify(data)); // Valid

data.items = getItems(); // Problem might be here
console.log(JSON.stringify(data)); // Check if still valid
```

## Prevention

### Use JSON Libraries

Never build JSON strings manually:

```javascript
// Bad - prone to errors
const json = '{"name": "' + name + '", "age": ' + age + '}';

// Good - handles escaping automatically
const json = JSON.stringify({ name, age });
```

### Use a Linter

Configure your editor to validate JSON files:
- **VS Code**: Built-in JSON validation
- **Sublime Text**: JSONLint package
- **Vim**: ALE or Syntastic

### Use Schema Validation

Define the expected structure with [JSON Schema](/json-schema):

```json
{
  "type": "object",
  "required": ["name", "age"],
  "properties": {
    "name": {"type": "string"},
    "age": {"type": "integer", "minimum": 0}
  }
}
```

### Test with Real Data

Always test your JSON generation with edge cases:
- Empty strings
- Special characters (quotes, backslashes, unicode)
- Very large numbers
- Deeply nested objects

## Quick Reference

| Problem | Solution |
|---------|----------|
| Trailing comma | Remove comma after last item |
| Single quotes | Replace with double quotes |
| Unquoted key | Add double quotes around key |
| Missing comma | Add comma between items |
| Unescaped backslash | Use `\\` |
| Unescaped quote | Use `\"` |
| `undefined` value | Use `null` |
| `NaN` or `Infinity` | Use `null` or string |
| Comments | Remove them |
| Wrong case boolean | Use lowercase `true`/`false` |

## Related Tools & Resources

### Tools

- [JSON Validator](/) — Find and fix syntax errors instantly
- [JSON Unescape](/json-unescape) — Handle escape sequences
- [JSON Stringify](/json-stringify) — Properly escape strings
- [JSON Minify](/json-minify) — Compact valid JSON

### Learn More

- [JSON Parse Error Guide](/json-parse-error) — Detailed error handling
- [Common JSON Mistakes](/common-mistakes-in-json-and-how-to-avoid-them) — Complete error list
- [JSON Comments Guide](/json-comments) — Why comments fail
- [Fix Unexpected End of JSON](/fix-unexpected-end-of-json-input) — Incomplete JSON errors
