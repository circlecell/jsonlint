---
title: Oceans JSON Dataset
description: The five world oceans with area, depth, and geographic information.
category: geographic
tags:
  - oceans
  - geography
  - marine
  - world
records: 5
fields:
  - name: name
    type: string
    description: Ocean name
  - name: area_km2
    type: number
    description: Surface area
  - name: avg_depth_m
    type: number
    description: Average depth in meters
  - name: max_depth_m
    type: number
    description: Maximum depth in meters
  - name: max_depth_location
    type: string
    description: Deepest point name
  - name: bordering_continents
    type: array
    description: Adjacent continents
fileSize: 1 KB
lastUpdated: 2024-01-15
source: NOAA
license: public-domain
---

# Oceans JSON Dataset

The five world oceans with geographic data.

## Download

- [Download JSON](/datasets/oceans.json)
- [Open in JSONLint](/?url=/datasets/oceans.json)

## Sample Data

```json
{
  "oceans": [
    {
      "name": "Pacific Ocean",
      "area_km2": 168723000,
      "avg_depth_m": 4188,
      "max_depth_m": 10928,
      "max_depth_location": "Mariana Trench"
    }
  ]
}
```
