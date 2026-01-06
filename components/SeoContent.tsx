import Link from 'next/link';

export function SeoContent() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jsonlint.com';

  return (
    <div className="prose-custom mt-8">
      <h2>About the JSONLint Editor</h2>
      <p>
        JSONLint is a validator and reformatter for JSON, a lightweight
        data-interchange format. Copy and paste, directly type, or input a URL
        in the editor above and let JSONLint tidy and validate your messy JSON
        code.
      </p>

      <h2>What Is JSON?</h2>
      <p>
        JSON (pronounced as Jason), stands for &quot;JavaScript Object
        Notation,&quot; is a human-readable and compact solution to represent a
        complex data structure and facilitate data interchange between systems.
        It&apos;s a widespread data format with a diverse range of applications
        enabled by its simplicity and semblance to readable text. As such,
        it&apos;s used by most but not all systems for communicating data.
      </p>

      <h2>Why Use JSON?</h2>
      <p>
        There are several reasons why you should consider using JSON, the key
        reason being that JSON is independent of your system&apos;s programming
        language, despite being derived from JavaScript. Not only is JSON
        language-independent, but it also represents data that speaks common
        elements of many programming languages, effectively making it into a
        universal data representation understood by all systems.
      </p>
      <p>Other reasons include:</p>
      <ul>
        <li>
          Readability – JSON is human-readable, given proper formatting.
        </li>
        <li>
          Compactness – JSON data format doesn&apos;t use a complete markup
          structure, unlike XML.
        </li>
        <li>
          It&apos;s easy to analyze into logical syntactic components,
          especially in JavaScript.
        </li>
        <li>
          Countless JSON libraries are available for most programming languages.
        </li>
      </ul>

      <h2>Proper JSON Format</h2>
      <p>
        Using JSON doesn&apos;t require any JavaScript knowledge, though having
        such would only improve your understanding of JSON. And though the
        knowledge of JavaScript isn&apos;t necessary, following specific rules
        is:
      </p>
      <ul>
        <li>Data is in name/value pairs</li>
        <li>Data is separated by commas</li>
        <li>
          Objects are encapsulated within the opening and closing curly brackets
        </li>
        <li>
          An empty object can be represented by <code>{'{}'}</code>
        </li>
        <li>
          Arrays are encapsulated within opening and closing square brackets
        </li>
        <li>
          An empty array can be represented by <code>[]</code>
        </li>
        <li>
          A member is represented by a key-value pair, contained in double
          quotes
        </li>
        <li>Each member should have a unique key within an object structure</li>
        <li>
          The value of a member must be contained in double quotes, if it&apos;s
          a string
        </li>
        <li>
          Boolean values are represented using the <code>true</code> or{' '}
          <code>false</code> literals in lower case
        </li>
        <li>
          Number values are represented using double-precision floating-point
          format and shouldn&apos;t have leading zeroes
        </li>
        <li>
          &quot;Offensive&quot; characters in a string need to be escaped using
          the backslash character <code>\</code>
        </li>
        <li>
          Null values are represented by the <code>null</code> literal in lower
          case
        </li>
        <li>
          Dates, and similar object types, aren&apos;t adequately supported and
          should be converted to strings
        </li>
        <li>
          Each member of an object or array value must be followed by a comma,
          except for the last one
        </li>
        <li>
          The standard extension for the JSON file is <code>&apos;.json&apos;</code>
        </li>
        <li>
          The mime type for JSON files is <code>&apos;application/json&apos;</code>
        </li>
      </ul>
      <p>
        You can achieve proper JSON formatting by following these simple rules.
        However, if you&apos;re unsure about your code, we suggest using this
        JSONLint Validator and formatter.
      </p>

      <h2>Why Use JSONLint Validator and Formatter?</h2>
      <p>
        Programming can be challenging, as it requires enormous attention and
        excellent knowledge of the programming language, even as simple as JSON.
        Still, writing code is tricky, and finding an error in JSON code can be
        a challenging and time-consuming task.
      </p>
      <p>
        The best way to find and correct errors while simultaneously saving time
        is to use an online tool such as JSONLint. JSONLint will check the
        validity of your JSON code, detect and point out line numbers of the
        code containing errors. It&apos;s an excellent way to correct errors
        without wasting hours finding a missing coma somewhere inside your code.
      </p>

      <h2>How Does A JSONLint Validator Work?</h2>
      <p>
        JSONLint is an online editor, validator, and formatting tool for JSON,
        which allows you to directly type your code, copy and paste it, or input
        a URL containing your code. It will validate your JSON content according
        to JS standards, informing you of every human-made error, which happens
        for a multitude of reasons – one of them being the lack of focus.
      </p>
      <p>
        Using JSONLint, you can quickly find any errors that might&apos;ve
        occurred, allowing you to focus more on the rest of your code than on a
        tiny error itself.
      </p>

      <h2>Tips & Tricks</h2>
      <ul>
        <li>
          You can use a URL and JSONLint will scrape it for JSON and parse it.
          Just structure the link like this, for example:{' '}
          <Link href="/?url=/datasets/programming-languages.json">
            <code>
              {baseUrl}/?url={baseUrl}/datasets/programming-languages.json
            </code>
          </Link>
        </li>
        <li>
          You can provide JSON to lint in the URL if you link to JSONLint with
          the <code>&apos;json&apos;</code> parameter. For example:{' '}
          <Link href="/?json=%7B%22hello%22:%20%22world%22%7D">
            <code>{baseUrl}/?json=%7B%22hello%22:%20%22world%22%7D</code>
          </Link>
          .
        </li>
        <li>
          JSONLint can also be used as a JSON compressor/minifier. Just click on
          the &quot;Compress&quot; button above.
        </li>
      </ul>

      <h2>Common Errors</h2>
      <ul>
        <li>
          Expecting <code>&apos;STRING&apos;</code> - You probably have an extra
          comma at the end of your collection. Something like{' '}
          <code>{`{ "a": "b", }`}</code>
        </li>
        <li>
          Expecting <code>&apos;STRING&apos;</code>, <code>&apos;NUMBER&apos;</code>
          , <code>&apos;NULL&apos;</code>, <code>&apos;TRUE&apos;</code>,{' '}
          <code>&apos;FALSE&apos;</code>, <code>&apos;{`{`}&apos;</code>,{' '}
          <code>&apos;[&apos;</code> - You probably have an extra comma at the
          end of your list. Something like: <code>{`["a", "b", ]`}</code>
        </li>
        <li>
          Enclosing your collection keys in quotes. Proper format for a
          collection is <code>{'{ "key": "value" }'}</code>
        </li>
        <li>
          Make sure you follow{' '}
          <a
            href="http://www.json.org/"
            title="Visit JSON.org to learn more"
            target="_blank"
            rel="noopener"
          >
            JSON&apos;s syntax
          </a>{' '}
          properly. For example, always use double quotes, always quotify your
          keys, and remove all callback functions.
        </li>
      </ul>

      <h2>Different Results</h2>
      <p>
        If you use a Windows computer you may end up with different results.
        This is possibly due to the way Windows handles newlines. Essentially,
        if you have just newline characters <code>(\n)</code> in your JSON and
        paste it into JSONLint from a Windows computer, it may validate it as
        valid erroneously since Windows may need a carriage return{' '}
        <code>(\r)</code> as well to detect newlines properly. As a solution,
        either use direct URL input, or make sure your content&apos;s newlines
        match the architecture your system expects!
      </p>

      <h2>Credits</h2>
      <p>
        Maintained by CircleCell. Thanks to{' '}
        <a href="http://www.crockford.com/" target="_blank" rel="noopener">
          Douglas Crockford
        </a>{' '}
        of JSON and JS Lint, and{' '}
        <a href="http://zaa.ch/" target="_blank" rel="noopener">
          Zach Carter
        </a>
        , who built a{' '}
        <a
          href="https://github.com/zaach/jsonlint"
          target="_blank"
          rel="noopener"
        >
          pure JavaScript implementation
        </a>
        . You can download the{' '}
        <a
          href="https://www.github.com/circlecell/jsonlintdotcom"
          target="_blank"
          rel="noopener"
        >
          JSONLint source code on GitHub
        </a>
        .
      </p>
    </div>
  );
}

export function ToolsSidebar() {
  return (
    <div className="space-y-4">
      {/* More tools */}
      <div
        className="p-4 rounded-lg"
        style={{ background: 'var(--bg-tertiary)' }}
      >
        <h3
          className="font-mono text-xs font-semibold mb-3 flex items-center gap-2"
          style={{ color: 'var(--text-primary)' }}
        >
          <CodeIcon className="w-3.5 h-3.5" />
          More tools from JSONLint
        </h3>
        <ul className="space-y-2 text-sm">
          <li>
            <Link
              href="/xml-to-json"
              className="hover:underline"
              style={{ color: 'var(--accent-blue)' }}
            >
              XML to JSON
            </Link>
          </li>
          <li>
            <Link
              href="/json-stringify"
              className="hover:underline"
              style={{ color: 'var(--accent-blue)' }}
            >
              JSON Stringify
            </Link>
          </li>
          <li>
            <Link
              href="/json-diff"
              className="hover:underline"
              style={{ color: 'var(--accent-blue)' }}
            >
              JSON Diff
            </Link>
          </li>
          <li>
            <Link
              href="/json-schema"
              className="hover:underline"
              style={{ color: 'var(--accent-blue)' }}
            >
              JSON Schema Validator
            </Link>
          </li>
          <li>
            <Link
              href="/json-path"
              className="hover:underline"
              style={{ color: 'var(--accent-blue)' }}
            >
              JSON Path Query
            </Link>
          </li>
        </ul>
      </div>

      {/* Learn more */}
      <div
        className="p-4 rounded-lg"
        style={{ background: 'var(--bg-tertiary)' }}
      >
        <h3
          className="font-mono text-xs font-semibold mb-3 flex items-center gap-2"
          style={{ color: 'var(--text-primary)' }}
        >
          <BookIcon className="w-3.5 h-3.5" />
          Learn more about JSON
        </h3>
        <ul className="space-y-2 text-sm">
          <li>
            <Link
              href="/mastering-json-format"
              className="hover:underline"
              style={{ color: 'var(--accent-blue)' }}
            >
              Mastering JSON Format: Advantages, Best Practices and Comparison
              with Other Data Formats
            </Link>
          </li>
          <li>
            <Link
              href="/common-mistakes-in-json-and-how-to-avoid-them"
              className="hover:underline"
              style={{ color: 'var(--accent-blue)' }}
            >
              Common JSON Mistakes and How to Avoid Them
            </Link>
          </li>
          <li>
            <Link
              href="/mastering-json-in-javascript"
              className="hover:underline"
              style={{ color: 'var(--accent-blue)' }}
            >
              Mastering JSON in JavaScript: Comprehensive Examples and
              Techniques
            </Link>
          </li>
          <li>
            <Link
              href="/benefits-of-using-a-json-beautifier"
              className="hover:underline"
              style={{ color: 'var(--accent-blue)' }}
            >
              Understanding the Benefits of Using a JSON Beautifier
            </Link>
          </li>
          <li>
            <Link
              href="/how-to-open-json-file"
              className="hover:underline"
              style={{ color: 'var(--accent-blue)' }}
            >
              How to open JSON files
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

function CodeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}
