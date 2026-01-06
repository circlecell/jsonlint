# JSON to Code Generators - Shared Patterns

This document covers shared patterns for all JSON-to-code generators. Individual tool files reference this for common functionality.

## Common Architecture

All code generators share:
1. JSON input parsing
2. Type inference from values
3. Class/struct name generation
4. Property naming conventions
5. Nested type handling

### Shared Type Inference
```typescript
function inferType(value: any): TypeInfo {
  if (value === null) return { type: 'nullable', inner: 'any' };
  if (Array.isArray(value)) {
    if (value.length === 0) return { type: 'array', inner: 'any' };
    return { type: 'array', inner: inferType(value[0]) };
  }
  if (typeof value === 'object') return { type: 'object', className: 'NestedClass' };
  if (typeof value === 'string') return { type: 'string' };
  if (typeof value === 'number') {
    return Number.isInteger(value) ? { type: 'integer' } : { type: 'float' };
  }
  if (typeof value === 'boolean') return { type: 'boolean' };
  return { type: 'any' };
}
```

### Naming Convention Converters
```typescript
function toPascalCase(str: string): string {
  return str.replace(/(^|_|-)(\w)/g, (_, __, c) => c.toUpperCase());
}

function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function toSnakeCase(str: string): string {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
}
```

## Language-Specific Type Mappings

| JSON Type | Java | Python | Go | PHP | Kotlin | Swift | Rust |
|-----------|------|--------|-----|-----|--------|-------|------|
| string | String | str | string | string | String | String | String |
| integer | int/long | int | int/int64 | int | Int/Long | Int | i32/i64 |
| float | double | float | float64 | float | Double | Double | f64 |
| boolean | boolean | bool | bool | bool | Boolean | Bool | bool |
| null | null | None | nil | null | null | nil | None |
| array | List<T> | List[T] | []T | array | List<T> | [T] | Vec<T> |
| object | Class | @dataclass | struct | class | data class | struct | struct |

---

# Individual Tool Specifications

Below are condensed specs for each code generator. All follow the patterns above.
