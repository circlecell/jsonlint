---
title: "Unexpected Token in JSON: Fix `<`, `u`, BOM, and Other Errors"
description: "Diagnose unexpected-token JSON errors by the reported character, including HTML responses, undefined values, smart quotes, BOMs, and invalid syntax."
category: errors
priority: 20
updated: "2026-08-14"
---

An “unexpected token” error means a parser found a character or word that cannot appear at that location in JSON. The reported token is the best diagnostic clue: `<` usually means HTML, `u` often means `undefined`, and a quote or letter later in the document usually points to invalid syntax.

Paste the exact input into the [JSON Validator](/) to get a line, column, and error explanation.

## Unexpected Token `<` in JSON

If the first character is `<`, the response is probably HTML:

```text
SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

Common causes include:

- A server returned a 404 or 500 HTML page.
- Authentication redirected the request to a login page.
- The API URL points to the web application instead of its API route.
- A proxy or CDN returned an HTML error document.

Inspect the response before parsing:

```javascript
const response = await fetch('/api/profile');
const contentType = response.headers.get('content-type') || '';
const text = await response.text();

if (!response.ok) {
  throw new Error(`HTTP ${response.status}: ${text.slice(0, 100)}`);
}

if (!contentType.includes('application/json')) {
  throw new Error(`Expected JSON, received ${contentType}`);
}

const profile = JSON.parse(text);
```

Do not include a complete untrusted response in logs; it may contain private data.

## Unexpected Token `u`: Parsing `undefined`

This commonly happens when a missing value reaches `JSON.parse()`:

```javascript
const value = undefined;
JSON.parse(value); // attempts to parse "undefined"
```

Trace why the value is missing rather than replacing every failure with an empty object:

```javascript
function parseRequiredJson(value) {
  if (typeof value !== 'string') {
    throw new TypeError('Expected a JSON string');
  }

  return JSON.parse(value);
}
```

## “Unexpected Token o” or `[object Object]`

Older JavaScript engines often reported token `o` when code tried to parse an object that had already been parsed:

```javascript
const data = { active: true };
JSON.parse(data); // data is already an object
```

`JSON.parse()` accepts JSON text. If the value is already an object, use it directly. Use `JSON.stringify()` when converting an object *to* JSON text.

## Unexpected Token at Position 0

Position `0` is the first character. Inspect it before looking for a missing comma later in the file:

```javascript
console.log(typeof input);
console.log(String(input).slice(0, 80));
```

Common first-character problems include HTML `<`, `undefined`, a byte-order mark, a single quote, or a server log prefix before the JSON.

## Byte-Order Mark (BOM) Errors

UTF-8 JSON exchanged between systems should not begin with a BOM. Some files nevertheless include one, which may appear as an invisible unexpected character.

Remove it only at the beginning of trusted text:

```javascript
const withoutBom = text.replace(/^\uFEFF/, '');
const data = JSON.parse(withoutBom);
```

It is better to correct the producer so future files are emitted as UTF-8 without a BOM.

## Unexpected Quotes, Letters, or Punctuation

### Single Quotes

```javascript
{'name': 'Ada'}
```

Valid JSON:

```json
{"name":"Ada"}
```

### Unquoted Property Names

```javascript
{name: "Ada"}
```

Valid JSON:

```json
{"name":"Ada"}
```

### Smart Quotes

Text copied from rich-text software may contain `“` and `”` instead of ASCII double quotes:

```text
{“name”: “Ada”}
```

Replace smart punctuation at the source. A global replacement can damage legitimate prose inside string values, so review the result.

### Comments or Trailing Commas

JavaScript allows syntax that JSON does not:

```javascript
{
  // Invalid in standard JSON
  "name": "Ada",
}
```

Use [JSONC to JSON](/jsonc-to-json) for commented configuration and remove trailing commas for strict JSON.

## Unexpected Token After Valid JSON

Two JSON documents concatenated together are not one valid JSON document:

```text
{"id":1}{"id":2}
```

Use a JSON array when the records belong to one document:

```json
[
  {"id":1},
  {"id":2}
]
```

Use [JSON Lines](/json-lines) when records are streamed or processed one line at a time.

## A Safe Parse Helper

Use structured results when invalid input is an expected user error:

```javascript
function tryParseJson(input) {
  if (typeof input !== 'string' || input.trim() === '') {
    return { ok: false, error: 'Input is empty or not a string' };
  }

  try {
    return { ok: true, value: JSON.parse(input) };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}
```

Do not silently return `{}` for every failure. That hides broken requests and makes missing data look valid.

## Debugging Checklist

1. Check the input’s type.
2. Inspect its first 80 characters.
3. Check HTTP status and content type.
4. Confirm it is not empty or already parsed.
5. Validate the exact text.
6. Inspect the character before the reported position.
7. Check for comments, trailing commas, smart quotes, and a BOM.
8. Fix the producer when possible.

## Frequently Asked Questions

### Why did the message change to “is not valid JSON”?

JavaScript engines can use different wording across versions. The reported token and position still point to the same class of syntax or input-type problem.

### Is an unexpected token always malformed JSON?

The parser’s input is not valid JSON, but the root cause may be outside the document—for example an HTML error response or an undefined program variable.

### What if the input ends before the token appears?

See [Unexpected End of JSON Input](/fix-unexpected-end-of-json-input), which covers empty and truncated data.

## Related Guides

- [JSON Parse Errors](/json-parse-error)
- [Unexpected End of JSON Input](/fix-unexpected-end-of-json-input)
- [Comments in JSON](/json-comments)
- [MDN: JSON.parse()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)
