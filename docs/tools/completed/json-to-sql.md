# JSON to SQL Converter

## Overview
| Attribute | Value |
|-----------|-------|
| **URL** | `/json-to-sql` |
| **Target Keyword** | "json to sql", "convert json to sql insert" |
| **Monthly Volume** | 800 |
| **Keyword Difficulty** | 8 |
| **Priority** | Tier 4 - Database Tools |
| **Estimated Time** | 3-4 hours |
| **Status** | Pending |

## Tool Description
Convert JSON data to SQL statements. Generate INSERT statements, CREATE TABLE, or both.

## Output Formats

### INSERT Statements
```sql
INSERT INTO users (name, age, email) VALUES ('Alice', 30, 'alice@example.com');
INSERT INTO users (name, age, email) VALUES ('Bob', 25, 'bob@example.com');
```

### Batch INSERT
```sql
INSERT INTO users (name, age, email) VALUES
  ('Alice', 30, 'alice@example.com'),
  ('Bob', 25, 'bob@example.com');
```

### CREATE TABLE + INSERT
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  age INT,
  email VARCHAR(255)
);

INSERT INTO users (name, age, email) VALUES
  ('Alice', 30, 'alice@example.com'),
  ('Bob', 25, 'bob@example.com');
```

## Options
- [ ] Table name
- [ ] SQL dialect (MySQL, PostgreSQL, SQLite, SQL Server)
- [ ] Generate CREATE TABLE
- [ ] Batch vs individual INSERTs
- [ ] Include column types
- [ ] Auto-increment ID
- [ ] Handle NULL values
- [ ] Escape special characters

## Type Mapping
| JSON | SQL (Generic) |
|------|---------------|
| string | VARCHAR(255) |
| integer | INT |
| float | DECIMAL/FLOAT |
| boolean | BOOLEAN/TINYINT |
| null | NULL |
| array | TEXT (JSON) |
| object | TEXT (JSON) |

## Dialect Differences
| Feature | MySQL | PostgreSQL | SQLite | SQL Server |
|---------|-------|------------|--------|------------|
| Auto ID | AUTO_INCREMENT | SERIAL | AUTOINCREMENT | IDENTITY |
| Boolean | TINYINT(1) | BOOLEAN | INTEGER | BIT |
| String escape | \' | '' | '' | '' |

## SEO Content (1,000 words)
- What the tool generates
- SQL dialect differences
- When to use batch vs individual inserts
- Handling nested JSON
- Example conversions
- FAQ

## Internal Linking
- FROM: `/json-to-csv`, `/json-to-excel`
- TO: `/`, `/sql-to-json`

## Files
- `/app/json-to-sql/page.tsx`
- `/app/json-to-sql/JsonToSqlConverter.tsx`
- Update Footer.tsx

## Testing Checklist
- [ ] Array of objects → multiple INSERTs
- [ ] All data types
- [ ] NULL handling
- [ ] Special characters (quotes, backslash)
- [ ] Different SQL dialects
- [ ] CREATE TABLE generation
- [ ] Batch INSERT format
- [ ] Download .sql file
