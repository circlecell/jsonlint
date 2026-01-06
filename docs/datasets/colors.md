---
title: Colors JSON Dataset
description: A collection of 35 common colors with names, hex codes, RGB values, and color categories.
category: reference
tags:
  - colors
  - css
  - design
  - hex
  - rgb
records: 35
fields:
  - name: name
    type: string
    description: Color name
  - name: hex
    type: string
    description: Hexadecimal color code
  - name: rgb
    type: object
    description: RGB values object
  - name: category
    type: string
    description: Color category
fileSize: 3 KB
lastUpdated: 2024-01-15
source: W3C Named Colors, Design Systems
license: public-domain
---

# Colors JSON Dataset

A curated collection of named colors with multiple format representations for design and development.

## Quick Stats

- **35 colors** organized by category
- **~3 KB** file size
- **Fields:** name, hex, rgb, category

## Download

- [Download JSON](/datasets/colors.json)
- [Open in JSONLint](/?url=/datasets/colors.json)

## Schema

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `name` | string | Color name | `"Coral"` |
| `hex` | string | Hex code with # | `"#FF7F50"` |
| `rgb` | object | RGB values | `{"r": 255, "g": 127, "b": 80}` |
| `category` | string | Color family | `"warm"` |

## Categories

- **primary** - Red, Green, Blue
- **secondary** - Yellow, Cyan, Magenta
- **neutral** - Black, White, Gray, Silver
- **warm** - Orange, Pink, Coral, Gold
- **cool** - Purple, Violet, Teal, Navy
- **earth** - Brown, Maroon, Olive, Khaki
- **nature** - Lime, Aqua, Turquoise, Mint

## Sample Data

```json
{
  "colors": [
    {
      "name": "Coral",
      "hex": "#FF7F50",
      "rgb": {"r": 255, "g": 127, "b": 80},
      "category": "warm"
    },
    {
      "name": "Teal",
      "hex": "#008080",
      "rgb": {"r": 0, "g": 128, "b": 128},
      "category": "cool"
    }
  ]
}
```

## Usage Examples

### JavaScript - Color Picker

```javascript
const response = await fetch('https://jsonlint.com/datasets/colors.json');
const { colors } = await response.json();

// Filter by category
const warmColors = colors.filter(c => c.category === 'warm');

// Convert RGB to CSS
function rgbToCSS(rgb) {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

// Generate CSS variables
colors.forEach(color => {
  document.documentElement.style.setProperty(
    `--color-${color.name.toLowerCase()}`,
    color.hex
  );
});
```

### CSS Integration

```javascript
// Generate a color palette stylesheet
const css = colors.map(c => 
  `.bg-${c.name.toLowerCase()} { background-color: ${c.hex}; }`
).join('\n');
```

### Python - Color Analysis

```python
import requests

data = requests.get('https://jsonlint.com/datasets/colors.json').json()

# Calculate luminance
def luminance(rgb):
    return 0.299 * rgb['r'] + 0.587 * rgb['g'] + 0.114 * rgb['b']

# Sort by brightness
sorted_colors = sorted(data['colors'], key=lambda c: luminance(c['rgb']))
```

## Use Cases

- **Design tools** - Color pickers, palette generators
- **CSS generation** - Create color utility classes
- **Data visualization** - Consistent chart colors
- **Theme builders** - Color scheme selection
- **Accessibility** - Calculate contrast ratios

## Related Datasets

- [Mock Products](/datasets/mock-products) - Products that could use color attributes
- [File Extensions](/datasets/file-extensions) - File type icons could use colors
