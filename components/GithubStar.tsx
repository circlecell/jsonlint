'use client';

import { useEffect, useState } from 'react';

const REPO = 'toddynho/jsonlint-core';
const CACHE_KEY = 'jl_core_stars';
const TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

function formatStars(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

/**
 * Header "Star on GitHub" button for the open-source engine (@jsonlint/core).
 * Shows a live star count when available, cached in localStorage for 6h to
 * avoid hitting the GitHub API on every page view. Degrades to just "Star"
 * if the count can't be fetched.
 */
export function GithubStar() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const { v, t } = JSON.parse(raw);
        if (typeof v === 'number') setStars(v);
        if (typeof t === 'number' && Date.now() - t < TTL_MS) return;
      }
    } catch {
      /* ignore malformed cache */
    }

    let active = true;
    fetch(`https://api.github.com/repos/${REPO}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (active && d && typeof d.stargazers_count === 'number') {
          setStars(d.stargazers_count);
          try {
            localStorage.setItem(
              CACHE_KEY,
              JSON.stringify({ v: d.stargazers_count, t: Date.now() })
            );
          } catch {
            /* ignore quota errors */
          }
        }
      })
      .catch(() => {
        /* offline / rate-limited — keep whatever we have */
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <a
      href={`https://github.com/${REPO}`}
      target="_blank"
      rel="noopener noreferrer"
      className="hidden sm:inline-flex items-center gap-1.5 pl-2 pr-2.5 py-1.5 rounded-md text-sm transition-colors hover:bg-[var(--bg-tertiary)]"
      style={{
        color: 'var(--text-secondary)',
        border: '1px solid var(--border-primary)',
      }}
      title="Star @jsonlint/core on GitHub"
      aria-label="Star @jsonlint/core on GitHub"
    >
      <GithubIcon className="w-4 h-4" />
      <span>Star</span>
      {stars !== null && (
        <span
          className="font-mono text-xs px-1.5 py-0.5 rounded tabular-nums"
          style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
        >
          {formatStars(stars)}
        </span>
      )}
    </a>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.598 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}
