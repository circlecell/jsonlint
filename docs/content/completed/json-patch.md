---
title: "JSON Patch: RFC 6902 Operations, Examples, and Best Practices"
description: "Learn JSON Patch add, remove, replace, move, copy, and test operations, JSON Pointer paths, HTTP usage, and Merge Patch differences."
category: languages
priority: 40
updated: "2026-08-14"
---

# JSON Patch: RFC 6902 Operations, Examples, and Best Practices

JSON Patch is an IETF standard for describing a sequence of changes to a JSON document. A patch is a JSON array whose operations are applied in order. RFC 6902 defines six operations: `add`, `remove`, `replace`, `move`, `copy`, and `test`.

```json
[
  { "op": "replace", "path": "/status", "value": "published" },
  { "op": "add", "path": "/tags/-", "value": "featured" }
]
```

Applied to this document:

```json
{
  "status": "draft",
  "tags": ["news"]
}
```

The result is:

```json
{
  "status": "published",
  "tags": ["news", "featured"]
}
```

## JSON Patch operations

| Operation | Purpose | Required members |
|---|---|---|
| `add` | Add or replace a value at a path | `path`, `value` |
| `remove` | Remove an existing value | `path` |
| `replace` | Replace an existing value | `path`, `value` |
| `move` | Remove a value and add it elsewhere | `from`, `path` |
| `copy` | Copy a value to another path | `from`, `path` |
| `test` | Assert that a path has a value | `path`, `value` |

If an operation fails, application of the patch document fails. Do not silently skip an invalid operation and continue unless a separate application protocol explicitly defines that non-standard behavior.

## `add`

Add an object member:

```json
[
  { "op": "add", "path": "/priority", "value": "high" }
]
```

Insert into an array at index 1:

```json
[
  { "op": "add", "path": "/tags/1", "value": "json" }
]
```

Append to an array with `-`:

```json
[
  { "op": "add", "path": "/tags/-", "value": "api" }
]
```

Adding to an existing object member replaces its value. For arrays, the specified position is an insertion point rather than a replacement.

## `remove` and `replace`

```json
[
  { "op": "remove", "path": "/temporaryNote" },
  { "op": "replace", "path": "/status", "value": "archived" }
]
```

The target for `remove` or `replace` must exist. Use `add` when the member may not exist and replacement semantics are acceptable.

## `move` and `copy`

Rename or relocate a value:

```json
[
  { "op": "move", "from": "/display_name", "path": "/displayName" }
]
```

Copy a value:

```json
[
  { "op": "copy", "from": "/shippingAddress", "path": "/billingAddress" }
]
```

The copied value is logically independent in the resulting JSON document; JSON itself has no shared object references.

## `test` for conditional updates

Use `test` before a mutation to ensure the document is in the expected state:

```json
[
  { "op": "test", "path": "/version", "value": 7 },
  { "op": "replace", "path": "/status", "value": "published" },
  { "op": "replace", "path": "/version", "value": 8 }
]
```

If `version` is not `7`, the patch fails before later operations are applied. This can support optimistic concurrency, although HTTP APIs should also consider standard conditional requests such as `If-Match` with an ETag.

## JSON Pointer paths

The `path` and `from` members use JSON Pointer syntax. Object members are separated with `/`, and array positions use zero-based indexes:

```text
/profile/name
/orders/0/status
```

Two characters need special escaping inside a path segment:

- `~` becomes `~0`
- `/` becomes `~1`

To target the key `a/b`, use `/a~1b`. To target `price~usd`, use `/price~0usd`.

An empty string points to the whole document. This is different from `/`, which points to an object member whose key is the empty string.

## Use JSON Patch over HTTP

A JSON Patch request commonly uses HTTP `PATCH` and the media type `application/json-patch+json`:

```http
PATCH /articles/123 HTTP/1.1
Content-Type: application/json-patch+json
If-Match: "article-7"

[
  { "op": "replace", "path": "/title", "value": "Updated title" }
]
```

The endpoint contract should document:

- Which paths clients may modify.
- Authentication and authorization for each field.
- Maximum operation count and payload size.
- Error responses and whether changes are atomic.
- Concurrency behavior.
- Validation performed on the final resource.

Never assume that allowing a client to update the resource means every reachable path is safe to modify.

## JSON Patch vs JSON Merge Patch

JSON Merge Patch (RFC 7396) uses a partial document rather than an operation array:

```json
{
  "status": "published",
  "temporaryNote": null
}
```

| Characteristic | JSON Patch | JSON Merge Patch |
|---|---|---|
| Representation | Array of operations | Partial JSON document |
| Move/copy/test operations | Yes | No |
| Precise array edits | Yes | No; arrays are replaced as values |
| Set an object member to JSON `null` | Yes | Ambiguous/impractical because `null` means remove |
| Easy simple object update | More verbose | Usually simpler |
| Standard media type | `application/json-patch+json` | `application/merge-patch+json` |

Choose JSON Patch for precise, ordered changes and array edits. Choose Merge Patch for simple object updates when its `null` and array semantics fit the resource.

## Security and validation

Treat a patch as untrusted input:

1. Validate that it is a JSON array of recognized operations.
2. Limit the number of operations, pointer depth, and payload size.
3. Authorize changes by resolved path, not just by endpoint.
4. Reject prototype-pollution paths in JavaScript implementations.
5. Validate the final document against business rules or a [JSON Schema](/json-schema-examples).
6. Apply the patch atomically so a failure does not expose a partially updated resource.
7. Record enough audit context to understand the before/after change.

Use a mature RFC-compliant library for your language and test edge cases such as escaped pointer tokens, array indexes, root replacement, and failed `test` operations.

## Frequently asked questions

### Is JSON Patch the same as HTTP PATCH?

No. HTTP `PATCH` is a request method. JSON Patch is one standardized patch-document format that an HTTP endpoint can accept.

### Does operation order matter?

Yes. Operations are applied sequentially, and each later path is evaluated against the result of earlier operations.

### Can JSON Patch update multiple fields atomically?

The format defines ordered application and failure behavior. The API and storage implementation must still ensure the overall request is transactional or otherwise atomic.

Validate the patch document's JSON syntax with the [JSON validator](/) before testing its patch semantics.

## References

- [RFC 6902: JSON Patch](https://www.rfc-editor.org/rfc/rfc6902)
- [RFC 6901: JSON Pointer](https://www.rfc-editor.org/rfc/rfc6901)
- [RFC 7396: JSON Merge Patch](https://www.rfc-editor.org/rfc/rfc7396)

