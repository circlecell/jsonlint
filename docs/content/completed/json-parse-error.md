---
title: "JSON Parse Error: How to Find and Fix Invalid JSON"
description: "Fix JSON parse errors with examples for unexpected tokens, trailing commas, quotes, escapes, incomplete data, and language-specific error messages."
category: errors
priority: 10
updated: "2026-08-14"
---

A JSON parse error means a parser reached text that does not follow JSON syntax. The fastest fix is to [paste the document into JSONLint](/), use the reported line and column as a starting point, and inspect the character immediately before the reported location.

JSON parsers often report where they *stopped understanding* the document, not where the mistake began. A missing quote or bracket several lines earlier can therefore produce an error near the end of the file.

## Quick JSON Parse Error Checklist

Check these issues first:

1. Property names and string values use double quotes.
2. There is no comma after the final property or array item.
3. Every `{`, `[`, `"`, and escape sequence is closed.
4. The input is actually JSON—not HTML, JavaScript, or an empty response.
5. Numbers do not contain leading zeroes, `NaN`, or `Infinity`.
6. Comments have been removed or converted from JSONC.

Use the [JSON Repair tool](/json-repair) when you want JSONLint to attempt a safe repair, or the [JSON Error Analyzer](/json-error-analyzer) for a more detailed explanation.

## Common JSON Parse Errors

| Error pattern | Likely cause | First thing to inspect |
|---|---|---|
| Unexpected end of JSON input | Empty or truncated input | Network response and closing brackets |
| Unexpected token `<` | An HTML page was returned | HTTP status and response content type |
| Expected property name | Unquoted key, single quote, or trailing comma | Object property before the error |
| Bad escaped character | Invalid backslash sequence | The string containing `\` |
| Unterminated string | Missing closing quote or raw newline | The previous string value |
| Extra data after JSON | Two documents were concatenated | Text after the first complete value |

### Trailing Commas

JSON does not allow a comma after the final member:

```json
{
  "name": "Ada",
  "active": true,
}
```

Remove the last comma:

```json
{
  "name": "Ada",
  "active": true
}
```

### Single Quotes and Unquoted Keys

JavaScript object literals can use syntax that JSON rejects:

```javascript
{ name: 'Ada' }
```

Valid JSON requires double-quoted keys and strings:

```json
{ "name": "Ada" }
```

### Missing Commas

Adjacent properties and array values need commas:

```json
{
  "name": "Ada"
  "role": "admin"
}
```

The parser may report the error at `"role"`, although the missing character belongs at the end of the preceding line.

### Unescaped Characters in Strings

Double quotes, backslashes, and control characters inside strings must be escaped:

```json
{
  "message": "She said \"hello\".",
  "path": "C:\\Users\\Ada",
  "lines": "first\nsecond"
}
```

Use the [JSON Escape tool](/json-escape) when embedding text in a JSON string.

### Invalid Numbers

Strict JSON numbers cannot contain leading zeroes, hexadecimal notation, `NaN`, or infinity:

```json
{
  "invalidLeadingZero": 007,
  "invalidNotANumber": NaN
}
```

Represent unavailable numeric data as `null`, or use a quoted string when the consumer expects a special value.

### Comments

Standard JSON does not support `//`, `/* ... */`, or `#` comments. If a tool accepts them, it is parsing a related format such as JSONC or JSON5. Convert JSONC with the [JSONC to JSON tool](/jsonc-to-json) before using a strict parser.

## Why “Unexpected Token `<`” Usually Means HTML

This JavaScript error commonly occurs when code expects JSON but receives an HTML error or login page:

```javascript
const response = await fetch('/api/user');
const data = await response.json();
```

Inspect the status and content type before parsing:

```javascript
const response = await fetch('/api/user');
const contentType = response.headers.get('content-type') || '';

if (!response.ok) {
  throw new Error(`Request failed: ${response.status}`);
}

if (!contentType.includes('application/json')) {
  const body = await response.text();
  throw new Error(`Expected JSON, received: ${body.slice(0, 80)}`);
}

const data = await response.json();
```

## Language-Specific Error Messages

### JavaScript

`JSON.parse()` throws a `SyntaxError`. Keep the original input available during debugging, and never parse the result of an unchecked HTTP request. For incomplete input, see [Unexpected End of JSON Input](/fix-unexpected-end-of-json-input).

### Python

Python raises `json.JSONDecodeError`, which includes `lineno`, `colno`, and `pos`:

```python
import json

try:
    data = json.loads(payload)
except json.JSONDecodeError as error:
    print(error.msg)
    print(error.lineno, error.colno)
```

### Java

Jackson and Gson typically include a path or location in their exceptions. Log the location and a small, redacted portion of the input—not an entire response that could contain credentials or personal data.

## A Reliable Debugging Workflow

1. Confirm the input is not empty.
2. Confirm the response status and content type when JSON came from a network request.
3. Validate the smallest reproducible document.
4. Inspect the character before the reported location.
5. Reduce nested objects or arrays until the error disappears.
6. Add schema validation after syntax parsing when structure matters.

Syntax validation only proves that the text is valid JSON. It does not prove required fields exist or values have the expected types. Use the [JSON Schema Validator](/json-schema) for structural validation.

## Preventing Parse Errors

- Generate JSON with a serializer instead of string concatenation.
- Validate configuration files in CI.
- Check HTTP status and `Content-Type` before parsing responses.
- Avoid logging full sensitive payloads.
- Use JSON Schema or typed validation at trust boundaries.
- Use JSON Lines when writing a stream of independent records instead of concatenating JSON documents.

## Frequently Asked Questions

### Is a JSON parse error the same as a schema error?

No. A parse error means the text is not valid JSON. A schema error means the JSON is syntactically valid but does not match an expected structure.

### Why does valid-looking JSON still fail?

Invisible byte-order marks, smart quotes, raw control characters, duplicated content, or an HTML response can be difficult to see in an editor. Validate the exact bytes received by the parser.

### Can JSONLint fix invalid JSON automatically?

The validator identifies syntax errors. The separate [JSON Repair tool](/json-repair) can attempt common repairs, but you should review repaired output before using it in production.

## References and Related Guides

- [RFC 8259: The JSON Data Interchange Format](https://www.rfc-editor.org/rfc/rfc8259)
- [Unexpected End of JSON Input](/fix-unexpected-end-of-json-input)
- [Unexpected Token in JSON](/unexpected-token-in-json)
- [JSON Comments and JSONC](/json-comments)
- [JSON Format and Syntax](/mastering-json-format)
