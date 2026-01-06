# JSON to Python Converter

## Overview
| Attribute | Value |
|-----------|-------|
| **URL** | `/json-to-python` |
| **Target Keyword** | "json to python class", "json to dataclass" |
| **Monthly Volume** | 500 |
| **Keyword Difficulty** | 8 |
| **Priority** | Tier 3 - Code Generator |
| **Estimated Time** | 2-3 hours |
| **Status** | Pending |

## Tool Description
Generate Python classes from JSON data. Supports dataclasses, TypedDict, and Pydantic models.

## Output Formats

### Dataclass (Python 3.7+)
```python
from dataclasses import dataclass
from typing import List, Optional

@dataclass
class User:
    name: str
    age: int
    email: Optional[str] = None
```

### TypedDict
```python
from typing import TypedDict, List

class User(TypedDict):
    name: str
    age: int
    email: str
```

### Pydantic Model
```python
from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    name: str
    age: int
    email: Optional[str] = None
```

### Named Tuple
```python
from typing import NamedTuple

class User(NamedTuple):
    name: str
    age: int
```

## Options
- [ ] Output format (dataclass/TypedDict/Pydantic/NamedTuple)
- [ ] Root class name
- [ ] Use Optional for nullable fields
- [ ] Generate __post_init__ for dataclass
- [ ] Include default values
- [ ] Snake_case conversion

## Type Mapping
| JSON | Python |
|------|--------|
| string | str |
| integer | int |
| float | float |
| boolean | bool |
| null | None / Optional |
| array | List[T] |
| object | nested class |

## SEO Content (800 words)
- When to use dataclass vs Pydantic
- Type hints in Python
- Example conversions
- Integration with JSON parsing
- FAQ

## Internal Links
- FROM: `/python-json` article, other code generators
- TO: `/`, `/json-schema`

## Files
- `/app/json-to-python/page.tsx`
- `/app/json-to-python/JsonToPythonConverter.tsx`
- Update Footer.tsx
