import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Metadata } from 'next';
import Link from 'next/link';
import { getAllDatasets, getDatasetSample } from '@/lib/dataset-utils';
import { DatasetsSection } from './DatasetsSection';

export const metadata: Metadata = {
  title: 'Learn JSON - Guides, Tutorials & Datasets | JSONLint',
  description:
    'Everything you need to master JSON. Guides, tutorials, best practices, and free datasets.',
};

const contentDirectory = path.join(process.cwd(), 'docs/content/completed');

function getAllMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  
  const files: string[] = [];
  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const filePath = path.join(dir, item);
    if (fs.statSync(filePath).isDirectory()) {
      files.push(...getAllMarkdownFiles(filePath));
    } else if (item.endsWith('.md')) {
      files.push(filePath);
    }
  });

  return files;
}

interface Article {
  slug: string;
  title: string;
  description: string;
  category: 'getting-started' | 'advanced';
}

function getArticles(): Article[] {
  const articles: Article[] = [];
  
  const contentFiles = getAllMarkdownFiles(contentDirectory);
  contentFiles.forEach((filePath) => {
    const relativePath = path.relative(contentDirectory, filePath);
    const slug = relativePath.replace('.md', '').replace(/\\/g, '/');
    
    // Skip privacy and other non-educational pages
    if (slug === 'privacy') return;
    
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);
    
    let category: Article['category'] = 'getting-started';
    if (
      slug.includes('schema') ||
      slug.includes('javascript') ||
      slug.includes('advanced') ||
      slug.includes('beautifier')
    ) {
      category = 'advanced';
    }
    
    articles.push({
      slug,
      title: data.title || slug,
      description: data.description || '',
      category,
    });
  });

  return articles;
}

export default async function LearnPage() {
  const articles = getArticles();
  const datasets = getAllDatasets();
  
  // Get sample data for each dataset
  const samples: Record<string, string> = {};
  for (const dataset of datasets) {
    const sample = await getDatasetSample(dataset.jsonPath, 1);
    if (sample) {
      samples[dataset.slug] = JSON.stringify(sample, null, 2);
    }
  }
  
  const gettingStarted = articles.filter((a) => a.category === 'getting-started');
  const advanced = articles.filter((a) => a.category === 'advanced');
  
  // Pick a featured article
  const featured = articles.find((a) => a.slug === 'mastering-json-format') || articles[0];

  return (
    <div style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Learn JSON
          </h1>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            Everything you need to master JSON. From basic syntax to advanced
            validation techniques, plus free datasets for your projects.
          </p>
        </header>

        {/* Featured Article */}
        {featured && (
          <section className="mb-12">
            <Link
              href={`/${featured.slug}`}
              className="group block rounded-xl border overflow-hidden transition-colors hover:border-[var(--accent-blue)]"
              style={{
                background: 'var(--bg-secondary)',
                borderColor: 'var(--border-primary)',
              }}
            >
              <div className="p-8 sm:p-10">
                <span
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{ color: 'var(--accent-blue)' }}
                >
                  Featured
                </span>
                <h2
                  className="text-2xl sm:text-3xl font-bold mt-2 mb-3 group-hover:text-[var(--accent-blue)] transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {featured.title}
                </h2>
                <p
                  className="text-lg"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {featured.description}
                </p>
                <span
                  className="inline-flex items-center gap-1 mt-4 text-sm font-medium"
                  style={{ color: 'var(--accent-blue)' }}
                >
                  Read article
                  <ArrowIcon className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </section>
        )}

        {/* Article Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Getting Started */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <BookIcon className="w-5 h-5" style={{ color: 'var(--accent-green)' }} />
              <h2
                className="text-xl font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                Getting Started
              </h2>
            </div>
            <div className="space-y-3">
              {gettingStarted.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </section>

          {/* Advanced */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <CodeIcon className="w-5 h-5" style={{ color: 'var(--accent-purple)' }} />
              <h2
                className="text-xl font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                Advanced Topics
              </h2>
            </div>
            <div className="space-y-3">
              {advanced.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </section>
        </div>

        {/* Datasets Section Preview */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <DatabaseIcon className="w-5 h-5" style={{ color: 'var(--accent-amber)' }} />
              <h2
                className="text-xl font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                Free JSON Datasets
              </h2>
            </div>
            <Link 
              href="/datasets" 
              className="text-sm font-medium flex items-center gap-1 hover:underline"
              style={{ color: 'var(--accent-blue)' }}
            >
              View all datasets
              <ArrowIcon className="w-4 h-4" />
            </Link>
          </div>
          <DatasetsSection datasets={datasets} samples={samples} />
        </section>

        {/* Tools CTA */}
        <section
          className="mt-12 p-8 rounded-xl border text-center"
          style={{
            background: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)',
          }}
        >
          <h2
            className="text-2xl font-bold mb-3"
            style={{ color: 'var(--text-primary)' }}
          >
            Ready to work with JSON?
          </h2>
          <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
            Use our free online tools to validate, format, convert, and transform JSON data.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/" className="btn btn-primary">
              JSON Validator
            </Link>
            <Link href="/json-to-csv" className="btn btn-secondary">
              JSON to CSV
            </Link>
            <Link href="/json-to-yaml" className="btn btn-secondary">
              JSON to YAML
            </Link>
            <Link href="/json-diff" className="btn btn-secondary">
              JSON Diff
            </Link>
            <Link href="/json-minify" className="btn btn-secondary">
              JSON Minify
            </Link>
            <Link href="/json-schema" className="btn btn-secondary">
              Schema Validator
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/${article.slug}`}
      className="group flex items-start gap-3 p-4 rounded-lg border transition-colors hover:border-[var(--accent-blue)]"
      style={{
        background: 'var(--bg-secondary)',
        borderColor: 'var(--border-primary)',
      }}
    >
      <div
        className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5"
        style={{ background: 'var(--bg-tertiary)' }}
      >
        <FileIcon className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
      </div>
      <div className="min-w-0">
        <h3
          className="font-medium mb-1 group-hover:text-[var(--accent-blue)] transition-colors line-clamp-1"
          style={{ color: 'var(--text-primary)' }}
        >
          {article.title}
        </h3>
        <p
          className="text-sm line-clamp-2"
          style={{ color: 'var(--text-muted)' }}
        >
          {article.description}
        </p>
      </div>
    </Link>
  );
}

function BookIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function CodeIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function FileIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function DatabaseIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}
