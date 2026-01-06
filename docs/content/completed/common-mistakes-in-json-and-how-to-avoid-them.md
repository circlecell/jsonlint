---
title: Common JSON Mistakes and How to Avoid Them
description: The 20 most common JSON syntax errors developers make, organized by category with examples and fixes.
---

# Common JSON Mistakes and How to Avoid Them

Even experienced developers make JSON syntax errors. Here are the 20 most common mistakes, organized by category, with examples showing what's wrong and how to fix it.

---

## Syntax Errors

### 1. Trailing Commas 🔴 Very Common

**Wrong:**
```json
{
  "name": "Alice",
  "age": 30,
}
```

**Correct:**
```json
{
  "name": "Alice",
  "age": 30
}
```

JSON doesn't allow trailing commas. This is the #1 error we see—likely because JavaScript allows them.

💡 **Pro tip:** When reordering properties, always check the last line.

---

### 2. Single Quotes 🔴 Very Common

**Wrong:**
```json
{
  'name': 'Alice'
}
```

**Correct:**
```json
{
  "name": "Alice"
}
```

JSON requires double quotes. Single quotes are never valid, even though JavaScript accepts them.

💡 **Pro tip:** If copying from Python code, watch for single quotes—Python doesn't distinguish.

---

### 3. Unquoted Keys 🔴 Very Common

**Wrong:**
```json
{
  name: "Alice"
}
```

**Correct:**
```json
{
  "name": "Alice"
}
```

All keys must be quoted strings. JavaScript object shorthand doesn't work in JSON.

---

### 4. Comments 🟡 Common

**Wrong:**
```json
{
  "name": "Alice", // user's name
  "age": 30 /* in years */
}
```

**Correct:**
```json
{
  "name": "Alice",
  "age": 30
}
```

Standard JSON has no comment syntax. If you need comments, consider:
- JSONC (JSON with Comments) — supported by VS Code
- JSON5 — superset with relaxed syntax
- A separate documentation file

Read our full guide: [JSON Comments: Why They Don't Exist and Workarounds](/json-comments)

---

### 5. Missing Commas 🟡 Common

**Wrong:**
```json
{
  "name": "Alice"
  "age": 30
}
```

**Correct:**
```json
{
  "name": "Alice",
  "age": 30
}
```

Every property except the last needs a trailing comma. JSONLint points to the exact line.

---

## Data Type Errors

### 6. Using `undefined` 🟡 Common

**Wrong:**
```json
{
  "name": "Alice",
  "nickname": undefined
}
```

**Correct:**
```json
{
  "name": "Alice",
  "nickname": null
}
```

`undefined` is a JavaScript concept, not valid JSON. Use `null` for missing/empty values.

---

### 7. NaN and Infinity 🟢 Rare

**Wrong:**
```json
{
  "result": NaN,
  "limit": Infinity
}
```

**Correct:**
```json
{
  "result": null,
  "limit": null
}
```

JSON numbers must be finite. Represent these as `null` or use a string like `"NaN"` with application-level handling.

---

### 8. Wrong Boolean/Null Case 🟡 Common

**Wrong:**
```json
{
  "active": True,
  "deleted": FALSE,
  "data": NULL
}
```

**Correct:**
```json
{
  "active": true,
  "deleted": false,
  "data": null
}
```

Booleans and null must be lowercase. Python developers often make this mistake.

---

### 9. Leading Zeros in Numbers 🟢 Rare

**Wrong:**
```json
{
  "code": 007,
  "zip": 02134
}
```

**Correct:**
```json
{
  "code": 7,
  "zip": "02134"
}
```

Leading zeros make numbers invalid (they look like octal). If you need them, use a string.

---

### 10. Numeric Precision Issues 🟢 Rare

**Wrong (may lose precision):**
```json
{
  "bigId": 9007199254740993
}
```

**Safer:**
```json
{
  "bigId": "9007199254740993"
}
```

JavaScript (and JSON parsers in many languages) can't precisely represent integers larger than 2^53. Use strings for big IDs.

---

### 11. Hexadecimal Numbers 🟢 Rare

**Wrong:**
```json
{
  "color": 0xFF5733
}
```

**Correct:**
```json
{
  "color": "#FF5733"
}
```

JSON only supports decimal numbers. Use strings for hex values.

---

## String Errors

### 12. Unescaped Special Characters 🟡 Common

**Wrong:**
```json
{
  "path": "C:\Users\Alice"
}
```

**Correct:**
```json
{
  "path": "C:\\Users\\Alice"
}
```

Backslashes must be escaped. This also applies to quotes inside strings: `"She said \"hello\""`.

---

### 13. Multi-line Strings 🟡 Common

**Wrong:**
```json
{
  "message": "Hello
  World"
}
```

**Correct:**
```json
{
  "message": "Hello\nWorld"
}
```

Strings can't contain literal newlines. Use `\n` for line breaks.

---

### 14. Tab Characters 🟢 Rare

**Wrong:**
```json
{
  "data": "col1	col2"
}
```

**Correct:**
```json
{
  "data": "col1\tcol2"
}
```

Literal tabs must be escaped as `\t`. Most editors hide this issue.

---

### 15. Control Characters 🟢 Rare

**Wrong:**
```json
{
  "text": "Hello\u0000World"
}
```

Many control characters (ASCII 0-31) are invalid even when escaped. The null character (`\u0000`) is particularly problematic.

💡 **Pro tip:** If processing user input, sanitize control characters before JSON encoding.

---

### 16. Invalid Unicode Escapes 🟢 Rare

**Wrong:**
```json
{
  "emoji": "\u123"
}
```

**Correct:**
```json
{
  "emoji": "\u0123"
}
```

Unicode escapes must be exactly 4 hex digits: `\uXXXX`.

---

## Structural Errors

### 17. Duplicate Keys 🟡 Common

**Problematic:**
```json
{
  "name": "Alice",
  "name": "Bob"
}
```

This is technically valid JSON (the spec allows it), but behavior varies by parser. Most take the last value, but don't rely on this.

💡 **Pro tip:** JSONLint warns about duplicates. Always fix them.

---

### 18. Root Must Be Object or Array 🟢 Rare

**Wrong:**
```json
"just a string"
```

**Correct:**
```json
{
  "value": "just a string"
}
```

The root element must be an object `{}` or array `[]`. Primitives alone aren't valid JSON documents (though some parsers accept them).

---

### 19. Empty Key 🟢 Rare

**Technically valid but problematic:**
```json
{
  "": "empty key"
}
```

An empty string is a valid key, but many systems don't handle it well. Avoid if possible.

---

### 20. Circular References (Conceptual) 🟡 Common

**Impossible to represent:**
```javascript
const obj = { name: "Alice" };
obj.self = obj; // circular!
JSON.stringify(obj); // TypeError
```

JSON can't represent circular structures. Flatten your data or use a library that handles cycles.

---

## Quick Reference

| Error | Frequency | Quick Fix |
|-------|-----------|-----------|
| Trailing comma | 🔴 Very Common | Remove comma after last item |
| Single quotes | 🔴 Very Common | Replace with double quotes |
| Unquoted keys | 🔴 Very Common | Add quotes around keys |
| Comments | 🟡 Common | Remove or use JSONC |
| Missing commas | 🟡 Common | Add comma between items |
| `undefined` | 🟡 Common | Use `null` instead |
| Wrong case (True/NULL) | 🟡 Common | Use lowercase |
| Unescaped backslash | 🟡 Common | Double the backslash |
| Multi-line string | 🟡 Common | Use `\n` |
| Duplicate keys | 🟡 Common | Remove duplicates |

---

## How JSONLint Helps

[JSONLint](%%NEXT_PUBLIC_BASE_URL%%) catches all these errors and shows you exactly where they are:

- **Line numbers** — Jump directly to the problem
- **Clear messages** — Understand what's wrong
- **Auto-fix** — The "Try Fix" button handles common issues like trailing commas

Validate your JSON before deploying. A syntax error in a config file can take down your whole app.

---

## Preventing Errors

1. **Use an editor with JSON support** — VS Code, Sublime, and others highlight errors as you type
2. **Let your language generate JSON** — `JSON.stringify()` in JavaScript, `json.dumps()` in Python
3. **Validate in CI/CD** — Catch errors before they reach production
4. **Format consistently** — Prettier and similar tools enforce consistent style

Most JSON errors are simple typos. Use tools to catch them early.

---

## Related Resources

- [JSON Validator](/) — Validate your JSON and find errors instantly
- [JSON Minify](/json-minify) — Compress JSON by removing whitespace
- [JSON Comments Guide](/json-comments) — Learn about JSON comment alternatives
- [Fix "Unexpected End of JSON Input"](/fix-unexpected-end-of-json-input) — Debug parsing errors
- [JSON Unescape](/json-unescape) — Fix escaped string issues
- [Mastering JSON Format](/mastering-json-format) — Complete JSON syntax reference
