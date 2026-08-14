import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import { getAllErrorCodes } from '@/lib/error-codes';

function getAllMarkdownSlugs(dir: string, basePath: string = ''): string[] {
  if (!fs.existsSync(dir)) return [];

  const slugs: string[] = [];
  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const filePath = path.join(dir, item);
    if (fs.statSync(filePath).isDirectory()) {
      slugs.push(...getAllMarkdownSlugs(filePath, `${basePath}${item}/`));
    } else if (item.endsWith('.md')) {
      const slug = `${basePath}${item.replace('.md', '')}`;
      slugs.push(slug);
    }
  });

  return slugs;
}

// NOTE: `lastModified` is intentionally omitted. Filesystem mtimes are reset
// on most deploys (fresh checkout), so stamping them would make every URL
// look freshly modified after each deploy — a worse signal than none. If
// real per-page dates become available (frontmatter or Git), add them here.
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
  const contentSlugs = getAllMarkdownSlugs(contentDir);
  const contentEntries: MetadataRoute.Sitemap = contentSlugs
    .filter((slug) => slug !== 'privacy')
    .map((slug) => ({
      url: `${baseUrl}/${slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  // Dataset pages
  const datasetsDir = path.join(process.cwd(), 'docs/datasets');
  const datasetSlugs = getAllMarkdownSlugs(datasetsDir);
  const datasetEntries: MetadataRoute.Sitemap = datasetSlugs.map((slug) => ({
    url: `${baseUrl}/datasets/${slug}`,
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
