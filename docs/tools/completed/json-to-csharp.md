# JSON to C# Converter

## Overview
| Attribute | Value |
|-----------|-------|
| **URL** | `/json-to-csharp` |
| **Target Keyword** | "json to c#", "json to csharp" |
| **Monthly Volume** | 1,900 |
| **Keyword Difficulty** | 10 |
| **Priority** | Tier 1 - Quick Win |
| **Estimated Time** | 2-3 hours |
| **Status** | Pending |

## Tool Description
Generate C# classes from JSON data. Similar pattern to JSON to TypeScript converter.

## Technical Implementation

### Core Functionality
```typescript
function jsonToCSharp(json: object, options: CSharpOptions): string {
  // Generate C# class definitions from JSON structure
  // Handle nested objects as separate classes
  // Infer types from values
  // Support various C# patterns
}

interface CSharpOptions {
  rootClassName: string;        // Default: "Root"
  namespace?: string;           // Optional namespace wrapper
  useProperties: boolean;       // Properties vs fields
  usePascalCase: boolean;       // Convert keys to PascalCase
  useNullable: boolean;         // Nullable reference types
  useRecords: boolean;          // C# 9+ records vs classes
  jsonPropertyAttributes: boolean; // Add [JsonProperty] attributes
  useSystemTextJson: boolean;   // System.Text.Json vs Newtonsoft
  generateFromJson: boolean;    // Add static FromJson method
}
```

### Output Formats
1. **Standard Class**
```csharp
public class Person
{
    public string Name { get; set; }
    public int Age { get; set; }
}
```

2. **With Newtonsoft Attributes**
```csharp
public class Person
{
    [JsonProperty("name")]
    public string Name { get; set; }
    
    [JsonProperty("age")]
    public int Age { get; set; }
}
```

3. **C# 9+ Record**
```csharp
public record Person(string Name, int Age);
```

4. **With System.Text.Json**
```csharp
public class Person
{
    [JsonPropertyName("name")]
    public string Name { get; set; }
    
    [JsonPropertyName("age")]
    public int Age { get; set; }
}
```

### Type Inference Rules
| JSON Type | C# Type |
|-----------|---------|
| string | string |
| integer | int (or long if > int.MaxValue) |
| float | double |
| boolean | bool |
| null | nullable type |
| array | List<T> or T[] |
| object | nested class |

### Edge Cases
- Null values (make nullable)
- Mixed arrays (use object or dynamic)
- Numeric keys (prefix with underscore)
- Reserved keywords (@ prefix)
- Empty arrays (List<object>)
- Deeply nested objects

### Reference Implementation
Look at: `/app/json-to-typescript/JsonToTypescriptConverter.tsx`

### Dependencies
- None required (pure string generation)

## SEO Content Requirements

### Page Title
```
JSON to C# Converter - Generate Classes Online | JSONLint
```

### Meta Description
```
Convert JSON to C# classes instantly. Generate POCO classes, records, or classes with JsonProperty attributes. Supports Newtonsoft.Json and System.Text.Json.
```

### H1
```
JSON to C# Converter
```

### Content Structure (800-1,200 words)

#### Section 1: Introduction (100 words)
- What the tool does
- Why generate C# from JSON
- Supported output formats

#### Section 2: How to Use (150 words)
- Paste JSON
- Select options
- Copy generated code
- Use in Visual Studio

#### Section 3: Output Options Explained (200 words)
- Classes vs Records
- Newtonsoft vs System.Text.Json
- Nullable reference types
- Namespace wrapping

#### Section 4: Type Mapping (150 words)
- How JSON types map to C#
- Handling nulls
- Array type inference

#### Section 5: Code Example (200 words)
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "isActive": true,
  "roles": ["admin", "user"],
  "profile": {
    "avatar": "https://example.com/avatar.jpg",
    "bio": null
  }
}
```
```csharp
public class Root
{
    [JsonProperty("id")]
    public int Id { get; set; }
    
    [JsonProperty("name")]
    public string Name { get; set; }
    
    [JsonProperty("email")]
    public string Email { get; set; }
    
    [JsonProperty("isActive")]
    public bool IsActive { get; set; }
    
    [JsonProperty("roles")]
    public List<string> Roles { get; set; }
    
    [JsonProperty("profile")]
    public Profile Profile { get; set; }
}

public class Profile
{
    [JsonProperty("avatar")]
    public string Avatar { get; set; }
    
    [JsonProperty("bio")]
    public string? Bio { get; set; }
}
```

#### Section 6: Using Generated Classes (150 words)
- Deserializing JSON in C#
- Newtonsoft.Json example
- System.Text.Json example

#### Section 7: FAQ (3-5 questions)
1. What's the difference between Newtonsoft and System.Text.Json?
2. Should I use classes or records?
3. How are nullable types handled?
4. Can I customize property names?
5. How do I handle arrays of mixed types?

## Internal Linking

### Links TO this page (update these)
- `/json-to-typescript` — "Also available: C# converter"
- `/json-to-java` — Related code generator (when built)
- Learn page — Add to tools section

### Links FROM this page (include these)
- `/` — "Validate JSON first"
- `/json-to-typescript` — "Need TypeScript instead?"
- `/json-to-java` — "Generate Java classes" (when built)
- `/json-schema` — "Or generate JSON Schema"

## Footer/Header Updates

### Footer
Add to Converters column:
```typescript
{ href: '/json-to-csharp', label: 'JSON to C#' },
```

### Header
Consider adding to dropdown (1,900 volume is significant)

## Files to Create/Modify

### Create
- [ ] `/app/json-to-csharp/page.tsx`
- [ ] `/app/json-to-csharp/JsonToCSharpConverter.tsx`

### Modify
- [ ] `/components/Footer.tsx` — Add link
- [ ] `/app/json-to-typescript/page.tsx` — Add cross-link

## Testing Checklist
- [ ] Simple object
- [ ] Nested objects
- [ ] Arrays of primitives
- [ ] Arrays of objects
- [ ] Null values
- [ ] All primitive types (string, int, double, bool)
- [ ] Large integers (long detection)
- [ ] PascalCase conversion
- [ ] Reserved keyword handling
- [ ] All options combinations
- [ ] Newtonsoft attributes
- [ ] System.Text.Json attributes
- [ ] Record generation
- [ ] Copy to clipboard
