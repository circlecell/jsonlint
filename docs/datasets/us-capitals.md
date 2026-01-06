---
title: US State Capitals JSON Dataset
description: All 50 US state capitals with population, founding year, and coordinates.
category: geographic
tags:
  - united-states
  - capitals
  - cities
  - geography
  - coordinates
records: 50
fields:
  - name: state
    type: string
    description: State name
  - name: capital
    type: string
    description: Capital city
  - name: population
    type: number
    description: City population
  - name: founded
    type: number
    description: Year became capital
  - name: lat
    type: number
    description: Latitude
  - name: lon
    type: number
    description: Longitude
fileSize: 5 KB
lastUpdated: 2024-01-15
source: US Census Bureau
license: public-domain
---

# US State Capitals JSON Dataset

All 50 US state capitals with coordinates and population data.

## Download

- [Download JSON](/datasets/us-capitals.json)
- [Open in JSONLint](/?url=/datasets/us-capitals.json)

## Sample Data

```json
{
  "capitals": [
    {
      "state": "California",
      "capital": "Sacramento",
      "population": 508529,
      "founded": 1854,
      "lat": 38.555605,
      "lon": -121.468926
    }
  ]
}
```
