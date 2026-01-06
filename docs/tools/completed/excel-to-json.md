# Excel to JSON Converter

## Overview
| Attribute | Value |
|-----------|-------|
| **URL** | `/excel-to-json` |
| **Target Keyword** | "excel to json", "xlsx to json" |
| **Monthly Volume** | 600 |
| **Keyword Difficulty** | 8 |
| **Priority** | Tier 2 - Medium Value |
| **Estimated Time** | 4-5 hours |
| **Status** | Pending |

## Tool Description
Convert Excel files (.xlsx, .xls) to JSON format. Companion to JSON to Excel converter.

## Technical Implementation

### Dependencies
```bash
npm install xlsx
```

### Core Functionality
```typescript
import * as XLSX from 'xlsx';

async function excelToJson(file: File, options: ExcelToJsonOptions): Promise<any[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  
  const sheetName = options.sheetName || workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  const data = XLSX.utils.sheet_to_json(worksheet, {
    header: options.useFirstRowAsHeaders ? undefined : 1,
    raw: options.preserveTypes,
    defval: options.defaultValue,
  });
  
  return data;
}

interface ExcelToJsonOptions {
  sheetName?: string;
  useFirstRowAsHeaders: boolean;
  preserveTypes: boolean;      // Keep numbers as numbers
  defaultValue?: any;          // Value for empty cells
  range?: string;              // Specific cell range
}
```

### Options to Include
- [ ] Select sheet (if multiple)
- [ ] First row as headers (vs array of arrays)
- [ ] Preserve data types
- [ ] Handle empty cells (null, empty string, skip)
- [ ] Specific range selection
- [ ] Output format (array of objects vs nested)

### Data Type Handling
| Excel Type | JSON Type |
|------------|-----------|
| Text | string |
| Number | number |
| Date | ISO string or timestamp |
| Boolean | boolean |
| Empty | null or omit |
| Formula | computed value |

### Edge Cases
- Multiple sheets
- Merged cells
- Empty rows/columns
- Formulas
- Date formats
- Very large files
- Password-protected files (not supported)

## SEO Content Requirements

### Page Title
```
Excel to JSON Converter - Convert XLSX to JSON Online | JSONLint
```

### Meta Description
```
Convert Excel spreadsheets to JSON format online. Upload .xlsx or .xls files and get clean JSON output. Handles multiple sheets and preserves data types.
```

### H1
```
Excel to JSON Converter
```

### Content Structure (800-1,000 words)

#### Section 1: Introduction (100 words)
- What the tool does
- Supported formats (.xlsx, .xls)
- Key features

#### Section 2: How to Use (150 words)
- Upload Excel file
- Select options
- Preview and download JSON
- No data sent to server (client-side)

#### Section 3: Output Format Options (150 words)
- Array of objects (with headers)
- Array of arrays (raw data)
- Nested structure

#### Section 4: Example (200 words)
Excel table:
| Name | Age | City |
|------|-----|------|
| Alice | 30 | NYC |
| Bob | 25 | LA |

JSON output:
```json
[
  {"Name": "Alice", "Age": 30, "City": "NYC"},
  {"Name": "Bob", "Age": 25, "City": "LA"}
]
```

#### Section 5: Handling Complex Spreadsheets (150 words)
- Multiple sheets
- Merged cells
- Date formatting

#### Section 6: FAQ (3-4 questions)
1. Is my data secure?
2. What's the maximum file size?
3. Can I convert specific sheets?
4. How are dates handled?

## Internal Linking

### Links TO this page (update these)
- `/json-to-excel` — "Convert back: Excel to JSON"
- `/csv-to-json` — "Also available: Excel to JSON"

### Links FROM this page (include these)
- `/json-to-excel` — "Convert JSON to Excel"
- `/csv-to-json` — "Or use CSV format"
- `/` — "Validate generated JSON"
- `/json-to-table` — "View as table"

## Footer/Header Updates

### Footer
Add to Converters column:
```typescript
{ href: '/excel-to-json', label: 'Excel to JSON' },
```

## Files to Create/Modify

### Create
- [ ] `/app/excel-to-json/page.tsx`
- [ ] `/app/excel-to-json/ExcelToJsonConverter.tsx`

### Modify
- [ ] `/components/Footer.tsx` — Add link
- [ ] `/app/json-to-excel/page.tsx` — Add cross-link

## Testing Checklist
- [ ] .xlsx file upload
- [ ] .xls file upload
- [ ] Multiple sheets
- [ ] First row as headers
- [ ] Different data types
- [ ] Empty cells
- [ ] Large files
- [ ] Download JSON
- [ ] Copy to clipboard
