---
title: Zodiac Signs JSON Dataset
description: All 12 zodiac signs with symbols, elements, and date ranges for astrology applications.
category: reference
tags:
  - zodiac
  - astrology
  - signs
  - horoscope
  - dates
records: 12
fields:
  - name: name
    type: string
    description: Sign name
  - name: symbol
    type: string
    description: Zodiac symbol
  - name: element
    type: string
    description: Fire/Earth/Air/Water
  - name: ruling_planet
    type: string
    description: Ruling planet
  - name: start_date
    type: string
    description: Start date
  - name: end_date
    type: string
    description: End date
fileSize: 1 KB
lastUpdated: 2024-01-15
license: public-domain
---

# Zodiac Signs JSON Dataset

All 12 zodiac signs with dates.

## Download

- [Download JSON](/datasets/zodiac-signs.json)
- [Open in JSONLint](/?url=/datasets/zodiac-signs.json)

## Sample Data

```json
{
  "signs": [
    {
      "name": "Aries",
      "symbol": "♈",
      "element": "Fire",
      "start_date": "March 21"
    }
  ]
}
```
