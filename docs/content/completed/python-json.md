---
title: "How to Read and Write JSON in Python: Complete Guide"
description: "Master JSON in Python with this comprehensive guide. Learn to read, write, parse, and manipulate JSON data using the json module with practical examples."
date: "2024-01-15"
---

Python's built-in `json` module makes working with JSON data straightforward. Whether you're reading configuration files, consuming APIs, or storing data, this guide covers everything you need to know about handling JSON in Python.

## Quick Start

Here's the essentials in 30 seconds:

```python
import json

# Parse JSON string → Python dict
data = json.loads('{"name": "Alice", "age": 30}')

# Python dict → JSON string
json_string = json.dumps({"name": "Alice", "age": 30})

# Read JSON file
with open('data.json', 'r') as f:
    data = json.load(f)

# Write JSON file
with open('data.json', 'w') as f:
    json.dump(data, f, indent=2)
```

## Reading JSON

### From a String: `json.loads()`

Use `loads()` (load **s**tring) to parse a JSON string into a Python object:

```python
import json

json_string = '{"name": "Alice", "age": 30, "active": true}'
data = json.loads(json_string)

print(data['name'])    # Alice
print(data['age'])     # 30
print(data['active'])  # True (converted to Python bool)
print(type(data))      # <class 'dict'>
```

### From a File: `json.load()`

Use `load()` (no 's') to read directly from a file:

```python
import json

with open('config.json', 'r', encoding='utf-8') as file:
    config = json.load(file)

print(config)
```

Always specify `encoding='utf-8'` to handle special characters correctly.

### From an API Response

When working with the `requests` library:

```python
import requests

response = requests.get('https://api.example.com/data')

# Method 1: Use response.json() (recommended)
data = response.json()

# Method 2: Parse manually
data = json.loads(response.text)
```

## Writing JSON

### To a String: `json.dumps()`

Use `dumps()` (dump **s**tring) to convert Python objects to JSON:

```python
import json

data = {
    "name": "Alice",
    "age": 30,
    "languages": ["Python", "JavaScript"],
    "active": True
}

# Basic conversion
json_string = json.dumps(data)
print(json_string)
# {"name": "Alice", "age": 30, "languages": ["Python", "JavaScript"], "active": true}
```

### To a File: `json.dump()`

Use `dump()` to write directly to a file:

```python
import json

data = {"name": "Alice", "scores": [95, 87, 92]}

with open('output.json', 'w', encoding='utf-8') as file:
    json.dump(data, file)
```

## Formatting Options

### Pretty Printing

Use `indent` for readable output:

```python
import json

data = {"name": "Alice", "address": {"city": "Boston", "zip": "02101"}}

# Compact (default)
print(json.dumps(data))
# {"name": "Alice", "address": {"city": "Boston", "zip": "02101"}}

# Pretty printed
print(json.dumps(data, indent=2))
# {
#   "name": "Alice",
#   "address": {
#     "city": "Boston",
#     "zip": "02101"
#   }
# }
```

### Sorting Keys

Use `sort_keys` for consistent output:

```python
data = {"zebra": 1, "apple": 2, "mango": 3}

print(json.dumps(data, sort_keys=True, indent=2))
# {
#   "apple": 2,
#   "mango": 3,
#   "zebra": 1
# }
```

### Compact Output

Remove whitespace for smaller file sizes:

```python
# Remove spaces after separators
compact = json.dumps(data, separators=(',', ':'))
```

## Type Conversions

Python and JSON types map as follows:

| Python | JSON |
|--------|------|
| `dict` | object |
| `list`, `tuple` | array |
| `str` | string |
| `int`, `float` | number |
| `True` | true |
| `False` | false |
| `None` | null |

### Handling Unsupported Types

JSON doesn't support all Python types. These will raise `TypeError`:

```python
import json
from datetime import datetime

data = {
    "timestamp": datetime.now(),  # Not JSON serializable!
    "data": {1, 2, 3}             # Sets not supported!
}

json.dumps(data)  # TypeError
```

### Custom Encoder for Dates

Handle datetime objects with a custom encoder:

```python
import json
from datetime import datetime, date

class DateTimeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, (datetime, date)):
            return obj.isoformat()
        return super().default(obj)

data = {"created": datetime.now(), "name": "Report"}

json_string = json.dumps(data, cls=DateTimeEncoder)
print(json_string)
# {"created": "2024-01-15T10:30:00.123456", "name": "Report"}
```

### Using the `default` Parameter

For simple cases, use the `default` parameter:

```python
import json
from datetime import datetime

def json_serializer(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    if isinstance(obj, set):
        return list(obj)
    raise TypeError(f"Type {type(obj)} not serializable")

data = {
    "timestamp": datetime.now(),
    "tags": {"python", "json", "tutorial"}
}

print(json.dumps(data, default=json_serializer, indent=2))
```

## Error Handling

### Catching Parse Errors

Always wrap JSON parsing in try-except:

```python
import json

def safe_parse(json_string):
    try:
        return json.loads(json_string)
    except json.JSONDecodeError as e:
        print(f"Invalid JSON at line {e.lineno}, column {e.colno}")
        print(f"Error: {e.msg}")
        return None

# Test with invalid JSON
result = safe_parse('{"name": "Alice",}')  # Trailing comma
# Invalid JSON at line 1, column 18
# Error: Expecting property name enclosed in double quotes
```

### Common Errors and Fixes

**JSONDecodeError: Expecting property name**
- Cause: Trailing comma or single quotes
- Fix: Remove trailing commas, use double quotes

**JSONDecodeError: Expecting value**
- Cause: Empty string or malformed JSON
- Fix: Check input isn't empty, validate JSON structure

**JSONDecodeError: Invalid control character**
- Cause: Unescaped newlines or tabs in strings
- Fix: Escape special characters or use raw strings

See our [JSON Parse Error guide](/json-parse-error) for detailed solutions.

## Working with Nested JSON

### Accessing Nested Data

```python
import json

data = {
    "user": {
        "name": "Alice",
        "contacts": {
            "email": "alice@example.com",
            "phone": ["555-1234", "555-5678"]
        }
    }
}

# Access nested values
email = data["user"]["contacts"]["email"]
first_phone = data["user"]["contacts"]["phone"][0]

# Safe access with .get()
website = data["user"]["contacts"].get("website", "Not provided")
```

### Flattening Nested JSON

For deeply nested structures, consider flattening:

```python
def flatten_json(data, prefix=''):
    result = {}
    for key, value in data.items():
        new_key = f"{prefix}.{key}" if prefix else key
        if isinstance(value, dict):
            result.update(flatten_json(value, new_key))
        else:
            result[new_key] = value
    return result

nested = {"user": {"name": "Alice", "address": {"city": "Boston"}}}
flat = flatten_json(nested)
# {"user.name": "Alice", "user.address.city": "Boston"}
```

Or use our [JSON Flatten tool](/json-flatten) for quick results.

## Working with JSON Lines (JSONL)

JSON Lines format stores one JSON object per line:

```python
import json

# Reading JSONL
def read_jsonl(filename):
    with open(filename, 'r') as f:
        return [json.loads(line) for line in f if line.strip()]

# Writing JSONL
def write_jsonl(filename, data_list):
    with open(filename, 'w') as f:
        for item in data_list:
            f.write(json.dumps(item) + '\n')

# Example
users = [
    {"name": "Alice", "age": 30},
    {"name": "Bob", "age": 25}
]
write_jsonl('users.jsonl', users)
```

## Performance Tips

### Large Files: Use Streaming

For very large JSON files, process line by line:

```python
import json

def process_large_json_array(filename):
    """Process large JSON array without loading entire file."""
    with open(filename, 'r') as f:
        # Skip opening bracket
        f.read(1)
        
        buffer = ''
        for line in f:
            buffer += line
            if line.strip().endswith(',') or line.strip() == ']':
                try:
                    # Try to parse accumulated buffer
                    obj = json.loads(buffer.rstrip(',\n]'))
                    yield obj
                    buffer = ''
                except json.JSONDecodeError:
                    continue
```

### Use `orjson` for Speed

For performance-critical applications, consider `orjson`:

```python
# pip install orjson
import orjson

# 3-10x faster than standard json
data = orjson.loads(json_bytes)
json_bytes = orjson.dumps(data)
```

### Use `ujson` as Alternative

```python
# pip install ujson
import ujson

# Faster than standard library
data = ujson.loads(json_string)
json_string = ujson.dumps(data)
```

## Real-World Examples

### Reading a Config File

```python
import json
from pathlib import Path

def load_config(config_path='config.json'):
    """Load configuration with defaults."""
    defaults = {
        "debug": False,
        "port": 8080,
        "host": "localhost"
    }
    
    config_file = Path(config_path)
    if config_file.exists():
        with open(config_file, 'r') as f:
            user_config = json.load(f)
            return {**defaults, **user_config}
    
    return defaults

config = load_config()
print(f"Server running on {config['host']}:{config['port']}")
```

### Consuming a REST API

```python
import json
import requests

def fetch_user(user_id):
    """Fetch user data from API with error handling."""
    try:
        response = requests.get(
            f'https://api.example.com/users/{user_id}',
            timeout=10
        )
        response.raise_for_status()
        return response.json()
    
    except requests.RequestException as e:
        print(f"Request failed: {e}")
        return None
    except json.JSONDecodeError:
        print("Invalid JSON response")
        return None

user = fetch_user(123)
if user:
    print(f"Hello, {user['name']}!")
```

### Saving Application State

```python
import json
from pathlib import Path

class AppState:
    def __init__(self, state_file='state.json'):
        self.state_file = Path(state_file)
        self.data = self._load()
    
    def _load(self):
        if self.state_file.exists():
            with open(self.state_file, 'r') as f:
                return json.load(f)
        return {}
    
    def save(self):
        with open(self.state_file, 'w') as f:
            json.dump(self.data, f, indent=2)
    
    def get(self, key, default=None):
        return self.data.get(key, default)
    
    def set(self, key, value):
        self.data[key] = value
        self.save()

# Usage
state = AppState()
state.set('last_run', '2024-01-15')
state.set('processed_count', 42)
```

## Related Tools & Resources

### Tools

- [JSON Validator](/) — Validate your JSON before parsing
- [JSON Flatten](/json-flatten) — Flatten nested structures
- [JSON to CSV](/json-to-csv) — Convert JSON to spreadsheet format
- [JSON to YAML](/json-to-yaml) — Convert to YAML for config files

### Learn More

- [JSON Parse Error Guide](/json-parse-error) — Fix common parsing errors
- [Common JSON Mistakes](/common-mistakes-in-json-and-how-to-avoid-them) — Avoid syntax errors
- [JSON Comments Guide](/json-comments) — Why comments cause errors
- [Mastering JSON Format](/mastering-json-format) — JSON fundamentals
