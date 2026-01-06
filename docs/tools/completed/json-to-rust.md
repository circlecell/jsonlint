# JSON to Rust Converter

## Overview
| Attribute | Value |
|-----------|-------|
| **URL** | `/json-to-rust` |
| **Target Keyword** | "json to rust", "json to rust struct" |
| **Monthly Volume** | 150 |
| **Keyword Difficulty** | 2 |
| **Priority** | Tier 3 - Code Generator |
| **Estimated Time** | 2-3 hours |
| **Status** | Pending |

## Tool Description
Generate Rust structs with Serde derive macros from JSON data.

## Output Format
```rust
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    pub name: String,
    pub age: i32,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub email: Option<String>,
    pub tags: Vec<String>,
}
```

### With rename attributes
```rust
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct User {
    pub user_name: String,  // maps to "userName" in JSON
    pub user_age: i32,
}
```

## Options
- [ ] Root struct name
- [ ] Derive Debug, Clone, PartialEq
- [ ] Public vs private fields
- [ ] Option<T> for nullable
- [ ] serde rename_all attribute
- [ ] Skip serializing if None

## Type Mapping
| JSON | Rust |
|------|------|
| string | String |
| integer | i32 / i64 |
| float | f64 |
| boolean | bool |
| null | Option<T> |
| array | Vec<T> |
| object | struct |

## Files
- `/app/json-to-rust/page.tsx`
- `/app/json-to-rust/JsonToRustConverter.tsx`
