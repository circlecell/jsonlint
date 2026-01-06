# JSON to Go Converter

## Overview
| Attribute | Value |
|-----------|-------|
| **URL** | `/json-to-go` |
| **Target Keyword** | "json to go struct", "json to golang" |
| **Monthly Volume** | 400 |
| **Keyword Difficulty** | 6 |
| **Priority** | Tier 3 - Code Generator |
| **Estimated Time** | 2-3 hours |
| **Status** | Pending |

## Tool Description
Generate Go structs from JSON data with proper json tags.

## Output Format
```go
type User struct {
	Name    string   `json:"name"`
	Age     int      `json:"age"`
	Email   string   `json:"email,omitempty"`
	Tags    []string `json:"tags"`
	Profile Profile  `json:"profile"`
}

type Profile struct {
	Bio    string `json:"bio"`
	Avatar string `json:"avatar"`
}
```

## Options
- [ ] Root struct name
- [ ] Inline nested structs vs separate
- [ ] Use pointers for optional fields
- [ ] Add omitempty tag
- [ ] Generate JSON marshal/unmarshal methods
- [ ] Use `any` vs `interface{}`

## Type Mapping
| JSON | Go |
|------|-----|
| string | string |
| integer | int / int64 |
| float | float64 |
| boolean | bool |
| null | *T (pointer) |
| array | []T |
| object | struct |

## SEO Content (800 words)
- Go struct tags explained
- Handling optional fields
- Using with encoding/json
- Example with nested data
- FAQ

## Internal Links
- TO: `/`, other code generators
- FROM: Other code generators

## Files
- `/app/json-to-go/page.tsx`
- `/app/json-to-go/JsonToGoConverter.tsx`
