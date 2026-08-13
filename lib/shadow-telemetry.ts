/**
 * Client-side sample telemetry for the validator.
 *
 * Post-flip, @jsonlint/core is authoritative, so there is no legacy comparison
 * to make. This records a 10% sample of real validations carrying only
 * aggregate signal — the distinct error codes, document length, diagnostic
 * count, and engine latency. The document itself never leaves the browser.
 *
 * Feeds the code-frequency and latency queries in workers/shadow/QUERIES.md.
 * Telemetry failures are swallowed: this can never affect a user's validation.
 */
import type { LintResult, LintMode } from './jsonlint-core-integration';

const ENDPOINT = '/api/shadow';
const SAMPLE_RATE = 0.1; // 10% of validations report code + latency stats

function send(payload: Record<string, unknown>): void {
  try {
    if (typeof navigator === 'undefined' || !navigator.sendBeacon) return;
    const body = new Blob([JSON.stringify(payload)], {
      type: 'application/json',
    });
    navigator.sendBeacon(ENDPOINT, body);
  } catch {
    /* telemetry must never affect the user */
  }
}

/**
 * Record a sampled telemetry point for a validation that already ran.
 * Pass the `LintResult` from `lint()` so no second parse is needed.
 */
export function recordValidationSample(
  result: LintResult,
  textLength: number,
  mode: LintMode = 'strict'
): void {
  try {
    if (Math.random() >= SAMPLE_RATE) return;
    const codes = Array.from(new Set(result.diagnostics.map((d) => d.code)));
    send({
      kind: 'sample',
      mode,
      len: textLength,
      coreMs: Math.round(result.ms * 10) / 10,
      coreOk: result.ok,
      firstCode: result.diagnostics[0]?.code ?? '',
      codes: codes.slice(0, 8).join(','),
      diagCount: result.diagnostics.length,
    });
  } catch {
    /* never throw into the validation path */
  }
}
