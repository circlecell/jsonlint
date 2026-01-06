# JSON Sorter

## Overview
| Attribute | Value |
|-----------|-------|
| **URL** | `/json-sort` |
| **Target Keyword** | "json sort", "sort json keys" |
| **Monthly Volume** | 600 |
| **Keyword Difficulty** | 3 |
| **Priority** | Tier 1 - Quick Win |
| **Estimated Time** | 2 hours |
| **Status** | Pending |

## Tool Description
Sort JSON object keys alphabetically. Useful for comparing JSON files, creating consistent output, and improving readability.

## Technical Implementation

### Core Functionality
```typescript
function sortJson(obj: any, options: SortOptions): any {
  if (Array.isArray(obj)) {
    return options.sortArrays 
      ? obj.map(item => sortJson(item, options)).sort()
      : obj.map(item => sortJson(item, options));
  }
  
  if (typeof obj === 'object' && obj !== null) {
    const sorted: any = {};
    const keys = Object.keys(obj);
    
    keys.sort((a, b) => {
      if (options.caseInsensitive) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
      }
      return options.descending ? b.localeCompare(a) : a.localeCompare(b);
    });
    
    for (const key of keys) {
      sorted[key] = sortJson(obj[key], options);
    }
    return sorted;
  }
  
  return obj;
}

interface SortOptions {
  descending: boolean;      // Z-A instead of A-Z
  caseInsensitive: boolean; // Ignore case when sorting
  sortArrays: boolean;      // Sort array values too
  recursive: boolean;       // Sort nested objects
}
```

### Options to Include
- [ ] Sort direction (ascending/descending)
- [ ] Case sensitive/insensitive
- [ ] Sort arrays (primitive values)
- [ ] Recursive sorting (nested objects)
- [ ] Indentation (2/4 spaces)

### Edge Cases
- Nested objects (recursive sort)
- Arrays of objects (sort objects, not array order)
- Arrays of primitives (optionally sort values)
- Mixed arrays
- Empty objects/arrays
- Numeric keys (sort as strings or numbers?)

## SEO Content Requirements

### Page Title
```
JSON Sorter - Sort Keys Alphabetically Online | JSONLint
```

### Meta Description
```
Sort JSON keys alphabetically with our free online tool. Supports nested objects, ascending/descending order, and case-insensitive sorting.
```

### H1
```
JSON Sorter
```

### Content Structure (800-1,000 words)

#### Section 1: Introduction (100 words)
- What the tool does
- Why sort JSON keys
- Key features

#### Section 2: How to Use (100 words)
- Paste JSON
- Select sort options
- Copy sorted result

#### Section 3: Why Sort JSON Keys? (150 words)
- Easier comparison/diffing
- Consistent output
- Better readability
- Version control benefits

#### Section 4: Sort Options Explained (150 words)
- Ascending vs descending
- Case sensitivity
- Recursive sorting
- Array sorting

#### Section 5: Example (150 words)
```json
// Before
{
  "zebra": 1,
  "Apple": 2,
  "banana": 3,
  "nested": {
    "z": 1,
    "a": 2
  }
}

// After (ascending, case-insensitive, recursive)
{
  "Apple": 2,
  "banana": 3,
  "nested": {
    "a": 2,
    "z": 1
  },
  "zebra": 1
}
```

#### Section 6: Sorting in Code (150 words)
- JavaScript implementation
- Python implementation
- jq command line

#### Section 7: FAQ (3-4 questions)
1. Does sorting change the data?
2. How are nested objects handled?
3. Can I sort array values?
4. What order are numbers sorted in?

## Internal Linking

### Links TO this page (update these)
- `/json-diff` — "Sort before comparing"
- `/json-pretty-print` — "Also sort keys" (when built)

### Links FROM this page (include these)
- `/` — "Validate JSON first"
- `/json-diff` — "Compare sorted JSON"
- `/json-minify` — "Minify after sorting"
- `/json-pretty-print` — "Format with sorting"

## Footer/Header Updates

### Footer
Add to Tools column:
```typescript
{ href: '/json-sort', label: 'JSON Sorter' },
```

### Header
Do not add (volume doesn't justify header space)

## Files to Create/Modify

### Create
- [ ] `/app/json-sort/page.tsx`
- [ ] `/app/json-sort/JsonSorter.tsx`

### Modify
- [ ] `/components/Footer.tsx` — Add link
- [ ] `/app/json-diff/page.tsx` — Add cross-link

## Testing Checklist
- [ ] Basic key sorting
- [ ] Descending order
- [ ] Case insensitive
- [ ] Nested objects
- [ ] Arrays of objects
- [ ] Arrays of primitives
- [ ] Empty objects/arrays
- [ ] Large JSON
- [ ] Already sorted JSON
- [ ] Copy to clipboard
