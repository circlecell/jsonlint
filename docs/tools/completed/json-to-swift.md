# JSON to Swift Converter

## Overview
| Attribute | Value |
|-----------|-------|
| **URL** | `/json-to-swift` |
| **Target Keyword** | "json to swift", "json to codable" |
| **Monthly Volume** | 200 |
| **Keyword Difficulty** | 3 |
| **Priority** | Tier 3 - Code Generator |
| **Estimated Time** | 2-3 hours |
| **Status** | Pending |

## Tool Description
Generate Swift Codable structs from JSON data.

## Output Format
```swift
struct User: Codable {
    let name: String
    let age: Int
    let email: String?
    let tags: [String]
    
    enum CodingKeys: String, CodingKey {
        case name
        case age
        case email
        case tags
    }
}
```

### Without CodingKeys (when names match)
```swift
struct User: Codable {
    let name: String
    let age: Int
    let email: String?
}
```

## Options
- [ ] Root struct name
- [ ] Use `let` vs `var`
- [ ] Generate CodingKeys enum
- [ ] Use Optional vs non-optional
- [ ] Class vs Struct
- [ ] Conform to Equatable/Hashable

## Type Mapping
| JSON | Swift |
|------|-------|
| string | String |
| integer | Int |
| float | Double |
| boolean | Bool |
| null | T? |
| array | [T] |
| object | struct |

## Files
- `/app/json-to-swift/page.tsx`
- `/app/json-to-swift/JsonToSwiftConverter.tsx`
