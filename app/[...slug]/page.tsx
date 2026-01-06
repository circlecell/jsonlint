import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeShiki from '@shikijs/rehype';
import rehypeStringify from 'rehype-stringify';
import { Metadata } from 'next';
import { ArticlePageClient } from './ArticlePageClient';
import { DatasetPageClient } from './DatasetPageClient';

// Import theme JSON files directly for server-side rendering
import jsonlintDark from '@/lib/themes/jsonlint-dark.json';
import jsonlintLight from '@/lib/themes/jsonlint-light.json';

// Content directories
const contentDirectory = path.join(process.cwd(), 'docs/content/completed');
const datasetsDirectory = path.join(process.cwd(), 'docs/datasets');

function getAllMarkdownFiles(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;
  
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      fileList = getAllMarkdownFiles(filePath, fileList);
    } else if (file.endsWith('.md')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

export async function generateStaticParams() {
  const slugs: { slug: string[] }[] = [];
  
  // Get content articles
  const contentFiles = getAllMarkdownFiles(contentDirectory);
  contentFiles.forEach((file) => {
    const relativePath = path.relative(contentDirectory, file);
    const slug = relativePath.replace('.md', '').split(path.sep);
    slugs.push({ slug });
  });
  
  // Get datasets
  const datasetFiles = getAllMarkdownFiles(datasetsDirectory);
  datasetFiles.forEach((file) => {
    const relativePath = path.relative(datasetsDirectory, file);
    const slug = ['datasets', ...relativePath.replace('.md', '').split(path.sep)];
    slugs.push({ slug });
  });

  return slugs;
}

// Get all articles for related content
function getAllArticles(): { slug: string; title: string; description: string }[] {
  const contentFiles = getAllMarkdownFiles(contentDirectory);
  const articles: { slug: string; title: string; description: string }[] = [];

  contentFiles.forEach((filePath) => {
    const relativePath = path.relative(contentDirectory, filePath);
    const slug = relativePath.replace('.md', '').replace(/\\/g, '/');
    
    // Skip privacy page
    if (slug === 'privacy') return;
    
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);
    
    articles.push({
      slug,
      title: data.title || slug,
      description: data.description || '',
    });
  });

  return articles;
}

// Get all datasets for the sidebar
function getAllDatasets(): { slug: string; name: string }[] {
  if (!fs.existsSync(datasetsDirectory)) return [];
  
  const datasetFiles = getAllMarkdownFiles(datasetsDirectory);
  
  return datasetFiles.map((filePath) => {
    const relativePath = path.relative(datasetsDirectory, filePath);
    const slug = relativePath.replace('.md', '').replace(/\\/g, '/');
    const name = slug
      .split('/')
      .pop()!
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    return { slug, name };
  });
}

async function getMarkdownContent(slug: string[]) {
  const slugPath = slug.join('/');
  const isDatasetPage = slug[0] === 'datasets';
  
  let fullPath: string;
  if (isDatasetPage) {
    // Dataset pages: /datasets/foo -> docs/datasets/foo.md
    const datasetSlug = slug.slice(1).join('/');
    fullPath = path.join(datasetsDirectory, `${datasetSlug}.md`);
  } else {
    // Content pages: /foo -> docs/content/completed/foo.md
    fullPath = path.join(contentDirectory, `${slugPath}.md`);
  }

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jsonlint.com';
  const contentWithEnv = content.replace(/%%NEXT_PUBLIC_BASE_URL%%/g, baseUrl);
  
  // Process markdown with Shiki syntax highlighting
  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeShiki, {
      themes: {
        light: jsonlintLight,
        dark: jsonlintDark,
      },
      defaultColor: false,
    } as any)
    .use(rehypeStringify)
    .process(contentWithEnv);
  let contentHtml = processedContent.toString();
  
  // Add IDs to headings for anchor links
  let headingCounter = 0;
  contentHtml = contentHtml.replace(/<(h[23])>(.*?)<\/\1>/gi, (match, tag, innerContent) => {
    const id = innerContent
      .toLowerCase()
      .replace(/<[^>]+>/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    headingCounter++;
    return `<${tag} id="${id || `heading-${headingCounter}`}">${innerContent}</${tag}>`;
  });

  // Calculate reading time
  const text = contentHtml.replace(/<[^>]+>/g, '');
  const words = text.split(/\s+/).length;
  const readingTime = Math.ceil(words / 200);

  return {
    slug: slugPath,
    content: contentHtml,
    title: data.title || 'JSONLint',
    description: data.description || '',
    readingTime,
  };
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] };
}): Promise<Metadata> {
  const data = await getMarkdownContent(params.slug);

  if (!data) {
    return { title: 'Not Found' };
  }

  return {
    title: data.title,
    description: data.description,
  };
}

export default async function MarkdownPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const data = await getMarkdownContent(params.slug);

  if (!data) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Page Not Found
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          <a href="/" className="text-[var(--accent-blue)] hover:underline">
            Go back to home
          </a>
        </p>
      </div>
    );
  }

  const isDatasetPage = data.slug.startsWith('datasets/');
  const allDatasets = getAllDatasets();
  const allArticles = getAllArticles();
  
  // Get related articles (exclude current one)
  const relatedArticles = allArticles
    .filter((article) => article.slug !== data.slug)
    .slice(0, 4)
    .map((article) => ({
      title: article.title,
      href: `/${article.slug}`,
      description: article.description,
    }));

  // Build breadcrumbs
  const breadcrumbs = [];
  if (isDatasetPage) {
    breadcrumbs.push({ label: 'Datasets', href: '/learn#datasets' });
    const datasetName = data.slug.split('/').pop() || '';
    breadcrumbs.push({ label: datasetName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') });
  } else {
    breadcrumbs.push({ label: 'Learn', href: '/learn' });
    breadcrumbs.push({ label: data.title });
  }

  if (isDatasetPage) {
    const datasetSlug = data.slug.replace('datasets/', '');
    const otherDatasets = allDatasets
      .filter((d) => d.slug !== datasetSlug)
      .map((d) => ({
        name: d.name,
        href: `/datasets/${d.slug}`,
      }));

    return (
      <DatasetPageClient
        title={data.title}
        content={data.content}
        breadcrumbs={breadcrumbs}
        datasetPath={`/datasets/${datasetSlug}.json`}
        datasetName={datasetSlug}
        otherDatasets={otherDatasets}
      />
    );
  }

  return (
    <ArticlePageClient
      title={data.title}
      content={data.content}
      breadcrumbs={breadcrumbs}
      readingTime={data.readingTime}
      relatedArticles={relatedArticles}
    />
  );
}
