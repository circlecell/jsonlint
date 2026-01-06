---
title: "Unexpected Token in JSON: How to Fix This Error"
description: "Fix the 'Unexpected token' JSON error with this guide. Learn what causes it and how to resolve it in JavaScript, Python, and other languages."
date: "2024-01-15"
---

The **"Unexpected token" error** is one of the most common JSON parsing errors. It means the parser encountered a character it wasn't expecting at a specific position. This guide explains what causes it and how to fix it quickly.

## What Does "Unexpected Token" Mean?

When you see an error like:

```
SyntaxError: Unexpected token < in JSON at position 0
```

It's telling you three things:
1. **Unexpected token** — The parser found a character that doesn't belong
2. **`<`** — The specific character that caused the problem
3. **at position 0** — Where in the string it occurred (0 = the very first character)

The most important clue is **which token** was unexpected. Different tokens indicate different problems.

## Common Causes by Token

### Unexpected Token `<` (Most Common)

**Cause:** You're receiving HTML instead of JSON. This typically happens when:
- An API returns an error page instead of JSON
- You're hitting the wrong URL
- The server is down and returning a default error page
- Authentication failed and you got a login page

```javascript
// You expected JSON but got HTML
fetch('/api/data')
  .then(r => r.json())  // Fails: response is "<html>..."
```

**How to debug:**

```javascript
fetch('/api/data')
  .then(response => {
    // Check content type
    const contentType = response.headers.get('content-type');
    console.log('Content-Type:', contentType);
    
    // Look at raw response
    return response.text();
  })
  .then(text => {
    console.log('Raw response:', text.substring(0, 200));
    
    // Now try to parse
    return JSON.parse(text);
  });
```

**Fix:** Check that:
- The URL is correct
- The server is returning JSON (Content-Type: application/json)
- You're authenticated if required
- The API endpoint exists

### Unexpected Token `u`

**Cause:** Trying to parse the string `"undefined"`:

```javascript
let data;
JSON.parse(data);  // Error: data is undefined
// Parser sees: undefined → starts with 'u' → unexpected
```

**Fix:** Check for undefined before parsing:

```javascript
function safeParse(data) {
  if (data === undefined || data === null) {
    console.error('No data to parse');
    return null;
  }
  return JSON.parse(data);
}
```

### Unexpected Token `'` (Single Quote)

**Cause:** JSON requires double quotes, not single quotes:

```json
{'name': 'Alice'}  // Wrong: single quotes
```

**Fix:** Replace single quotes with double quotes:

```json
{"name": "Alice"}
```

If you're receiving data with single quotes, you may need to transform it:

```javascript
// Risky but sometimes necessary for malformed data
const fixed = badJson.replace(/'/g, '"');
const data = JSON.parse(fixed);
```

### Unexpected Token `}` or `]`

**Cause:** Extra closing bracket or trailing comma:

```json
{"name": "Alice",}   // Trailing comma before }
["a", "b", "c",]     // Trailing comma before ]
{"data": {}}}}       // Extra closing braces
```

**Fix:** Remove trailing commas and check bracket matching. Use the [JSON Validator](/) to find the exact location.

### Unexpected Token at Position 0

When the error is at position 0, the entire response is wrong:

```
SyntaxError: Unexpected token X in JSON at position 0
```

Common causes:
- **Empty response** — Server returned nothing
- **BOM character** — Invisible bytes at start of file
- **HTML/XML response** — Wrong content type
- **Plain text error** — Server returned "Error" or "Not found"

**Debug with:**

```javascript
fetch('/api/data')
  .then(r => r.text())
  .then(text => {
    console.log('Length:', text.length);
    console.log('First 10 chars:', JSON.stringify(text.substring(0, 10)));
    console.log('Char codes:', [...text.substring(0, 5)].map(c => c.charCodeAt(0)));
  });
```

## Fixing BOM Characters

A Byte Order Mark (BOM) is an invisible character at the start of some files. It looks like this in hex: `EF BB BF` (UTF-8 BOM).

**Symptoms:**
- JSON looks correct but won't parse
- Error at position 0
- File works in some editors but not others

**Fix in JavaScript:**

```javascript
function stripBOM(text) {
  // Remove UTF-8 BOM if present
  if (text.charCodeAt(0) === 0xFEFF) {
    return text.slice(1);
  }
  return text;
}

const cleanJson = stripBOM(rawText);
const data = JSON.parse(cleanJson);
```

**Fix in Python:**

```python
import codecs

# Method 1: Use utf-8-sig encoding
with open('data.json', 'r', encoding='utf-8-sig') as f:
    data = json.load(f)

# Method 2: Strip manually
text = raw_text.lstrip('\ufeff')
data = json.loads(text)
```

## Language-Specific Solutions

### JavaScript

```javascript
async function fetchJSON(url) {
  const response = await fetch(url);
  
  // Check if response is OK
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  // Check content type
  const contentType = response.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    const text = await response.text();
    throw new Error(`Expected JSON but got ${contentType}: ${text.substring(0, 100)}`);
  }
  
  return response.json();
}
```

### Python

```python
import requests
import json

def fetch_json(url):
    response = requests.get(url)
    
    # Check content type
    content_type = response.headers.get('Content-Type', '')
    if 'application/json' not in content_type:
        raise ValueError(f"Expected JSON, got {content_type}: {response.text[:100]}")
    
    try:
        return response.json()
    except json.JSONDecodeError as e:
        print(f"Failed to parse: {response.text[:200]}")
        raise
```

### Node.js with Axios

```javascript
const axios = require('axios');

async function fetchJSON(url) {
  try {
    const response = await axios.get(url, {
      headers: { 'Accept': 'application/json' },
      transformResponse: [(data) => {
        // Log raw response for debugging
        if (typeof data === 'string' && data.startsWith('<')) {
          console.error('Received HTML instead of JSON');
          throw new Error('Server returned HTML');
        }
        return JSON.parse(data);
      }]
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}
```

## Debugging Checklist

When you get an unexpected token error, check these in order:

### 1. Is the response actually JSON?
```javascript
console.log('Raw:', await response.text());
```

### 2. What's the Content-Type header?
```javascript
console.log('Type:', response.headers.get('content-type'));
```

### 3. Is the response empty?
```javascript
const text = await response.text();
console.log('Length:', text.length);
console.log('Empty?', text.trim() === '');
```

### 4. Are there hidden characters?
```javascript
console.log('Char codes:', [...text.slice(0, 10)].map(c => c.charCodeAt(0)));
// BOM would show: [65279, ...] or [239, 187, 191, ...]
```

### 5. Is the URL correct?
```javascript
console.log('URL:', response.url);  // Check for redirects
console.log('Status:', response.status);
```

## Common Scenarios

### API Returns Login Page

```javascript
// Problem: Not authenticated, API returns HTML login page
fetch('/api/private-data')
  .then(r => r.json())  // Error: Unexpected token <

// Solution: Check authentication first
fetch('/api/private-data', {
  headers: { 'Authorization': `Bearer ${token}` }
})
```

### CORS Proxy Issues

```javascript
// Problem: CORS proxy returns error as text
fetch('https://cors-proxy.example.com/api')
  .then(r => r.json())  // Error: Unexpected token

// Solution: Check proxy response
fetch('https://cors-proxy.example.com/api')
  .then(r => r.text())
  .then(text => {
    if (text.includes('error') || text.startsWith('<')) {
      console.error('Proxy error:', text);
      return null;
    }
    return JSON.parse(text);
  });
```

### Local File with BOM

```javascript
// Problem: JSON file saved with BOM from Windows editor
const fs = require('fs');
const text = fs.readFileSync('data.json', 'utf8');
JSON.parse(text);  // Error: Unexpected token

// Solution: Strip BOM
const cleanText = text.replace(/^\uFEFF/, '');
JSON.parse(cleanText);
```

## Prevention Tips

1. **Always check response status** before parsing
2. **Verify Content-Type header** is application/json
3. **Log raw responses** during development
4. **Use try-catch** around all JSON.parse calls
5. **Validate JSON** with the [JSON Validator](/) before using in code
6. **Save files without BOM** — Use UTF-8 encoding, not UTF-8 with BOM

## Related Tools & Resources

### Tools

- [JSON Validator](/) — Validate and find errors in JSON
- [JSON Unescape](/json-unescape) — Fix escape sequence issues
- [JSON Stringify](/json-stringify) — Properly format strings as JSON

### Learn More

- [JSON Syntax Error Guide](/json-syntax-error) — All syntax error types
- [JSON Parse Error Guide](/json-parse-error) — Comprehensive parsing errors
- [Fix Unexpected End of JSON](/fix-unexpected-end-of-json-input) — Incomplete JSON errors
- [JSON Comments Guide](/json-comments) — Why comments cause errors
- [Common JSON Mistakes](/common-mistakes-in-json-and-how-to-avoid-them) — Avoid common pitfalls
