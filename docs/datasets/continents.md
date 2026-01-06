---
title: Continents JSON Dataset
description: All seven continents with area, population, country counts, and geographic facts.
category: geographic
tags:
  - continents
  - geography
  - world
  - population
  - area
records: 7
fields:
  - name: code
    type: string
    description: Continent code
  - name: name
    type: string
    description: Continent name
  - name: area_km2
    type: number
    description: Area in square kilometers
  - name: population
    type: number
    description: Total population
  - name: countries
    type: number
    description: Number of countries
  - name: highest_point
    type: string
    description: Highest peak
fileSize: 1 KB
lastUpdated: 2024-01-15
source: National Geographic
license: public-domain
---

# Continents JSON Dataset

All seven continents with key geographic facts.

## Download

- [Download JSON](/datasets/continents.json)
- [Open in JSONLint](/?url=/datasets/continents.json)

## Sample Data

```json
{
  "continents": [
    {
      "code": "AS",
      "name": "Asia",
      "area_km2": 44579000,
      "population": 4700000000,
      "countries": 49,
      "highest_point": "Mount Everest"
    }
  ]
}
```

## Use Cases

- Geographic education apps
- Data visualization
- Region selectors
