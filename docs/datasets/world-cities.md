---
title: World Cities JSON Dataset
description: Major world cities with populations, coordinates, and timezone information for global applications.
category: geographic
tags:
  - cities
  - population
  - coordinates
  - timezones
  - geography
records: 30
fields:
  - name: name
    type: string
    description: City name
  - name: country
    type: string
    description: Country name
  - name: population
    type: number
    description: Metropolitan population
  - name: lat
    type: number
    description: Latitude
  - name: lon
    type: number
    description: Longitude
  - name: timezone
    type: string
    description: IANA timezone
fileSize: 3 KB
lastUpdated: 2024-01-15
source: United Nations, GeoNames
license: public-domain
---

# World Cities JSON Dataset

Top 30 most populous cities in the world with geographic data.

## Download

- [Download JSON](/datasets/world-cities.json)
- [Open in JSONLint](/?url=/datasets/world-cities.json)

## Sample Data

```json
{
  "cities": [
    {
      "name": "Tokyo",
      "country": "Japan",
      "population": 37400068,
      "lat": 35.6762,
      "lon": 139.6503,
      "timezone": "Asia/Tokyo"
    }
  ]
}
```

## Use Cases

- City picker dropdowns
- Population comparisons
- Map visualizations
- Timezone detection
