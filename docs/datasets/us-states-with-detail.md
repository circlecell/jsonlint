---
title: US States JSON Dataset
description: A comprehensive JSON dataset of all 50 US states with abbreviations, capitals, statehood dates, and bordering states.
category: geographic
tags:
  - united-states
  - states
  - geography
  - capitals
  - borders
records: 50
fields:
  - name: name
    type: string
    description: Full state name
  - name: abbreviation
    type: string
    description: Two-letter postal code
  - name: capital
    type: string
    description: State capital city
  - name: founded
    type: string
    description: Date admitted to Union (ISO 8601)
  - name: borders
    type: array
    description: Names of bordering states
fileSize: 10 KB
lastUpdated: 2024-01-15
source: US Census Bureau, National Archives
license: public-domain
---

# US States JSON Dataset

A complete dataset of all 50 US states with detailed information, perfect for testing, learning, or building applications.

## Quick Stats

- **50 items** (all US states)
- **~10 KB** file size
- **Fields:** name, abbreviation, capital, founded, borders

## Download

- [Download JSON](/datasets/us-states-with-detail.json)
- [Open in JSONLint](/?url=/datasets/us-states-with-detail.json)

## Schema

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `name` | string | Full state name | `"California"` |
| `abbreviation` | string | Two-letter postal code | `"CA"` |
| `capital` | string | State capital city | `"Sacramento"` |
| `founded` | string | Date admitted to Union (ISO 8601) | `"1850-09-09"` |
| `borders` | array | Names of bordering states | `["Oregon", "Nevada", "Arizona"]` |

## Sample Data

```json
{
  "states": [
    {
      "name": "California",
      "abbreviation": "CA",
      "capital": "Sacramento",
      "founded": "1850-09-09",
      "borders": ["Oregon", "Nevada", "Arizona"]
    },
    {
      "name": "Texas",
      "abbreviation": "TX",
      "capital": "Austin",
      "founded": "1845-12-29",
      "borders": ["New Mexico", "Oklahoma", "Arkansas", "Louisiana"]
    }
  ]
}
```

## Usage Examples

### JavaScript / Node.js

```javascript
// Fetch and use the dataset
const response = await fetch('https://jsonlint.com/datasets/us-states-with-detail.json');
const data = await response.json();

// Find a state by abbreviation
const california = data.states.find(s => s.abbreviation === 'CA');
console.log(california.capital); // "Sacramento"

// Get all state abbreviations
const codes = data.states.map(s => s.abbreviation);
console.log(codes); // ["AL", "AK", "AZ", ...]

// Find states that border Texas
const texasBorders = data.states
  .find(s => s.name === 'Texas')
  .borders;
console.log(texasBorders); // ["New Mexico", "Oklahoma", ...]
```

### Python

```python
import requests

data = requests.get('https://jsonlint.com/datasets/us-states-with-detail.json').json()

# Create a lookup dictionary
states_by_abbr = {s['abbreviation']: s for s in data['states']}
print(states_by_abbr['NY']['capital'])  # "Albany"

# Find landlocked states (no coastal or international borders)
# Note: This is simplified - actual determination needs more data
```

### cURL / Command Line

```bash
# Download the dataset
curl -O https://jsonlint.com/datasets/us-states-with-detail.json

# Pretty print with jq
curl -s https://jsonlint.com/datasets/us-states-with-detail.json | jq '.states[0]'

# Get all state names
curl -s https://jsonlint.com/datasets/us-states-with-detail.json | jq '.states[].name'
```

## Use Cases

### Form Validation
Use the abbreviations and names to populate and validate state dropdowns in forms.

### Geographic Applications
The `borders` array enables building maps, calculating routes, or creating geography quizzes.

### Educational Projects
Great for teaching data structures, array methods, or building practice apps.

### Testing
Consistent, realistic test data for applications that handle US addresses.

## Data Notes

- **Founded dates** use ISO 8601 format (YYYY-MM-DD)
- **Borders** only includes US states, not countries or bodies of water
- **Alaska and Hawaii** have empty `borders` arrays (no land borders with other states)
- **District of Columbia** is not included (it's not a state)

## Source

This dataset is maintained by JSONLint. Data compiled from public sources including the US Census Bureau and National Archives.

## Related Datasets

- [Programming Languages](/datasets/programming-languages) - Languages with metadata
- [Emoticons](/datasets/emoticons) - Text emoticons collection
