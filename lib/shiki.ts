import { createHighlighter, type Highlighter, type BundledLanguage } from 'shiki';
import jsonlintDark from './themes/jsonlint-dark.json';
import jsonlintLight from './themes/jsonlint-light.json';

// Only the languages needed for code generator pages — loaded on demand
export const EXTRA_LANGUAGES: BundledLanguage[] = [
  'javascript',
  'typescript',
  'python',
  'java',
  'go',
  'csharp',
  'bash',
  'xml',
  'yaml',
  'sql',
  'html',
  'css',
  'swift',
  'kotlin',
  'php',
  'rust',
];

// Full list (for reference / backward compat)
export const SUPPORTED_LANGUAGES: BundledLanguage[] = ['json', ...EXTRA_LANGUAGES];

// Theme type definitions
export type JsonLintTheme = 'jsonlint-dark' | 'jsonlint-light';

// Cast themes once to avoid repeating the assertion
const themes = [
  jsonlintDark as unknown as Parameters<typeof createHighlighter>[0]['themes'][number],
  jsonlintLight as unknown as Parameters<typeof createHighlighter>[0]['themes'][number],
];

// Singleton highlighter — starts with only 'json' grammar loaded
let highlighterPromise: Promise<Highlighter> | null = null;

// Track which extra languages have been loaded
const loadedLanguages = new Set<BundledLanguage>(['json']);

/**
 * Get or create the shared Shiki highlighter instance.
 * By default only the 'json' grammar is bundled — call loadLanguage()
 * before highlighting other languages.
 */
export async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes,
      langs: ['json'],
    });
  }
  return highlighterPromise;
}

/**
 * Lazily load an additional language grammar into the shared highlighter.
 * No-ops if the language is already loaded.
 */
export async function loadLanguage(lang: BundledLanguage): Promise<void> {
  if (loadedLanguages.has(lang)) return;
  const highlighter = await getHighlighter();
  await highlighter.loadLanguage(lang);
  loadedLanguages.add(lang);
}

/**
 * Load all supported languages (useful for Monaco integration on tool pages).
 */
export async function loadAllLanguages(): Promise<void> {
  const highlighter = await getHighlighter();
  const toLoad = EXTRA_LANGUAGES.filter(l => !loadedLanguages.has(l));
  if (toLoad.length > 0) {
    await Promise.all(toLoad.map(l => highlighter.loadLanguage(l)));
    toLoad.forEach(l => loadedLanguages.add(l));
  }
}

/**
 * Highlight code and return HTML string
 */
export async function highlightCode(
  code: string,
  lang: BundledLanguage = 'json',
  theme: JsonLintTheme = 'jsonlint-dark'
): Promise<string> {
  await loadLanguage(lang);
  const highlighter = await getHighlighter();
  return highlighter.codeToHtml(code, {
    lang,
    theme,
  });
}

/**
 * Highlight code with dual theme support (for CSS variable-based theme switching)
 */
export async function highlightCodeDualTheme(
  code: string,
  lang: BundledLanguage = 'json'
): Promise<string> {
  await loadLanguage(lang);
  const highlighter = await getHighlighter();
  return highlighter.codeToHtml(code, {
    lang,
    themes: {
      light: 'jsonlint-light',
      dark: 'jsonlint-dark',
    },
    defaultColor: false,
  });
}

// Export theme objects for direct use
export { jsonlintDark, jsonlintLight };
