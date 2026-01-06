# JSON to Kotlin Converter

## Overview
| Attribute | Value |
|-----------|-------|
| **URL** | `/json-to-kotlin` |
| **Target Keyword** | "json to kotlin", "json to data class" |
| **Monthly Volume** | 200 |
| **Keyword Difficulty** | 4 |
| **Priority** | Tier 3 - Code Generator |
| **Estimated Time** | 2-3 hours |
| **Status** | Pending |

## Tool Description
Generate Kotlin data classes from JSON data.

## Output Format
```kotlin
data class User(
    @SerializedName("name")
    val name: String,
    
    @SerializedName("age")
    val age: Int,
    
    @SerializedName("email")
    val email: String? = null
)
```

### With kotlinx.serialization
```kotlin
@Serializable
data class User(
    @SerialName("name")
    val name: String,
    
    @SerialName("age")
    val age: Int,
    
    @SerialName("email")
    val email: String? = null
)
```

## Options
- [ ] Gson annotations (@SerializedName)
- [ ] kotlinx.serialization (@SerialName)
- [ ] Moshi annotations
- [ ] Nullable types
- [ ] Default values
- [ ] val vs var

## Type Mapping
| JSON | Kotlin |
|------|--------|
| string | String |
| integer | Int / Long |
| float | Double |
| boolean | Boolean |
| null | T? |
| array | List<T> |
| object | data class |

## Files
- `/app/json-to-kotlin/page.tsx`
- `/app/json-to-kotlin/JsonToKotlinConverter.tsx`
