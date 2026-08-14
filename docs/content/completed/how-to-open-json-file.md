---
title: "How to Open a JSON File on Windows, macOS, Linux, and the Web"
description: "Open, view, format, and edit JSON files using a browser, code editor, command line, or JSONLint on Windows, macOS, and Linux."
category: foundations
priority: 20
updated: "2026-08-14"
---

A `.json` file is a plain-text document, so you can open it with any text editor. A code editor or JSON viewer is usually better because it adds syntax highlighting, formatting, folding, and error detection.

For a quick check, open [JSONLint](/), paste the file contents, and validate them. Do not paste files containing passwords, API keys, personal records, or other sensitive data into any online tool.

## Fastest Ways to Open a JSON File

| Goal | Recommended option |
|---|---|
| Read a small file | VS Code, Notepad++, TextEdit in plain-text mode |
| Validate syntax | [JSONLint Validator](/) |
| Explore nested data | [JSON Tree Viewer](/json-tree) |
| View an array as rows | [JSON to Table](/json-to-table) |
| Inspect from a terminal | `jq`, Python, or PowerShell |
| Process a very large file | Streaming command-line tool or application code |

## Open JSON on Windows

### Use a Code Editor

1. Right-click the `.json` file.
2. Choose **Open with**.
3. Select Visual Studio Code or Notepad++.
4. To make it the default, choose **Choose another app** and enable **Always**.

Windows Notepad can display JSON, but a code editor provides clearer indentation and highlights matching brackets.

### Use PowerShell

Pretty-print a JSON file:

```powershell
Get-Content .\data.json -Raw |
  ConvertFrom-Json |
  ConvertTo-Json -Depth 100
```

`ConvertFrom-Json` parses the file, so it will also reveal invalid syntax.

## Open JSON on macOS

### Use Finder

1. Control-click the file.
2. Choose **Open With**.
3. Select Visual Studio Code, BBEdit, or TextEdit.

If you use TextEdit, ensure the document is treated as plain text rather than rich text.

### Use Terminal

Python can validate and format the file:

```bash
python3 -m json.tool data.json
```

Or use `jq` when installed:

```bash
jq . data.json
```

## Open JSON on Linux

Most desktop editors and code editors can open JSON directly. From a terminal:

```bash
less data.json
jq . data.json
python3 -m json.tool data.json
```

Use `less` for viewing, `jq` for querying and formatting, and `python3 -m json.tool` for a dependency-free validation check when Python is available.

## Open JSON in a Web Browser

You can drag a local JSON file into a browser window or use **File → Open**. Browser behavior varies: some display raw text, some format JSON, and some download the file depending on the response headers.

For JSON served by a website, the server should normally send:

```http
Content-Type: application/json
```

The [JSON Formatter for Chrome](/json-formatter/chrome-extension) adds a formatted tree view for JSON responses opened in Chrome.

## Format Minified JSON

A one-line file is still valid JSON, but it is difficult to inspect:

```json
{"users":[{"id":1,"name":"Ada"},{"id":2,"name":"Grace"}]}
```

Use [JSON Formatter](/json-formatter), `jq`, or Python:

```bash
jq . data.json > formatted.json
python3 -m json.tool data.json formatted.json
```

Keep the original until you have verified the formatted output.

## Open Large JSON Files

Desktop editors can become slow when they must parse and render hundreds of megabytes. Avoid loading a very large file into an online tool or a browser tab.

Start by checking its size and structure:

```bash
wc -c large.json
head -c 500 large.json
jq -r 'type' large.json
```

Then stream or select only the data you need:

```bash
jq -c '.items[]' large.json | head
```

If the file contains one JSON value per line, it may be JSON Lines or NDJSON rather than one JSON array. See [JSON Lines and NDJSON](/json-lines).

## Edit JSON Safely

- Keep keys and string values in double quotes.
- Remove trailing commas and comments unless the format is explicitly JSONC.
- Preserve UTF-8 encoding.
- Validate after every manual change.
- Use version control or a backup for configuration files.
- Do not reorder keys if another system incorrectly depends on their textual order.

Use [JSON Diff](/json-diff) to review changes between two versions.

## Common Problems

### “This File Is Not Valid JSON”

The file may contain a missing delimiter, comments, multiple concatenated values, or truncated content. Start with the [JSON Parse Error guide](/json-parse-error).

### The File Contains Comments

It may be JSONC. Standard JSON parsers reject comments; convert it using [JSONC to JSON](/jsonc-to-json).

### The File Shows Strange Characters

Reopen it as UTF-8. A byte-order mark or a different source encoding can also cause parse errors.

### The File Has No `.json` Extension

An extension is a convention, not proof of content. Inspect the first characters and the content type. A valid JSON document can also be a string, number, boolean, or null—not only an object or array.

## Frequently Asked Questions

### What program opens JSON files?

Any plain-text editor can open JSON. Visual Studio Code and similar code editors are more convenient because they understand JSON syntax.

### Can Excel open JSON?

Modern Excel versions can import JSON through Power Query. For a quick conversion, use [JSON to Excel](/json-to-excel) or [JSON to CSV](/json-to-csv).

### Can I open JSON on a phone?

Yes. A text editor, code-viewer app, browser, or online validator can display it. Avoid uploading sensitive files.

## Related Tools

- [JSON Validator](/)
- [JSON Formatter](/json-formatter)
- [JSON Tree Viewer](/json-tree)
- [JSON Path Finder](/json-path)
- [JSON to Table](/json-to-table)
