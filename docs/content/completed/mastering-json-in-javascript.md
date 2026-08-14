---
title: "JSON.parse() in JavaScript: Parsing, Revivers, Fetch, and Errors"
description: "Use JSON.parse safely in JavaScript with reviver examples, fetch response checks, TypeScript validation, error handling, and JSON.stringify guidance."
category: languages
priority: 20
updated: "2026-08-14"
---

`JSON.parse()` converts JSON text into a JavaScript value. It can return an object, array, string, number, boolean, or `null`, and it throws a `SyntaxError` when the text is not valid JSON.

```javascript
const text = '{"name":"Ada","active":true}';
const user = JSON.parse(text);

console.log(user.name); // Ada
```

Validate unfamiliar input with [JSONLint](/), but remember that valid syntax does not make untrusted data safe or structurally correct.

## `JSON.parse()` Syntax

```javascript
JSON.parse(text);
JSON.parse(text, reviver);
```

- `text` is the JSON string to parse.
- `reviver` is an optional function that transforms parsed values while the result is constructed.

`JSON.parse()` does not accept comments, trailing commas, single-quoted strings, `undefined`, `NaN`, or JavaScript object-literal syntax.

## Parse Objects, Arrays, and Primitive Values

```javascript
JSON.parse('{"id":42}');     // { id: 42 }
JSON.parse('[1,2,3]');       // [1, 2, 3]
JSON.parse('"hello"');       // "hello"
JSON.parse('42');            // 42
JSON.parse('true');          // true
JSON.parse('null');          // null
```

A JSON document does not have to start with `{` or `[`, although some older APIs impose that restriction.

## Handle Parse Errors

```javascript
function tryParseJson(text) {
  if (typeof text !== 'string' || text.trim() === '') {
    return { ok: false, error: 'Expected non-empty JSON text' };
  }

  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}
```

Do not silently return an empty object on failure. That turns a broken response into apparently valid data. See [JSON Parse Errors](/json-parse-error) and [Unexpected End of JSON Input](/fix-unexpected-end-of-json-input) for diagnostics.

## Parse JSON from `fetch()` Safely

`response.json()` parses the body, but it does not make an unsuccessful HTTP response successful. Check the status and content type:

```javascript
async function fetchJson(url) {
  const response = await fetch(url);
  const contentType = response.headers.get('content-type') || '';

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }

  if (!contentType.includes('application/json')) {
    const preview = (await response.text()).slice(0, 100);
    throw new Error(`Expected JSON; received ${preview}`);
  }

  return response.json();
}
```

An unexpected `<` normally means the server returned HTML, often an error or login page.

## Transform Values with a Reviver

JSON has no date type, so APIs commonly send ISO 8601 strings. A reviver can convert selected fields:

```javascript
const text = '{"createdAt":"2026-08-14T12:30:00Z"}';

const result = JSON.parse(text, (key, value) => {
  if (key === 'createdAt' && typeof value === 'string') {
    return new Date(value);
  }
  return value;
});

console.log(result.createdAt instanceof Date); // true
```

Avoid converting every date-shaped string automatically. A product code or user input can resemble a date without representing one.

## Preserve Large Integers

JavaScript numbers cannot precisely represent every integer beyond `Number.MAX_SAFE_INTEGER`. By the time a reviver receives a numeric value, precision may already be lost.

Send very large identifiers or exact integers as strings:

```json
{"orderId":"9007199254740993"}
```

Then convert with `BigInt` only when the application requires numeric operations:

```javascript
const order = JSON.parse(text, (key, value) =>
  key === 'orderId' ? BigInt(value) : value
);
```

## Parsing Does Not Validate Data

This is valid JSON but may be invalid application data:

```json
{"id":"not-a-number","role":"superuser"}
```

Check the result before using it:

```typescript
type User = { id: number; name: string };

function isUser(value: unknown): value is User {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.id === 'number' && typeof candidate.name === 'string';
}

const value: unknown = JSON.parse(text);
if (!isUser(value)) throw new Error('Invalid user payload');
```

For complex data, validate against JSON Schema with the [Schema Validator](/json-schema).

## Convert JavaScript Values to JSON

`JSON.stringify()` performs the reverse operation:

```javascript
const text = JSON.stringify(
  { name: 'Ada', roles: ['admin', 'editor'] },
  null,
  2
);
```

Use the [JSON Stringify tool](/json-stringify) for escaping and embedding JSON. Important limitations include:

- Object properties containing `undefined`, functions, or symbols are omitted.
- Those values become `null` inside arrays.
- `BigInt` throws unless you provide a custom representation.
- Circular references throw.
- `Date` values normally serialize through `toJSON()` as strings.

## Do Not Use JSON Serialization for General Deep Cloning

`JSON.parse(JSON.stringify(value))` loses unsupported values and changes dates into strings. Modern JavaScript provides `structuredClone()` for many cloning cases:

```javascript
const clone = structuredClone(original);
```

Neither approach should replace intentional domain-level copying when class instances, accessors, or external resources are involved.

## Security and Performance

- Set size and nesting limits before parsing untrusted input.
- Validate fields before using them in database queries, templates, or authorization decisions.
- Avoid logging complete sensitive payloads.
- Large synchronous parses block the main JavaScript thread.
- Use JSON Lines and streaming parsers when records can be processed independently.

## Frequently Asked Questions

### Does `JSON.parse()` copy an object?

It creates a new JavaScript value from text. If you already have an object, parsing it is a type error or unintended string conversion—not a cloning method.

### Why does `JSON.parse()` reject comments?

Comments are not part of standard JSON. Use a JSONC-aware parser or convert the document first.

### Does TypeScript make parsed JSON type-safe?

No. A type assertion affects the compiler, not runtime data. Validate unknown values before treating them as a TypeScript type.

## References and Related Tools

- [MDN: JSON.parse()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)
- [JSON Stringify](/json-stringify)
- [JSON Date Format](/json-date-format)
- [JSON Lines and NDJSON](/json-lines)
