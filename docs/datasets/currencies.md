---
title: World Currencies JSON Dataset
description: A dataset of 30 major world currencies with codes, symbols, decimal digits, and associated countries.
category: reference
tags:
  - currencies
  - finance
  - money
  - iso-4217
  - symbols
records: 30
fields:
  - name: code
    type: string
    description: ISO 4217 currency code
  - name: name
    type: string
    description: Full currency name
  - name: symbol
    type: string
    description: Currency symbol
  - name: decimal_digits
    type: number
    description: Number of decimal places
  - name: countries
    type: array
    description: Countries using this currency
fileSize: 3 KB
lastUpdated: 2024-01-15
source: ISO 4217, International Monetary Fund
license: public-domain
---

# World Currencies JSON Dataset

A comprehensive dataset of major world currencies with symbols, formatting info, and country associations.

## Quick Stats

- **30 currencies** covering major economies
- **~3 KB** file size
- **Fields:** code, name, symbol, decimal_digits, countries

## Download

- [Download JSON](/datasets/currencies.json)
- [Open in JSONLint](/?url=/datasets/currencies.json)

## Schema

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `code` | string | ISO 4217 currency code | `"USD"` |
| `name` | string | Full currency name | `"US Dollar"` |
| `symbol` | string | Currency symbol | `"$"` |
| `decimal_digits` | number | Decimal places (0-2) | `2` |
| `countries` | array | Countries using this currency | `["United States"]` |

## Sample Data

```json
{
  "currencies": [
    {
      "code": "USD",
      "name": "US Dollar",
      "symbol": "$",
      "decimal_digits": 2,
      "countries": ["United States", "Ecuador", "El Salvador"]
    },
    {
      "code": "EUR",
      "name": "Euro",
      "symbol": "€",
      "decimal_digits": 2,
      "countries": ["Germany", "France", "Italy", "Spain", "Netherlands"]
    }
  ]
}
```

## Usage Examples

### JavaScript - Format Currency

```javascript
const response = await fetch('https://jsonlint.com/datasets/currencies.json');
const { currencies } = await response.json();

function formatCurrency(amount, currencyCode) {
  const currency = currencies.find(c => c.code === currencyCode);
  if (!currency) return amount.toString();
  
  const formatted = amount.toFixed(currency.decimal_digits);
  return `${currency.symbol}${formatted}`;
}

console.log(formatCurrency(1234.5, 'USD'));  // "$1234.50"
console.log(formatCurrency(1234.5, 'JPY'));  // "¥1235" (0 decimals)
```

### Python

```python
import requests

data = requests.get('https://jsonlint.com/datasets/currencies.json').json()

# Build currency lookup
currencies = {c['code']: c for c in data['currencies']}

# Get symbol for a currency
print(currencies['GBP']['symbol'])  # "£"

# Find all currencies with 0 decimal places
no_decimals = [c for c in data['currencies'] if c['decimal_digits'] == 0]
```

## Use Cases

- **E-commerce** - Display prices with correct symbols and formatting
- **Currency converters** - Build conversion tools with proper formatting
- **Form inputs** - Validate currency codes and display appropriate symbols
- **Internationalization** - Map countries to their currencies

## Data Notes

- `decimal_digits` indicates standard decimal places (JPY, KRW = 0)
- `countries` lists primary users, not all legal tender locations
- The Euro (EUR) is used by 20+ countries in the Eurozone

## Related Datasets

- [Countries](/datasets/countries) - Country information with currencies
- [Mock Products](/datasets/mock-products) - Sample e-commerce data
