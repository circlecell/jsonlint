# JSON to PHP Converter

## Overview
| Attribute | Value |
|-----------|-------|
| **URL** | `/json-to-php` |
| **Target Keyword** | "json to php class" |
| **Monthly Volume** | 300 |
| **Keyword Difficulty** | 5 |
| **Priority** | Tier 3 - Code Generator |
| **Estimated Time** | 2-3 hours |
| **Status** | Pending |

## Tool Description
Generate PHP classes from JSON data.

## Output Formats

### Standard PHP Class
```php
class User {
    public string $name;
    public int $age;
    public ?string $email;
    
    public function __construct(array $data) {
        $this->name = $data['name'];
        $this->age = $data['age'];
        $this->email = $data['email'] ?? null;
    }
}
```

### PHP 8 Constructor Promotion
```php
class User {
    public function __construct(
        public string $name,
        public int $age,
        public ?string $email = null,
    ) {}
}
```

## Options
- [ ] PHP version (7.4 / 8.0+)
- [ ] Use constructor promotion
- [ ] Generate fromJson static method
- [ ] Use typed properties
- [ ] Nullable types

## Type Mapping
| JSON | PHP |
|------|-----|
| string | string |
| integer | int |
| float | float |
| boolean | bool |
| null | ?T |
| array | array |
| object | class |

## Files
- `/app/json-to-php/page.tsx`
- `/app/json-to-php/JsonToPhpConverter.tsx`
