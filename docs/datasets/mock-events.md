---
title: Mock Events JSON Dataset
description: Sample event data for testing calendar features, registrations, and event management.
category: api-mocks
tags:
  - events
  - calendar
  - mock-data
  - testing
  - scheduling
records: 10
fields:
  - name: id
    type: number
    description: Event ID
  - name: title
    type: string
    description: Event name
  - name: type
    type: string
    description: Event type
  - name: start
    type: string
    description: Start datetime
  - name: location
    type: string
    description: Event location
  - name: virtual
    type: boolean
    description: Is online
  - name: price
    type: number
    description: Ticket price
fileSize: 2 KB
lastUpdated: 2024-01-15
license: public-domain
---

# Mock Events JSON Dataset

Sample events for calendar testing.

## Download

- [Download JSON](/datasets/mock-events.json)
- [Open in JSONLint](/?url=/datasets/mock-events.json)

## Sample Data

```json
{
  "events": [
    {
      "id": 1,
      "title": "Tech Conference 2024",
      "type": "conference",
      "start": "2024-03-15T09:00:00Z",
      "location": "San Francisco, CA",
      "virtual": false,
      "price": 299.00
    }
  ]
}
```
