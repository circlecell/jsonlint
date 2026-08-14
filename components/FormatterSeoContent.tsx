import Link from 'next/link';

export function FormatterSeoContent() {
  return (
    <section className="prose-custom mt-8">
      <h2>Format and Beautify JSON Online</h2>
      <p>
        The JSONLint formatter turns compact or inconsistently indented JSON into a
        readable document. It preserves the data while adding predictable whitespace,
        line breaks, and indentation so nested objects and arrays are easier to inspect.
        Everything runs in your browser, so the JSON you paste is not uploaded for
        server-side formatting.
      </p>

      <h2>How to Use the JSON Formatter</h2>
      <ol>
        <li>Paste or type JSON in the editor above.</li>
        <li>Select <strong>Validate</strong> to check the syntax before formatting.</li>
        <li>
          Select <strong>Prettify</strong> to add indentation, or choose{' '}
          <strong>Compress</strong> to remove unnecessary whitespace.
        </li>
        <li>Optionally sort object keys, then copy the formatted result.</li>
      </ol>
      <p>
        You can also press <kbd>Ctrl</kbd>/<kbd>Cmd</kbd> + <kbd>Enter</kbd> to
        validate and <kbd>Ctrl</kbd>/<kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>F</kbd>
        to format valid JSON.
      </p>

      <h2>JSON Formatter vs. Related Tools</h2>
      <table>
        <thead>
          <tr>
            <th>Tool</th>
            <th>Best for</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>JSON Formatter</td>
            <td>Validating and reformatting JSON in one editor</td>
          </tr>
          <tr>
            <td><Link href="/json-pretty-print">JSON Pretty Print</Link></td>
            <td>Viewing input and formatted output side by side</td>
          </tr>
          <tr>
            <td><Link href="/json-minify">JSON Minifier</Link></td>
            <td>Producing the smallest valid JSON representation</td>
          </tr>
          <tr>
            <td><Link href="/json-repair">JSON Repair</Link></td>
            <td>Fixing common syntax mistakes in invalid JSON</td>
          </tr>
        </tbody>
      </table>

      <h2>Formatting Does Not Change JSON Values</h2>
      <p>
        Beautifying JSON changes whitespace, not the underlying strings, numbers,
        booleans, arrays, objects, or null values. Object keys are sorted only when you
        explicitly select that option. Because JSON objects are unordered by the
        specification, sorting keys can make configuration files and API responses
        easier to compare without changing their meaning.
      </p>

      <h2>What If the JSON Is Invalid?</h2>
      <p>
        A formatter must parse the document before it can safely rewrite it. If parsing
        fails, JSONLint reports the relevant line and column and provides diagnostic
        error codes. For malformed documents, try the <Link href="/json-repair">JSON
        repair tool</Link> or use the <Link href="/json-error-analyzer">JSON error
        analyzer</Link> to understand the failure before formatting again.
      </p>

      <h2>Common Uses for Formatted JSON</h2>
      <ul>
        <li>Reading API responses and webhook payloads</li>
        <li>Reviewing configuration files and package metadata</li>
        <li>Finding misplaced brackets, commas, or nested values</li>
        <li>Preparing fixtures and examples for documentation</li>
        <li>Creating stable, readable diffs for code review</li>
      </ul>

      <h2>Explore Formatted JSON</h2>
      <p>
        After formatting, open the <Link href="/json-tree">online JSON tree
        viewer</Link> to expand and collapse nested values, use the{' '}
        <Link href="/json-path">JSONPath finder</Link> to extract matching data, or
        <Link href="/json-diff"> compare JSON documents</Link> side by side.
      </p>
    </section>
  );
}
