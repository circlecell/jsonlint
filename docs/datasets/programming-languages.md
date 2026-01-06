---
title: Programming Languages JSON Dataset
description: A curated collection of popular programming languages with creation year, creator, paradigms, and type system information.
category: reference
tags:
  - programming
  - languages
  - development
  - coding
  - software
records: 15
fields:
  - name: name
    type: string
    description: Language name
  - name: year
    type: number
    description: Year the language was created
  - name: creator
    type: string
    description: Original creator or organization
  - name: paradigm
    type: array
    description: Programming paradigms supported
  - name: typing
    type: string
    description: Type system (static or dynamic)
fileSize: 3 KB
lastUpdated: 2024-01-15
source: Wikipedia, Official language documentation
license: public-domain
---

# Programming Languages JSON Dataset

A curated collection of popular programming languages with detailed metadata about their origins, paradigms, and type systems.

## Quick Stats

- **15 languages** (most popular languages)
- **~3 KB** file size
- **Fields:** name, year, creator, paradigm, typing

## Download

- [Download JSON](/datasets/programming-languages.json)
- [Open in JSONLint](/?url=/datasets/programming-languages.json)

## Schema

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `name` | string | Language name | `"JavaScript"` |
| `year` | number | Year created | `1995` |
| `creator` | string | Original creator | `"Brendan Eich"` |
| `paradigm` | array | Supported paradigms | `["functional", "object-oriented"]` |
| `typing` | string | Type system | `"dynamic"` or `"static"` |

## Sample Data

```json
{
  "languages": [
    {
      "name": "JavaScript",
      "year": 1995,
      "creator": "Brendan Eich",
      "paradigm": ["event-driven", "functional", "imperative", "object-oriented"],
      "typing": "dynamic"
    },
    {
      "name": "Python",
      "year": 1991,
      "creator": "Guido van Rossum",
      "paradigm": ["functional", "imperative", "object-oriented", "structured"],
      "typing": "dynamic"
    },
    {
      "name": "TypeScript",
      "year": 2012,
      "creator": "Microsoft",
      "paradigm": ["functional", "generic", "imperative", "object-oriented"],
      "typing": "static"
    }
  ]
}
```

## Usage Examples

### JavaScript / Node.js

```javascript
const response = await fetch('https://jsonlint.com/datasets/programming-languages.json');
const data = await response.json();

// Find all statically typed languages
const staticLangs = data.languages.filter(l => l.typing === 'static');
console.log(staticLangs.map(l => l.name));
// ["Java", "C++", "C#", "Go", "Rust", "TypeScript", "Kotlin", "Swift"]

// Sort by creation year
const byYear = [...data.languages].sort((a, b) => a.year - b.year);
console.log(byYear[0].name); // Oldest language

// Find languages supporting functional paradigm
const functional = data.languages.filter(l => 
  l.paradigm.includes('functional')
);
```

### Python

```python
import requests

data = requests.get('https://jsonlint.com/datasets/programming-languages.json').json()

# Group by type system
static = [l for l in data['languages'] if l['typing'] == 'static']
dynamic = [l for l in data['languages'] if l['typing'] == 'dynamic']

print(f"Static: {len(static)}, Dynamic: {len(dynamic)}")

# Find unique paradigms
all_paradigms = set()
for lang in data['languages']:
    all_paradigms.update(lang['paradigm'])
print(all_paradigms)
```

### cURL / Command Line

```bash
# Download the dataset
curl -O https://jsonlint.com/datasets/programming-languages.json

# List all language names
curl -s https://jsonlint.com/datasets/programming-languages.json | jq '.languages[].name'

# Find languages created after 2000
curl -s https://jsonlint.com/datasets/programming-languages.json | \
  jq '.languages[] | select(.year >= 2000) | .name'
```

## Use Cases

### Developer Tools
Build language detection, syntax highlighting configuration, or IDE settings.

### Educational Content
Create programming language comparison charts, quizzes, or learning paths.

### Portfolio Projects
Use as sample data for CRUD applications, filtering UIs, or data visualization.

### Testing
Consistent test data for applications that handle programming language metadata.

## Languages Included

1. JavaScript (1995)
2. Python (1991)
3. Java (1995)
4. C++ (1985)
5. C# (2000)
6. Ruby (1995)
7. Go (2009)
8. Rust (2010)
9. TypeScript (2012)
10. PHP (1995)
11. Swift (2014)
12. Kotlin (2011)
13. Scala (2004)
14. R (1993)
15. Perl (1987)

## Source

Data compiled from official language documentation and Wikipedia. This dataset is maintained by JSONLint.

## Related Datasets

- [US States](/datasets/us-states-with-detail) - Geographic data
- [Emoticons](/datasets/emoticons) - Text emoticons collection
