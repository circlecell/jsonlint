import { Metadata } from 'next';
import { ToolNav } from '@/components/ToolNav';
import { Container } from '@/components/Container';
import { TokenCounter } from './TokenCounter';

export const metadata: Metadata = {
  title: 'JSON Token Counter - Count Tokens for GPT & Claude | JSONLint',
  description:
    'Count tokens in JSON for OpenAI GPT-4, GPT-3.5, and Anthropic Claude. Optimize your prompts and reduce API costs with token-aware JSON formatting.',
  keywords: [
    'json token counter',
    'gpt token count',
    'claude tokens',
    'openai tokens',
    'llm token calculator',
    'tiktoken',
    'token optimizer',
    'api cost calculator',
    'chatgpt tokens',
    'anthropic tokens',
  ],
  openGraph: {
    title: 'JSON Token Counter for LLMs',
    description: 'Count and optimize JSON tokens for GPT-4, Claude, and other LLMs.',
  },
};

export default function TokenCounterPage() {
  return (
    <>
      <ToolNav />

      <Container className="py-4">
        <div className="mb-4 flex justify-center">
          <div id="bsa-zone_1570746984891-3_123456"></div>
        </div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          JSON Token Counter
        </h1>
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
          Count tokens in your JSON for GPT-4, GPT-3.5, Claude, and other LLMs. 
          Optimize your context window and reduce API costs.
        </p>

        <TokenCounter />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6 mt-8">
          <div className="prose-custom">
            <h2>Why Token Counting Matters</h2>
            <p>
              Large Language Models like GPT-4 and Claude charge by the token, not by character 
              or word. Understanding how your JSON translates to tokens helps you:
            </p>
            <ul>
              <li><strong>Stay within context limits</strong> — GPT-4 has 8K-128K token limits</li>
              <li><strong>Reduce API costs</strong> — Fewer tokens = lower bills</li>
              <li><strong>Optimize prompts</strong> — More room for your actual question</li>
              <li><strong>Improve response quality</strong> — Less noise in the context</li>
            </ul>

            <h2>What is a Token?</h2>
            <p>
              Tokens are the basic units that LLMs process. They're not quite characters and 
              not quite words — they're somewhere in between:
            </p>
            <ul>
              <li><code>"hello"</code> = 1 token</li>
              <li><code>"Hello, world!"</code> = 4 tokens</li>
              <li><code>{`{"name": "John"}`}</code> = ~7 tokens</li>
            </ul>
            <p>
              JSON tends to use more tokens per character than plain English because of all 
              the punctuation (<code>{`{} [] : , ""`}</code>).
            </p>

            <h2>Token Limits by Model</h2>
            <table>
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Context Window</th>
                  <th>Output Limit</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>GPT-4 Turbo</td>
                  <td>128,000 tokens</td>
                  <td>4,096 tokens</td>
                </tr>
                <tr>
                  <td>GPT-4</td>
                  <td>8,192 tokens</td>
                  <td>4,096 tokens</td>
                </tr>
                <tr>
                  <td>GPT-4o</td>
                  <td>128,000 tokens</td>
                  <td>16,384 tokens</td>
                </tr>
                <tr>
                  <td>GPT-3.5 Turbo</td>
                  <td>16,384 tokens</td>
                  <td>4,096 tokens</td>
                </tr>
                <tr>
                  <td>Claude 3 Opus</td>
                  <td>200,000 tokens</td>
                  <td>4,096 tokens</td>
                </tr>
                <tr>
                  <td>Claude 3 Sonnet</td>
                  <td>200,000 tokens</td>
                  <td>4,096 tokens</td>
                </tr>
              </tbody>
            </table>

            <h2>Optimizing JSON for Tokens</h2>
            
            <h3>1. Minify Your JSON</h3>
            <p>
              Removing whitespace typically saves 10-30% of tokens:
            </p>
            <pre><code>{`// Before: ~50 tokens
{
  "user": {
    "name": "Alice",
    "email": "alice@example.com"
  }
}

// After: ~35 tokens
{"user":{"name":"Alice","email":"alice@example.com"}}`}</code></pre>
            <p>
              Use our <a href="/json-minify">JSON Minify tool</a> to compress your JSON.
            </p>

            <h3>2. Shorten Key Names</h3>
            <p>
              Long, descriptive keys are great for readability but costly for tokens:
            </p>
            <pre><code>{`// Before
{"firstName": "Alice", "lastName": "Smith", "emailAddress": "alice@example.com"}

// After (saves ~30% tokens)
{"fn": "Alice", "ln": "Smith", "email": "alice@example.com"}`}</code></pre>
            <p>
              Consider using a key mapping in your prompt to maintain clarity.
            </p>

            <h3>3. Remove Null/Empty Values</h3>
            <p>
              Null values and empty strings still cost tokens:
            </p>
            <pre><code>{`// Before
{"name": "Alice", "middleName": null, "nickname": ""}

// After
{"name": "Alice"}`}</code></pre>

            <h3>4. Use Arrays for Repeated Structures</h3>
            <p>
              When you have many similar objects, consider a more compact format:
            </p>
            <pre><code>{`// Before: Array of objects
[{"name": "Alice", "age": 30}, {"name": "Bob", "age": 25}]

// After: Separate arrays (fewer repeated keys)
{"names": ["Alice", "Bob"], "ages": [30, 25]}`}</code></pre>

            <h3>5. Consider Alternative Formats</h3>
            <p>
              For very large datasets, consider:
            </p>
            <ul>
              <li><strong>CSV format</strong> — Much more token-efficient for tabular data</li>
              <li><strong>YAML</strong> — Slightly more efficient than JSON</li>
              <li><strong>Custom formats</strong> — Define your own compact syntax</li>
            </ul>

            <h2>Programmatic Token Counting</h2>
            
            <h3>JavaScript/TypeScript</h3>
            <pre><code>{`// Using tiktoken (official OpenAI tokenizer)
import { encoding_for_model } from 'tiktoken';

const encoder = encoding_for_model('gpt-4');
const tokens = encoder.encode(JSON.stringify(data));
console.log('Token count:', tokens.length);
encoder.free(); // Don't forget to free memory`}</code></pre>

            <h3>Python</h3>
            <pre><code>{`import tiktoken
import json

encoder = tiktoken.encoding_for_model("gpt-4")
tokens = encoder.encode(json.dumps(data))
print(f"Token count: {len(tokens)}")`}</code></pre>

            <h2>Cost Comparison</h2>
            <p>
              Here's how token counts affect your API costs (as of 2024):
            </p>
            <table>
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Input Cost</th>
                  <th>Output Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>GPT-4 Turbo</td>
                  <td>$0.01/1K tokens</td>
                  <td>$0.03/1K tokens</td>
                </tr>
                <tr>
                  <td>GPT-4o</td>
                  <td>$0.005/1K tokens</td>
                  <td>$0.015/1K tokens</td>
                </tr>
                <tr>
                  <td>GPT-3.5 Turbo</td>
                  <td>$0.0005/1K tokens</td>
                  <td>$0.0015/1K tokens</td>
                </tr>
                <tr>
                  <td>Claude 3 Opus</td>
                  <td>$0.015/1K tokens</td>
                  <td>$0.075/1K tokens</td>
                </tr>
                <tr>
                  <td>Claude 3 Sonnet</td>
                  <td>$0.003/1K tokens</td>
                  <td>$0.015/1K tokens</td>
                </tr>
              </tbody>
            </table>

            <h2>Related Tools</h2>
            <ul>
              <li><a href="/json-minify">JSON Minify</a> — Compress JSON to save tokens</li>
              <li><a href="/json-repair">JSON Repair</a> — Fix malformed LLM JSON output</li>
              <li><a href="/">JSON Validator</a> — Validate JSON before sending to LLMs</li>
              <li><a href="/json-pretty-print">JSON Pretty Print</a> — Format JSON for readability</li>
            </ul>

            <h2>Frequently Asked Questions</h2>
            
            <h3>Why do different models have different token counts?</h3>
            <p>
              Each model family uses a different tokenizer. GPT-4 and GPT-3.5 use <code>cl100k_base</code>, 
              while GPT-4o uses the newer <code>o200k_base</code> which is more efficient. Claude 
              uses its own tokenizer with slightly different characteristics.
            </p>

            <h3>Is the token count exact?</h3>
            <p>
              This tool provides estimates based on the tokenization algorithms. For production 
              use, consider using the official tiktoken library for exact counts. Our estimates 
              are typically within 5-10% of the actual count.
            </p>

            <h3>Do whitespace tokens cost money?</h3>
            <p>
              Yes! Every token costs the same, whether it's meaningful content or whitespace. 
              That's why minifying JSON can significantly reduce costs for large payloads.
            </p>

            <h3>Should I always minify JSON for LLMs?</h3>
            <p>
              Not necessarily. For small payloads, the token savings are minimal and formatted 
              JSON may help the model understand the structure better. For large payloads 
              (1000+ tokens), minification is usually worth it.
            </p>
          </div>
          
          <aside className="hidden lg:block">
            <div id="bsa-zone_1605730077127-6_123456"></div>
          </aside>
        </div>
      </Container>
    </>
  );
}
