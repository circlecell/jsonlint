---
title: File Extensions JSON Dataset
description: A reference dataset of common file extensions with types, MIME types, and descriptions for file handling.
category: reference
tags:
  - files
  - mime-types
  - extensions
  - web
  - development
records: 35
fields:
  - name: extension
    type: string
    description: File extension with dot
  - name: type
    type: string
    description: File type category
  - name: mime_type
    type: string
    description: MIME type string
  - name: description
    type: string
    description: Full name/description
fileSize: 3 KB
lastUpdated: 2024-01-15
source: IANA Media Types
license: public-domain
---

# File Extensions JSON Dataset

A comprehensive reference of common file extensions with MIME types for file upload validation, icon assignment, and content type handling.

## Quick Stats

- **35 file extensions** covering common formats
- **~3 KB** file size
- **Fields:** extension, type, mime_type, description

## Download

- [Download JSON](/datasets/file-extensions.json)
- [Open in JSONLint](/?url=/datasets/file-extensions.json)

## Schema

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `extension` | string | Extension with dot | `".json"` |
| `type` | string | File category | `"Data"` |
| `mime_type` | string | MIME type | `"application/json"` |
| `description` | string | Full name | `"JavaScript Object Notation"` |

## File Types

- **Data** - JSON, XML, CSV, YAML
- **Code** - JS, TS, Python, Java, Go, Rust, etc.
- **Web** - HTML, CSS
- **Image** - PNG, JPG, GIF, SVG, WebP
- **Audio** - MP3, WAV
- **Video** - MP4
- **Document** - PDF, MD, TXT
- **Archive** - ZIP, TAR
- **Database** - SQL

## Sample Data

```json
{
  "extensions": [
    {
      "extension": ".json",
      "type": "Data",
      "mime_type": "application/json",
      "description": "JavaScript Object Notation"
    },
    {
      "extension": ".ts",
      "type": "Code",
      "mime_type": "text/typescript",
      "description": "TypeScript"
    },
    {
      "extension": ".png",
      "type": "Image",
      "mime_type": "image/png",
      "description": "Portable Network Graphics"
    }
  ]
}
```

## Usage Examples

### JavaScript - File Upload Validation

```javascript
const response = await fetch('https://jsonlint.com/datasets/file-extensions.json');
const { extensions } = await response.json();

// Build allowed extensions for images
const imageExtensions = extensions
  .filter(e => e.type === 'Image')
  .map(e => e.extension);
// [".png", ".jpg", ".gif", ".svg", ".webp"]

// Validate file upload
function isValidImage(filename) {
  const ext = '.' + filename.split('.').pop().toLowerCase();
  return imageExtensions.includes(ext);
}

// Get MIME type for Content-Type header
function getMimeType(filename) {
  const ext = '.' + filename.split('.').pop().toLowerCase();
  const found = extensions.find(e => e.extension === ext);
  return found ? found.mime_type : 'application/octet-stream';
}
```

### File Type Icon Assignment

```javascript
const typeIcons = {
  'Code': 'code-icon',
  'Image': 'image-icon',
  'Data': 'data-icon',
  'Document': 'doc-icon',
  // ...
};

function getFileIcon(filename) {
  const ext = '.' + filename.split('.').pop().toLowerCase();
  const found = extensions.find(e => e.extension === ext);
  return found ? typeIcons[found.type] : 'file-icon';
}
```

### Server-Side Content Types

```javascript
// Express.js middleware
app.use((req, res, next) => {
  const ext = path.extname(req.path);
  const found = extensions.find(e => e.extension === ext);
  if (found) {
    res.type(found.mime_type);
  }
  next();
});
```

## Use Cases

- **File upload validation** - Restrict uploads to specific file types
- **MIME type detection** - Set correct Content-Type headers
- **File icons** - Display appropriate icons for file types
- **Syntax highlighting** - Choose highlighter based on extension
- **File browsers** - Categorize and filter files

## Related Datasets

- [Programming Languages](/datasets/programming-languages) - More language details
- [HTTP Status Codes](/datasets/http-status-codes) - API response handling
