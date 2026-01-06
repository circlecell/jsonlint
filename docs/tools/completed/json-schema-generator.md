# JSON Schema Generator

## Overview
| Attribute | Value |
|-----------|-------|
| **URL** | `/json-schema-generator` |
| **Target Keyword** | "json schema generator", "generate json schema" |
| **Monthly Volume** | 350 |
| **Keyword Difficulty** | 5 |
| **Priority** | Tier 2 - Medium Value |
| **Estimated Time** | 4-5 hours |
| **Status** | Pending |

## Tool Description
Generate JSON Schema from sample JSON data. Complements the existing JSON Schema Validator.

## Technical Implementation

### Core Functionality
```typescript
function generateSchema(sample: any, options: SchemaOptions): JSONSchema {
  const schema: JSONSchema = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    type: getType(sample),
  };
  
  if (schema.type === 'object') {
    schema.properties = {};
    schema.required = [];
    
    for (const [key, value] of Object.entries(sample)) {
      schema.properties[key] = generateSchema(value, options);
      if (options.allRequired || value !== null) {
        schema.required.push(key);
      }
    }
  } else if (schema.type === 'array' && sample.length > 0) {
    // Analyze all items to infer schema
    schema.items = inferArrayItemSchema(sample, options);
  }
  
  return schema;
}

interface SchemaOptions {
  draft: '2020-12' | '07' | '04';
  allRequired: boolean;
  includeExamples: boolean;
  includeDescriptions: boolean;
  stringFormats: boolean;  // Detect email, uri, date, etc.
  numberConstraints: boolean; // Infer min/max
}

interface JSONSchema {
  $schema?: string;
  type: string | string[];
  properties?: Record<string, JSONSchema>;
  items?: JSONSchema;
  required?: string[];
  enum?: any[];
  format?: string;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  examples?: any[];
  description?: string;
}
```

### Type Inference
| JSON Value | Schema Type | Additional |
|------------|-------------|------------|
| `"hello"` | string | - |
| `"test@email.com"` | string | format: email |
| `"2024-01-15"` | string | format: date |
| `"https://..."` | string | format: uri |
| `123` | integer | - |
| `12.5` | number | - |
| `true` | boolean | - |
| `null` | null | - |
| `[]` | array | items schema |
| `{}` | object | properties |

### Options to Include
- [ ] Schema draft version (2020-12, 07, 04)
- [ ] All properties required
- [ ] Detect string formats (email, uri, date, uuid)
- [ ] Include example values
- [ ] Add placeholder descriptions
- [ ] Infer number constraints (min/max from sample)
- [ ] Infer string patterns

### Edge Cases
- Empty objects/arrays
- Mixed type arrays
- Null values
- Deeply nested structures
- Arrays with different object shapes

## SEO Content Requirements

### Page Title
```
JSON Schema Generator - Create Schema from JSON | JSONLint
```

### Meta Description
```
Generate JSON Schema from sample data automatically. Supports draft 2020-12, format detection, and required properties. Validate with our schema validator.
```

### H1
```
JSON Schema Generator
```

### Content Structure (800-1,000 words)

#### Section 1: Introduction (100 words)
- What JSON Schema is
- Why generate from samples
- Tool capabilities

#### Section 2: How to Use (100 words)
- Paste sample JSON
- Configure options
- Generate and download schema

#### Section 3: What is JSON Schema? (150 words)
- Schema purpose
- Validation benefits
- Industry adoption
- Link to schema validator

#### Section 4: Generated Schema Features (200 words)
- Type inference
- Format detection
- Required properties
- Nested object handling

#### Section 5: Example (200 words)
Input:
```json
{
  "id": 1,
  "email": "user@example.com",
  "created": "2024-01-15",
  "active": true
}
```

Generated Schema:
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "id": { "type": "integer" },
    "email": { "type": "string", "format": "email" },
    "created": { "type": "string", "format": "date" },
    "active": { "type": "boolean" }
  },
  "required": ["id", "email", "created", "active"]
}
```

#### Section 6: FAQ (3-4 questions)
1. Which schema draft should I use?
2. How are optional fields detected?
3. Can it handle complex nested structures?
4. How do I validate against the generated schema?

## Internal Linking

### Links TO this page (update these)
- `/json-schema` — "Generate schema from sample"
- Learn articles about validation

### Links FROM this page (include these)
- `/json-schema` — "Validate with this schema"
- `/` — "Validate sample JSON first"
- `/json-to-typescript` — "Or generate TypeScript types"

## Footer/Header Updates

### Footer
Add to Tools column:
```typescript
{ href: '/json-schema-generator', label: 'Schema Generator' },
```

## Files to Create/Modify

### Create
- [ ] `/app/json-schema-generator/page.tsx`
- [ ] `/app/json-schema-generator/JsonSchemaGenerator.tsx`

### Modify
- [ ] `/components/Footer.tsx` — Add link
- [ ] `/app/json-schema/page.tsx` — Add cross-link

## Testing Checklist
- [ ] All primitive types
- [ ] Nested objects
- [ ] Arrays of primitives
- [ ] Arrays of objects
- [ ] Email format detection
- [ ] URL format detection
- [ ] Date format detection
- [ ] Different draft versions
- [ ] Required property options
- [ ] Empty objects/arrays
- [ ] Copy/download schema
