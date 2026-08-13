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
# Requires curl; uses jq for pretty output if it is installed.
# Queries exclude the synthetic deploy-test row (blob1/blob4 = "ZTEST01").
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
q2="SELECT arrayJoin(splitByChar(',', blob4)) AS code, count() AS n FROM ${DATASET} WHERE blob4 != '' AND ${NOTEST} GROUP BY code ORDER BY n DESC"
q3="SELECT blob3 AS core_ok, count() AS n FROM ${DATASET} WHERE ${NOTEST} GROUP BY core_ok"
q4="SELECT multiIf(double1 < 10000, '<10KB', double1 < 1000000, '<1MB', '>=1MB') AS size, quantile(0.5)(double3) AS p50_ms, quantile(0.95)(double3) AS p95_ms, quantile(0.99)(double3) AS p99_ms, count() AS n FROM ${DATASET} WHERE ${NOTEST} GROUP BY size ORDER BY size"
q5="SELECT blob1 AS first_code, count() AS n FROM ${DATASET} WHERE blob1 != '' AND ${NOTEST} GROUP BY first_code ORDER BY n DESC"

DESCS=(
  "1  Daily sample volume (is the pipeline flowing?)"
  "2  Error-code frequency (which errors real users hit)"
  "3  Valid vs invalid split (1 = valid, 0 = invalid)"
  "4  Engine latency p50/p95/p99 by size bucket"
  "5  First-error distribution (which error users see first)"
)

usage() {
  echo "Usage: CF_TOKEN=<token> $0 <1-5|list|raw \"SELECT ...\">" >&2
  printf '  %s\n' "${DESCS[@]}" >&2
}

run() {
  local sql="$1"
  if [[ -z "${CF_TOKEN:-}" ]]; then
    echo "error: set CF_TOKEN to an 'Account Analytics: Read' API token" >&2
    echo "  create one at https://dash.cloudflare.com/profile/api-tokens" >&2
    exit 1
  fi
  local out
  out=$(curl -s "$API" -H "Authorization: Bearer $CF_TOKEN" --data "$sql")
  if command -v jq >/dev/null 2>&1; then
    echo "$out" | jq '.data // .'
  else
    echo "$out"
  fi
}

case "${1:-}" in
  1) run "$q1" ;;
  2) run "$q2" ;;
  3) run "$q3" ;;
  4) run "$q4" ;;
  5) run "$q5" ;;
  raw) shift; run "${1:?provide a SQL string}" ;;
  list) printf '%s\n' "${DESCS[@]}" ;;
  *) usage; exit 1 ;;
esac
