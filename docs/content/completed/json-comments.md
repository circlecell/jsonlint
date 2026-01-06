---
title: "JSON Comments: Why They Don't Exist and How to Work Around It"
description: "Learn why JSON doesn't support comments, explore workarounds like JSONC and JSON5, and discover best practices for documenting your JSON files."
date: "2024-01-15"
---

If you've ever tried to add a comment to a JSON file, you've likely been frustrated to discover that **JSON does not support comments**. This is one of the most common pain points developers face when working with JSON configuration files.

In this guide, we'll explain why JSON lacks comment support, explore practical workarounds, and help you choose the best approach for your project.

## Why Doesn't JSON Support Comments?

Douglas Crockford, the creator of JSON, deliberately excluded comments from the specification. In his own words:

> "I removed comments from JSON because I saw people were using them to hold parsing directives, a practice which would have destroyed interoperability."

The concern was that comments would be abused for metadata or instructions that parsers might interpret differently, breaking the simplicity and universality that makes JSON so successful as a data interchange format.

### JSON's Design Philosophy

JSON was designed to be:

- **Simple** — Easy to read and write for humans
- **Universal** — Parsed identically by any compliant parser
- **Data-only** — A pure data format, not a configuration language

Comments blur the line between data and documentation, which conflicts with JSON's role as a strict data interchange format.

## Workarounds for Adding Comments to JSON

Despite the lack of native support, there are several practical ways to add documentation to your JSON files.

### 1. Use a `_comment` or `__comment` Field

The most common workaround is adding a dedicated field for comments:

```json
{
  "_comment": "Configuration for the production server",
  "host": "api.example.com",
  "port": 443,
  "ssl": true,
  "_comment_ssl": "SSL is required for production"
}
```

**Pros:**
- Works with any JSON parser
- No additional tooling required

**Cons:**
- Adds to file size
- Comments become part of the data
- Some strict schemas may reject unknown fields

### 2. Use JSONC (JSON with Comments)

JSONC is a superset of JSON that allows C-style comments. It's supported by Visual Studio Code and many modern tools.

```jsonc
{
  // This is a single-line comment
  "name": "my-project",
  "version": "1.0.0",
  
  /* 
   * This is a multi-line comment
   * explaining the dependencies
   */
  "dependencies": {
    "lodash": "^4.17.21"
  }
}
```

**Supported by:**
- Visual Studio Code (`*.jsonc` files)
- TypeScript `tsconfig.json`
- ESLint configuration
- Many modern CLI tools

To validate or format JSONC, you'll need a JSONC-aware parser. Standard JSON tools like our [JSON Validator](/) won't accept comments.

### 3. Use JSON5

JSON5 is an extended JSON format that allows:
- Comments (single and multi-line)
- Trailing commas
- Unquoted keys
- Single-quoted strings
- Hexadecimal numbers

```json5
{
  // JSON5 is more lenient
  name: 'my-project',
  version: '1.0.0',
  
  /* Multi-line comments work too */
  dependencies: {
    lodash: '^4.17.21', // Trailing commas are fine
  },
}
```

**Use JSON5 when:**
- You control both writing and reading
- Human editability is a priority
- You're working with configuration files

### 4. Use YAML Instead

For configuration files, consider using YAML, which natively supports comments:

```yaml
# Configuration for production server
host: api.example.com
port: 443
ssl: true  # Required for production
```

You can convert between formats using our [JSON to YAML](/json-to-yaml) and [YAML to JSON](/yaml-to-json) converters.

### 5. External Documentation

For complex configurations, maintain documentation separately:

```
config/
├── settings.json
└── settings.md  # Documentation for settings.json
```

This keeps your JSON files clean and valid while providing comprehensive documentation.

## Best Practices

### For Configuration Files

If your JSON file is primarily edited by humans (like `package.json` or `tsconfig.json`):

1. **Use JSONC or JSON5** if your tooling supports it
2. **Add `_comment` fields** for inline notes
3. **Keep a separate README** for complex configurations

### For Data Files

If your JSON is primarily machine-generated or consumed:

1. **Keep it comment-free** — Standard JSON is best for interoperability
2. **Use JSON Schema** for validation and documentation
3. **Document in code** — Add comments where you parse the JSON

### For APIs

API responses should **never** include comments:

1. Use standard JSON for all API communication
2. Document your API with OpenAPI/Swagger
3. Use [JSON Schema](/json-schema) for request/response validation

## How Different Tools Handle Comments

| Tool/Format | Comments Supported | Notes |
|-------------|-------------------|-------|
| Standard JSON | ❌ No | Will throw parse error |
| JSONC | ✅ Yes | VS Code, TypeScript |
| JSON5 | ✅ Yes | Requires json5 parser |
| YAML | ✅ Yes | Native comment support |
| TOML | ✅ Yes | Good for config files |

## Stripping Comments from JSON

If you have JSONC or JSON5 and need standard JSON, you can strip comments programmatically:

### JavaScript

```javascript
// Using strip-json-comments package
const stripJsonComments = require('strip-json-comments');

const jsonc = `{
  // This is a comment
  "name": "example"
}`;

const json = stripJsonComments(jsonc);
// {"name": "example"}
```

### Command Line

```bash
# Using jq (strips comments automatically in some cases)
cat config.jsonc | npx strip-json-comments-cli > config.json
```

## Common Mistakes to Avoid

### 1. Assuming Comments Will Be Ignored

```json
{
  "name": "test",
  // This will cause a parse error!
  "version": "1.0.0"
}
```

Standard JSON parsers will **reject** this file. Use the [JSON Validator](/) to check your files.

### 2. Using Hash Comments

```json
{
  "name": "test"  # Python-style comments don't work
}
```

Even JSONC only supports `//` and `/* */` style comments, not `#`.

### 3. Forgetting to Remove Comments Before Parsing

If you're using `_comment` fields, remember they become part of your data:

```javascript
const config = JSON.parse(fs.readFileSync('config.json'));
// config._comment exists and may cause issues
```

## Related Resources

- [JSON Validator](/) — Validate your JSON syntax
- [JSON to YAML Converter](/json-to-yaml) — Convert to a format that supports comments
- [Common JSON Mistakes](/common-mistakes-in-json-and-how-to-avoid-them) — Avoid other common errors
- [JSON vs YAML](/json-vs-yaml) — Compare formats for your use case
- [Mastering JSON Format](/mastering-json-format) — Complete JSON syntax guide

## Conclusion

While JSON's lack of comment support can be frustrating, it's a deliberate design decision that keeps the format simple and universal. For most use cases, the workarounds described above provide practical solutions:

- **Use JSONC/JSON5** for human-edited config files
- **Use `_comment` fields** when you need inline documentation
- **Consider YAML** for configuration-heavy projects
- **Keep JSON pure** for data interchange and APIs

The key is choosing the right approach for your specific use case while maintaining compatibility with the tools and systems that will consume your JSON.
