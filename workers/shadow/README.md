# Shadow sample telemetry

Document-free sample telemetry for the JSONLint validator: a 10% sample of real
validations carrying only the distinct error codes, document length, diagnostic
count, and engine latency. The document itself never leaves the browser.

- **Client:** [`lib/shadow-telemetry.ts`](../../lib/shadow-telemetry.ts) —
  `recordValidationSample()` is called from `handleValidate` in
  `components/JsonValidator.tsx` with the `LintResult` already computed (no second
  parse). Beacons to `/api/shadow`.
- **Collector:** `shadow-worker.js` — writes to a Cloudflare Analytics Engine
  dataset. Whitelists + clamps every field.
- **Analysis:** [`QUERIES.md`](./QUERIES.md) — code frequency, latency
  percentiles, valid/invalid split, first-error distribution.

## What is sent

`kind`, `mode`, `len` (chars), `coreMs`, `coreOk`, `firstCode`, `codes` (≤8
distinct), `diagCount`. **Never** the document text. No gating is applied — to
honor Do Not Track / Global Privacy Control instead, add an early
`if (navigator.doNotTrack === '1' || navigator.globalPrivacyControl) return;`
guard at the top of `recordValidationSample`.

## Deploy (your step — needs your Cloudflare creds)

```bash
cd workers/shadow
npx wrangler deploy
```

The route `jsonlint.com/api/shadow` and the `jsonlint_shadow` Analytics Engine
dataset are declared in `wrangler.toml`. Analytics Engine needs no provisioning
and is free at this volume. Once deployed, run the queries in `QUERIES.md` via
the SQL API.
