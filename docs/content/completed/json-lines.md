---
title: "JSON Lines (JSONL) and NDJSON: Format, Examples, and Use Cases"
description: "Learn how JSON Lines and NDJSON store one JSON value per line for streaming, logs, data pipelines, and large files."
category: foundations
priority: 10
updated: "2026-08-14"
---

# JSON Lines (JSONL) and NDJSON: Format, Examples, and Use Cases

JSON Lines—usually called **JSONL**—stores one complete JSON value on each line. **NDJSON** (newline-delimited JSON) describes the same practical format. It is useful when you need to process records one at a time instead of loading one large JSON array into memory.

```json
{"id":1,"event":"signup","active":true}
{"id":2,"event":"purchase","active":true}
{"id":3,"event":"cancel","active":false}
```

Each line above is independently valid JSON. The file as a whole is not a single JSON array, so a normal `JSON.parse()` call cannot parse the entire file at once.

## JSON Lines rules

A portable JSONL file follows three simple rules:

1. Use UTF-8 encoding.
2. Put one valid JSON value on each line.
3. Separate records with a newline (`\n`). A final newline is strongly recommended.

Blank lines are not valid records. Values can technically be objects, arrays, strings, numbers, booleans, or `null`, although objects are the most common choice for datasets and logs.

The usual extension is `.jsonl`; `.ndjson` is also common. Confirm the extension and media type expected by the system receiving the file because conventions differ between tools.

## JSON vs JSONL

The same records can be represented as a JSON array:

```json
[
  {"id": 1, "event": "signup"},
  {"id": 2, "event": "purchase"}
]
```

Or as JSON Lines:

```json
{"id":1,"event":"signup"}
{"id":2,"event":"purchase"}
```

| Characteristic | JSON array | JSON Lines |
|---|---|---|
| Entire file is one JSON value | Yes | No |
| Stream one record at a time | Awkward | Natural |
| Append a record | Requires editing the array | Append one line |
| Pretty-print records across lines | Yes | Usually no |
| Recover after one bad record | Often difficult | Can isolate the bad line |

Use a JSON array for a small document that should be parsed atomically. Use JSONL for logs, exports, machine-learning datasets, event streams, and large record collections.

## Read JSONL in JavaScript

For a small file, split it into lines and parse each non-empty line:

```js
const records = text
  .split(/\r?\n/)
  .filter((line) => line.trim() !== "")
  .map((line, index) => {
    try {
      return JSON.parse(line);
    } catch (error) {
      throw new Error(`Invalid JSON on line ${index + 1}: ${error.message}`);
    }
  });
```

For a large file in Node.js, use a line reader so you do not retain the entire file in memory:

```js
import fs from "node:fs";
import readline from "node:readline";

const input = fs.createReadStream("events.jsonl", "utf8");
const lines = readline.createInterface({ input, crlfDelay: Infinity });

let lineNumber = 0;
for await (const line of lines) {
  lineNumber += 1;
  if (!line.trim()) continue;

  try {
    const record = JSON.parse(line);
    console.log(record);
  } catch (error) {
    console.error(`Line ${lineNumber}: ${error.message}`);
  }
}
```

## Read and write JSONL in Python

Python can process the file one line at a time:

```python
import json

with open("events.jsonl", encoding="utf-8") as source:
    for line_number, line in enumerate(source, start=1):
        if not line.strip():
            continue
        try:
            record = json.loads(line)
            print(record)
        except json.JSONDecodeError as error:
            print(f"Line {line_number}: {error}")
```

Write compact records with one `json.dumps()` call per line:

```python
import json

records = [{"id": 1}, {"id": 2}]

with open("records.jsonl", "w", encoding="utf-8") as output:
    for record in records:
        output.write(json.dumps(record, ensure_ascii=False) + "\n")
```

## Work with JSONL from the command line

[`jq`](https://jqlang.org/) processes a stream of JSON values naturally:

```bash
jq 'select(.active == true)' events.jsonl
```

Convert a JSON array to compact JSONL:

```bash
jq -c '.[]' records.json > records.jsonl
```

Convert JSONL back to an array:

```bash
jq -s '.' records.jsonl > records.json
```

## Common JSONL mistakes

- **Wrapping records in an array:** that creates ordinary JSON, not JSONL.
- **Pretty-printing one record across multiple lines:** a line reader will treat each fragment as a separate record.
- **Leaving commas between lines:** each line must stand alone, so there is no comma after a record.
- **Ignoring blank lines:** decide whether to reject or skip them and apply that rule consistently.
- **Stopping the whole import after one malformed line:** for batch data, report the line number and consider quarantining only the invalid record.
- **Assuming every consumer uses the same extension or content type:** verify the receiving API's requirements.

JSONL files also compress well. Files such as `events.jsonl.gz` can be decompressed and processed as streams, which is useful for large archives.

## How to validate a JSONL file

Because the complete file is not one JSON document, validate each non-empty line separately. When a line fails, report its line number and preserve the original record for debugging.

For a short sample, paste one line at a time into the [JSON validator](/). If the parser error is unclear, the [JSON error analyzer](/json-error-analyzer) explains common syntax failures. For standard JSON syntax and data types, see the [JSON format guide](/mastering-json-format).

## Frequently asked questions

### Are JSONL and NDJSON the same?

In most data tools, yes: both mean newline-delimited JSON with one complete JSON value per line. A specific service may document small convention differences, so follow its import or API specification.

### Can a JSONL value contain a newline?

A JSON string can contain the escaped characters `\n`, but not a literal unescaped line break. Keeping each complete value on one physical line is what makes JSONL streamable.

### Can I call `JSON.parse()` on a JSONL file?

Not on the whole file. Parse each line independently, or first convert the records into a valid JSON array.

## References

- [JSON Lines format documentation](https://jsonlines.org/)
- [JSON specification (RFC 8259)](https://www.rfc-editor.org/rfc/rfc8259)

