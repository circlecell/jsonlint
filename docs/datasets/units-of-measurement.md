---
title: Units of Measurement JSON Dataset
description: Common units of measurement with symbols, types, and conversion factors.
category: reference
tags:
  - units
  - measurement
  - conversion
  - metric
  - imperial
records: 25
fields:
  - name: name
    type: string
    description: Unit name
  - name: symbol
    type: string
    description: Unit symbol
  - name: type
    type: string
    description: Measurement type
  - name: system
    type: string
    description: SI or Imperial
  - name: base_unit
    type: boolean
    description: Is base unit
  - name: conversion
    type: number
    description: Conversion to base
fileSize: 2 KB
lastUpdated: 2024-01-15
source: NIST, SI
license: public-domain
---

# Units of Measurement JSON Dataset

Common measurement units for conversions.

## Download

- [Download JSON](/datasets/units-of-measurement.json)
- [Open in JSONLint](/?url=/datasets/units-of-measurement.json)

## Sample Data

```json
{
  "units": [
    {
      "name": "Kilometer",
      "symbol": "km",
      "type": "Length",
      "system": "SI",
      "conversion": 1000
    }
  ]
}
```
