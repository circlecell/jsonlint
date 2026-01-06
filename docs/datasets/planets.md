---
title: Solar System Planets JSON Dataset
description: All eight planets in our solar system with physical and orbital characteristics.
category: reference
tags:
  - planets
  - space
  - astronomy
  - solar-system
  - science
records: 8
fields:
  - name: name
    type: string
    description: Planet name
  - name: type
    type: string
    description: Planet classification
  - name: diameter_km
    type: number
    description: Diameter in kilometers
  - name: moons
    type: number
    description: Number of known moons
  - name: orbital_period_days
    type: number
    description: Year length in Earth days
  - name: has_rings
    type: boolean
    description: Has ring system
fileSize: 1 KB
lastUpdated: 2024-01-15
source: NASA
license: public-domain
---

# Solar System Planets JSON Dataset

All eight planets with scientific data.

## Download

- [Download JSON](/datasets/planets.json)
- [Open in JSONLint](/?url=/datasets/planets.json)

## Sample Data

```json
{
  "planets": [
    {
      "name": "Earth",
      "type": "Terrestrial",
      "diameter_km": 12756,
      "moons": 1,
      "orbital_period_days": 365,
      "has_rings": false
    }
  ]
}
```
