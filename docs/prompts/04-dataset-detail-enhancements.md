# Prompt 04: Dataset Detail Page Enhancements

## Objective
Enhance the individual dataset pages with additional tabs/sections showing schema, sample queries, statistics, and code snippets.

## Current State
Dataset pages show:
- Title and breadcrumbs
- Live preview (JSON viewer)
- Markdown documentation
- Sidebar with download/view raw links

## Target State
Add tabbed interface with:
1. **Preview** (current) - JSON viewer with syntax highlighting
2. **Schema** - Auto-generated JSON Schema for the dataset
3. **Queries** - Example JSONPath queries that work with this data
4. **Stats** - Field statistics (types, null counts, unique values)
5. **Code** - Fetch snippets in JS, Python, curl

## Visual Design
```
┌─────────────────────────────────────────────────────────────┐
│ Countries Dataset                                           │
│ [Preview] [Schema] [Queries] [Stats] [Code]                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  (Tab content here)                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Tasks
1. Create tabbed interface component
2. Implement JSON Schema generator from sample data
3. Create JSONPath query examples component
4. Build statistics calculator (field types, counts)
5. Add code snippet generator for multiple languages
6. Update DatasetPageClient to use tabs

## Files to Create/Modify
- `components/DatasetTabs.tsx` - Tabbed interface
- `components/DatasetSchema.tsx` - Schema viewer
- `components/DatasetQueries.tsx` - Query examples
- `components/DatasetStats.tsx` - Statistics display
- `components/DatasetCode.tsx` - Code snippets
- `lib/schema-generator.ts` - JSON to JSON Schema converter
- `app/[...slug]/DatasetPageClient.tsx` - Integrate tabs

## Acceptance Criteria
- All tabs load without page refresh
- Schema is valid JSON Schema draft-07
- Query examples are executable in the JSON Path tool
- Stats accurately reflect the data
- Code snippets are copy-able and correct
- Tabs persist in URL hash (e.g., `#schema`)
