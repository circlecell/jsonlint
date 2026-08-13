/**
 * Catalog of every diagnostic code emitted by @jsonlint/core.
 *
 * Drives the /errors/{CODE} reference pages and the code badges rendered by the
 * validator. Keep this in sync with the engine (node_modules/@jsonlint/core):
 * every code the engine can emit must have an entry here, or its badge links to
 * a 404.
 */

export type Severity = 'error' | 'warning';

export interface ErrorCodeEntry {
  code: string;
  severity: Severity;
  /** Short human title, e.g. "Trailing comma". */
  title: string;
  /** One-sentence summary of what the diagnostic means. */
  summary: string;
  /** A paragraph explaining why it happens and what JSON requires. */
  explanation: string;
  /** Minimal snippet that triggers the code, and a corrected version. */
  example: { bad: string; good?: string };
  /** One-sentence fix. */
  fix: string;
}

export const ERROR_CODES: Record<string, ErrorCodeEntry> = {
  E001: {
    code: 'E001',
    severity: 'error',
    title: 'Unexpected character',
    summary: 'A character appeared that is not part of JSON syntax.',
    explanation:
      'JSON only allows a fixed set of characters outside of strings: braces, brackets, colons, commas, digits, and the literals true/false/null. A stray symbol such as @, #, or a smart punctuation mark stops the parser.',
    example: { bad: '{ "price": @19.99 }', good: '{ "price": 19.99 }' },
    fix: 'Remove or replace the stray character with valid JSON syntax.',
  },
  E002: {
    code: 'E002',
    severity: 'error',
    title: 'Trailing content after the JSON value',
    summary: 'Extra content appears after the top-level value ended.',
    explanation:
      'A JSON document contains exactly one top-level value. If more tokens follow — often two objects pasted back to back, or newline-delimited JSON (NDJSON) — the parser reports the leftover content.',
    example: {
      bad: '{ "id": 1 }{ "id": 2 }',
      good: '[{ "id": 1 }, { "id": 2 }]',
    },
    fix: 'Wrap multiple values in an array, or split them into separate documents.',
  },
  E003: {
    code: 'E003',
    severity: 'error',
    title: 'Unexpected identifier',
    summary: 'A bare word was found where a value was expected.',
    explanation:
      'Unquoted words are not JSON values. Only true, false, and null are allowed as bare literals; anything else must be wrapped in double quotes to be a string.',
    example: { bad: '{ "status": active }', good: '{ "status": "active" }' },
    fix: 'Quote the word to make it a string, or use true/false/null.',
  },
  E004: {
    code: 'E004',
    severity: 'error',
    title: 'Unexpected end of input',
    summary: 'The document ended while a value was still expected.',
    explanation:
      'This usually means the JSON was truncated — cut off by a size limit, a failed copy/paste, or a stream that closed early — so a value that should follow a comma or colon is missing.',
    example: { bad: '{ "items": [1, 2,', good: '{ "items": [1, 2] }' },
    fix: 'Complete the missing value and close any open objects or arrays.',
  },
  E005: {
    code: 'E005',
    severity: 'error',
    title: 'Expected a value',
    summary: 'Punctuation appeared where a value belongs.',
    explanation:
      'After a colon or a comma the parser expects a value (string, number, object, array, or literal). Finding a closing brace, bracket, or another comma instead means a value was left out.',
    example: { bad: '{ "name": }', good: '{ "name": null }' },
    fix: 'Supply the missing value, or remove the dangling colon/comma.',
  },
  E006: {
    code: 'E006',
    severity: 'error',
    title: 'Unclosed object or array',
    summary: 'An object or array was opened but never closed.',
    explanation:
      'Every { must be matched by a } and every [ by a ]. The parser reached the end of the input with a container still open, usually because a closing bracket was dropped.',
    example: { bad: '{ "user": { "name": "Ada" }', good: '{ "user": { "name": "Ada" } }' },
    fix: 'Add the missing closing bracket to match every opening one.',
  },
  E007: {
    code: 'E007',
    severity: 'error',
    title: 'Leading comma in object',
    summary: 'An object starts with a comma before its first member.',
    explanation:
      'Commas separate members; they do not precede the first one. A leading comma is usually left behind after deleting the original first property.',
    example: { bad: '{ , "a": 1 }', good: '{ "a": 1 }' },
    fix: 'Delete the comma before the first member.',
  },
  E008: {
    code: 'E008',
    severity: 'error',
    title: 'Trailing comma',
    summary: 'A comma appears before a closing brace or bracket.',
    explanation:
      'Standard JSON (RFC 8259) does not allow a comma after the last element of an object or array. Trailing commas are valid in JSONC and JSON5, which is why editors often leave them behind.',
    example: { bad: '{ "a": 1, "b": 2, }', good: '{ "a": 1, "b": 2 }' },
    fix: 'Remove the trailing comma, or parse the input in JSONC mode if it is a config file.',
  },
  E009: {
    code: 'E009',
    severity: 'error',
    title: 'Missing comma between items',
    summary: "Expected ',' or a closing bracket between two values.",
    explanation:
      'Object members and array elements must be separated by commas. When one value is directly followed by another with no comma between them, the parser cannot tell where the first ends.',
    example: { bad: '{ "a": 1 "b": 2 }', good: '{ "a": 1, "b": 2 }' },
    fix: 'Add a comma between the two values.',
  },
  E010: {
    code: 'E010',
    severity: 'error',
    title: 'Strings must use double quotes',
    summary: "A string was written with single quotes (').",
    explanation:
      "JSON strings — both keys and values — must use double quotes. Single-quoted strings are valid in JavaScript and JSON5 but not in JSON or JSONC.",
    example: { bad: "{ 'name': 'Ada' }", good: '{ "name": "Ada" }' },
    fix: 'Replace single quotes with double quotes.',
  },
  E011: {
    code: 'E011',
    severity: 'error',
    title: 'Smart quote found',
    summary: 'A curly “smart” quote appeared where a string was expected.',
    explanation:
      'Word processors and chat apps often auto-replace straight quotes with typographic ones (“ ” ‘ ’). These are ordinary letters to JSON, not string delimiters, so the value is rejected.',
    example: { bad: '{ "msg": “hello” }', good: '{ "msg": "hello" }' },
    fix: 'Replace the curly quotes with straight double quotes (").',
  },
  E012: {
    code: 'E012',
    severity: 'error',
    title: 'Number cannot start with + or .',
    summary: "A number began with a leading '+' or '.'.",
    explanation:
      'JSON numbers may not have a leading plus sign, and a fraction must have at least one digit before the decimal point. These forms are valid in JSON5 only.',
    example: { bad: '{ "ratio": .5 }', good: '{ "ratio": 0.5 }' },
    fix: 'Drop the leading + and add a 0 before a leading decimal point.',
  },
  E013: {
    code: 'E013',
    severity: 'error',
    title: 'Unterminated string',
    summary: 'A string was opened but never closed.',
    explanation:
      'Every opening double quote needs a matching closing quote on the same line. A missing closing quote — or a line break inside the string — leaves it unterminated.',
    example: { bad: '{ "greeting": "hello }', good: '{ "greeting": "hello" }' },
    fix: 'Add the closing double quote (and escape any real line breaks as \\n).',
  },
  E014: {
    code: 'E014',
    severity: 'error',
    title: 'Invalid \\u escape',
    summary: 'A \\u escape was not followed by four hex digits.',
    explanation:
      'Unicode escapes in JSON take the form \\uXXXX, where XXXX is exactly four hexadecimal digits (0-9, a-f). Anything shorter, or with non-hex characters, is invalid.',
    example: { bad: '{ "char": "\\u12" }', good: '{ "char": "\\u0041" }' },
    fix: 'Provide four hex digits, e.g. \\u00e9 for é.',
  },
  E015: {
    code: 'E015',
    severity: 'error',
    title: 'Invalid escape sequence',
    summary: 'A backslash was followed by a character that is not a valid escape.',
    explanation:
      'Inside a JSON string a backslash starts an escape. Only \\" \\\\ \\/ \\b \\f \\n \\r \\t and \\uXXXX are allowed. A backslash before any other character — common in unescaped Windows paths — is an error.',
    example: { bad: '{ "path": "C:\\Users" }', good: '{ "path": "C:\\\\Users" }' },
    fix: 'Double every backslash, or use a valid escape sequence.',
  },
  E016: {
    code: 'E016',
    severity: 'error',
    title: 'Unescaped control character in string',
    summary: 'A raw control character (tab, newline, etc.) appears inside a string.',
    explanation:
      'Characters below U+0020 — literal tabs, newlines, and other control codes — are not allowed inside JSON strings. They must be written as escapes such as \\t or \\n.',
    example: { bad: '{ "note": "line1<TAB>line2" }', good: '{ "note": "line1\\tline2" }' },
    fix: 'Replace the raw control character with its escape (\\t, \\n, \\u0000-style, …).',
  },
  E018: {
    code: 'E018',
    severity: 'error',
    title: 'Number has a leading zero',
    summary: 'A number has an extra zero in front of it.',
    explanation:
      'JSON does not allow leading zeros on numbers (e.g. 007). A single 0, or 0 followed by a decimal point, is fine — but 0 followed by more digits is not.',
    example: { bad: '{ "code": 0123 }', good: '{ "code": 123 }' },
    fix: 'Remove the leading zero, or quote the value if you need to preserve it.',
  },
  E019: {
    code: 'E019',
    severity: 'error',
    title: 'Malformed number',
    summary: 'Expected a digit that is missing from a number.',
    explanation:
      'A JSON number needs digits after a decimal point and after an exponent marker. Forms like 1., 1e, or a lone - are incomplete.',
    example: { bad: '{ "value": 1. }', good: '{ "value": 1.0 }' },
    fix: 'Add the missing digit(s) to complete the number.',
  },
  E020: {
    code: 'E020',
    severity: 'error',
    title: 'Unterminated block comment',
    summary: 'A /* comment was never closed with */.',
    explanation:
      'Block comments are a JSONC/JSON5 feature (not standard JSON). When one is opened with /* but never closed, everything after it is swallowed as a comment.',
    example: { bad: '{ /* todo\n"a": 1 }', good: '{ "a": 1 }' },
    fix: 'Close the comment with */, or remove it and parse in JSONC mode if needed.',
  },
  E021: {
    code: 'E021',
    severity: 'error',
    title: 'Comments are not allowed in strict JSON',
    summary: 'A // or /* comment appeared in strict JSON.',
    explanation:
      'Standard JSON has no comments. They are valid in JSONC (used by tsconfig.json, VS Code settings, and similar config files), so switch to JSONC mode if this input is a config file.',
    example: { bad: '{\n  "port": 8080 // dev\n}', good: '{\n  "port": 8080\n}' },
    fix: 'Remove the comment, or enable JSONC mode for config files.',
  },
  E022: {
    code: 'E022',
    severity: 'error',
    title: 'Object keys must be quoted',
    summary: 'An object key was written without double quotes.',
    explanation:
      'In JSON every object key is a double-quoted string. Unquoted keys (and numeric keys) are valid in JavaScript object literals and JSON5, but not in JSON.',
    example: { bad: '{ name: "Ada" }', good: '{ "name": "Ada" }' },
    fix: 'Wrap the key in double quotes.',
  },
  E023: {
    code: 'E023',
    severity: 'error',
    title: 'Expected an object key',
    summary: 'Something other than a key appeared inside an object.',
    explanation:
      'After { or a comma inside an object, the parser expects a quoted key. Finding a colon, bracket, or other token there usually means a key is missing or a stray character slipped in.',
    example: { bad: '{ : "Ada" }', good: '{ "name": "Ada" }' },
    fix: 'Add the missing quoted key before the colon.',
  },
  E024: {
    code: 'E024',
    severity: 'error',
    title: "Expected ':' after object key",
    summary: 'A colon is missing between a key and its value.',
    explanation:
      'Object members are written as "key": value. When the colon is dropped, the parser sees the value directly after the key and cannot pair them.',
    example: { bad: '{ "name" "Ada" }', good: '{ "name": "Ada" }' },
    fix: 'Add a colon between the key and its value.',
  },
  E025: {
    code: 'E025',
    severity: 'error',
    title: 'Leading byte-order mark (BOM)',
    summary: 'The input begins with a UTF-8 BOM.',
    explanation:
      'Some Windows editors (Notepad, PowerShell, Visual Studio) prepend an invisible byte-order mark (U+FEFF) when saving. Strict JSON does not allow it before the first value.',
    example: { bad: '\\uFEFF{ "a": 1 }', good: '{ "a": 1 }' },
    fix: 'Save the file as UTF-8 without BOM, or parse in JSONC mode where it is a warning.',
  },
  E026: {
    code: 'E026',
    severity: 'error',
    title: 'Input is UTF-16/UTF-32 encoded',
    summary: 'The bytes look like UTF-16 or UTF-32, not UTF-8.',
    explanation:
      'JSON should be encoded as UTF-8. Files saved as "Unicode" by some Windows tools are actually UTF-16, which shows up as null bytes between characters and cannot be parsed as UTF-8.',
    example: { bad: '(file saved as UTF-16/"Unicode")', good: '(re-save the file as UTF-8)' },
    fix: 'Re-save or convert the input to UTF-8.',
  },
  E027: {
    code: 'E027',
    severity: 'error',
    title: 'Invalid UTF-8 byte',
    summary: 'A byte in the input is not valid UTF-8.',
    explanation:
      'This usually means Latin-1 or Windows-1252 text (for example a “smart” dash or an accented character) was pasted or read without converting it to UTF-8 first.',
    example: { bad: '(Latin-1 / Windows-1252 bytes)', good: '(re-encode the input as UTF-8)' },
    fix: 'Re-encode the input as UTF-8 before validating.',
  },
  E030: {
    code: 'E030',
    severity: 'error',
    title: 'Language literal is not valid JSON',
    summary: 'A Python/JavaScript literal such as True, None, or undefined was used.',
    explanation:
      'JSON booleans and null are lowercase: true, false, null. Values copied from Python (True, False, None) or JavaScript (undefined) are not valid JSON.',
    example: { bad: '{ "ok": True, "data": None }', good: '{ "ok": true, "data": null }' },
    fix: 'Use lowercase true/false, and null instead of None or undefined.',
  },
  E031: {
    code: 'E031',
    severity: 'error',
    title: 'NaN or Infinity is not valid JSON',
    summary: 'A NaN or Infinity value was used.',
    explanation:
      'JSON has no representation for NaN, Infinity, or -Infinity. They are valid in JSON5 only. Serializers usually emit these by accident when a computation overflows or divides by zero.',
    example: { bad: '{ "amount": Infinity }', good: '{ "amount": null }' },
    fix: 'Replace it with null or a string, or fix the value before serializing.',
  },
  E040: {
    code: 'E040',
    severity: 'error',
    title: 'Maximum nesting depth exceeded',
    summary: 'The JSON is nested more deeply than the parser allows.',
    explanation:
      'To guard against stack-overflow attacks, the engine limits nesting depth (512 levels by default). Legitimate data rarely nests this deeply; hitting the limit often signals a cycle or malformed input.',
    example: { bad: '[[[[[[ … 600 levels … ]]]]]]', good: '(flatten or restructure the data)' },
    fix: 'Reduce the nesting depth, or raise the maxDepth option if the data is genuinely this deep.',
  },
  W001: {
    code: 'W001',
    severity: 'warning',
    title: 'Leading byte-order mark (BOM)',
    summary: 'The input begins with a UTF-8 BOM (allowed in JSONC).',
    explanation:
      'In JSONC mode a leading byte-order mark (U+FEFF) is tolerated rather than rejected, but it is still non-standard and can trip up other parsers downstream.',
    example: { bad: '\\uFEFF{ "a": 1 }', good: '{ "a": 1 }' },
    fix: 'Save the file as UTF-8 without BOM to be safe across all tools.',
  },
  W017: {
    code: 'W017',
    severity: 'warning',
    title: 'Lone surrogate in \\u escape',
    summary: 'A \\u escape encodes half of a surrogate pair.',
    explanation:
      'Characters above U+FFFF are written as two \\u escapes (a surrogate pair). A single, unpaired surrogate is technically accepted by JSON.parse, but the resulting string contains an invalid code unit that many systems will corrupt or reject.',
    example: { bad: '{ "emoji": "\\uD83D" }', good: '{ "emoji": "\\uD83D\\uDE00" }' },
    fix: 'Provide the full surrogate pair, or use the actual Unicode character.',
  },
  W050: {
    code: 'W050',
    severity: 'warning',
    title: 'Integer loses precision',
    summary: 'A large integer exceeds JavaScript’s safe range.',
    explanation:
      'JavaScript numbers are IEEE-754 doubles, so integers beyond 2^53 (9,007,199,254,740,992) cannot be represented exactly. Large IDs such as Twitter/X snowflake IDs silently round to a different value when parsed as numbers.',
    example: {
      bad: '{ "id": 12345678901234567890 }',
      good: '{ "id": "12345678901234567890" }',
    },
    fix: 'Store large IDs as strings, or parse with a lossless-number option.',
  },
  W051: {
    code: 'W051',
    severity: 'warning',
    title: 'Control escape in a Windows path',
    summary: 'An escape like \\t is a control character in what looks like a path.',
    explanation:
      'In a string, \\t is a TAB, \\n a newline, and \\b a backspace — not a backslash followed by a letter. A value like "C:\\temp" therefore contains a tab and a partial path, which is almost never intended.',
    example: { bad: '{ "dir": "C:\\temp" }', good: '{ "dir": "C:\\\\temp" }' },
    fix: 'Double every backslash so the path is literal: C:\\\\temp.',
  },
  W060: {
    code: 'W060',
    severity: 'warning',
    title: 'Duplicate object key',
    summary: 'The same key appears more than once in one object.',
    explanation:
      'JSON does not forbid duplicate keys, but the result is ambiguous: most parsers keep only the last occurrence and silently discard the earlier values. This is almost always a mistake.',
    example: {
      bad: '{ "id": 1, "id": 2 }',
      good: '{ "id": 2 }',
    },
    fix: 'Remove or rename the duplicate so each key appears once.',
  },
};

/** All codes, errors first then warnings, each group in numeric order. */
export function getAllErrorCodes(): ErrorCodeEntry[] {
  return Object.values(ERROR_CODES).sort((a, b) => {
    if (a.severity !== b.severity) return a.severity === 'error' ? -1 : 1;
    return a.code.localeCompare(b.code);
  });
}

/** Case-insensitive lookup; returns null for unknown codes. */
export function getErrorCode(code: string): ErrorCodeEntry | null {
  return ERROR_CODES[code.toUpperCase()] ?? null;
}
