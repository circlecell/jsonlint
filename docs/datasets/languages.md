---
title: World Languages JSON Dataset
description: Major world languages with ISO codes, native names, speaker counts, and text direction for internationalization.
category: reference
tags:
  - languages
  - i18n
  - localization
  - iso-639
  - internationalization
records: 30
fields:
  - name: code
    type: string
    description: ISO 639-1 code
  - name: name
    type: string
    description: English name
  - name: native_name
    type: string
    description: Native language name
  - name: family
    type: string
    description: Language family
  - name: speakers
    type: number
    description: Total speakers
  - name: direction
    type: string
    description: Text direction (ltr/rtl)
fileSize: 3 KB
lastUpdated: 2024-01-15
source: Ethnologue, UNESCO
license: public-domain
---

# World Languages JSON Dataset

Major world languages with localization metadata.

## Download

- [Download JSON](/datasets/languages.json)
- [Open in JSONLint](/?url=/datasets/languages.json)

## Sample Data

```json
{
  "languages": [
    {
      "code": "en",
      "name": "English",
      "native_name": "English",
      "family": "Indo-European",
      "speakers": 1500000000,
      "direction": "ltr"
    }
  ]
}
```

## Use Cases

- Language selector dropdowns
- RTL layout detection
- Internationalization (i18n)
- Content localization
