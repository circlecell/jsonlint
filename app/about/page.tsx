import { Metadata } from 'next';
import { ToolNav } from '@/components/ToolNav';

export const metadata: Metadata = {
  title: 'About JSONLint - Todd Garland | JSONLint',
  description:
    'Learn about JSONLint and its creator Todd Garland, founder of BuySellAds and Carbon Ads. Building developer tools since 2010.',
};

export default function AboutPage() {
  return (
    <>
      <ToolNav />

      <div className="py-12 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-3xl mx-auto">
          <h1
            className="text-3xl sm:text-4xl font-bold mb-8"
            style={{ color: 'var(--text-primary)' }}
          >
            About JSONLint
          </h1>

          <div className="prose-custom">
            <p>
              JSONLint is a validator and formatter for JSON, one of the most widely used 
              data formats on the web. I originally acquired JSONLint from its creator and 
              have been building it out ever since — adding the Chrome extension, conversion 
              tools, and a comprehensive suite of JSON utilities.
            </p>

            <h2>About Me</h2>
            
            <p>
              Hi, I'm <strong>Todd Garland</strong>.
            </p>

            <p>
              I'm the founder of{' '}
              <a href="https://buysellads.com" target="_blank" rel="noopener noreferrer">
                BuySellAds
              </a>
              , which I started in 2008 to scratch my own itch with selling sponsorships 
              online. Over the past 17 years, we've helped publishers and creators sell over 
              $500 million in sponsorship revenue. We also run{' '}
              <a href="https://carbonads.net" target="_blank" rel="noopener noreferrer">
                Carbon Ads
              </a>
              , a popular monetization tool on design and developer-focused websites.
            </p>

            <p>
              Before BuySellAds, I was one of the first 10 employees at{' '}
              <a href="https://hubspot.com" target="_blank" rel="noopener noreferrer">
                HubSpot
              </a>
              , where I stayed through their Series B funding. The company went on to do 
              great things (not because of me!), but it was an incredible experience to be 
              in the room so early. I'm proud to call many of the people who built HubSpot 
              into what it is today good friends.
            </p>

            <p>
              In 2018, I started{' '}
              <a href="https://www.cnbc.com/2022/04/27/bitcoin-miner-crusoe-energy-acquires-great-american-mining.html" target="_blank" rel="noopener noreferrer">
                Great American Mining
              </a>
              , a Bitcoin mining company that used stranded natural gas to power mining 
              operations. We were acquired by Crusoe Energy in 2022.
            </p>

            <h2>Technical Interests</h2>
            
            <p>
              When I'm not running BuySellAds, I spend a lot of time working on:
            </p>

            <ul>
              <li>
                <strong>Full-stack development</strong> — Working with React, TypeScript, 
                Python, and modern web technologies
              </li>
              <li>
                <strong>Data analysis</strong> — Building analytics pipelines and working 
                with large datasets
              </li>
              <li>
                <strong>AI and machine learning</strong> — Integrating LLMs into workflows 
                and building intelligent automation
              </li>
            </ul>

            <h2>Why JSONLint?</h2>
            
            <p>
              JSON is everywhere — APIs, configuration files, data storage, and more. Yet 
              debugging JSON errors can be frustrating. A single missing quote or trailing 
              comma can break an entire application, and the error messages from parsers 
              are often cryptic.
            </p>

            <p>
              JSONLint aims to be the most helpful JSON tool on the web. Beyond basic 
              validation, we offer:
            </p>

            <ul>
              <li>Clear, actionable error messages with line numbers</li>
              <li>Automatic formatting and beautification</li>
              <li>Conversion tools for CSV, XML, YAML, Excel, and SQL</li>
              <li>Code generators for TypeScript, Python, Java, Go, and more</li>
              <li>Schema validation and generation</li>
              <li>Diff comparison and path queries</li>
            </ul>

            <p>
              All tools run entirely in your browser — your data never leaves your machine.
            </p>

            <h2>Powered by Modern Tools</h2>
            
            <p>
              JSONLint uses{' '}
              <a href="https://shiki.style/" target="_blank" rel="noopener noreferrer">
                Shiki
              </a>
              {' '}for syntax highlighting — the same TextMate grammar engine that powers 
              VS Code. This gives you accurate, beautiful code highlighting whether you're 
              editing JSON in our validator or reading code examples in our documentation.
            </p>

            <p>
              We've created custom JSONLint themes (dark and light) that provide consistent 
              syntax highlighting across the entire site, from the interactive editor to 
              static code blocks. The color scheme is designed to make JSON structure 
              immediately clear: green for keys, blue for string values, amber for numbers, 
              and purple for booleans and null.
            </p>

            <h2>Get in Touch</h2>
            
            <p>
              Have feedback, suggestions, or found a bug? I'd love to hear from you.
            </p>

            <ul>
              <li>
                <strong>X:</strong>{' '}
                <a href="https://x.com/toddo" target="_blank" rel="noopener noreferrer">
                  @toddo
                </a>
              </li>
              <li>
                <strong>LinkedIn:</strong>{' '}
                <a href="https://linkedin.com/in/toddgarland" target="_blank" rel="noopener noreferrer">
                  linkedin.com/in/toddgarland
                </a>
              </li>
            </ul>

            <p>
              Thanks for using JSONLint. Happy coding!
            </p>

            <p style={{ marginTop: '2rem' }}>
              — Todd
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
