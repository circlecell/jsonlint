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

// Real content-modification date for a file, so `lastModified` reflects
// actual changes rather than the moment the sitemap was regenerated.
// Returns undefined (field omitted) when the file can't be stat'd.
function fileModified(absPath: string): Date | undefined {
  try {
    return fs.statSync(absPath).mtime;
  } catch {
    return undefined;
  }
}

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
    lastModified: fileModified(
      path.join(process.cwd(), 'app', page.replace(/^\//, ''), 'page.tsx')
    ),
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
      lastModified: fileModified(path.join(contentDir, `${slug}.md`)),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  // Dataset pages
  const datasetsDir = path.join(process.cwd(), 'docs/datasets');
  const datasetSlugs = getAllMarkdownSlugs(datasetsDir);
  const datasetEntries: MetadataRoute.Sitemap = datasetSlugs.map((slug) => ({
    url: `${baseUrl}/datasets/${slug}`,
    lastModified: fileModified(path.join(datasetsDir, `${slug}.md`)),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Error-code reference pages
  const errorCodesModified = fileModified(
    path.join(process.cwd(), 'lib/error-codes.ts')
  );
  const errorEntries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/errors`,
      lastModified: errorCodesModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    ...getAllErrorCodes().map((e) => ({
      url: `${baseUrl}/errors/${e.code}`,
      lastModified: errorCodesModified,
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
