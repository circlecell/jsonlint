---
title: Chemical Elements JSON Dataset
description: Periodic table elements with atomic numbers, symbols, masses, and categories.
category: reference
tags:
  - chemistry
  - elements
  - periodic-table
  - science
  - atoms
records: 25
fields:
  - name: number
    type: number
    description: Atomic number
  - name: symbol
    type: string
    description: Element symbol
  - name: name
    type: string
    description: Element name
  - name: atomic_mass
    type: number
    description: Atomic mass (amu)
  - name: category
    type: string
    description: Element category
  - name: phase
    type: string
    description: Phase at STP
fileSize: 2 KB
lastUpdated: 2024-01-15
source: IUPAC
license: public-domain
---

# Chemical Elements JSON Dataset

Key elements from the periodic table.

## Download

- [Download JSON](/datasets/elements.json)
- [Open in JSONLint](/?url=/datasets/elements.json)

## Sample Data

```json
{
  "elements": [
    {
      "number": 6,
      "symbol": "C",
      "name": "Carbon",
      "atomic_mass": 12.011,
      "category": "Nonmetal",
      "phase": "Solid"
    }
  ]
}
```
