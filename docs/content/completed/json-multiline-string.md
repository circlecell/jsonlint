---
title: "JSON Multiline Strings: Newlines, Escaping, and Alternatives"
description: "Learn why raw multiline strings are invalid JSON, how to encode line breaks with escaped newlines, and when to use arrays or external files."
category: foundations
priority: 50
updated: "2026-08-14"
---

# JSON Multiline Strings: Newlines, Escaping, and Alternatives

Standard JSON has no triple-quoted or raw multiline string syntax. A literal line break inside a quoted JSON string is invalid. Encode the line break as `\n`, or choose a different data shape.

Valid JSON:

```json
{
  "message": "First line\nSecond line\nThird line"
}
```

After parsing, the `message` value contains real newline characters. The JSON source contains the two-character escape sequence `\n`.

## Why a raw multiline string fails

This is not valid JSON:

```text
{
  "message": "First line
Second line"
}
```

JSON strings must escape control characters. A parser will report an unterminated string, an invalid control character, or another syntax error near the line break.

## Common newline escapes

| Escape | Meaning |
|---|---|
| `\n` | Line feed; the usual newline |
| `\r` | Carriage return |
| `\t` | Horizontal tab |
| `\\` | Literal backslash |
| `\"` | Literal double quote |

Windows text commonly uses carriage return plus line feed (`\r\n`). Most cross-platform application text can use `\n` internally and let the display or file layer choose platform-specific line endings.

Use the [JSON escape tool](/json-escape) or [JSON unescape tool](/json-unescape) when you need to inspect or generate escaped text.

## Let a serializer escape the string

Avoid building JSON by concatenating quoted strings. Native serializers handle newlines, quotes, tabs, and backslashes correctly.

JavaScript:

```js
const message = `First line
Second line`;

const json = JSON.stringify({ message });
console.log(json);
// {"message":"First line\nSecond line"}
```

Python:

```python
import json

message = """First line
Second line"""

payload = json.dumps({"message": message})
print(payload)
# {"message": "First line\nSecond line"}
```

The source-language string can span lines even though the serialized JSON string cannot contain unescaped line breaks.

## Use an array when lines are separate items

If order matters but each line has its own meaning, an array is often clearer:

```json
{
  "addressLines": [
    "123 Example Street",
    "Suite 400",
    "New York, NY 10001"
  ]
}
```

Arrays make it easier to add, remove, validate, and render individual items. Join them with a newline only at the presentation layer:

```js
const formattedAddress = data.addressLines.join("\n");
```

## Use structured data instead of formatted blocks

A display-ready block may hide information that should be queryable:

```json
{
  "address": {
    "street": "123 Example Street",
    "unit": "Suite 400",
    "city": "New York",
    "region": "NY",
    "postalCode": "10001"
  }
}
```

Prefer this structure when consumers need to search, sort, translate, or validate the fields independently.

## Long documents and source code

Escaped strings become hard to review when they contain long Markdown, HTML, SQL, certificates, or source code. Consider:

- Storing the content in a separate file and putting its path or URL in JSON.
- Using an array of lines when line-by-line processing is important.
- Using Base64 only for binary data or a transport that explicitly requires it; Base64 does not improve ordinary text readability.
- Choosing YAML for a human-authored configuration format that genuinely benefits from block scalar syntax.

If a system accepts JSONC or JSON5, it may add conveniences, but do not send those dialects to a strict JSON parser unless the contract explicitly allows them.

## Double escaping

Escapes can be confusing when JSON is embedded inside a programming-language string:

```js
const source = "{\"message\":\"First line\\nSecond line\"}";
const data = JSON.parse(source);
```

There are two layers here. JavaScript consumes `\"` and `\\`; then the JSON parser consumes `\n`. Whenever possible, build a JavaScript object and call `JSON.stringify()` instead of manually maintaining both layers.

## JSON Lines is different

[JSON Lines](/json-lines) puts one complete JSON value on each physical line:

```json
{"id":1,"message":"First line\nSecond line"}
{"id":2,"message":"Another record"}
```

It does not permit one JSON string to spill across physical lines. The line break inside the first message is still escaped.

## Frequently asked questions

### Can I use backticks in JSON?

No. Backticks create template literals in JavaScript, not strings in JSON. JSON strings must use double quotes.

### Can I use triple quotes in JSON?

No. Triple-quoted strings belong to languages such as Python and some configuration formats. Serialize the resulting value to JSON and its line breaks will become `\n` escapes.

### Does pretty-printing create multiline strings?

No. Pretty-printing adds whitespace between JSON tokens. It does not change the string value or put raw line breaks inside it.

Paste a failing payload into the [JSON validator](/) or use the [JSON error analyzer](/json-error-analyzer) to locate the invalid character.

## Reference

- [JSON string grammar in RFC 8259](https://www.rfc-editor.org/rfc/rfc8259#section-7)
