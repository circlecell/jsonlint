---
title: NFL Teams JSON Dataset
description: All 32 NFL teams with cities, conferences, divisions, stadiums, and colors.
category: reference
tags:
  - nfl
  - football
  - sports
  - teams
  - america
records: 32
fields:
  - name: name
    type: string
    description: Team name
  - name: abbreviation
    type: string
    description: Team abbreviation
  - name: city
    type: string
    description: City location
  - name: conference
    type: string
    description: AFC or NFC
  - name: division
    type: string
    description: Division name
  - name: stadium
    type: string
    description: Home stadium
  - name: primary_color
    type: string
    description: Team color hex
fileSize: 5 KB
lastUpdated: 2024-01-15
source: NFL
license: public-domain
---

# NFL Teams JSON Dataset

All 32 NFL teams with locations and team info.

## Download

- [Download JSON](/datasets/sports-teams-nfl.json)
- [Open in JSONLint](/?url=/datasets/sports-teams-nfl.json)

## Sample Data

```json
{
  "teams": [
    {
      "name": "Dallas Cowboys",
      "abbreviation": "DAL",
      "city": "Arlington",
      "conference": "NFC",
      "division": "East",
      "stadium": "AT&T Stadium",
      "primary_color": "#003594"
    }
  ]
}
```
