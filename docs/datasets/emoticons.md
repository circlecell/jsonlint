---
title: Emoticons JSON Dataset
description: A collection of classic text emoticons with meanings and categories, perfect for sentiment analysis and chat features.
category: reference
tags:
  - emoticons
  - emoji
  - sentiment
  - text
  - chat
records: 20
fields:
  - name: emoticon
    type: string
    description: ASCII text emoticon
  - name: meaning
    type: string
    description: What it represents
  - name: category
    type: string
    description: Emotional category (positive, negative, playful, neutral)
fileSize: 2 KB
lastUpdated: 2024-01-15
source: Common usage patterns
license: public-domain
---

# Emoticons JSON Dataset

A collection of classic text emoticons (smileys made from ASCII characters) with their meanings and categories. Useful for sentiment analysis, chat features, or nostalgic fun.

## Quick Stats

- **20 emoticons**
- **~2 KB** file size
- **Fields:** emoticon, meaning, category

## Download

- [Download JSON](/datasets/emoticons.json)
- [Open in JSONLint](/?url=/datasets/emoticons.json)

## Schema

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `emoticon` | string | ASCII text emoticon | `":)"` |
| `meaning` | string | What it represents | `"Happy"` |
| `category` | string | Emotional category | `"positive"` |

## Sample Data

```json
{
  "emoticons": [
    {
      "emoticon": ":)",
      "meaning": "Happy",
      "category": "positive"
    },
    {
      "emoticon": ":D",
      "meaning": "Big smile",
      "category": "positive"
    },
    {
      "emoticon": ";)",
      "meaning": "Wink",
      "category": "playful"
    },
    {
      "emoticon": ":(",
      "meaning": "Sad",
      "category": "negative"
    }
  ]
}
```

## Categories

- **positive** - Happy, excited, loving emotions
- **negative** - Sad, angry, disappointed emotions  
- **playful** - Winks, jokes, silly expressions
- **neutral** - Uncertain, thinking, mixed feelings

## Usage Examples

### JavaScript - Sentiment Detection

```javascript
const response = await fetch('https://jsonlint.com/datasets/emoticons.json');
const data = await response.json();

// Create a lookup map
const emoticonMap = {};
data.emoticons.forEach(e => {
  emoticonMap[e.emoticon] = e;
});

// Detect sentiment in text
function detectSentiment(text) {
  const found = data.emoticons.filter(e => text.includes(e.emoticon));
  return found.map(e => ({ emoticon: e.emoticon, category: e.category }));
}

console.log(detectSentiment("Great job! :) :D"));
// [{ emoticon: ":)", category: "positive" }, { emoticon: ":D", category: "positive" }]
```

### Python - Sentiment Scoring

```python
import requests

data = requests.get('https://jsonlint.com/datasets/emoticons.json').json()

# Simple sentiment scoring
scores = {'positive': 1, 'playful': 0.5, 'neutral': 0, 'negative': -1}

def analyze_sentiment(text):
    score = 0
    for e in data['emoticons']:
        if e['emoticon'] in text:
            score += scores.get(e['category'], 0)
    return score

print(analyze_sentiment("Great job! :) :D"))  # 2
print(analyze_sentiment("Oh no :("))          # -1
```

### cURL / jq

```bash
# Get all positive emoticons
curl -s https://jsonlint.com/datasets/emoticons.json | \
  jq '.emoticons | map(select(.category == "positive")) | .[].emoticon'

# List emoticons with their meanings
curl -s https://jsonlint.com/datasets/emoticons.json | \
  jq '.emoticons[] | "\(.emoticon) = \(.meaning)"'
```

## Use Cases

### Chat Applications
Detect emoticons in messages for auto-reactions or sentiment display.

### Sentiment Analysis
Use categories to score the emotional tone of text messages or social media posts.

### Data Cleaning
Normalize text data by replacing or removing emoticons before NLP processing.

### Content Moderation
Identify potentially negative or aggressive content based on emoticon usage.

## Emoticons Included

| Emoticon | Meaning | Category |
|----------|---------|----------|
| `:)` | Happy | positive |
| `:(` | Sad | negative |
| `;)` | Wink | playful |
| `:D` | Big smile | positive |
| `XD` | Laughing | positive |
| `:P` | Tongue out | playful |
| `:O` | Surprised | neutral |
| `:/` | Skeptical | negative |
| `:\|` | Neutral | neutral |
| `>:(` | Angry | negative |
| `:'(` | Crying | negative |
| `<3` | Love/Heart | positive |
| `^_^` | Happy (anime) | positive |
| `-_-` | Annoyed | negative |
| `o_O` | Confused | neutral |

Plus kaomoji-style emoticons like shrug, table flip, and more.

## Source

This dataset is maintained by JSONLint. Emoticons collected from common usage patterns.

## Related Datasets

- [US States](/datasets/us-states-with-detail) - US states with capitals and borders
- [Programming Languages](/datasets/programming-languages) - Languages with metadata
