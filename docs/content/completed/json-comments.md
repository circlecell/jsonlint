---
title: "Comments in JSON: Why They Are Invalid and What to Use Instead"
description: "Standard JSON does not support comments. Learn the safe alternatives—JSONC, JSON5, comment fields, and separate documentation—with working examples."
category: foundations
priority: 30
updated: "2026-08-14"
---

Standard JSON does **not** support comments. Adding `//`, `/* ... */`, or `#` text makes a document invalid according to the JSON specification and causes strict parsers to fail.

If you need comments in a configuration file, use JSONC or JSON5 only when every tool that reads the file supports that format. For APIs and portable data, keep the JSON comment-free.

## Can JSON Have Comments?

No. These examples are not valid JSON:

```jsonc
{
  // Single-line comment
  "port": 443,
  "secure": true /* Inline comment */
}
```

JSON was designed as a small, interoperable data format. Comments can become unofficial instructions that different programs interpret differently, so they were intentionally left out of the grammar defined by [RFC 8259](https://www.rfc-editor.org/rfc/rfc8259).

Paste a document into the [JSON Validator](/) if you are unsure whether comments or another syntax extension are present.

## Best Alternatives to JSON Comments

### 1. Use JSONC for Human-Edited Configuration

JSONC means “JSON with Comments.” It commonly supports JavaScript-style line and block comments:

```jsonc
{
  // Public port for the web server
  "port": 443,

  /* Disable only in local development. */
  "secure": true
}
```

Visual Studio Code settings and TypeScript configuration are familiar JSONC use cases. The `.jsonc` extension makes the distinction clear, but support still depends on the consuming tool.

Convert a JSONC document to strict JSON with the [JSONC to JSON tool](/jsonc-to-json).

### 2. Use JSON5 When You Control Both Ends

JSON5 is a broader extension that permits comments, trailing commas, single-quoted strings, unquoted property names, and additional number formats:

```json5
{
  // JSON5 is designed for human editing
  serviceName: 'catalog',
  retries: 3,
}
```

Do not send JSON5 to a standard JSON parser. Use it only when the reader explicitly supports JSON5.

### 3. Add a Comment Property

A normal property keeps the document valid JSON:

```json
{
  "_comment": "Port used by the public HTTPS listener",
  "port": 443,
  "secure": true
}
```

This works with every JSON parser, but the comment becomes part of the data. It may fail a strict JSON Schema that rejects unknown properties, and it can accidentally reach downstream systems.

Use a naming convention such as `_comment`, `_note`, or `description`, and confirm the consumer will ignore it.

### 4. Use JSON Schema for Field Documentation

When you need machine-readable validation and human-readable explanations, JSON Schema is usually better than inline comments:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "port": {
      "type": "integer",
      "minimum": 1,
      "maximum": 65535,
      "description": "Public TCP port for the service"
    }
  },
  "required": ["port"]
}
```

Try the schema with the [JSON Schema Validator](/json-schema), or start with our [JSON Schema examples guide](/json-schema-examples).

### 5. Keep Documentation Beside the File

For public APIs and complex configuration, keep standard JSON and document it in a README, API reference, or schema:

```text
config/
├── service.json
├── service.schema.json
└── README.md
```

This keeps data portable while allowing richer explanations, examples, links, and change history.

### 6. Choose YAML or TOML for Human-Managed Configuration

YAML and TOML both support comments. They may be a better fit for configuration edited primarily by people, while JSON remains a strong choice for APIs and generated data. See [YAML vs JSON](/json-vs-yaml) before changing formats.

## How to Remove Comments from JSONC

Do not delete comments with a regular expression. Comment-like text can legally appear inside strings, including URLs such as `"https://example.com"`.

Use a parser designed for the extended format. In JavaScript, one option is `strip-json-comments`:

```javascript
import stripJsonComments from 'strip-json-comments';

const jsonc = `{
  // Local development port
  "port": 3000
}`;

const value = JSON.parse(stripJsonComments(jsonc));
console.log(value.port); // 3000
```

The JSONLint [JSONC converter](/jsonc-to-json) provides the same kind of workflow in the browser without uploading a file.

## Which Option Should You Choose?

| Situation | Recommended approach |
|---|---|
| Public API request or response | Strict JSON with external API documentation |
| VS Code or TypeScript configuration | JSONC, because the tool supports it |
| Application configuration you control | JSONC, JSON5, YAML, or TOML |
| Shared data interchange | Strict JSON |
| Need validation and field descriptions | JSON Schema |
| One short note and flexible consumer | A `_comment` property |

## Common Mistakes

- Saving JSONC with a `.json` extension and assuming every parser will accept it.
- Sending JSON5 syntax in an `application/json` response.
- Using a regex that damages `//` inside string values.
- Adding `_comment` properties to data validated with `additionalProperties: false`.
- Assuming a formatter will remove comments automatically.

## Frequently Asked Questions

### Does `JSON.parse()` support comments?

No. Browser and Node.js implementations of `JSON.parse()` follow JSON syntax and reject comments.

### Does `package.json` support comments?

No. `package.json` is standard JSON. Keep explanatory text in a README or in documented, tool-supported metadata fields.

### Does `tsconfig.json` support comments?

The TypeScript toolchain supports comments in its configuration format. That does not make the file valid standard JSON for other parsers.

### Can `jq` parse JSON comments?

No. `jq` expects valid JSON input. Strip or convert comments with a JSONC-aware tool before piping the result to `jq`.

## Related Tools and References

- [JSONC to JSON](/jsonc-to-json)
- [JSON Validator](/)
- [JSON Schema Validator](/json-schema)
- [RFC 8259](https://www.rfc-editor.org/rfc/rfc8259)
