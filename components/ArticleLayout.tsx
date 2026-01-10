'use client';

import { Breadcrumbs } from './Breadcrumbs';
import { TableOfContents } from './TableOfContents';
import { ShareButtons } from './ShareButtons';
import { useLayout } from './LayoutProvider';

interface ArticleLayoutProps {
  title: string;
  content: string;
  breadcrumbs: { label: string; href?: string }[];
  readingTime: number;
  relatedArticles?: { title: string; href: string; description?: string }[];
}

export function ArticleLayout({
  title,
  content,
  breadcrumbs,
  readingTime,
  relatedArticles,
}: ArticleLayoutProps) {
  const { width } = useLayout();

  return (
    <div style={{ background: 'var(--bg-primary)' }}>
      <div className={`${width === 'fixed' ? 'max-w-7xl' : ''} mx-auto py-6 px-4 sm:px-6 lg:px-8`}>
        <div className="grid grid-cols-1 xl:grid-cols-[1fr,280px] gap-6">
          {/* Main content */}
          <article className="min-w-0 max-w-none">
            <Breadcrumbs items={breadcrumbs} />
            
            {/* Article header */}
            <header className="mb-8">
              <h1
                className="text-3xl sm:text-4xl font-bold mb-4"
                style={{ color: 'var(--text-primary)' }}
              >
                {title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <ClockIcon className="w-4 h-4" />
                  <span>{readingTime} min read</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <UserIcon className="w-4 h-4" />
                  <a href="/about" className="hover:text-[var(--accent-blue)] transition-colors">Todd Garland</a>
                </div>
                
                <div className="ml-auto">
                  <ShareButtons title={title} />
                </div>
              </div>
            </header>
            
            {/* Article content */}
            <div
              className="prose-custom"
              dangerouslySetInnerHTML={{ __html: content }}
            />
            
            {/* Related articles */}
            {relatedArticles && relatedArticles.length > 0 && (
              <section
                className="mt-12 pt-8 border-t"
                style={{ borderColor: 'var(--border-primary)' }}
              >
                <h2
                  className="text-xl font-semibold mb-6"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Related Articles
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedArticles.map((article) => (
                    <a
                      key={article.href}
                      href={article.href}
                      className="group p-4 rounded-lg border transition-colors hover:border-[var(--accent-blue)]"
                      style={{
                        background: 'var(--bg-secondary)',
                        borderColor: 'var(--border-primary)',
                      }}
                    >
                      <h3
                        className="font-medium mb-1 group-hover:text-[var(--accent-blue)] transition-colors"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {article.title}
                      </h3>
                      {article.description && (
                        <p
                          className="text-sm line-clamp-2"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          {article.description}
                        </p>
                      )}
                    </a>
                  ))}
                </div>
              </section>
            )}
          </article>
          
          {/* Sidebar with TOC */}
          <TableOfContents html={content} />
        </div>
      </div>
    </div>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
