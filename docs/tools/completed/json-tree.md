# JSON Tree Viewer

## Overview
| Attribute | Value |
|-----------|-------|
| **URL** | `/json-tree` |
| **Target Keyword** | "json tree viewer", "json tree view" |
| **Monthly Volume** | 300 |
| **Keyword Difficulty** | 4 |
| **Priority** | Tier 2 - Medium Value |
| **Estimated Time** | 3-4 hours |
| **Status** | Pending |

## Tool Description
Interactive collapsible tree view for JSON data. Visual exploration of complex nested structures.

## Technical Implementation

### Core Component
```typescript
interface TreeNodeProps {
  keyName: string;
  value: any;
  depth: number;
  expanded: boolean;
  onToggle: () => void;
  path: string;
}

function TreeNode({ keyName, value, depth, expanded, onToggle, path }: TreeNodeProps) {
  const type = getType(value);
  const isExpandable = type === 'object' || type === 'array';
  const childCount = isExpandable ? Object.keys(value).length : 0;
  
  return (
    <div style={{ marginLeft: depth * 16 }}>
      <div className="tree-node" onClick={isExpandable ? onToggle : undefined}>
        {isExpandable && <ChevronIcon expanded={expanded} />}
        <span className="key">{keyName}:</span>
        {isExpandable ? (
          <span className="preview">
            {type === 'array' ? `[${childCount}]` : `{${childCount}}`}
          </span>
        ) : (
          <span className={`value value-${type}`}>{formatValue(value)}</span>
        )}
      </div>
      {expanded && isExpandable && (
        <div className="children">
          {Object.entries(value).map(([k, v]) => (
            <TreeNode key={k} keyName={k} value={v} depth={depth + 1} ... />
          ))}
        </div>
      )}
    </div>
  );
}
```

### Features to Include
- [ ] Expand/collapse nodes
- [ ] Expand all / Collapse all
- [ ] Search within tree
- [ ] Click to copy path
- [ ] Click to copy value
- [ ] Syntax highlighting by type
- [ ] Show array indices
- [ ] Show item counts

### Visual Design
- Indentation guides (vertical lines)
- Color-coded values (strings=green, numbers=blue, etc.)
- Hover to highlight path
- Keyboard navigation

## SEO Content Requirements

### Page Title
```
JSON Tree Viewer - Visualize JSON Structure Online | JSONLint
```

### Meta Description
```
Explore JSON data with our interactive tree viewer. Expand and collapse nodes, search values, copy paths. Visualize complex nested structures easily.
```

### Content Structure (600-800 words)
1. Introduction - What tree view offers
2. How to use - Paste, explore, interact
3. Features - Expand/collapse, search, copy
4. When to use - Complex data exploration
5. Example with nested JSON
6. FAQ

## Internal Linking

### Links FROM this page
- `/` — "Validate JSON first"
- `/json-path` — "Query with JSONPath"
- `/json-flatten` — "Flatten nested structure"
- `/json-to-table` — "View as table instead"

## Footer/Header Updates

### Footer
Add to Tools column:
```typescript
{ href: '/json-tree', label: 'JSON Tree View' },
```

## Files to Create/Modify

### Create
- [ ] `/app/json-tree/page.tsx`
- [ ] `/app/json-tree/JsonTreeViewer.tsx`

### Modify
- [ ] `/components/Footer.tsx` — Add link
