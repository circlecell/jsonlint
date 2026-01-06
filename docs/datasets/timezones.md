---
title: World Timezones JSON Dataset
description: A dataset of 31 major world timezones with IANA identifiers, abbreviations, UTC offsets, and DST information.
category: reference
tags:
  - timezones
  - time
  - iana
  - utc
  - dst
records: 31
fields:
  - name: id
    type: string
    description: IANA timezone identifier
  - name: name
    type: string
    description: Human-readable timezone name
  - name: abbreviation
    type: string
    description: Common abbreviation
  - name: utc_offset
    type: string
    description: Standard UTC offset
  - name: dst_offset
    type: string
    description: Daylight saving offset (null if none)
  - name: region
    type: string
    description: Geographic region
fileSize: 4 KB
lastUpdated: 2024-01-15
source: IANA Time Zone Database
license: public-domain
---

# World Timezones JSON Dataset

A curated dataset of major world timezones with IANA identifiers for use in scheduling, international applications, and time conversion.

## Quick Stats

- **31 timezones** covering major cities worldwide
- **~4 KB** file size
- **Fields:** id, name, abbreviation, utc_offset, dst_offset, region

## Download

- [Download JSON](/datasets/timezones.json)
- [Open in JSONLint](/?url=/datasets/timezones.json)

## Schema

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | string | IANA timezone ID | `"America/New_York"` |
| `name` | string | Friendly name | `"Eastern Time"` |
| `abbreviation` | string | Common abbreviation | `"ET"` |
| `utc_offset` | string | Standard UTC offset | `"-05:00"` |
| `dst_offset` | string/null | DST offset (if applicable) | `"-04:00"` |
| `region` | string | Geographic region | `"North America"` |

## Sample Data

```json
{
  "timezones": [
    {
      "id": "America/New_York",
      "name": "Eastern Time",
      "abbreviation": "ET",
      "utc_offset": "-05:00",
      "dst_offset": "-04:00",
      "region": "North America"
    },
    {
      "id": "Asia/Tokyo",
      "name": "Japan Standard Time",
      "abbreviation": "JST",
      "utc_offset": "+09:00",
      "dst_offset": null,
      "region": "Asia"
    }
  ]
}
```

## Usage Examples

### JavaScript - Timezone Selector

```javascript
const response = await fetch('https://jsonlint.com/datasets/timezones.json');
const { timezones } = await response.json();

// Build a select dropdown
const select = document.getElementById('timezone-select');
timezones.forEach(tz => {
  const option = document.createElement('option');
  option.value = tz.id;
  option.textContent = `${tz.name} (${tz.abbreviation}) UTC${tz.utc_offset}`;
  select.appendChild(option);
});

// Use with JavaScript Date API
const date = new Date();
const formatted = date.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' });
```

### Python

```python
import requests
from datetime import datetime
import pytz

data = requests.get('https://jsonlint.com/datasets/timezones.json').json()

# Get all timezones that observe DST
dst_zones = [tz for tz in data['timezones'] if tz['dst_offset'] is not None]

# Convert time between zones
eastern = pytz.timezone('America/New_York')
tokyo = pytz.timezone('Asia/Tokyo')
now_eastern = datetime.now(eastern)
now_tokyo = now_eastern.astimezone(tokyo)
```

## Use Cases

- **Scheduling apps** - Let users select their timezone
- **Meeting planners** - Convert times across timezones
- **User preferences** - Store timezone settings
- **Global dashboards** - Show times in multiple zones

## Data Notes

- IANA IDs (e.g., `America/New_York`) are the standard for timezone handling
- `dst_offset` is `null` for zones that don't observe daylight saving time
- Offsets are in `±HH:MM` format for easy parsing
- This dataset covers major cities; for complete coverage, use the full IANA database

## Related Datasets

- [Countries](/datasets/countries) - Country information
- [Mock Users](/datasets/mock-users) - Sample user data with dates
