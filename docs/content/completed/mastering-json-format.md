---
title: "JSON Format: Syntax, Data Types, Rules, and Examples"
description: "Learn JSON format and syntax with valid examples of objects, arrays, strings, numbers, booleans, null, escaping, nesting, and common mistakes."
category: foundations
featured: true
priority: 1
updated: "2026-08-14"
---

JSON (JavaScript Object Notation) is a text format for exchanging structured data. A JSON document contains exactly one value: an object, array, string, number, boolean, or null. Objects and arrays can contain other JSON values to create nested structures.

Use the [JSON Validator](/) to check an example while learning the rules below.

## A Complete JSON Example

```json
{
  "id": 42,
  "name": "Ada Lovelace",
  "active": true,
  "roles": ["admin", "editor"],
  "profile": {
    "timezone": "Europe/London",
    "lastLogin": "2026-08-14T12:30:00Z"
  },
  "manager": null
}
```

This document’s top-level value is an object. It contains a number, string, boolean, array, nested object, and null.

## The Six JSON Data Types

| JSON type | Example | Common language equivalent |
|---|---|---|
| Object | `{"name":"Ada"}` | Map, dictionary, object |
| Array | `[1,2,3]` | List, slice, array |
| String | `"hello"` | String |
| Number | `42`, `-1.5`, `6.02e23` | Integer or floating-point type |
| Boolean | `true`, `false` | Boolean |
| Null | `null` | Null, nil, None |

JSON has no native date, binary, set, map, comment, or undefined type. Applications represent those concepts using agreed conventions.

## JSON Object Syntax

An object is an unordered collection of name/value members surrounded by braces:

```json
{
  "name": "Ada",
  "age": 36
}
```

Object rules:

- Property names are strings and require double quotes.
- A colon separates each name from its value.
- A comma separates members.
- A trailing comma is invalid.
- Names should be unique for interoperable data.

Although some parsers accept duplicate names, they do not agree on whether the first, last, or every value should be preserved.

## JSON Array Syntax

An array is an ordered list of values surrounded by square brackets:

```json
[
  {"id": 1, "name": "Ada"},
  {"id": 2, "name": "Grace"}
]
```

Array values can use different JSON types, although consistent item shapes are easier for applications and schemas to process.

An empty array is `[]`; an empty object is `{}`.

## JSON String Rules and Escaping

Strings use double quotes. Escape characters that would otherwise end the string or represent a control character:

```json
{
  "quote": "She said \"hello\".",
  "path": "C:\\Users\\Ada",
  "multiline": "first line\nsecond line",
  "tabbed": "name\tvalue",
  "symbol": "\u2764"
}
```

Common escapes are `\"`, `\\`, `\/`, `\b`, `\f`, `\n`, `\r`, `\t`, and `\u` followed by four hexadecimal digits. Raw newlines are not allowed inside a JSON string. See [Multiline Strings in JSON](/json-multiline-string) for practical patterns.

## JSON Number Rules

Valid JSON numbers include:

```json
[0, -12, 3.14, 6.02e23, -2E-3]
```

Invalid forms include:

```text
01
.5
1.
NaN
Infinity
0xFF
```

JSON does not define a maximum numeric size or precision, but receiving programming languages do. Large integers may lose precision in JavaScript and other IEEE-754-based environments. Use a string when an identifier or exact integer can exceed the consumer’s safe range.

## Booleans and Null

The literals are lowercase:

```json
{
  "enabled": true,
  "archived": false,
  "deletedAt": null
}
```

`null` is a JSON value. It is different from a missing property, an empty string, zero, and an empty object.

## Whitespace and Formatting

Spaces, tabs, carriage returns, and line feeds can appear between JSON tokens. Minified and pretty-printed versions represent the same data:

```json
{"name":"Ada","roles":["admin","editor"]}
```

```json
{
  "name": "Ada",
  "roles": [
    "admin",
    "editor"
  ]
}
```

Use [JSON Formatter](/json-formatter) to add indentation and [JSON Minify](/json-minify) to remove unnecessary whitespace.

## What JSON Does Not Allow

These JavaScript conveniences are invalid in standard JSON:

- Comments.
- Single-quoted strings.
- Unquoted property names.
- Trailing commas.
- Functions, regular expressions, `undefined`, `NaN`, or infinity.
- Raw tab or newline characters inside strings.

Use [JSONC to JSON](/jsonc-to-json) when a configuration file intentionally contains comments.

## Dates in JSON

JSON has no date type. ISO 8601 strings are the most interoperable convention:

```json
{
  "createdAt": "2026-08-14T12:30:00Z",
  "birthday": "1815-12-10"
}
```

The producer and consumer must agree on whether a value is a date, local time, or instant. Read [JSON Date Format](/json-date-format) for time-zone guidance.

## JSON Files, APIs, and Streaming

- `.json` files normally contain one complete JSON value.
- HTTP APIs commonly use the `application/json` media type.
- A sequence of independent records can use JSON Lines/NDJSON, where each line is a complete JSON value.
- JSON text exchanged between independent systems should use UTF-8 for maximum interoperability.

## Common Syntax Errors

```json
{
  name: 'Ada',
  "active": True,
}
```

Problems:

1. `name` is not quoted.
2. The string uses single quotes.
3. `True` must be lowercase `true`.
4. The final property has a trailing comma.

Use the [JSON Parse Error guide](/json-parse-error) for error-specific fixes.

## JSON Schema

Valid syntax does not guarantee valid application data. JSON Schema can require fields, restrict types and values, and document a format:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["id", "name"],
  "properties": {
    "id": {"type": "integer"},
    "name": {"type": "string", "minLength": 1}
  }
}
```

See [JSON Schema Examples](/json-schema-examples) or validate a document with the [Schema Validator](/json-schema).

## Frequently Asked Questions

### Must JSON start with `{` or `[`?

No. Modern JSON specifications allow any JSON value at the top level, including a string, number, boolean, or null. Some older systems still expect an object or array.

### Does property order matter?

Applications should not assign meaning to object-property order. Array order is significant.

### Is JSON the same as a JavaScript object?

No. JSON is text with a smaller grammar. JavaScript object literals can contain features that JSON does not allow.

## References and Next Steps

- [RFC 8259: The JSON Data Interchange Format](https://www.rfc-editor.org/rfc/rfc8259)
- [JSON Lines and NDJSON](/json-lines)
- [Comments in JSON](/json-comments)
- [YAML vs JSON](/json-vs-yaml)
- [JSON vs XML](/json-vs-xml)
