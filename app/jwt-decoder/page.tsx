import { Metadata } from 'next';
import { ToolNav } from '@/components/ToolNav';
import { JwtDecoder } from './JwtDecoder';

export const metadata: Metadata = {
  title: 'JWT Decoder - Decode JSON Web Tokens Online | JSONLint',
  description:
    'Decode and inspect JWT tokens instantly. View header, payload, and check expiration status. Free online JWT decoder tool.',
};

export default function JwtDecoderPage() {
  return (
    <>
      <ToolNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-4 flex justify-center">
          <div id="bsa-zone_1570746984891-3_123456"></div>
        </div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          JWT Decoder
        </h1>
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
          Decode and inspect JSON Web Tokens. Paste your JWT below to view the header and payload:
        </p>

        <JwtDecoder />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6 mt-8">
          <div className="prose-custom">
            <h2>What is a JWT?</h2>
            <p>
              JSON Web Token (JWT) is a compact, URL-safe way to represent claims between two parties. 
              JWTs are commonly used for authentication and authorization in web applications and APIs.
            </p>

            <h2>JWT Structure</h2>
            <p>A JWT consists of three parts separated by dots:</p>
            <pre><code>header.payload.signature</code></pre>
            
            <table>
              <thead>
                <tr>
                  <th>Part</th>
                  <th>Contents</th>
                  <th>Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Header</strong></td>
                  <td>Algorithm, token type</td>
                  <td>Describes how the token is signed</td>
                </tr>
                <tr>
                  <td><strong>Payload</strong></td>
                  <td>Claims (user data)</td>
                  <td>Contains the actual data/claims</td>
                </tr>
                <tr>
                  <td><strong>Signature</strong></td>
                  <td>Encrypted hash</td>
                  <td>Verifies the token is authentic</td>
                </tr>
              </tbody>
            </table>

            <h2>Common JWT Claims</h2>
            <p>The payload typically contains these standard claims:</p>
            <table>
              <thead>
                <tr>
                  <th>Claim</th>
                  <th>Name</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>sub</code></td>
                  <td>Subject</td>
                  <td>Who the token is about (usually user ID)</td>
                </tr>
                <tr>
                  <td><code>iat</code></td>
                  <td>Issued At</td>
                  <td>When the token was created (Unix timestamp)</td>
                </tr>
                <tr>
                  <td><code>exp</code></td>
                  <td>Expiration</td>
                  <td>When the token expires (Unix timestamp)</td>
                </tr>
                <tr>
                  <td><code>iss</code></td>
                  <td>Issuer</td>
                  <td>Who issued the token</td>
                </tr>
                <tr>
                  <td><code>aud</code></td>
                  <td>Audience</td>
                  <td>Intended recipient of the token</td>
                </tr>
              </tbody>
            </table>

            <h2>Security Considerations</h2>
            <p>
              <strong>Important:</strong> This tool decodes JWTs but does not verify signatures. 
              Anyone can decode a JWT and read its contents — the signature only prevents tampering.
            </p>
            <ul>
              <li>Never trust a JWT without verifying its signature on your server</li>
              <li>Don&apos;t store sensitive data in JWT payloads (they&apos;re not encrypted)</li>
              <li>Always check the <code>exp</code> claim to reject expired tokens</li>
              <li>Validate the <code>iss</code> and <code>aud</code> claims match expected values</li>
            </ul>

            <h2>JWT vs Session Cookies</h2>
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>JWT</th>
                  <th>Session Cookie</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Storage</td>
                  <td>Client-side</td>
                  <td>Server-side</td>
                </tr>
                <tr>
                  <td>Scalability</td>
                  <td>Stateless, easy to scale</td>
                  <td>Requires session store</td>
                </tr>
                <tr>
                  <td>Revocation</td>
                  <td>Harder (needs blocklist)</td>
                  <td>Easy (delete session)</td>
                </tr>
                <tr>
                  <td>Size</td>
                  <td>Larger (contains data)</td>
                  <td>Small (just an ID)</td>
                </tr>
              </tbody>
            </table>

            <h2>Working with JWTs in Code</h2>
            
            <h3>JavaScript</h3>
            <pre><code>{`// Decode without verifying (like this tool)
function decodeJWT(token) {
  const payload = token.split('.')[1];
  return JSON.parse(atob(payload));
}

// With a library (recommended for verification)
import jwt from 'jsonwebtoken';
const decoded = jwt.verify(token, secretKey);`}</code></pre>

            <h3>Python</h3>
            <pre><code>{`import jwt

# Decode without verifying
decoded = jwt.decode(token, options={"verify_signature": False})

# Decode with verification
decoded = jwt.decode(token, secret_key, algorithms=["HS256"])`}</code></pre>

            <h2>Related Tools</h2>
            <ul>
              <li><a href="/json-base64">Base64 Encode/Decode</a> — Encode or decode Base64 data</li>
              <li><a href="/">JSON Validator</a> — Validate JSON syntax</li>
              <li><a href="/json-pretty-print">JSON Pretty Print</a> — Format JSON for readability</li>
            </ul>

            <h2>Frequently Asked Questions</h2>
            
            <h3>Is it safe to decode a JWT in the browser?</h3>
            <p>
              Yes, decoding is safe. JWTs are not encrypted — they&apos;re just Base64-encoded. 
              The signature protects against tampering, not reading. Never put sensitive 
              information in a JWT that you wouldn&apos;t want users to see.
            </p>

            <h3>Why does my JWT show as expired?</h3>
            <p>
              The <code>exp</code> claim is a Unix timestamp. If the current time is past this 
              value, the token is expired. Tokens typically expire in minutes to hours for security.
            </p>

            <h3>Can I verify the signature with this tool?</h3>
            <p>
              No. Signature verification requires the secret key or public key used to sign the token, 
              which should never be shared publicly. Use server-side code to verify signatures.
            </p>
          </div>
          
          <aside className="hidden lg:block">
            <div id="bsa-zone_1605730077127-6_123456"></div>
          </aside>
        </div>
      </div>
    </>
  );
}
