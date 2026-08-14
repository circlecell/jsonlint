---
title: "JSON Date Format: ISO 8601 Examples and Best Practices"
description: "JSON has no date type. Learn how to represent dates and timestamps with ISO 8601 strings, UTC offsets, Unix time, and JSON Schema."
category: foundations
priority: 40
updated: "2026-08-14"
---

# JSON Date Format: ISO 8601 Examples and Best Practices

JSON does not define a date or timestamp data type. A date must be represented as a JSON string, number, or structured object according to a convention that the producer and consumer both understand.

For interoperable APIs, use an ISO 8601/RFC 3339-style string and state whether the value represents a calendar date, a local wall-clock time, or an exact instant.

```json
{
  "birthday": "1990-06-15",
  "publishedAt": "2026-08-14T18:30:00Z",
  "appointmentAt": "2026-08-14T14:30:00-04:00"
}
```

## Choose the meaning before the format

These values look similar but represent different concepts:

| Meaning | Example | Notes |
|---|---|---|
| Calendar date | `2026-08-14` | No time or timezone |
| UTC instant | `2026-08-14T18:30:00Z` | `Z` means UTC |
| Instant with offset | `2026-08-14T14:30:00-04:00` | Same instant can have multiple offset representations |
| Local date and time | `2026-08-14T14:30:00` | Ambiguous without zone or offset |
| Unix timestamp | `1786732200` | Unit must be documented |

A birthday is normally a calendar date, not midnight UTC. A payment event is an instant. A recurring 9:00 AM meeting may require a named timezone such as `America/New_York`, because an offset alone does not encode future daylight-saving rules.

## Recommended timestamp format

For an instant, a clear default is:

```json
{"createdAt":"2026-08-14T18:30:00Z"}
```

Recommended practices:

- Use four-digit years and two-digit months, days, hours, minutes, and seconds.
- Include `T` between date and time.
- Include `Z` for UTC or a numeric offset such as `-04:00`.
- Use fractional seconds only when needed, such as `2026-08-14T18:30:00.123Z`.
- Document whether the API accepts only UTC or also accepts offset timestamps.
- Keep field naming consistent, for example `createdAt` and `updatedAt`.

Avoid locale-dependent strings such as `08/14/2026`, which can be interpreted differently across regions. Month names and informal timezone abbreviations also create parsing ambiguity.

## Dates in JavaScript

Serialize a JavaScript `Date` as an ISO UTC string:

```js
const value = new Date("2026-08-14T14:30:00-04:00");

const payload = {
  createdAt: value.toISOString()
};

console.log(JSON.stringify(payload));
// {"createdAt":"2026-08-14T18:30:00.000Z"}
```

`JSON.parse()` returns strings, not `Date` objects:

```js
const data = JSON.parse('{"createdAt":"2026-08-14T18:30:00Z"}');
const createdAt = new Date(data.createdAt);

if (Number.isNaN(createdAt.getTime())) {
  throw new Error("Invalid createdAt timestamp");
}
```

Do not assume that parsing every vaguely date-like string will behave consistently. Validate the expected format at the API boundary.

## Dates in Python

Python's standard `json` module also returns a string. Parse it explicitly:

```python
import json
from datetime import datetime

data = json.loads('{"createdAt":"2026-08-14T18:30:00Z"}')
created_at = datetime.fromisoformat(data["createdAt"].replace("Z", "+00:00"))
```

Serialize a timezone-aware `datetime`:

```python
from datetime import datetime, timezone
import json

payload = {
    "createdAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
}

print(json.dumps(payload))
```

For more Python examples, see [reading and writing JSON in Python](/python-json).

## Unix timestamps

A Unix timestamp is compact and sortable:

```json
{"createdAt":1786732200}
```

The number is meaningless unless the contract states the unit. Ten-digit values are commonly seconds and thirteen-digit values are commonly milliseconds, but guessing is unsafe. Numbers also hide timezone and human readability, and very precise timestamps may exceed safe integer handling in some consumers.

If you use Unix time, name or document the unit explicitly:

```json
{
  "createdAtEpochMs": 1786732200000
}
```

## Date validation with JSON Schema

JSON Schema can describe a date or date-time string:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "birthday": {
      "type": "string",
      "format": "date"
    },
    "createdAt": {
      "type": "string",
      "format": "date-time"
    }
  },
  "required": ["createdAt"]
}
```

JSON Schema's `format` behavior can depend on the validator and its configuration. Test the exact implementation you deploy and add application-level rules when your contract is narrower—for example, UTC-only timestamps.

Use the [JSON Schema validator](/json-schema) to test an instance against a schema, or see [JSON Schema examples](/json-schema-examples) for larger patterns.

## Common date-format mistakes

- Omitting the offset from a value that is meant to identify an instant.
- Adding `Z` to a local time without converting it to UTC.
- Treating a date-only value as midnight in an arbitrary timezone.
- Mixing seconds and milliseconds in Unix timestamps.
- Assuming JSON parsing automatically creates date objects.
- Using a regular expression as the only date-validity check.
- Storing a named-timezone requirement as a fixed numeric offset.

## Frequently asked questions

### Does JSON support a native date type?

No. JSON has strings, numbers, booleans, `null`, arrays, and objects. Date semantics come from your data contract.

### Should API timestamps always use UTC?

UTC strings are an excellent default for instants and event times. Retain a named timezone separately when the original civil-time context or future local scheduling rules matter.

### Is ISO 8601 the same as RFC 3339?

RFC 3339 defines an internet timestamp profile based on ISO 8601. API documentation often says “ISO 8601” while using the narrower RFC 3339-style forms shown above.

Check your final payload with the [JSON validator](/) and format it with the [JSON formatter](/json-formatter).
