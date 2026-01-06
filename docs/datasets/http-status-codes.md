---
title: HTTP Status Codes JSON Dataset
description: Complete reference of HTTP status codes with messages, categories, and descriptions for web development.
category: reference
tags:
  - http
  - web
  - api
  - status-codes
  - rest
records: 33
fields:
  - name: code
    type: number
    description: HTTP status code number
  - name: message
    type: string
    description: Standard status message
  - name: category
    type: string
    description: Status category
  - name: description
    type: string
    description: Human-readable explanation
fileSize: 4 KB
lastUpdated: 2024-01-15
source: IETF RFC 7231, RFC 6585
license: public-domain
---

# HTTP Status Codes JSON Dataset

A complete reference of HTTP status codes for building APIs, error handling, and web development documentation.

## Quick Stats

- **33 status codes** covering all major HTTP responses
- **~4 KB** file size
- **Fields:** code, message, category, description

## Download

- [Download JSON](/datasets/http-status-codes.json)
- [Open in JSONLint](/?url=/datasets/http-status-codes.json)

## Schema

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `code` | number | HTTP status code | `200` |
| `message` | string | Standard message | `"OK"` |
| `category` | string | Status category | `"Success"` |
| `description` | string | Explanation | `"The request was successful."` |

## Categories

- **Informational (1xx)** - Request received, continuing process
- **Success (2xx)** - Request successfully received and processed
- **Redirection (3xx)** - Further action needed to complete request
- **Client Error (4xx)** - Request contains bad syntax or cannot be fulfilled
- **Server Error (5xx)** - Server failed to fulfill valid request

## Sample Data

```json
{
  "status_codes": [
    {
      "code": 200,
      "message": "OK",
      "category": "Success",
      "description": "The request was successful."
    },
    {
      "code": 404,
      "message": "Not Found",
      "category": "Client Error",
      "description": "The requested resource could not be found."
    },
    {
      "code": 500,
      "message": "Internal Server Error",
      "category": "Server Error",
      "description": "The server encountered an unexpected condition."
    }
  ]
}
```

## Usage Examples

### JavaScript - Error Handler

```javascript
const response = await fetch('https://jsonlint.com/datasets/http-status-codes.json');
const { status_codes } = await response.json();

function getErrorMessage(statusCode) {
  const status = status_codes.find(s => s.code === statusCode);
  return status ? status.description : 'Unknown error occurred';
}

// In your API error handler
catch (error) {
  const message = getErrorMessage(error.response.status);
  showToast(message);
}
```

### TypeScript - Type Generation

```typescript
// Generate a type from the status codes
type HttpStatusCode = 100 | 101 | 200 | 201 | /* ... */ | 504;

interface ApiResponse<T> {
  status: HttpStatusCode;
  message: string;
  data?: T;
}
```

## Use Cases

- **API documentation** - Generate status code reference docs
- **Error handling** - Display user-friendly error messages
- **Testing** - Validate API responses return correct status codes
- **Education** - Learn HTTP fundamentals

## Fun Fact

Status code **418 "I'm a Teapot"** is a real code defined in RFC 2324 as an April Fools' joke. It's included in this dataset!

## Related Datasets

- [File Extensions](/datasets/file-extensions) - MIME types and file info
- [Programming Languages](/datasets/programming-languages) - Language reference
