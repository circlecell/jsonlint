---
title: Mock Notifications JSON Dataset
description: Sample notification data for testing notification systems, read states, and user alerts.
category: api-mocks
tags:
  - notifications
  - alerts
  - mock-data
  - testing
  - social
records: 10
fields:
  - name: id
    type: number
    description: Notification ID
  - name: type
    type: string
    description: Notification type
  - name: message
    type: string
    description: Notification text
  - name: read
    type: boolean
    description: Read status
  - name: created
    type: string
    description: Timestamp
  - name: link
    type: string
    description: Target URL
fileSize: 1 KB
lastUpdated: 2024-01-15
license: public-domain
---

# Mock Notifications JSON Dataset

Sample notifications for alert system testing.

## Download

- [Download JSON](/datasets/mock-notifications.json)
- [Open in JSONLint](/?url=/datasets/mock-notifications.json)

## Sample Data

```json
{
  "notifications": [
    {
      "id": 1,
      "type": "like",
      "message": "Alice liked your post",
      "read": false,
      "link": "/posts/101"
    }
  ]
}
```
