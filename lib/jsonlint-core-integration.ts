/**
 * Adapter around @jsonlint/core — the engine that powers the main validator.
 *
 * `lint()` runs the single-pass diagnostics engine and returns every error and
 * warning at once, each with a 1-based line/column resolved from its offset.
 * Warnings (duplicate keys, precision loss, lone surrogates, Windows-path
 * escapes) do not make a document invalid — `ok` reflects errors only.
 *
 * Source: github.com/toddynho/jsonlint-core (packages/core).
 */
import { validate, lineColumn, type Diagnostic } from '@jsonlint/core';

export type LintMode = 'strict' | 'jsonc';

export interface LintDiagnostic extends Omit<Diagnostic, 'related'> {
  line: number;
  column: number;
  related:
    | (NonNullable<Diagnostic['related']> & { line: number; column: number })
    | null;
}

export interface LintResult {
  ok: boolean;
  ms: number;
  diagnostics: LintDiagnostic[];
}

/** Run the core engine and return render-ready diagnostics. */
export function lint(
  text: string,
  { mode = 'strict' }: { mode?: LintMode } = {}
): LintResult {
  const now = () =>
    typeof performance !== 'undefined' ? performance.now() : 0;
  const t0 = now();
  const { ok, diagnostics } = validate(text, { mode });
  return {
    ok,
    ms: now() - t0,
    diagnostics: diagnostics.map((d) => {
      const { line, column } = lineColumn(text, d.start);
      const related = d.related
        ? { ...d.related, ...lineColumn(text, d.related.start) }
        : null;
      return { ...d, line, column, related };
    }),
  };
}
