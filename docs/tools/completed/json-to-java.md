# JSON to Java Converter

## Overview
| Attribute | Value |
|-----------|-------|
| **URL** | `/json-to-java` |
| **Target Keyword** | "json to java", "json to java class" |
| **Monthly Volume** | 600 |
| **Keyword Difficulty** | 12 |
| **Priority** | Tier 3 - Code Generator |
| **Estimated Time** | 2-3 hours |
| **Status** | Pending |

## Tool Description
Generate Java POJO classes from JSON data.

## Output Formats

### Standard POJO
```java
public class User {
    private String name;
    private int age;
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    // ...
}
```

### With Jackson Annotations
```java
public class User {
    @JsonProperty("name")
    private String name;
    
    @JsonProperty("age")
    private int age;
    // ...
}
```

### With Lombok
```java
@Data
public class User {
    private String name;
    private int age;
}
```

### Java Record (17+)
```java
public record User(String name, int age) {}
```

## Options
- [ ] Root class name
- [ ] Package name
- [ ] Use Lombok (@Data, @Builder)
- [ ] Use Records (Java 17+)
- [ ] Jackson annotations
- [ ] Gson annotations
- [ ] Generate getters/setters
- [ ] Generate toString/equals/hashCode

## Type Mapping
| JSON | Java |
|------|------|
| string | String |
| integer | int (Long if large) |
| float | double |
| boolean | boolean |
| array | List<T> |
| object | nested class |

## SEO Content (800 words)
- Introduction to POJO generation
- Options explained (Lombok, Records, annotations)
- Example input/output
- Using generated classes with Jackson/Gson
- FAQ

## Internal Links
- FROM: `/json-to-typescript`, `/json-to-csharp`
- TO: `/`, `/json-schema`, other code generators

## Files
- `/app/json-to-java/page.tsx`
- `/app/json-to-java/JsonToJavaConverter.tsx`
- Update Footer.tsx
