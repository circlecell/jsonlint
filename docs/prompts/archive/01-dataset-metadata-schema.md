# Prompt 01: Enhanced Dataset Metadata Schema

## Objective
Add richer frontmatter metadata to all dataset markdown files to enable better filtering, display, and discovery.

## Current State
Dataset markdown files have minimal frontmatter:
```yaml
---
title: Countries Dataset
description: Basic description
---
```

## Target State
Expand frontmatter with structured metadata:
```yaml
---
title: Countries JSON Dataset
description: Complete list of world countries with ISO codes, capitals, currencies, and population data
category: geographic
tags: [countries, iso, international, reference]
records: 250
fields:
  - name: code
    type: string
    description: ISO 3166-1 alpha-2 country code
  - name: name
    type: string
    description: Official country name
  - name: capital
    type: string
    description: Capital city
  - name: currency
    type: string
    description: ISO 4217 currency code
  - name: population
    type: number
    description: Estimated population
fileSize: 45KB
lastUpdated: 2024-01-15
source: ISO 3166 / World Bank
license: Public Domain
---
```

## Tasks
1. Define the TypeScript interface for dataset metadata
2. Update all existing dataset markdown files with the new schema
3. Create a utility function to parse and validate dataset metadata
4. Update the Learn page to read and display the new metadata

## Files to Modify
- `docs/datasets/*.md` - Add metadata to each dataset
- `lib/dataset-utils.ts` - Create new utility file for dataset metadata
- `app/learn/page.tsx` - Update to use new metadata

## Acceptance Criteria
- All datasets have complete metadata
- TypeScript types are defined for the metadata schema
- Metadata is validated at build time
- No breaking changes to existing functionality
