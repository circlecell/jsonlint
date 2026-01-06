---
title: Mock Comments JSON Dataset
description: Sample comment data for testing discussion features, moderation, and social interactions.
category: api-mocks
tags:
  - comments
  - social
  - mock-data
  - testing
  - discussion
records: 10
fields:
  - name: id
    type: number
    description: Comment ID
  - name: post_id
    type: number
    description: Parent post
  - name: author
    type: string
    description: Author name
  - name: content
    type: string
    description: Comment text
  - name: likes
    type: number
    description: Like count
  - name: created
    type: string
    description: Timestamp
fileSize: 2 KB
lastUpdated: 2024-01-15
license: public-domain
---

# Mock Comments JSON Dataset

Sample comments for social feature testing.

## Download

- [Download JSON](/datasets/mock-comments.json)
- [Open in JSONLint](/?url=/datasets/mock-comments.json)

## Sample Data

```json
{
  "comments": [
    {
      "id": 1,
      "post_id": 101,
      "author": "Alice Brown",
      "content": "Great article!",
      "likes": 24,
      "created": "2024-01-10T14:30:00Z"
    }
  ]
}
```
