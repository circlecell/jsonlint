'use client';

import { ArticleLayout } from '@/components/ArticleLayout';

interface ArticlePageClientProps {
  title: string;
  content: string;
  breadcrumbs: { label: string; href?: string }[];
  url: string;
  readingTime: number;
  relatedArticles: { title: string; href: string; description?: string }[];
}

export function ArticlePageClient({
  title,
  content,
  breadcrumbs,
  url,
  readingTime,
  relatedArticles,
}: ArticlePageClientProps) {
  return (
    <ArticleLayout
      title={title}
      content={content}
      breadcrumbs={breadcrumbs}
      url={url}
      readingTime={readingTime}
      relatedArticles={relatedArticles}
    />
  );
}
