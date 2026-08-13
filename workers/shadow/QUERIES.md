# Analyzing the sample telemetry (Analytics Engine SQL API)

Query via <https://developers.cloudflare.com/analytics/analytics-engine/sql-api/>:

```bash
curl "https://api.cloudflare.com/client/v4/accounts/{ACCOUNT}/analytics_engine/sql" \
  -H "Authorization: Bearer $CF_TOKEN" \
  -d "SELECT ..."
```

**Column map** (matches `shadow-worker.js`):
`blob1=firstCode`, `blob2=mode`, `blob3=coreOk ("1"/"0")`, `blob4=codes`,
`double1=len`, `double2=diagCount`, `double3=coreMs`, `index1=kind ("sample")`.

Each row is a 10% sample of a real validation. Scale counts by ~10 for
absolute traffic estimates.

## 1. Daily sample volume (sanity check the pipeline is flowing)

```sql
SELECT toDate(timestamp) AS day, count() AS samples
FROM jsonlint_shadow
GROUP BY day ORDER BY day
```

## 2. Error-code frequency on real traffic — prioritizes /errors/CODE pages + hints

```sql
SELECT arrayJoin(splitByChar(',', blob4)) AS code, count() AS n
FROM jsonlint_shadow
WHERE blob4 != ''
GROUP BY code ORDER BY n DESC
```

Which errors humans actually hit decides the order to invest in `/errors/{CODE}`
pages and which hints earn their keep. Nobody else has this dataset.

## 3. Valid vs invalid split (how much traffic is already-clean JSON)

```sql
SELECT blob3 AS core_ok, count() AS n
FROM jsonlint_shadow
GROUP BY core_ok
```

## 4. Engine latency on real documents (p50/p95/p99 by size bucket)

```sql
SELECT multiIf(double1 < 10000, '<10KB', double1 < 1000000, '<1MB', '>=1MB') AS size,
       quantile(0.5)(double3) AS p50_ms,
       quantile(0.95)(double3) AS p95_ms,
       quantile(0.99)(double3) AS p99_ms,
       count() AS n
FROM jsonlint_shadow
GROUP BY size ORDER BY size
```

Production p95 by size answers "do we need the WASM build yet?" with data
instead of guesses.

## 5. First-error distribution (which error users see first, before fixing)

```sql
SELECT blob1 AS first_code, count() AS n
FROM jsonlint_shadow
WHERE blob1 != ''
GROUP BY first_code ORDER BY n DESC
```

---

_Note: this is the post-flip, sample-only kit. @jsonlint/core is already the
authoritative validator, so there is no legacy-vs-core divergence stream — the
original kit's divergence queries do not apply here._
