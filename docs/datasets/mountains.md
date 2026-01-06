---
title: Mountains JSON Dataset
description: Famous mountains worldwide with heights, ranges, and first ascent dates for geographic applications.
category: geographic
tags:
  - mountains
  - peaks
  - geography
  - climbing
  - altitude
records: 20
fields:
  - name: name
    type: string
    description: Mountain name
  - name: height_m
    type: number
    description: Height in meters
  - name: range
    type: string
    description: Mountain range
  - name: country
    type: string
    description: Location country
  - name: first_summit
    type: string
    description: First ascent date
  - name: continent
    type: string
    description: Continent
fileSize: 2 KB
lastUpdated: 2024-01-15
source: Wikipedia, National Geographic
license: public-domain
---

# Mountains JSON Dataset

Famous mountains from around the world including all Seven Summits.

## Download

- [Download JSON](/datasets/mountains.json)
- [Open in JSONLint](/?url=/datasets/mountains.json)

## Sample Data

```json
{
  "mountains": [
    {
      "name": "Mount Everest",
      "height_m": 8849,
      "range": "Himalayas",
      "country": "Nepal/China",
      "first_summit": "1953-05-29",
      "continent": "Asia"
    }
  ]
}
```
