---
title: "Unexpected End of JSON Input: Causes and Fixes"
description: "Fix Unexpected end of JSON input errors caused by empty responses, truncated data, missing brackets, incomplete strings, and incorrect fetch handling."
category: errors
priority: 1
updated: "2026-08-14"
---

`SyntaxError: Unexpected end of JSON input` means a parser reached the end of its input before it found a complete JSON value. The input is commonly empty, truncated, missing a closing bracket, or cut off inside a string.

Validate the exact input with [JSONLint](/). If the data is recoverable but malformed, try the [JSON Repair tool](/json-repair) and review its output before using it.

## The Most Common Causes

### Empty Input

Both an empty string and a whitespace-only response fail:

```javascript
JSON.parse('');
JSON.parse('   ');
```

Check before parsing:

```javascript
function parseJsonIfPresent(text) {
  if (typeof text !== 'string' || text.trim() === '') {
    return null;
  }

  return JSON.parse(text);
}
```

Returning `null` is only appropriate if an empty value is valid in your application. Otherwise, throw a descriptive error.

### Missing Closing Bracket or Brace

These documents end too early:

```json
{"user":{"name":"Ada"}
```

```json
{"items":[1,2,3}
```

The first needs another `}`. The second has mismatched array and object delimiters. Do not fix production data by blindly appending brackets: a truncated payload may also be missing properties or values.

### Unterminated String

```json
{"message":"The request was cut off
```

The parser reached the end while still inside the string. Recover the original data rather than guessing the missing text.

### Truncated Network Response

A timeout, closed connection, proxy limit, or interrupted stream can produce a partial body. Compare logs from the sender and receiver, check response size, and retry the request when the operation is safe to repeat.

### Parsing a Response That Has No Body

Some successful responses intentionally have no JSON body, including common `204 No Content` responses. Do not call `response.json()` without checking:

```javascript
async function readOptionalJson(response) {
  if (response.status === 204) return null;

  const text = await response.text();
  if (!text.trim()) return null;

  return JSON.parse(text);
}
```

## Fixing the Error with `fetch()`

Check the HTTP status, expected content type, and raw text:

```javascript
async function fetchJson(url) {
  const response = await fetch(url);
  const contentType = response.headers.get('content-type') || '';

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} from ${url}`);
  }

  if (response.status === 204) return null;

  const text = await response.text();
  if (!text.trim()) {
    throw new Error('Expected JSON but received an empty response');
  }

  if (!contentType.includes('application/json')) {
    throw new Error(`Expected JSON, received ${contentType || 'an unknown type'}`);
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Invalid JSON from ${url}: ${error.message}`);
  }
}
```

Reading the body once as text makes it possible to distinguish empty data from invalid JSON. Avoid logging the complete body when it may contain tokens, personal data, or credentials.

## Fixing the Error in Node.js

Use the promise-based file API and specify UTF-8:

```javascript
import { readFile } from 'node:fs/promises';

async function readJsonFile(filename) {
  const text = await readFile(filename, 'utf8');

  if (!text.trim()) {
    throw new Error(`${filename} is empty`);
  }

  return JSON.parse(text);
}
```

When another process writes the file, use an atomic-write pattern: write the complete document to a temporary file and rename it after the write succeeds. This prevents readers from seeing half-written JSON.

## Fixing the Error in Python

Python reports similar incomplete input through `json.JSONDecodeError`:

```python
import json
from pathlib import Path

def read_json_file(filename):
    text = Path(filename).read_text(encoding="utf-8")

    if not text.strip():
        raise ValueError(f"{filename} is empty")

    try:
        return json.loads(text)
    except json.JSONDecodeError as error:
        raise ValueError(
            f"Invalid JSON at line {error.lineno}, column {error.colno}: {error.msg}"
        ) from error
```

For normal file reads, `json.load(file)` is more direct. See [Read and Write JSON Files in Python](/python-json) for the difference between `load`, `loads`, `dump`, and `dumps`.

## Debugging Checklist

1. Record whether the input length is zero.
2. Inspect the final 100 characters of a redacted copy.
3. Confirm the request returned the expected status and content type.
4. Reproduce the problem with the exact received text.
5. Validate the document and inspect the first reported location.
6. Compare the sender’s byte count with the receiver’s byte count.
7. Check for concurrent or interrupted file writes.
8. Retry or recover from the authoritative source instead of guessing missing values.

## Do Not Automatically Append Brackets

Counting opening and closing braces is not a reliable repair strategy. Braces can appear inside strings, and a truncated document may be missing much more than its final delimiter:

```json
{"message":"use } in this example","permissions":["read"
```

Appending `]}` produces valid syntax, but it cannot prove the original permissions array was complete. Treat automated repair as a reviewable recovery aid, not a guarantee of semantic correctness.

## Preventing Unexpected-End Errors

- Serialize values with a standard JSON library instead of concatenating strings.
- Write files atomically.
- Use checksums, record counts, or message framing for streamed data.
- Use JSON Lines for a stream of independent records.
- Place response-size limits on both clients and servers.
- Validate configuration and fixture files in CI.
- Handle empty and `204` responses explicitly.

## Frequently Asked Questions

### Why does `JSON.parse(undefined)` fail differently?

`JSON.parse` first converts many non-string inputs to strings. `undefined` becomes `"undefined"`, which usually produces an unexpected-token error rather than an unexpected-end error.

### Can valid JSON be empty?

No. An empty string is not a JSON value. `null` is valid JSON when you need an explicit empty or absent value.

### Why does the error point to the last line?

The parser may only discover that something is missing after reaching the end. The actual mistake can be an opening bracket or quote much earlier.

### Can JSONLint recover truncated data?

The [JSON Repair tool](/json-repair) can repair some malformed structures, but no tool can reconstruct values that were never received.

## Related Guides

- [JSON Parse Errors](/json-parse-error)
- [Unexpected Token in JSON](/unexpected-token-in-json)
- [JSON Lines and NDJSON](/json-lines)
- [RFC 8259](https://www.rfc-editor.org/rfc/rfc8259)
