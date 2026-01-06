---
title: European Countries JSON Dataset
description: All European countries with capitals, population, EU membership status, and currency information.
category: geographic
tags:
  - europe
  - countries
  - eu
  - geography
  - currency
records: 43
fields:
  - name: name
    type: string
    description: Country name
  - name: code
    type: string
    description: ISO country code
  - name: capital
    type: string
    description: Capital city
  - name: population
    type: number
    description: Total population
  - name: area_km2
    type: number
    description: Area in sq km
  - name: eu_member
    type: boolean
    description: EU membership
  - name: currency
    type: string
    description: Currency code
fileSize: 6 KB
lastUpdated: 2024-01-15
source: European Union, Eurostat
license: public-domain
---

# European Countries JSON Dataset

All European countries including EU membership status.

## Download

- [Download JSON](/datasets/european-countries.json)
- [Open in JSONLint](/?url=/datasets/european-countries.json)

## Sample Data

```json
{
  "countries": [
    {
      "name": "Germany",
      "code": "DE",
      "capital": "Berlin",
      "population": 83783942,
      "eu_member": true,
      "currency": "EUR"
    }
  ]
}
```
