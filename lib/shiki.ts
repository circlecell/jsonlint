import { createHighlighter, type Highlighter, type BundledLanguage } from 'shiki';
import jsonlintDark from './themes/jsonlint-dark.json';
import jsonlintLight from './themes/jsonlint-light.json';

// Supported languages for syntax highlighting
export const SUPPORTED_LANGUAGES: BundledLanguage[] = [
  'json',
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

// Theme type definitions
export type JsonLintTheme = 'jsonlint-dark' | 'jsonlint-light';

// Singleton highlighter instance
let highlighterPromise: Promise<Highlighter> | null = null;

/**
 * Get or create the shared Shiki highlighter instance
 * Uses a singleton pattern for efficiency
 */
export async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [jsonlintDark as unknown as Parameters<typeof createHighlighter>[0]['themes'][number], jsonlintLight as unknown as Parameters<typeof createHighlighter>[0]['themes'][number]],
      langs: SUPPORTED_LANGUAGES,
    });
  }
  return highlighterPromise;
}

/**
 * Highlight code and return HTML string
 */
export async function highlightCode(
  code: string,
  lang: BundledLanguage = 'json',
  theme: JsonLintTheme = 'jsonlint-dark'
): Promise<string> {
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
