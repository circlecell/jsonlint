---
title: "JSON vs JSONB in PostgreSQL: Differences, Performance, and Indexing"
description: "Compare PostgreSQL json and jsonb storage, indexing, query performance, duplicate keys, and the cases where each data type fits."
category: comparisons
priority: 30
updated: "2026-08-14"
---

# JSON vs JSONB in PostgreSQL: Differences, Performance, and Indexing

PostgreSQL provides two native JSON types. `json` stores the original JSON text and reparses it when queried. `jsonb` stores a decomposed binary representation that is slower to ingest but usually faster to process and can be indexed.

For most application data, PostgreSQL recommends `jsonb`. Choose `json` when preserving the input's exact whitespace, object-key order, or duplicate keys is an explicit requirement.

## JSON vs JSONB at a glance

| Capability | `json` | `jsonb` |
|---|---|---|
| Validates JSON on input | Yes | Yes |
| Preserves whitespace | Yes | No |
| Preserves object-key order | Yes | No |
| Preserves duplicate object keys | In stored text | No; last value is kept |
| Processing speed | Reparsed for each operation | Usually faster to query |
| Input conversion | Faster | Slightly slower |
| GIN indexing | No | Yes |
| Containment operators | Limited | Yes |

Both types reject invalid JSON syntax. They differ in how valid input is stored and queried, not in whether the value must be JSON.

## Storage behavior

Given this input:

```json
{ "status": "draft", "status": "published", "count": 2 }
```

A `json` column retains the original text, including both `status` keys and the spacing. PostgreSQL JSON operations still treat the last duplicate value as operative. A `jsonb` column normalizes the object and retains only the last value:

```json
{"count": 2, "status": "published"}
```

Do not rely on object-key order in application logic. JSON objects are conceptually unordered, and `jsonb` may display keys in a different order from the input.

## Create JSON and JSONB columns

```sql
CREATE TABLE api_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  raw_payload json NOT NULL,
  searchable_payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

Use `json` for a raw payload only when exact input preservation matters. Otherwise, one `jsonb` column is generally simpler.

## Query JSONB data

The `->` operator returns JSON, while `->>` returns text:

```sql
SELECT
  searchable_payload -> 'customer' AS customer_json,
  searchable_payload ->> 'status' AS status_text
FROM api_events;
```

Filter with containment:

```sql
SELECT *
FROM api_events
WHERE searchable_payload @> '{"status":"published"}';
```

## Index JSONB

A general GIN index supports many containment and key-existence searches:

```sql
CREATE INDEX api_events_payload_gin
ON api_events
USING GIN (searchable_payload);
```

If queries repeatedly extract one scalar value, an expression index may be more targeted:

```sql
CREATE INDEX api_events_status_idx
ON api_events ((searchable_payload ->> 'status'));
```

An index is useful only when it matches real query patterns. Broad JSONB indexes increase storage and write cost, so confirm them with `EXPLAIN (ANALYZE, BUFFERS)` on representative queries.

## When to use JSONB

Use `jsonb` when you need to:

- Filter, join, or aggregate on values inside the document.
- Use containment or key-existence operators.
- Add a GIN or expression index.
- Update individual paths within a document.
- Enforce equality or uniqueness involving the normalized JSON value.

JSONB is a strong fit for flexible metadata, external payloads you need to search, preferences, and event properties. It is not a substitute for normal columns when the same fields are central to nearly every query or need relational constraints.

## When to use JSON

Use `json` only when the original text representation is important—for example, an audit system that must retain byte-relevant formatting after decoding, or an ingestion pipeline that preserves duplicate keys for later inspection.

If you only need the untouched request body, `text` or `bytea` may express that requirement more directly. You can keep a raw value separately and parse a validated `jsonb` copy for queries.

## Migration considerations

Convert a column with an explicit cast:

```sql
ALTER TABLE api_events
ALTER COLUMN raw_payload TYPE jsonb
USING raw_payload::jsonb;
```

Before migrating:

1. Check whether any rows contain duplicate object keys.
2. Confirm that no application depends on whitespace or key order.
3. Measure table and index size.
4. Review query plans and operator behavior.
5. Plan for the table rewrite and lock requirements on your PostgreSQL version and dataset.

The cast can permanently discard representational details. Test it on a copy of production-shaped data before changing a critical table.

## JSON null vs SQL NULL

SQL `NULL` means the column has no SQL value. JSON `null` is a JSON value stored inside the document. They are not interchangeable:

```sql
INSERT INTO api_events (raw_payload, searchable_payload)
VALUES ('null', 'null');       -- JSON null values

INSERT INTO api_events (raw_payload, searchable_payload)
VALUES (NULL, NULL);           -- rejected here because columns are NOT NULL
```

The distinction also matters for missing keys. Define how your application handles a missing property, a property whose value is JSON `null`, and a SQL-null column.

## Frequently asked questions

### Is JSONB compressed?

Large values can use PostgreSQL's normal oversized-attribute storage and compression mechanisms. The exact on-disk size depends on the document and PostgreSQL configuration; JSONB is not guaranteed to be smaller than the original JSON text.

### Does JSONB preserve array order?

Yes. JSON arrays remain ordered. It is object-key order that JSONB does not preserve.

### Should every table have one JSONB column?

No. Use ordinary typed columns for stable, frequently queried attributes and relational constraints. Add JSONB where flexible or sparse document-shaped data provides a real benefit.

Validate documents before inserting them with the [JSON validator](/), or start with the [JSON format guide](/mastering-json-format) if the syntax is unfamiliar.

## Reference

- [PostgreSQL documentation: JSON types](https://www.postgresql.org/docs/current/datatype-json.html)

