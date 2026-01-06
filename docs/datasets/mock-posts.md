---
title: Mock Blog Posts JSON Dataset
description: Sample blog post data for testing CMS features, content management, and publishing workflows.
category: api-mocks
tags:
  - posts
  - blog
  - mock-data
  - cms
  - content
records: 8
fields:
  - name: id
    type: number
    description: Post ID
  - name: title
    type: string
    description: Post title
  - name: slug
    type: string
    description: URL slug
  - name: status
    type: string
    description: Publish status
  - name: views
    type: number
    description: View count
  - name: tags
    type: array
    description: Post tags
fileSize: 2 KB
lastUpdated: 2024-01-15
license: public-domain
---

# Mock Blog Posts JSON Dataset

Sample blog posts for CMS testing.

## Download

- [Download JSON](/datasets/mock-posts.json)
- [Open in JSONLint](/?url=/datasets/mock-posts.json)

## Sample Data

```json
{
  "posts": [
    {
      "id": 101,
      "title": "Getting Started with JSON",
      "slug": "getting-started-with-json",
      "status": "published",
      "views": 1542,
      "tags": ["json", "tutorial"]
    }
  ]
}
```
