'use client';

import { ArticleLayout } from '@/components/ArticleLayout';

interface ArticlePageClientProps {
  title: string;
  content: string;
  breadcrumbs: { label: string; href?: string }[];
  readingTime: number;
  relatedArticles: { title: string; href: string; description?: string }[];
}

export function ArticlePageClient({
  title,
  content,
  breadcrumbs,
  readingTime,
  relatedArticles,
}: ArticlePageClientProps) {
  return (
    <ArticleLayout
      title={title}
      content={content}
      breadcrumbs={breadcrumbs}
      readingTime={readingTime}
      relatedArticles={relatedArticles}
    />
  );
}
