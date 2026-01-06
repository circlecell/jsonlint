# JSON to Excel Converter

## Overview
| Attribute | Value |
|-----------|-------|
| **URL** | `/json-to-excel` |
| **Target Keyword** | "json to excel", "convert json to xlsx" |
| **Monthly Volume** | 2,500 |
| **Keyword Difficulty** | 12 |
| **Priority** | Tier 2 - High Value |
| **Estimated Time** | 4-5 hours |
| **Status** | Pending |

## Tool Description
Convert JSON data to Excel (.xlsx) format. Higher volume than JSON to CSV, targets users who need Excel-specific features.

## Technical Implementation

### Dependencies
```bash
npm install xlsx
# or
npm install exceljs  # More features, larger bundle
```

### Core Functionality
```typescript
import * as XLSX from 'xlsx';

function jsonToExcel(data: any[], options: ExcelOptions): Blob {
  // Flatten nested objects if needed
  const flatData = options.flatten ? flattenArray(data) : data;
  
  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(flatData, {
    header: options.customHeaders,
    skipHeader: options.skipHeader,
  });
  
  // Apply formatting
  if (options.autoWidth) {
    ws['!cols'] = calculateColumnWidths(flatData);
  }
  
  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, options.sheetName || 'Sheet1');
  
  // Generate file
  const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([buffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
}

interface ExcelOptions {
  sheetName: string;
  flatten: boolean;
  autoWidth: boolean;
  customHeaders?: string[];
  skipHeader: boolean;
  dateFormat?: string;
}
```

### Options to Include
- [ ] Sheet name
- [ ] Flatten nested objects
- [ ] Auto-fit column widths
- [ ] Custom header names
- [ ] Include/exclude headers
- [ ] Multiple sheets (for arrays of arrays)
- [ ] Date formatting

### Data Handling
- **Array of objects**: Each object = row, keys = columns
- **Nested objects**: Flatten to dot notation or separate sheets
- **Arrays within objects**: Join with delimiter or expand rows
- **Dates**: Format as Excel dates
- **Numbers**: Preserve as numeric

### Edge Cases
- Deeply nested objects
- Mixed data types in arrays
- Very large datasets (memory)
- Empty arrays/objects
- Non-array JSON (wrap in array)

## SEO Content Requirements

### Page Title
```
JSON to Excel Converter - Convert JSON to XLSX Online | JSONLint
```

### Meta Description
```
Convert JSON to Excel (.xlsx) format instantly. Supports nested objects, auto-column widths, and custom sheet names. Free online converter, no upload required.
```

### H1
```
JSON to Excel Converter
```

### Content Structure (1,000-1,200 words)

#### Section 1: Introduction (100 words)
- What the tool does
- Why convert to Excel
- Key features

#### Section 2: How to Use (150 words)
- Paste JSON
- Configure options
- Download .xlsx file
- Open in Excel/Google Sheets

#### Section 3: JSON to Excel vs JSON to CSV (200 words)
- When to use Excel format
- Excel advantages (formatting, multiple sheets, data types)
- CSV advantages (simplicity, compatibility)
- Link to JSON to CSV

#### Section 4: Handling Nested Data (200 words)
- Flattening options
- Dot notation columns
- Example with nested objects

#### Section 5: Example (200 words)
```json
[
  {
    "name": "Alice",
    "age": 30,
    "department": "Engineering",
    "skills": ["Python", "JavaScript"]
  },
  {
    "name": "Bob",
    "age": 25,
    "department": "Marketing",
    "skills": ["SEO", "Analytics"]
  }
]
```
→ Excel table with columns: name, age, department, skills

#### Section 6: Programmatic Conversion (150 words)
- JavaScript with xlsx library
- Python with pandas
- Code examples

#### Section 7: FAQ (4-5 questions)
1. Can I convert nested JSON to Excel?
2. What's the maximum file size?
3. Does it preserve data types?
4. Can I customize column names?
5. How do I handle arrays within objects?

## Internal Linking

### Links TO this page (update these)
- `/json-to-csv` — "Need Excel format? JSON to Excel"
- `/json-to-table` — "Download as Excel"

### Links FROM this page (include these)
- `/json-to-csv` — "Or convert to CSV"
- `/excel-to-json` — "Convert Excel back to JSON"
- `/json-flatten` — "Flatten nested JSON first"
- `/` — "Validate JSON before converting"
- `/json-to-table` — "Preview as table first"

## Footer/Header Updates

### Footer
Add to Converters column:
```typescript
{ href: '/json-to-excel', label: 'JSON to Excel' },
```

### Header
Add to Convert dropdown (high volume):
```typescript
{ href: '/json-to-excel', label: 'JSON → Excel' },
```

## Files to Create/Modify

### Create
- [ ] `/app/json-to-excel/page.tsx`
- [ ] `/app/json-to-excel/JsonToExcelConverter.tsx`

### Modify
- [ ] `package.json` — Add xlsx dependency
- [ ] `/components/Footer.tsx` — Add link
- [ ] `/components/Header.tsx` — Add to dropdown
- [ ] `/app/json-to-csv/page.tsx` — Add cross-link

## Testing Checklist
- [ ] Simple array of objects
- [ ] Nested objects (flattened)
- [ ] Arrays within objects
- [ ] Different data types (string, number, boolean, null)
- [ ] Empty arrays
- [ ] Single object (not array)
- [ ] Large dataset (1000+ rows)
- [ ] Unicode characters
- [ ] Special characters in keys
- [ ] Custom sheet name
- [ ] Auto column width
- [ ] File downloads correctly
- [ ] Opens in Excel/Google Sheets
