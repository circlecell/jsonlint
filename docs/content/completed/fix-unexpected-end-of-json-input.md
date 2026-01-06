---
title: "How to Fix 'Unexpected End of JSON Input' Error"
description: "Learn what causes the 'Unexpected end of JSON input' error and how to fix it with practical solutions for JavaScript, Python, and other languages."
date: "2024-01-15"
---

The **"Unexpected end of JSON input"** error is one of the most common JSON parsing errors developers encounter. This error occurs when you try to parse incomplete or truncated JSON data.

In this guide, we'll explain why this error happens, show you how to identify the problem, and provide solutions for different programming languages.

## What Causes This Error?

The error occurs when a JSON parser reaches the end of the input before finding a complete, valid JSON structure. In simple terms: **something is missing**.

### Common Causes

1. **Empty string or response**
2. **Truncated data** (network timeout, file read error)
3. **Missing closing brackets** `}` or `]`
4. **Incomplete API response**
5. **Encoding issues** cutting off data

## Quick Diagnosis

Paste your JSON into the [JSON Validator](/) to identify exactly where the problem is. The validator will show you what's missing.

### Examples of Invalid JSON

```json
// Missing closing brace
{
  "name": "John",
  "age": 30

// Missing closing bracket
{
  "items": [1, 2, 3

// Empty string
(nothing)

// Truncated string
{"name": "Jo
```

All of these will produce the "Unexpected end of JSON input" error.

## Solutions by Language

### JavaScript / Node.js

#### The Error

```javascript
JSON.parse('{"name": "John"');
// SyntaxError: Unexpected end of JSON input

JSON.parse('');
// SyntaxError: Unexpected end of JSON input
```

#### Solution 1: Check for Empty Data

```javascript
function safeJsonParse(str) {
  if (!str || str.trim() === '') {
    return null; // or throw a custom error
  }
  
  try {
    return JSON.parse(str);
  } catch (error) {
    console.error('JSON parse error:', error.message);
    return null;
  }
}
```

#### Solution 2: Validate API Responses

```javascript
async function fetchJson(url) {
  const response = await fetch(url);
  
  // Check if response is OK
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  
  // Get text first to inspect if needed
  const text = await response.text();
  
  // Check for empty response
  if (!text) {
    throw new Error('Empty response from server');
  }
  
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error('Invalid JSON:', text.substring(0, 100));
    throw new Error('Server returned invalid JSON');
  }
}
```

#### Solution 3: Handle Streaming Data

```javascript
// When receiving chunked data, wait for complete response
let chunks = [];

response.on('data', chunk => chunks.push(chunk));
response.on('end', () => {
  const complete = Buffer.concat(chunks).toString();
  try {
    const data = JSON.parse(complete);
    // Process data
  } catch (error) {
    console.error('Incomplete JSON received');
  }
});
```

### Python

#### The Error

```python
import json

json.loads('{"name": "John"')
# json.decoder.JSONDecodeError: Expecting ',' delimiter: line 1 column 16 (char 15)

json.loads('')
# json.decoder.JSONDecodeError: Expecting value: line 1 column 1 (char 0)
```

#### Solution

```python
import json

def safe_json_loads(s):
    if not s or not s.strip():
        return None
    
    try:
        return json.loads(s)
    except json.JSONDecodeError as e:
        print(f"JSON error at position {e.pos}: {e.msg}")
        return None

# For API responses
import requests

def fetch_json(url):
    response = requests.get(url)
    response.raise_for_status()
    
    if not response.text:
        raise ValueError("Empty response from server")
    
    return response.json()  # Will raise JSONDecodeError if invalid
```

### Java

#### The Error

```java
// Using Jackson
ObjectMapper mapper = new ObjectMapper();
mapper.readTree("{\"name\":");
// JsonParseException: Unexpected end-of-input
```

#### Solution

```java
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

public JsonNode safeParseJson(String json) {
    if (json == null || json.trim().isEmpty()) {
        return null;
    }
    
    ObjectMapper mapper = new ObjectMapper();
    try {
        return mapper.readTree(json);
    } catch (JsonProcessingException e) {
        System.err.println("JSON parse error: " + e.getMessage());
        return null;
    }
}
```

### PHP

#### The Error

```php
json_decode('{"name": "John"', true);
// Returns NULL, json_last_error() returns JSON_ERROR_SYNTAX
```

#### Solution

```php
function safe_json_decode($json, $assoc = true) {
    if (empty($json)) {
        return null;
    }
    
    $result = json_decode($json, $assoc);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log('JSON error: ' . json_last_error_msg());
        return null;
    }
    
    return $result;
}
```

## Debugging Truncated JSON

When JSON is cut off mid-stream, you need to find what's missing:

### Step 1: Count Brackets

Every `{` needs a `}`, and every `[` needs a `]`:

```javascript
function countBrackets(json) {
  let braces = 0;
  let brackets = 0;
  let inString = false;
  
  for (let char of json) {
    if (char === '"' && json[json.indexOf(char) - 1] !== '\\') {
      inString = !inString;
    }
    if (!inString) {
      if (char === '{') braces++;
      if (char === '}') braces--;
      if (char === '[') brackets++;
      if (char === ']') brackets--;
    }
  }
  
  console.log(`Missing ${braces} closing braces`);
  console.log(`Missing ${brackets} closing brackets`);
}
```

### Step 2: Use a JSON Repair Tool

For automated fixing of truncated JSON:

```javascript
// Try to repair truncated JSON by closing open structures
function repairJson(json) {
  let braces = 0;
  let brackets = 0;
  let inString = false;
  
  for (let i = 0; i < json.length; i++) {
    const char = json[i];
    const prev = json[i - 1];
    
    if (char === '"' && prev !== '\\') {
      inString = !inString;
    }
    if (!inString) {
      if (char === '{') braces++;
      if (char === '}') braces--;
      if (char === '[') brackets++;
      if (char === ']') brackets--;
    }
  }
  
  // Close open strings
  if (inString) json += '"';
  
  // Close open structures
  json += ']'.repeat(brackets);
  json += '}'.repeat(braces);
  
  return json;
}
```

### Step 3: Check Network Responses

Common issues with API responses:

```javascript
// Log the raw response before parsing
fetch(url)
  .then(response => response.text())
  .then(text => {
    console.log('Response length:', text.length);
    console.log('Response preview:', text.substring(0, 200));
    console.log('Response end:', text.substring(text.length - 50));
    
    return JSON.parse(text);
  });
```

## Common Scenarios and Fixes

### Scenario 1: Empty API Response

**Problem:** Server returns empty body or just whitespace

```javascript
// Bad: No data handling
const data = JSON.parse(response.body);

// Good: Check before parsing
if (response.body && response.body.trim()) {
  const data = JSON.parse(response.body);
} else {
  console.log('No data received');
}
```

### Scenario 2: Network Timeout

**Problem:** Response cut off due to timeout

```javascript
// Increase timeout for large responses
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 30000); // 30 seconds

fetch(url, { signal: controller.signal })
  .finally(() => clearTimeout(timeout));
```

### Scenario 3: File Read Issues

**Problem:** File not fully read

```javascript
// Node.js - Use proper async file reading
const fs = require('fs').promises;

async function readJsonFile(path) {
  const content = await fs.readFile(path, 'utf8');
  return JSON.parse(content);
}
```

### Scenario 4: Encoding Problems

**Problem:** Unicode characters cause truncation

```javascript
// Ensure proper encoding
const response = await fetch(url);
const buffer = await response.arrayBuffer();
const text = new TextDecoder('utf-8').decode(buffer);
const data = JSON.parse(text);
```

## Prevention Best Practices

### 1. Always Validate Before Parsing

Use the [JSON Validator](/) during development to catch issues early.

### 2. Implement Error Handling

Never assume JSON parsing will succeed:

```javascript
try {
  const data = JSON.parse(input);
  processData(data);
} catch (error) {
  handleError(error);
}
```

### 3. Log Raw Input on Errors

When debugging, always log what you tried to parse:

```javascript
try {
  return JSON.parse(input);
} catch (error) {
  console.error('Failed to parse:', input);
  throw error;
}
```

### 4. Validate Data Length

For API responses, check Content-Length matches actual data:

```javascript
const contentLength = response.headers.get('content-length');
const body = await response.text();

if (contentLength && body.length < parseInt(contentLength)) {
  console.warn('Response may be truncated');
}
```

## Related Tools and Resources

- [JSON Validator](/) — Validate and identify JSON errors
- [JSON Stringify](/json-stringify) — Properly escape JSON strings
- [JSON Unescape](/json-unescape) — Fix escaped JSON issues
- [Common JSON Mistakes](/common-mistakes-in-json-and-how-to-avoid-them) — Avoid other common errors
- [Mastering JSON Format](/mastering-json-format) — JSON syntax reference

## Summary

The "Unexpected end of JSON input" error always means **incomplete data**. To fix it:

1. **Check for empty input** before parsing
2. **Verify network responses** are complete
3. **Count brackets** to find what's missing
4. **Add proper error handling** to catch and log issues
5. **Use the [JSON Validator](/)** to diagnose problems

With proper validation and error handling, you can catch these issues early and provide meaningful error messages to users.
