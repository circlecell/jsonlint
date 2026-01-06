---
title: World Countries JSON Dataset
description: A curated dataset of 50+ major countries with ISO codes, capitals, regions, populations, and currency information.
category: geographic
tags:
  - countries
  - geography
  - iso-codes
  - capitals
  - population
records: 51
fields:
  - name: name
    type: string
    description: Country name in English
  - name: code
    type: string
    description: ISO 3166-1 alpha-2 code
  - name: capital
    type: string
    description: Capital city
  - name: region
    type: string
    description: Geographic region
  - name: population
    type: number
    description: Population estimate
  - name: currency
    type: string
    description: Currency code (ISO 4217)
fileSize: 5 KB
lastUpdated: 2024-01-15
source: United Nations, World Bank
license: public-domain
---

# World Countries JSON Dataset

A comprehensive dataset of major world countries with essential geographic and demographic data.

## Quick Stats

- **51 countries** from all continents
- **~5 KB** file size
- **Fields:** name, code, capital, region, population, currency

## Download

- [Download JSON](/datasets/countries.json)
- [Open in JSONLint](/?url=/datasets/countries.json)

## Schema

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `name` | string | Country name in English | `"United States"` |
| `code` | string | ISO 3166-1 alpha-2 code | `"US"` |
| `capital` | string | Capital city | `"Washington, D.C."` |
| `region` | string | Geographic region | `"Americas"` |
| `population` | number | Population estimate | `331002651` |
| `currency` | string | Currency code (ISO 4217) | `"USD"` |

## Sample Data

```json
{
  "countries": [
    {
      "name": "United States",
      "code": "US",
      "capital": "Washington, D.C.",
      "region": "Americas",
      "population": 331002651,
      "currency": "USD"
    },
    {
      "name": "Japan",
      "code": "JP",
      "capital": "Tokyo",
      "region": "Asia",
      "population": 126476461,
      "currency": "JPY"
    }
  ]
}
```

## Usage Examples

### JavaScript

```javascript
const response = await fetch('https://jsonlint.com/datasets/countries.json');
const data = await response.json();

// Find country by code
const usa = data.countries.find(c => c.code === 'US');

// Get all European countries
const european = data.countries.filter(c => c.region === 'Europe');

// Sort by population (descending)
const byPopulation = data.countries.sort((a, b) => b.population - a.population);
```

### Python

```python
import requests

data = requests.get('https://jsonlint.com/datasets/countries.json').json()

# Create a lookup by country code
by_code = {c['code']: c for c in data['countries']}
print(by_code['GB']['capital'])  # "London"

# Get total world population (from this dataset)
total = sum(c['population'] for c in data['countries'])
```

## Use Cases

- **Country selectors** - Populate dropdown menus with country names and codes
- **Localization** - Map countries to currencies and regions
- **Data visualization** - Population comparisons, regional groupings
- **Form validation** - Validate country codes

## Related Datasets

- [Currencies](/datasets/currencies) - Currency information with symbols
- [Timezones](/datasets/timezones) - World timezone data
