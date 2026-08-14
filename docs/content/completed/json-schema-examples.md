---
title: "JSON Schema Examples: Objects, Arrays, Enums, and Validation"
description: "Practical JSON Schema examples for required fields, nested objects, arrays, enums, conditional shapes, dates, and reusable definitions."
category: languages
priority: 30
updated: "2026-08-14"
---

# JSON Schema Examples: Objects, Arrays, Enums, and Validation

JSON Schema describes the allowed shape and values of JSON data. It can validate required properties, types, array items, numeric ranges, string patterns, and alternative object structures.

This guide uses JSON Schema Draft 2020-12. Always confirm which draft your validator, framework, or API supports.

## A complete object schema

The following schema validates a customer record:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.com/schemas/customer.json",
  "title": "Customer",
  "type": "object",
  "properties": {
    "id": {
      "type": "integer",
      "minimum": 1
    },
    "name": {
      "type": "string",
      "minLength": 1
    },
    "email": {
      "type": "string",
      "format": "email"
    },
    "status": {
      "enum": ["active", "paused", "closed"]
    }
  },
  "required": ["id", "name", "email"],
  "additionalProperties": false
}
```

This instance passes:

```json
{
  "id": 42,
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "status": "active"
}
```

This one fails because `id` is a string, `name` is empty, `email` is missing, and `role` is not declared:

```json
{
  "id": "42",
  "name": "",
  "role": "admin"
}
```

Test both examples with the [JSON Schema validator](/json-schema).

## Required does not mean non-empty

`required` checks whether a property exists. It does not make a string non-empty or a number positive.

```json
{
  "type": "object",
  "properties": {
    "username": {
      "type": "string",
      "minLength": 1
    }
  },
  "required": ["username"]
}
```

Without `minLength`, an empty string would satisfy both `type: "string"` and the `required` property list.

## Arrays and unique values

Validate an array of tags:

```json
{
  "type": "array",
  "items": {
    "type": "string",
    "minLength": 1
  },
  "minItems": 1,
  "maxItems": 10,
  "uniqueItems": true
}
```

Validate an object containing an array of products:

```json
{
  "type": "object",
  "properties": {
    "products": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "sku": { "type": "string" },
          "quantity": { "type": "integer", "minimum": 1 }
        },
        "required": ["sku", "quantity"]
      }
    }
  },
  "required": ["products"]
}
```

## Nested objects

```json
{
  "type": "object",
  "properties": {
    "profile": {
      "type": "object",
      "properties": {
        "displayName": { "type": "string" },
        "preferences": {
          "type": "object",
          "properties": {
            "theme": { "enum": ["light", "dark", "system"] },
            "notifications": { "type": "boolean" }
          },
          "required": ["theme"]
        }
      },
      "required": ["displayName"]
    }
  },
  "required": ["profile"]
}
```

Add `additionalProperties: false` only where unknown fields truly should be rejected. It can make future-compatible API changes harder, especially in nested or composed schemas.

## Reuse definitions with `$defs` and `$ref`

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$defs": {
    "money": {
      "type": "object",
      "properties": {
        "currency": {
          "type": "string",
          "pattern": "^[A-Z]{3}$"
        },
        "amount": {
          "type": "number",
          "minimum": 0
        }
      },
      "required": ["currency", "amount"]
    }
  },
  "type": "object",
  "properties": {
    "subtotal": { "$ref": "#/$defs/money" },
    "total": { "$ref": "#/$defs/money" }
  },
  "required": ["subtotal", "total"]
}
```

Reusable definitions prevent similar rules from drifting apart. `$ref` can also point to another schema, but remote references require deliberate identifier, retrieval, caching, and security policies.

## Enums and constants

Use `enum` for a fixed set of allowed values:

```json
{
  "type": "string",
  "enum": ["draft", "review", "published"]
}
```

Use `const` for exactly one allowed value:

```json
{
  "type": "object",
  "properties": {
    "version": { "const": 2 }
  },
  "required": ["version"]
}
```

## Alternative shapes with `oneOf`

An event can have one of two explicitly tagged shapes:

```json
{
  "oneOf": [
    {
      "type": "object",
      "properties": {
        "type": { "const": "created" },
        "resourceId": { "type": "string" }
      },
      "required": ["type", "resourceId"]
    },
    {
      "type": "object",
      "properties": {
        "type": { "const": "deleted" },
        "resourceId": { "type": "string" },
        "reason": { "type": "string" }
      },
      "required": ["type", "resourceId", "reason"]
    }
  ]
}
```

`oneOf` means exactly one subschema must match. `anyOf` means one or more may match, while `allOf` means all must match. Tagged alternatives make error messages and application dispatch clearer.

## Dates and formats

JSON has no native date type, so schemas validate date-like strings:

```json
{
  "type": "object",
  "properties": {
    "dueDate": { "type": "string", "format": "date" },
    "createdAt": { "type": "string", "format": "date-time" }
  }
}
```

Some validators treat `format` as annotation unless format assertion is enabled. Confirm your validator's behavior and add stricter application rules if your API accepts only a subset. See the [JSON date format guide](/json-date-format) for timestamp design choices.

## Generate a starting schema

If you already have a representative JSON document, use the [JSON Schema generator](/json-schema-generator) to create a starting point. Then review it manually:

1. Mark only genuinely mandatory fields as required.
2. Add business constraints such as ranges and enums.
3. Decide how unknown properties should be handled.
4. Extract repeated structures into `$defs`.
5. Test valid, invalid, missing, null, empty, and boundary cases.

Generated schemas infer from examples; they cannot know all intended rules or future variants.

## Common JSON Schema mistakes

- Omitting `$schema`, which makes the intended dialect unclear.
- Assuming `required` makes a value non-null or non-empty.
- Using `oneOf` when alternatives overlap and more than one can pass.
- Setting `additionalProperties: false` at the wrong composition level.
- Treating `format` behavior as identical across validators.
- Generating a schema from one example and shipping it without boundary tests.
- Changing a published schema without considering backward compatibility.

## References

- [JSON Schema examples](https://json-schema.org/learn/json-schema-examples)
- [Understanding JSON Schema: basics](https://json-schema.org/understanding-json-schema/basics)
- [JSON Schema Draft 2020-12](https://json-schema.org/draft/2020-12)
