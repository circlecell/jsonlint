---
title: "JSON Parse Error: Causes, Solutions, and Prevention"
description: "Learn how to fix JSON parse errors in JavaScript, Python, Java, and other languages. Comprehensive guide with examples and debugging techniques."
date: "2024-01-15"
---

A **JSON parse error** occurs when your code attempts to convert a string into a JSON object, but the string contains invalid JSON syntax. This is one of the most common errors developers encounter when working with APIs, configuration files, or any data stored as JSON.

In this guide, we'll cover the most common causes of parse errors and show you how to fix them in multiple programming languages.

## Understanding JSON Parse Errors

When you parse JSON, your programming language reads through the string character by character, building a data structure. If it encounters something unexpected—like a missing quote, extra comma, or invalid character—it throws a parse error.

The error message varies by language:

| Language | Error Type |
|----------|-----------|
| JavaScript | `SyntaxError: Unexpected token` |
| Python | `json.decoder.JSONDecodeError` |
| Java | `JsonParseException` or `JsonProcessingException` |
| PHP | `json_last_error()` returns error code |
| C# | `JsonReaderException` |
| Go | `json: cannot unmarshal...` |

## The 10 Most Common Causes

### 1. Trailing Commas

The most frequent cause of parse errors:

```json
{
  "name": "John",
  "age": 30,  // ← This comma breaks everything
}
```

**Fix:** Remove the comma after the last item.

```json
{
  "name": "John",
  "age": 30
}
```

### 2. Single Quotes Instead of Double Quotes

JSON requires double quotes. Single quotes are invalid:

```json
{
  'name': 'John'  // ← Wrong
}
```

**Fix:** Use double quotes for all strings and keys.

```json
{
  "name": "John"
}
```

### 3. Unquoted Keys

Unlike JavaScript objects, JSON keys must always be quoted:

```json
{
  name: "John"  // ← Wrong
}
```

**Fix:** Quote all keys.

```json
{
  "name": "John"
}
```

### 4. Missing Commas Between Items

Forgetting commas between properties or array items:

```json
{
  "name": "John"
  "age": 30
}
```

**Fix:** Add commas between items.

```json
{
  "name": "John",
  "age": 30
}
```

### 5. Unescaped Special Characters

Backslashes and quotes inside strings must be escaped:

```json
{
  "path": "C:\Users\John"  // ← Backslashes not escaped
}
```

**Fix:** Escape special characters with backslash.

```json
{
  "path": "C:\\Users\\John"
}
```

### 6. Invalid Values

JSON only supports specific value types. These are all invalid:

```json
{
  "value": undefined,    // ← Use null instead
  "func": function() {}, // ← Functions not allowed
  "date": new Date(),    // ← Use ISO string
  "num": NaN             // ← Use null or string
}
```

**Fix:** Use only valid JSON types: string, number, boolean, null, array, object.

### 7. Comments in JSON

Standard JSON doesn't support comments:

```json
{
  "name": "John", // This is a comment
  /* Multi-line
     comment */
  "age": 30
}
```

**Fix:** Remove all comments, or use JSONC/JSON5 if your parser supports it. See our [JSON Comments guide](/json-comments) for alternatives.

### 8. Wrong Boolean or Null Case

Booleans and null must be lowercase:

```json
{
  "active": True,   // ← Wrong (Python style)
  "deleted": FALSE, // ← Wrong
  "data": NULL      // ← Wrong
}
```

**Fix:** Use lowercase.

```json
{
  "active": true,
  "deleted": false,
  "data": null
}
```

### 9. Empty Input

Trying to parse an empty string or null:

```javascript
JSON.parse('');     // SyntaxError
JSON.parse(null);   // SyntaxError
```

**Fix:** Check for empty input before parsing.

### 10. BOM Characters or Hidden Characters

Byte Order Mark (BOM) or other invisible characters at the start of the file:

```javascript
// The string looks empty but contains BOM
const json = '\uFEFF{"name": "John"}';
JSON.parse(json); // May fail in some parsers
```

**Fix:** Strip BOM and trim whitespace before parsing.

## Fixing Parse Errors by Language

### JavaScript

```javascript
function parseJSON(str) {
  // Check for empty input
  if (!str || typeof str !== 'string') {
    console.error('Invalid input: expected non-empty string');
    return null;
  }
  
  // Trim whitespace and BOM
  str = str.trim().replace(/^\uFEFF/, '');
  
  try {
    return JSON.parse(str);
  } catch (error) {
    console.error('JSON parse error:', error.message);
    
    // Try to identify the problem location
    const match = error.message.match(/position (\d+)/);
    if (match) {
      const pos = parseInt(match[1]);
      console.error('Error near:', str.substring(Math.max(0, pos - 20), pos + 20));
    }
    
    return null;
  }
}
```

### Python

```python
import json

def parse_json(text):
    if not text or not isinstance(text, str):
        print("Invalid input: expected non-empty string")
        return None
    
    # Strip BOM and whitespace
    text = text.strip().lstrip('\ufeff')
    
    try:
        return json.loads(text)
    except json.JSONDecodeError as e:
        print(f"JSON parse error at line {e.lineno}, column {e.colno}")
        print(f"Message: {e.msg}")
        
        # Show context around the error
        lines = text.split('\n')
        if e.lineno <= len(lines):
            print(f"Problem line: {lines[e.lineno - 1]}")
        
        return None
```

### Java (Jackson)

```java
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.core.JsonProcessingException;

public class JsonParser {
    private static final ObjectMapper mapper = new ObjectMapper();
    
    public static JsonNode parseJson(String json) {
        if (json == null || json.trim().isEmpty()) {
            System.err.println("Invalid input: expected non-empty string");
            return null;
        }
        
        try {
            return mapper.readTree(json.trim());
        } catch (JsonProcessingException e) {
            System.err.println("JSON parse error at line " + 
                e.getLocation().getLineNr() + ", column " + 
                e.getLocation().getColumnNr());
            System.err.println("Message: " + e.getOriginalMessage());
            return null;
        }
    }
}
```

### PHP

```php
function parseJson($json) {
    if (empty($json) || !is_string($json)) {
        error_log("Invalid input: expected non-empty string");
        return null;
    }
    
    // Strip BOM
    $json = preg_replace('/^\xEF\xBB\xBF/', '', trim($json));
    
    $result = json_decode($json, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log("JSON parse error: " . json_last_error_msg());
        return null;
    }
    
    return $result;
}
```

## Debugging Workflow

When you encounter a parse error, follow these steps:

### Step 1: Validate the JSON

Paste your JSON into the [JSON Validator](/) to get a precise error location and message.

### Step 2: Check the Error Position

Most error messages include a position or line number. Look at that location for:
- Missing or extra commas
- Unquoted strings or keys
- Invalid characters

### Step 3: Inspect the Raw Data

If parsing API responses, log the raw string before parsing:

```javascript
fetch('/api/data')
  .then(response => response.text())
  .then(text => {
    console.log('Raw response:', text);
    console.log('First 100 chars:', text.substring(0, 100));
    console.log('Last 100 chars:', text.substring(text.length - 100));
    return JSON.parse(text);
  });
```

### Step 4: Check for HTML Error Pages

A common issue: your API returns an HTML error page instead of JSON:

```javascript
const text = await response.text();

// Check if we got HTML instead of JSON
if (text.trim().startsWith('<')) {
  console.error('Received HTML instead of JSON:', text.substring(0, 200));
  throw new Error('API returned HTML error page');
}
```

### Step 5: Verify Content-Type

Ensure the server sends the correct Content-Type header:

```javascript
const response = await fetch('/api/data');
const contentType = response.headers.get('content-type');

if (!contentType?.includes('application/json')) {
  console.warn('Unexpected content type:', contentType);
}
```

## Prevention Best Practices

### 1. Use JSON Libraries for Creation

Never build JSON strings manually:

```javascript
// Bad - manual string building
const json = '{"name": "' + name + '"}'; // Breaks if name contains quotes

// Good - use JSON.stringify
const json = JSON.stringify({ name: name });
```

### 2. Validate During Development

Use the [JSON Validator](/) to check your JSON files and API responses during development.

### 3. Add Schema Validation

Use [JSON Schema](/json-schema) to validate structure, not just syntax:

```javascript
const Ajv = require('ajv');
const ajv = new Ajv();

const schema = {
  type: 'object',
  required: ['name', 'age'],
  properties: {
    name: { type: 'string' },
    age: { type: 'integer', minimum: 0 }
  }
};

const validate = ajv.compile(schema);
```

### 4. Handle Errors Gracefully

Always wrap JSON parsing in try-catch and provide meaningful error messages to users.

### 5. Use TypeScript

TypeScript can catch many JSON-related issues at compile time:

```typescript
interface User {
  name: string;
  age: number;
}

function parseUser(json: string): User | null {
  try {
    const data = JSON.parse(json);
    // TypeScript ensures you handle the correct shape
    return data as User;
  } catch {
    return null;
  }
}
```

Generate TypeScript interfaces from your JSON with our [JSON to TypeScript](/json-to-typescript) converter.

## Related Tools & Resources

### Tools
- [JSON Validator](/) — Validate and format JSON instantly
- [JSON Unescape](/json-unescape) — Fix escaped string issues
- [JSON Schema Validator](/json-schema) — Validate JSON structure
- [JSON to TypeScript](/json-to-typescript) — Generate type definitions

### Learn More
- [Fix "Unexpected End of JSON Input"](/fix-unexpected-end-of-json-input) — Related parsing error
- [Common JSON Mistakes](/common-mistakes-in-json-and-how-to-avoid-them) — Comprehensive error list
- [JSON Comments Guide](/json-comments) — Why comments cause parse errors
- [Mastering JSON in JavaScript](/mastering-json-in-javascript) — Complete JS guide
