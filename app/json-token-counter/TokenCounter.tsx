'use client';

import { useState, useCallback, useEffect } from 'react';
import { JsonEditor } from '@/components/JsonEditor';

// Token counting using approximation for client-side
// More accurate than character count, less overhead than full tiktoken
function approximateTokens(text: string): number {
  // GPT tokenization roughly follows:
  // - Average of ~4 characters per token for English text
  // - JSON has more tokens per char due to punctuation
  // - We'll use a more conservative 3.5 chars/token for JSON
  
  // Count special JSON characters that typically get their own token
  const specialChars = (text.match(/[{}\[\]:,"]/g) || []).length;
  
  // Count words/identifiers
  const words = (text.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || []).length;
  
  // Count numbers
  const numbers = (text.match(/-?\d+\.?\d*/g) || []).length;
  
  // Count strings (rough approximation)
  const stringContent = text.replace(/"[^"]*"/g, (match) => {
    // String content: roughly 4 chars per token
    return 'X'.repeat(Math.ceil((match.length - 2) / 4));
  });
  
  // Whitespace is often merged with adjacent tokens
  const significantLength = text.replace(/\s+/g, ' ').length;
  
  // Combine heuristics
  const baseTokens = Math.ceil(significantLength / 3.5);
  const adjustedTokens = Math.max(
    baseTokens,
    specialChars + words + numbers + Math.ceil(stringContent.length / 4)
  );
  
  return adjustedTokens;
}

// More detailed token estimation per model
function estimateTokensByModel(text: string) {
  const baseTokens = approximateTokens(text);
  
  return {
    // GPT-4/GPT-3.5 use cl100k_base encoding
    'gpt-4': baseTokens,
    'gpt-4-turbo': baseTokens,
    'gpt-3.5-turbo': baseTokens,
    // Claude uses a similar but slightly different tokenizer
    'claude-3': Math.round(baseTokens * 0.95), // Claude tends to be slightly more efficient
    'claude-2': Math.round(baseTokens * 0.95),
    // GPT-4o uses o200k_base, slightly more efficient
    'gpt-4o': Math.round(baseTokens * 0.9),
  };
}

interface TokenStats {
  characters: number;
  charactersNoWhitespace: number;
  lines: number;
  tokens: {
    model: string;
    count: number;
    costPer1k?: number;
  }[];
  prettyTokens: number;
  minifiedTokens: number;
  savings: number;
  savingsPercent: number;
}

function calculateStats(input: string): TokenStats | null {
  if (!input.trim()) return null;
  
  let parsed;
  try {
    parsed = JSON.parse(input);
  } catch {
    // Not valid JSON, still calculate basic stats
    const tokens = estimateTokensByModel(input);
    return {
      characters: input.length,
      charactersNoWhitespace: input.replace(/\s/g, '').length,
      lines: input.split('\n').length,
      tokens: [
        { model: 'GPT-4 / GPT-3.5', count: tokens['gpt-4'], costPer1k: 0.03 },
        { model: 'GPT-4o', count: tokens['gpt-4o'], costPer1k: 0.005 },
        { model: 'Claude 3', count: tokens['claude-3'], costPer1k: 0.015 },
      ],
      prettyTokens: tokens['gpt-4'],
      minifiedTokens: tokens['gpt-4'],
      savings: 0,
      savingsPercent: 0,
    };
  }
  
  const pretty = JSON.stringify(parsed, null, 2);
  const minified = JSON.stringify(parsed);
  
  const prettyTokens = estimateTokensByModel(pretty);
  const minifiedTokens = estimateTokensByModel(minified);
  
  const savings = prettyTokens['gpt-4'] - minifiedTokens['gpt-4'];
  const savingsPercent = Math.round((savings / prettyTokens['gpt-4']) * 100);
  
  return {
    characters: input.length,
    charactersNoWhitespace: input.replace(/\s/g, '').length,
    lines: input.split('\n').length,
    tokens: [
      { model: 'GPT-4 / GPT-3.5', count: prettyTokens['gpt-4'], costPer1k: 0.03 },
      { model: 'GPT-4o', count: prettyTokens['gpt-4o'], costPer1k: 0.005 },
      { model: 'Claude 3', count: prettyTokens['claude-3'], costPer1k: 0.015 },
    ],
    prettyTokens: prettyTokens['gpt-4'],
    minifiedTokens: minifiedTokens['gpt-4'],
    savings,
    savingsPercent,
  };
}

const EXAMPLE_JSON = `{
  "users": [
    {
      "id": 1,
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "role": "admin",
      "active": true
    },
    {
      "id": 2,
      "name": "Bob Smith",
      "email": "bob@example.com",
      "role": "user",
      "active": true
    },
    {
      "id": 3,
      "name": "Charlie Brown",
      "email": "charlie@example.com",
      "role": "user",
      "active": false
    }
  ],
  "pagination": {
    "page": 1,
    "perPage": 10,
    "total": 3
  }
}`;

export function TokenCounter() {
  const [input, setInput] = useState(EXAMPLE_JSON);
  const [stats, setStats] = useState<TokenStats | null>(null);
  const [autoUpdate, setAutoUpdate] = useState(true);

  const calculateTokens = useCallback(() => {
    const result = calculateStats(input);
    setStats(result);
  }, [input]);

  // Auto-calculate on input change
  useEffect(() => {
    if (autoUpdate) {
      const timer = setTimeout(calculateTokens, 300);
      return () => clearTimeout(timer);
    }
  }, [input, autoUpdate, calculateTokens]);

  // Initial calculation
  useEffect(() => {
    calculateTokens();
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,350px] gap-4">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              JSON Input
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: 'var(--text-muted)' }}>
                <input
                  type="checkbox"
                  checked={autoUpdate}
                  onChange={(e) => setAutoUpdate(e.target.checked)}
                  className="rounded"
                />
                Auto-update
              </label>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {input.length} chars
              </span>
            </div>
          </div>
          <JsonEditor
            value={input}
            onChange={setInput}
            height="400px"
            language="json"
          />
        </div>

        {/* Stats panel */}
        <div className="space-y-4">
          {/* Main token count */}
          <div
            className="p-4 rounded-lg text-center"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
            }}
          >
            <div className="text-4xl font-bold mb-1" style={{ color: 'var(--accent-blue)' }}>
              {stats?.tokens[0]?.count.toLocaleString() || '—'}
            </div>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Estimated tokens (GPT-4)
            </div>
          </div>

          {/* Token counts by model */}
          <div
            className="p-4 rounded-lg"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
            }}
          >
            <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
              Tokens by Model
            </h3>
            <div className="space-y-2">
              {stats?.tokens.map((t) => (
                <div key={t.model} className="flex items-center justify-between text-sm">
                  <span style={{ color: 'var(--text-secondary)' }}>{t.model}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono" style={{ color: 'var(--text-primary)' }}>
                      {t.count.toLocaleString()}
                    </span>
                    {t.costPer1k && (
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        ~${((t.count / 1000) * t.costPer1k).toFixed(4)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Optimization tip */}
          {stats && stats.savings > 0 && (
            <div
              className="p-4 rounded-lg"
              style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid var(--accent-green)',
              }}
            >
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2" style={{ color: 'var(--accent-green)' }}>
                <TipIcon className="w-4 h-4" />
                Optimization Tip
              </h3>
              <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                Minifying this JSON saves <strong>{stats.savings}</strong> tokens ({stats.savingsPercent}%)
              </p>
              <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span>Pretty: {stats.prettyTokens}</span>
                <span>→</span>
                <span className="font-medium" style={{ color: 'var(--accent-green)' }}>
                  Minified: {stats.minifiedTokens}
                </span>
              </div>
            </div>
          )}

          {/* Character stats */}
          <div
            className="p-4 rounded-lg"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
            }}
          >
            <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
              Character Stats
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="font-mono" style={{ color: 'var(--text-primary)' }}>
                  {stats?.characters.toLocaleString() || '—'}
                </div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Characters
                </div>
              </div>
              <div>
                <div className="font-mono" style={{ color: 'var(--text-primary)' }}>
                  {stats?.charactersNoWhitespace.toLocaleString() || '—'}
                </div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  No whitespace
                </div>
              </div>
              <div>
                <div className="font-mono" style={{ color: 'var(--text-primary)' }}>
                  {stats?.lines || '—'}
                </div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Lines
                </div>
              </div>
              <div>
                <div className="font-mono" style={{ color: 'var(--text-primary)' }}>
                  ~{stats ? Math.round(stats.characters / (stats.tokens[0]?.count || 1) * 10) / 10 : '—'}
                </div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Chars/token
                </div>
              </div>
            </div>
          </div>

          {!autoUpdate && (
            <button
              onClick={calculateTokens}
              className="w-full px-4 py-2 rounded font-medium transition-colors"
              style={{
                background: 'var(--accent-blue)',
                color: 'white',
              }}
            >
              Count Tokens
            </button>
          )}
        </div>
      </div>

      {/* Tips section */}
      <div
        className="p-4 rounded-lg"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
        }}
      >
        <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
          Tips to Reduce Token Usage
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              title: 'Minify JSON',
              desc: 'Remove whitespace for 10-30% savings',
              link: '/json-minify',
            },
            {
              title: 'Shorten keys',
              desc: '"firstName" → "fn" saves tokens',
              link: null,
            },
            {
              title: 'Remove nulls',
              desc: 'Omit null/empty fields when possible',
              link: null,
            },
            {
              title: 'Use arrays',
              desc: 'Arrays use fewer tokens than repeated objects',
              link: null,
            },
          ].map((tip) => (
            <div
              key={tip.title}
              className="p-3 rounded"
              style={{ background: 'var(--bg-primary)' }}
            >
              <div className="font-medium text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                {tip.link ? (
                  <a href={tip.link} className="hover:text-[var(--accent-blue)]">
                    {tip.title} →
                  </a>
                ) : (
                  tip.title
                )}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {tip.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TipIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}
