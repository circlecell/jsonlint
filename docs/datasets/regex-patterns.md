---
title: Regex Patterns JSON Dataset
description: Common regular expression patterns for validation with examples and descriptions.
category: reference
tags:
  - regex
  - validation
  - patterns
  - programming
  - strings
records: 20
fields:
  - name: name
    type: string
    description: Pattern name
  - name: pattern
    type: string
    description: Regex pattern
  - name: description
    type: string
    description: What it matches
  - name: example
    type: string
    description: Example match
  - name: flags
    type: string
    description: Regex flags
fileSize: 4 KB
lastUpdated: 2024-01-15
license: public-domain
---

# Regex Patterns JSON Dataset

Common regex patterns for form validation and data parsing.

## Download

- [Download JSON](/datasets/regex-patterns.json)
- [Open in JSONLint](/?url=/datasets/regex-patterns.json)

## Sample Data

```json
{
  "patterns": [
    {
      "name": "Email",
      "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}$",
      "description": "Validates email addresses",
      "example": "user@example.com"
    }
  ]
}
```
