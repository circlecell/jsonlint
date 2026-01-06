---
title: World Airports JSON Dataset
description: Major international airports with IATA codes, locations, and geographic coordinates for travel applications.
category: geographic
tags:
  - airports
  - travel
  - iata
  - aviation
  - coordinates
records: 30
fields:
  - name: code
    type: string
    description: IATA airport code
  - name: name
    type: string
    description: Full airport name
  - name: city
    type: string
    description: City location
  - name: country
    type: string
    description: Country code
  - name: lat
    type: number
    description: Latitude
  - name: lon
    type: number
    description: Longitude
fileSize: 4 KB
lastUpdated: 2024-01-15
source: IATA, OpenFlights
license: public-domain
---

# World Airports JSON Dataset

Top 30 busiest international airports with IATA codes and coordinates.

## Download

- [Download JSON](/datasets/airports.json)
- [Open in JSONLint](/?url=/datasets/airports.json)

## Sample Data

```json
{
  "airports": [
    {
      "code": "JFK",
      "name": "John F. Kennedy International",
      "city": "New York",
      "country": "US",
      "lat": 40.6413,
      "lon": -73.7781
    }
  ]
}
```

## Use Cases

- Airport search/autocomplete
- Flight tracking applications
- Distance calculations between airports
- Travel booking systems
