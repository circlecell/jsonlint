# Prompt 05: Expand Dataset Collection

## Objective
Add new datasets covering common use cases that developers frequently need for testing, prototyping, and learning.

## Current Datasets
Review existing datasets in `docs/datasets/` and identify gaps.

## New Datasets to Add

### API Mocks Category
1. **users.json** - 100 fake users with realistic data
   - Fields: id, name, email, avatar, role, createdAt, address, phone
   
2. **products.json** - E-commerce product catalog
   - Fields: id, name, description, price, category, images, stock, rating
   
3. **orders.json** - Sample order data with line items
   - Fields: id, userId, items[], total, status, createdAt, shippingAddress
   
4. **comments.json** - Blog/social comments with threading
   - Fields: id, postId, userId, content, parentId, likes, createdAt

### Configuration Category
5. **eslint-config.json** - Example ESLint configuration
6. **tsconfig.json** - TypeScript configuration with comments
7. **package-json.json** - Well-documented package.json example
8. **i18n-messages.json** - Internationalization message bundle (en, es, fr)

### Testing Category
9. **edge-cases.json** - Tricky JSON for testing parsers
   - Unicode, escapes, deep nesting, large numbers, empty values
   
10. **malformed-examples.json** - Common JSON mistakes (for error testing)
    - Trailing commas, single quotes, unquoted keys, etc.

### Reference Category
11. **http-status-codes.json** - All HTTP status codes with descriptions
12. **mime-types.json** - Common MIME types
13. **timezones.json** - IANA timezone database

## Tasks
1. Research and gather accurate data for each dataset
2. Create JSON files in `public/datasets/`
3. Create markdown documentation in `docs/datasets/`
4. Ensure all data is properly licensed (public domain or CC0)
5. Validate all JSON files
6. Add appropriate metadata per Prompt 01

## Files to Create
- `public/datasets/{name}.json` - The actual data files
- `docs/datasets/{name}.md` - Documentation for each

## Acceptance Criteria
- All datasets are valid JSON
- All datasets have complete documentation
- Data is realistic and useful for testing
- Proper attribution for any sourced data
- Consistent naming conventions
- File sizes are reasonable (<500KB each)
