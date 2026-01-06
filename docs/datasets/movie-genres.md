---
title: Movie Genres JSON Dataset
description: Film genres with descriptions and example movies for entertainment applications.
category: reference
tags:
  - movies
  - genres
  - film
  - entertainment
  - cinema
records: 16
fields:
  - name: id
    type: number
    description: Genre ID
  - name: name
    type: string
    description: Genre name
  - name: description
    type: string
    description: Genre description
  - name: examples
    type: array
    description: Example films
fileSize: 2 KB
lastUpdated: 2024-01-15
license: public-domain
---

# Movie Genres JSON Dataset

Film genres with examples.

## Download

- [Download JSON](/datasets/movie-genres.json)
- [Open in JSONLint](/?url=/datasets/movie-genres.json)

## Sample Data

```json
{
  "genres": [
    {
      "id": 13,
      "name": "Science Fiction",
      "description": "Films exploring futuristic concepts",
      "examples": ["Blade Runner", "The Matrix", "Interstellar"]
    }
  ]
}
```
