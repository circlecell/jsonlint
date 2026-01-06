# Ahrefs Research Guide for JSONLint Content & Tool Ideas

This guide walks you through using Ahrefs to discover high-value content opportunities and new tool ideas for JSONLint.

---

## 1. Competitor Analysis

### Find JSON Tool Competitors

**Site Explorer → Enter competitors:**
- `jsonformatter.org`
- `jsonlint.com` (your own site for baseline)
- `codebeautify.org/jsonviewer`
- `jsoneditoronline.org`
- `json-generator.com`
- `jsonpath.com`

### What to Extract

For each competitor, go to:

**Organic Keywords** (left sidebar)
1. Filter by Position: 1-10 (what's ranking well)
2. Filter by Volume: 100+ (meaningful traffic)
3. Sort by Traffic
4. Export to CSV

**Top Pages** (left sidebar)
1. See which pages drive the most organic traffic
2. Note the URL patterns and topics
3. Look for tools/features you don't have

**Content Gap** (left sidebar)
1. Enter your domain + 2-3 competitors
2. Shows keywords competitors rank for that you don't
3. Filter by Volume: 500+ to focus on high-value opportunities

---

## 2. Keyword Research

### Seed Keywords to Explore

In **Keywords Explorer**, enter these seed terms:

```
json validator
json formatter
json beautifier
json parser
json lint
json checker
json viewer
json editor
json diff
json compare
json schema
json path
jsonpath
json to xml
xml to json
json to csv
csv to json
json to yaml
yaml to json
json escape
json unescape
json stringify
json minify
json prettify
json tester
json api tester
```

### For Each Keyword

1. **Check the Overview:**
   - Search volume (monthly)
   - Keyword Difficulty (KD) - lower is easier to rank
   - Traffic Potential (TP) - realistic traffic estimate
   - CPC - higher CPC = commercial intent

2. **Go to "Matching Terms":**
   - Switch to "Questions" to find article ideas
   - Look for long-tail variations with lower KD
   - Export keywords with Volume 100+ and KD < 30

3. **Go to "Also Rank For":**
   - Find related keywords the top results rank for
   - These are candidates for the same page or related tools

### High-Value Keyword Patterns

Look for these patterns:

| Pattern | Example | Content Type |
|---------|---------|--------------|
| `json [action]` | json validate, json format | Tool page |
| `[format] to json` | xml to json, csv to json | Converter tool |
| `json to [format]` | json to yaml, json to xml | Converter tool |
| `how to [action] json` | how to parse json | Article |
| `json [error message]` | json trailing comma | Article |
| `what is json [term]` | what is json schema | Article |
| `json [language]` | json python, json javascript | Article |
| `json online [tool]` | json online editor | Tool page |
| `best json [tool]` | best json viewer | Listicle or tool |

---

## 3. Content Gap Analysis (Detailed)

### Setup

Go to **Site Explorer → Content Gap**

**Your site:** `jsonlint.com`

**Competitors (add 3-5):**
- `jsonformatter.org`
- `codebeautify.org`
- `jsoneditoronline.org`
- `freeformatter.com`

### Filters to Apply

1. **Volume:** 200+ (focus on meaningful traffic)
2. **Show keywords:** "At least one competitor ranks in top 10"
3. **Exclude:** Brand terms, irrelevant topics

### Interpreting Results

The output shows keywords where competitors rank but you don't. Categorize them:

**Tool Opportunities:**
- Keywords like "json to csv online" → Need a JSON to CSV tool
- Keywords like "json tree viewer" → Need a tree view feature

**Content Opportunities:**
- Keywords like "json vs xml" → Need a comparison article
- Keywords like "json syntax error fix" → Need an error guide

**Feature Opportunities:**
- Keywords like "json file upload" → Need file upload feature
- Keywords like "json from url" → Need URL fetch feature

---

## 4. Discover New Tool Ideas

### Method 1: SERP Analysis

For each tool-related keyword, click to see the SERP:

1. What features do top-ranking pages have?
2. What's missing that you could add?
3. Are there related tools on the same page?

### Method 2: Questions Tab

In Keywords Explorer → Matching Terms → Questions

Look for:
- "how to convert X to json"
- "how to validate json against schema"
- "how to extract data from json"

Each question is a potential tool or feature.

### Method 3: Related Searches

In Keywords Explorer → Related Terms

These show what people search for in the same session, revealing tool combinations users want.

### Potential New Tools Based on Common Patterns

| Search Pattern | Tool Idea |
|---------------|-----------|
| json to csv | JSON to CSV converter |
| json to table | JSON table viewer |
| json tree view | Visual JSON tree |
| json to typescript | JSON to TypeScript interface generator |
| json mock data | JSON data generator |
| json api test | JSON API request builder |
| json to form | JSON to HTML form generator |
| json compare online | (You have this) |
| json merge | JSON merge tool |
| json flatten | JSON flatten/unflatten tool |
| json query builder | Visual JSONPath builder |
| json to code | JSON to code (multiple languages) |

---

## 5. Content Ideas Research

### Method 1: Questions

**Keywords Explorer → Matching Terms → Questions**

Seed: `json`

Look for questions with:
- Volume: 100+
- KD: < 40

Export and categorize:
- **Beginner:** "what is json", "what does json stand for"
- **How-to:** "how to read json file in python"
- **Troubleshooting:** "why is my json invalid"
- **Comparison:** "json vs yaml vs xml"

### Method 2: Topic Clustering

After exporting keywords, group them by topic:

**JSON Basics**
- what is json
- json syntax
- json data types
- json structure

**JSON in Languages**
- json python
- json javascript
- json java
- json c#
- json go

**JSON Errors**
- json parse error
- unexpected token json
- json trailing comma
- invalid json

**JSON Conversions**
- json to xml
- xml to json
- json to yaml
- json to csv

### Method 3: Competitor Blog Analysis

**Site Explorer → [competitor] → Top Pages**

Filter for blog/article URLs:
- `/blog/`
- `/guide/`
- `/how-to/`

See which articles drive traffic, then create better versions.

---

## 6. Prioritization Framework

### Score Each Opportunity

For each keyword/topic, rate:

| Factor | Score | Weight |
|--------|-------|--------|
| Search Volume | 1-5 | 30% |
| Keyword Difficulty | 1-5 (inverse) | 25% |
| Commercial Intent | 1-5 | 20% |
| Relevance to JSONLint | 1-5 | 15% |
| Effort to Create | 1-5 (inverse) | 10% |

**Calculate:** (Volume × 0.3) + (5-KD) × 0.25 + (Intent × 0.2) + (Relevance × 0.15) + (5-Effort) × 0.1

### Priority Matrix

| Volume | Difficulty | Action |
|--------|-----------|--------|
| High | Low | **Do immediately** |
| High | High | Long-term investment |
| Low | Low | Quick wins |
| Low | High | Skip |

---

## 7. Export Workflow

### Create These Exports

1. **tools-keywords.csv** - Tool-related keywords
   - Filter: "json" + action words (validate, format, convert, etc.)
   - Columns: Keyword, Volume, KD, CPC, Current Position

2. **content-keywords.csv** - Article-worthy keywords  
   - Filter: Questions + how-to + comparison
   - Columns: Keyword, Volume, KD, Parent Topic

3. **content-gap.csv** - Keywords competitors have, you don't
   - From Content Gap tool
   - Columns: Keyword, Volume, Top Competitor

4. **new-tool-ideas.csv** - Potential new tools
   - Manual extraction from above
   - Columns: Tool Idea, Primary Keyword, Volume, Notes

---

## 8. Specific Queries to Run

### High-Priority Searches

Run these specific searches in Keywords Explorer:

```
json to csv
json tree viewer
json api tester
json generator
json faker
json mock
json to typescript
json to interface
json editor online
json formatter online
json validator online
json schema generator
json schema validator
json path tester
json path finder
json compare tool
json merge online
json diff tool
json pretty print
json minifier
json escape online
json unescape
json decode
json encode
```

### Questions to Research

```
how to validate json
how to parse json
how to format json
how to read json file
how to convert json
what is valid json
why json parse error
how to fix json error
how to escape json
how to stringify json
```

---

## 9. Tracking & Iteration

### Set Up Rank Tracking

In **Rank Tracker:**
1. Add your domain
2. Add your target keywords (50-100)
3. Track weekly progress

### Monitor Competitors

Set up **Alerts** for:
- New backlinks to competitors
- New keywords competitors rank for
- Mentions of "json tools" across the web

### Monthly Review

1. Re-run Content Gap analysis
2. Check new keyword opportunities
3. Review which content/tools are ranking
4. Adjust priorities based on results

---

## Quick Start Checklist

- [ ] Run Content Gap with 3-4 competitors
- [ ] Export top 100 keywords from gap analysis
- [ ] Search "json to [format]" for converter ideas
- [ ] Search "json [tool type]" for tool ideas
- [ ] Check Questions for article topics
- [ ] Analyze top 5 competitor pages
- [ ] Create prioritized list of next 10 content pieces
- [ ] Create prioritized list of next 3 tool features
