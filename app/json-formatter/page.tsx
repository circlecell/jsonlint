import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'JSON Formatter For Chrome',
  description:
    'Turn tedious JSON data into a visually intuitive, interactive experience with our JSON Formatter. Featuring color-coded formatting, image previews, clickable URLs, and easy navigation.',
};

export default function JsonFormatterPage() {
  return (
    <div style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
        {/* Logos */}
        <div className="flex items-center justify-center gap-6 mb-10">
          <div 
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-12 h-12 sm:w-14 sm:h-14 text-accent-green"
            >
              <path d="M18.571 20C19.833 20 20.857 18.977 20.857 17.714V13.143L22 12L20.857 10.857V6.286C20.857 5.023 19.834 4 18.571 4" />
              <path d="M5.429 4C4.166 4 3.143 5.023 3.143 6.286V10.857L2 12L3.143 13.143V17.714C3.143 18.977 4.166 20 5.429 20" />
              <circle cx="7.5" cy="12" r="0.5" fill="currentColor" />
              <circle cx="12" cy="12" r="0.5" fill="currentColor" />
              <circle cx="16.5" cy="12" r="0.5" fill="currentColor" />
            </svg>
          </div>
          <span
            className="text-3xl sm:text-4xl font-light"
            style={{ color: 'var(--text-muted)' }}
          >
            +
          </span>
          <img
            src="/images/chrome.svg"
            height="100"
            width="100"
            alt="Chrome Logo"
            className="w-20 h-20 sm:w-24 sm:h-24"
          />
        </div>

        <h1
          className="text-4xl sm:text-5xl font-bold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          JSON Formatter for Chrome
        </h1>

        <p
          className="text-xl mb-10"
          style={{ color: 'var(--text-secondary)' }}
        >
          Turn tedious JSON data into a visually intuitive, interactive
          experience.
        </p>

        <Link
          href="https://chrome.google.com/webstore/detail/json-formatter/ondecobpcidaehknoegeapmclapnkgcl"
          target="_blank"
          className="btn btn-primary text-lg px-8 py-4"
        >
          Install (free!)
        </Link>

        {/* Features grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-16 text-left">
          {[
            { emoji: '🌟', text: 'Intuitive Visualization' },
            { emoji: '🖼️', text: 'Image Previews' },
            { emoji: '🔍', text: 'Collapsible trees / indent guides' },
            { emoji: '🔗', text: 'Clickable URLs' },
            { emoji: '⏳', text: 'Human-Readable Timestamps' },
            { emoji: '🔄', text: 'Toggle between raw/formatted' },
            { emoji: '📤', text: 'Export to JSONLint' },
            { emoji: '🛡️', text: 'Safe and Respectful' },
          ].map((feature) => (
            <div
              key={feature.text}
              className="flex items-center gap-2 p-3 rounded-lg"
              style={{ background: 'var(--bg-secondary)' }}
            >
              <span className="text-xl">{feature.emoji}</span>
              <span
                className="text-sm"
                style={{ color: 'var(--text-primary)' }}
              >
                {feature.text}
              </span>
            </div>
          ))}
        </div>

        {/* Screenshots carousel placeholder */}
        <div
          className="mt-12 p-8 rounded-lg"
          style={{ background: 'var(--bg-secondary)' }}
        >
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[1, 2, 3, 4].map((num) => (
              <img
                key={num}
                src={`/images/formatter/${num}.png`}
                alt={`JSON Formatter Screenshot ${num}`}
                className="rounded-lg w-full max-w-md flex-shrink-0"
              />
            ))}
          </div>
        </div>

        {/* Description */}
        <div
          className="prose-custom text-left max-w-2xl mx-auto mt-12"
          style={{ color: 'var(--text-secondary)' }}
        >
          <p>
            When you encounter raw JSON data, it&apos;s often just an
            overwhelming wall of text. Navigating this maze can be tedious and
            error-prone. But with the enhanced JSON Formatter, you can now
            visualize, understand, and interact with JSON in ways you never
            imagined.
          </p>

          <h3 style={{ color: 'var(--text-primary)' }}>
            Why Choose JSON Formatter?
          </h3>

          <p>
            🌟 <strong>Intuitive Visualization</strong>: Not only does our
            extension decode raw JSON to present it in a beautifully structured
            format, but it also detects colors and shows a small color swatch.
            With clear indentations, color-coded elements, and organized blocks,
            you can discern different components at a glance.
          </p>

          <p>
            🖼️ <strong>Image Previews</strong>: Whenever images are detected
            within your JSON data, JSON Formatter will provide a handy preview,
            making your data more interactive and easier to understand.
          </p>

          <p>
            🔍 <strong>Effortless Navigation</strong>: Dive deep into nested
            structures with our collapsible trees and indent guides. And with
            the added feature of human-readable timestamps, understanding your
            data&apos;s timeline becomes a breeze.
          </p>

          <p>
            🔗 <strong>Clickable URLs</strong>: Found a link within your JSON?
            It&apos;s now instantly clickable! No more copy-pasting. This
            streamlines your workflow and saves you time.
          </p>

          <p>
            ⏳ <strong>Human-Readable Timestamps</strong>: No more puzzling over
            cryptic timestamps. Our extension now converts them into a format
            that&apos;s easy to understand.
          </p>

          <p>
            🔄 <strong>Toggle with Ease</strong>: Whether you need the original
            data or the formatted version, effortlessly switch between raw and
            parsed views with a simple click.
          </p>

          <p>
            📤 <strong>Export to jsonlint.com</strong>: Want to edit your JSON?
            Easily export it to jsonlint.com and make your modifications there.
          </p>

          <p>
            🛡️ <strong>Safe and Respectful</strong>: We prioritize your privacy.
            Our extension operates client-side, ensuring your data never leaves
            your browser. No tracking, no data collection, just pure JSON magic.
          </p>

          <h3 style={{ color: 'var(--text-primary)' }}>
            Speed Up Your Development Workflow
          </h3>

          <p>
            For developers, every second counts. Why squint at unformatted JSON
            when you can view, interact, and even edit it seamlessly? With JSON
            Formatter, you&apos;re not just reading data; you&apos;re
            experiencing it. Whether you&apos;re debugging, analyzing, or just
            curious, our tool is designed to speed up your workflow.
          </p>

          <p>Install JSON Formatter today and transform chaos into clarity!</p>
        </div>

        <Link
          href="https://chrome.google.com/webstore/detail/json-formatter/ondecobpcidaehknoegeapmclapnkgcl"
          target="_blank"
          className="btn btn-primary text-lg px-8 py-4 mt-12 inline-flex"
        >
          Install (free!)
        </Link>
      </div>
    </div>
  );
}
