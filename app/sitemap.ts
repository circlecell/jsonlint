import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getAllErrorCodes } from '@/lib/error-codes';

interface MarkdownPage {
  slug: string;
  updated?: string;
}

function getAllMarkdownPages(dir: string, basePath: string = ''): MarkdownPage[] {
  if (!fs.existsSync(dir)) return [];

  const pages: MarkdownPage[] = [];
  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const filePath = path.join(dir, item);
    if (fs.statSync(filePath).isDirectory()) {
      pages.push(...getAllMarkdownPages(filePath, `${basePath}${item}/`));
    } else if (item.endsWith('.md')) {
      const slug = `${basePath}${item.replace('.md', '')}`;
      const { data } = matter(fs.readFileSync(filePath, 'utf8'));
      pages.push({
        slug,
        updated: typeof data.updated === 'string' ? data.updated : undefined,
      });
    }
  });

  return pages;
}

// Article last-modified dates come from explicit frontmatter. Filesystem mtimes
// are intentionally ignored because fresh deploys reset them.
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://jsonlint.com';

  // Static pages
  const staticPages = [
    '',
    '/about',
    '/learn',
    '/datasets',
    '/tools',
    '/pro',
    '/json-formatter',
    '/json-formatter/chrome-extension',
    '/json-minify',
    '/json-diff',
    '/json-repair',
    '/json-search',
    '/json-schema',
    '/json-schema-generator',
    '/json-error-analyzer',
    '/json-size-analyzer',
    '/json-token-counter',
    '/json-path',
    '/json-tree',
    '/json-sort',
    '/json-flatten',
    '/json-escape',
    '/json-unescape',
    '/json-stringify',
    '/json-pretty-print',
    '/json-to-csv',
    '/json-to-excel',
    '/json-to-yaml',
    '/json-to-xml',
    '/json-to-table',
    '/json-to-typescript',
    '/json-to-python',
    '/json-to-java',
    '/json-to-csharp',
    '/json-to-go',
    '/json-to-rust',
    '/json-to-swift',
    '/json-to-kotlin',
    '/json-to-php',
    '/json-to-sql',
    '/json-to-markdown',
    '/json-base64',
    '/jwt-decoder',
    '/csv-to-json',
    '/xml-to-json',
    '/yaml-to-json',
    '/sql-to-json',
    '/excel-to-json',
    '/jsonc-to-json',
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${baseUrl}${page}`,
    changeFrequency: page === '' ? 'daily' : 'weekly',
    priority: page === '' ? 1 : page.includes('json-to-') ? 0.8 : 0.9,
  }));

  // Content pages
  const contentDir = path.join(process.cwd(), 'docs/content/completed');
  const contentPages = getAllMarkdownPages(contentDir);
  const contentEntries: MetadataRoute.Sitemap = contentPages
    .filter((page) => page.slug !== 'privacy')
    .map((page) => ({
      url: `${baseUrl}/${page.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      ...(page.updated ? { lastModified: page.updated } : {}),
    }));

  // Dataset pages
  const datasetsDir = path.join(process.cwd(), 'docs/datasets');
  const datasetPages = getAllMarkdownPages(datasetsDir);
  const datasetEntries: MetadataRoute.Sitemap = datasetPages.map((page) => ({
    url: `${baseUrl}/datasets/${page.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Error-code reference pages
  const errorEntries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/errors`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    ...getAllErrorCodes().map((e) => ({
      url: `${baseUrl}/errors/${e.code}`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];

  return [
    ...staticEntries,
    ...contentEntries,
    ...datasetEntries,
    ...errorEntries,
  ];
}
