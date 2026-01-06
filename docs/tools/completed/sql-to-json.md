# SQL to JSON Converter

## Overview
| Attribute | Value |
|-----------|-------|
| **URL** | `/sql-to-json` |
| **Target Keyword** | "sql to json", "convert sql to json" |
| **Monthly Volume** | 400 |
| **Keyword Difficulty** | 5 |
| **Priority** | Tier 4 - Database Tools |
| **Estimated Time** | 3-4 hours |
| **Status** | Pending |

## Tool Description
Convert SQL CREATE TABLE statements or INSERT statements to JSON format.

## Input Formats Supported

### CREATE TABLE → JSON Schema-like
```sql
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  age INT DEFAULT 0
);
```
↓
```json
{
  "tableName": "users",
  "columns": [
    {"name": "id", "type": "INT", "primaryKey": true},
    {"name": "name", "type": "VARCHAR(255)", "nullable": false},
    {"name": "email", "type": "VARCHAR(255)", "nullable": true},
    {"name": "age", "type": "INT", "default": 0}
  ]
}
```

### INSERT Statements → JSON Array
```sql
INSERT INTO users (name, age) VALUES ('Alice', 30);
INSERT INTO users (name, age) VALUES ('Bob', 25);
```
↓
```json
[
  {"name": "Alice", "age": 30},
  {"name": "Bob", "age": 25}
]
```

## Options
- [ ] Input type (CREATE TABLE / INSERT / Both)
- [ ] Output format (array of objects / table schema)
- [ ] Include metadata (table name, types)
- [ ] Parse column types to JSON types

## SQL Parsing
Use regex or simple parser for:
- CREATE TABLE statements
- INSERT INTO statements
- Column definitions
- Value extraction

Note: Full SQL parsing is complex. Support common patterns, not all edge cases.

## SEO Content (800 words)
- Use cases for SQL to JSON
- Supported SQL syntax
- Example conversions
- Limitations
- FAQ

## Internal Linking
- FROM: `/json-to-sql`
- TO: `/`, `/json-to-sql`, `/csv-to-json`

## Files
- `/app/sql-to-json/page.tsx`
- `/app/sql-to-json/SqlToJsonConverter.tsx`
- Update Footer.tsx

## Testing Checklist
- [ ] CREATE TABLE parsing
- [ ] INSERT statement parsing
- [ ] Multiple INSERTs
- [ ] Batch INSERT format
- [ ] Different data types
- [ ] NULL values
- [ ] Escaped strings
- [ ] Copy/download JSON
