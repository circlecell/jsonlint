---
title: Rivers JSON Dataset
description: Major world rivers with length, drainage area, and geographic information.
category: geographic
tags:
  - rivers
  - geography
  - hydrology
  - world
records: 15
fields:
  - name: name
    type: string
    description: River name
  - name: length_km
    type: number
    description: Total length in km
  - name: drainage_km2
    type: number
    description: Drainage basin area
  - name: countries
    type: array
    description: Countries it flows through
  - name: mouth
    type: string
    description: Where it empties
  - name: continent
    type: string
    description: Primary continent
fileSize: 2 KB
lastUpdated: 2024-01-15
source: World Wildlife Fund
license: public-domain
---

# Rivers JSON Dataset

Major rivers of the world with geographic data.

## Download

- [Download JSON](/datasets/rivers.json)
- [Open in JSONLint](/?url=/datasets/rivers.json)

## Sample Data

```json
{
  "rivers": [
    {
      "name": "Amazon",
      "length_km": 6400,
      "drainage_km2": 7050000,
      "countries": ["Brazil", "Peru", "Colombia"],
      "mouth": "Atlantic Ocean",
      "continent": "South America"
    }
  ]
}
```
