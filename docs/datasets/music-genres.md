---
title: Music Genres JSON Dataset
description: Music genres with origins, parent genres, and subgenres for music applications.
category: reference
tags:
  - music
  - genres
  - audio
  - entertainment
  - categorization
records: 15
fields:
  - name: name
    type: string
    description: Genre name
  - name: origin_decade
    type: string
    description: Origin time period
  - name: parent
    type: string
    description: Parent genre
  - name: subgenres
    type: array
    description: List of subgenres
fileSize: 2 KB
lastUpdated: 2024-01-15
license: public-domain
---

# Music Genres JSON Dataset

Music genres and subgenres.

## Download

- [Download JSON](/datasets/music-genres.json)
- [Open in JSONLint](/?url=/datasets/music-genres.json)

## Sample Data

```json
{
  "genres": [
    {
      "name": "Rock",
      "origin_decade": "1950s",
      "subgenres": ["Classic Rock", "Punk Rock", "Alternative Rock"]
    }
  ]
}
```
