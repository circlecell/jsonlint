#!/usr/bin/env bash
#
# Query the jsonlint_shadow Analytics Engine dataset (sample telemetry).
#
# Setup — create a token with the "Account Analytics: Read" permission scoped
# to the jsonlint.com account at https://dash.cloudflare.com/profile/api-tokens
#
#   export CF_TOKEN='<Account Analytics: Read token>'
#
# Usage:
#   ./query.sh <1-5>            run a numbered query (see `list`)
#   ./query.sh list             list the available queries
#   ./query.sh raw "SELECT ..." run an arbitrary SQL query
#
# Requires curl; query 2 additionally requires jq.
# Queries exclude the synthetic deploy-test row (blob1/blob4 = "ZTEST01").
#
# NOTE: the Cloudflare Analytics Engine SQL API is a restricted ClickHouse
# subset — `multiIf`, `splitByChar`, `arrayJoin`, and the `quantile(x)(y)`
# combinator form are NOT available. So latency percentiles use
# `quantileWeighted(level, value, _sample_interval)` (weighted for sampling),
# and query 2 splits the comma-joined code list client-side with jq/awk.
#
# Column map (see QUERIES.md): blob1=firstCode, blob2=mode, blob3=coreOk,
# blob4=codes, double1=len, double2=diagCount, double3=coreMs, index1=kind.

set -euo pipefail

ACCOUNT_ID="3e73c3ab69d8d6a1ea495a7b5234877c"
DATASET="jsonlint_shadow"
API="https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/analytics_engine/sql"

# Exclude the one synthetic row written during deploy verification.
NOTEST="blob1 != 'ZTEST01'"

q1="SELECT toDate(timestamp) AS day, count() AS samples FROM ${DATASET} GROUP BY day ORDER BY day"
q3="SELECT blob3 AS core_ok, count() AS n FROM ${DATASET} WHERE ${NOTEST} GROUP BY core_ok"
q4="SELECT quantileWeighted(0.5, double3, _sample_interval) AS p50_ms, quantileWeighted(0.95, double3, _sample_interval) AS p95_ms, quantileWeighted(0.99, double3, _sample_interval) AS p99_ms, max(double3) AS max_ms, sum(_sample_interval) AS est_validations FROM ${DATASET} WHERE ${NOTEST}"
q5="SELECT blob1 AS first_code, count() AS n FROM ${DATASET} WHERE blob1 != '' AND ${NOTEST} GROUP BY first_code ORDER BY n DESC"
# Query 2 fetches the raw comma-joined code lists; the split + tally happens
# client-side because Analytics Engine has no arrayJoin/splitByChar.
q2_sql="SELECT blob4 FROM ${DATASET} WHERE blob4 != '' AND ${NOTEST}"

DESCS=(
  "1  Daily sample volume (is the pipeline flowing?)"
  "2  Error-code frequency (which errors real users hit)"
  "3  Valid vs invalid split (1 = valid, 0 = invalid)"
  "4  Engine latency p50/p95/p99 (coreMs, weighted for sampling)"
  "5  First-error distribution (which error users see first)"
)

usage() {
  echo "Usage: CF_TOKEN=<token> $0 <1-5|list|raw \"SELECT ...\">" >&2
  printf '  %s\n' "${DESCS[@]}" >&2
}

api_call() {
  local sql="$1"
  if [[ -z "${CF_TOKEN:-}" ]]; then
    echo "error: set CF_TOKEN to an 'Account Analytics: Read' API token" >&2
    echo "  create one at https://dash.cloudflare.com/profile/api-tokens" >&2
    exit 1
  fi
  curl -s "$API" -H "Authorization: Bearer $CF_TOKEN" --data "$sql"
}

run() {
  local out
  out=$(api_call "$1")
  if command -v jq >/dev/null 2>&1; then
    echo "$out" | jq '.data // .'
  else
    echo "$out"
  fi
}

# Query 2: split the comma-joined code lists and tally individual codes.
run_codes() {
  if ! command -v jq >/dev/null 2>&1; then
    echo "error: query 2 needs jq to split codes client-side" >&2
    exit 1
  fi
  local out codes
  out=$(api_call "$q2_sql")
  codes=$(echo "$out" | jq -r '.data[]?.blob4 // empty' 2>/dev/null || true)
  if [[ -z "$codes" ]]; then
    # No rows, or an API error — show the raw response so it's debuggable.
    echo "$out"
    return
  fi
  echo "$codes" | tr ',' '\n' | sed '/^[[:space:]]*$/d' \
    | sort | uniq -c | sort -rn \
    | awk '{printf "%6s  %s\n", $1, $2}'
}

case "${1:-}" in
  1) run "$q1" ;;
  2) run_codes ;;
  3) run "$q3" ;;
  4) run "$q4" ;;
  5) run "$q5" ;;
  raw) shift; run "${1:?provide a SQL string}" ;;
  list) printf '%s\n' "${DESCS[@]}" ;;
  *) usage; exit 1 ;;
esac
