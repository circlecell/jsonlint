// Cloudflare Worker: sample-telemetry collector for jsonlint.com.
//
// Receives the document-free samples emitted by lib/shadow-telemetry.ts and
// writes them to a Cloudflare Analytics Engine dataset (free at this volume,
// no database, SQL-queryable). See wrangler.toml for the binding + route.
//
// Privacy/robustness: only a fixed, whitelisted set of scalar fields is stored,
// and every field is clamped. The client never sends document content, and this
// worker would drop it anyway — unknown fields are ignored entirely.
//
// Column layout (keep in sync with QUERIES.md):
//   index1 = kind ("sample")
//   blob1 = firstCode   blob2 = mode   blob3 = coreOk ("1"/"0")   blob4 = codes
//   double1 = len       double2 = diagCount   double3 = coreMs

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors() });
    }
    if (request.method !== 'POST') {
      return new Response(null, { status: 405, headers: cors() });
    }

    let b;
    try {
      b = await request.json();
    } catch {
      return new Response(null, { status: 400, headers: cors() });
    }

    const str = (v, max) => (typeof v === 'string' ? v.slice(0, max) : '');
    const num = (v, max) =>
      typeof v === 'number' && isFinite(v)
        ? Math.min(Math.max(v, -1), max)
        : -1;

    env.SHADOW.writeDataPoint({
      indexes: ['sample'], // sampling key; only one kind is emitted post-flip
      blobs: [
        str(b.firstCode, 8), // e.g. "W060"
        str(b.mode, 8), // "strict" | "jsonc"
        b.coreOk === true ? '1' : b.coreOk === false ? '0' : '', // valid?
        str(b.codes, 64), // distinct codes, e.g. "E009,W060"
      ],
      doubles: [
        num(b.len, 100_000_000), // document length (chars)
        num(b.diagCount, 1000), // number of diagnostics
        num(b.coreMs, 60_000), // engine runtime, ms
      ],
    });

    return new Response(null, { status: 204, headers: cors() });
  },
};

function cors() {
  // Same-origin in production (jsonlint.com/api/shadow), so this is belt-and-
  // suspenders; keeps local/dev cross-origin beacons from erroring.
  return {
    'access-control-allow-origin': 'https://jsonlint.com',
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
  };
}
