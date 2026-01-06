---
title: NATO Phonetic Alphabet JSON Dataset
description: NATO phonetic alphabet with letters, code words, pronunciations, and Morse code.
category: reference
tags:
  - nato
  - phonetic
  - alphabet
  - communication
  - morse
records: 36
fields:
  - name: letter
    type: string
    description: Letter or digit
  - name: code
    type: string
    description: NATO code word
  - name: phonetic
    type: string
    description: Pronunciation
  - name: morse
    type: string
    description: Morse code
fileSize: 2 KB
lastUpdated: 2024-01-15
source: NATO, ITU
license: public-domain
---

# NATO Phonetic Alphabet JSON Dataset

The international radiotelephony spelling alphabet.

## Download

- [Download JSON](/datasets/nato-alphabet.json)
- [Open in JSONLint](/?url=/datasets/nato-alphabet.json)

## Sample Data

```json
{
  "alphabet": [
    {
      "letter": "A",
      "code": "Alfa",
      "phonetic": "AL-fah",
      "morse": ".-"
    }
  ]
}
```
