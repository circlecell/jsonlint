---
title: "U.S. States Information JSON Dataset"
description: "Explore a detailed dataset of all 50 U.S. states at JSONLint.com. From state names, capitals, to timezones and neighboring borders, get all the insights you need in one comprehensive JSON file."
---

# U.S. States Information JSON Dataset

This JSON file provides a comprehensive dataset of all 50 U.S. states. For each state, the following attributes are included:

- **Name:** The official name of the state.
- **Abbreviation:** The two-letter postal abbreviation for the state.
- **Capital:** The capital city of the state.
- **Incorporation Date:** The date when the state was admitted to the Union.
- **Timezone:** The primary timezone in which the state is located.
- **Borders:** A list of adjacent U.S. states that share a border with the state.

This data can be useful for educational purposes, geographic applications, or any context where detailed information on U.S. states is needed.

[Download](/datasets/us-states-with-detail.json)

[Open in Editor](/?url=%%NEXT_PUBLIC_BASE_URL%%/datasets/us-states-with-detail.json)

**Sample Data:**

```javascript
{
  "states": [
    {
      "name": "Alabama",
      "abbreviation": "AL",
      "capital": "Montgomery",
      "incorporation_date": "1819-12-14",
      "timezone": "Central Time Zone",
      "borders": ["Tennessee", "Georgia", "Florida", "Mississippi"]
    },
    {
      "name": "Alaska",
      "abbreviation": "AK",
      "capital": "Juneau",
      "incorporation_date": "1959-01-03",
      "timezone": "Alaska Time Zone",
      "borders": []
    },
    {
      "name": "Arizona",
      "abbreviation": "AZ",
      "capital": "Phoenix",
      "incorporation_date": "1912-02-14",
      "timezone": "Mountain Time Zone",
      "borders": ["California", "Nevada", "Utah", "Colorado", "New Mexico"]
    }
  ]
}
```