---
title: US Holidays JSON Dataset
description: US federal holidays and common observances with dates and types.
category: reference
tags:
  - holidays
  - united-states
  - calendar
  - dates
  - federal
records: 21
fields:
  - name: name
    type: string
    description: Holiday name
  - name: date
    type: string
    description: Date or rule
  - name: type
    type: string
    description: Holiday type
  - name: observed
    type: boolean
    description: Federal holiday
  - name: paid
    type: boolean
    description: Typically paid off
fileSize: 2 KB
lastUpdated: 2024-01-15
source: US Office of Personnel Management
license: public-domain
---

# US Holidays JSON Dataset

US federal holidays and observances.

## Download

- [Download JSON](/datasets/holidays-us.json)
- [Open in JSONLint](/?url=/datasets/holidays-us.json)

## Sample Data

```json
{
  "holidays": [
    {
      "name": "Independence Day",
      "date": "July 4",
      "type": "Federal",
      "observed": true,
      "paid": true
    }
  ]
}
```
