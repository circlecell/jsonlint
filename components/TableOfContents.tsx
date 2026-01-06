'use client';

import { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  html: string;
}

export function TableOfContents({ html }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Parse headings from HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const elements = doc.querySelectorAll('h2, h3');
    
    const items: TocItem[] = [];
    elements.forEach((el, index) => {
      const id = el.id || `heading-${index}`;
      items.push({
        id,
        text: el.textContent || '',
        level: parseInt(el.tagName.charAt(1)),
      });
    });
    
    setHeadings(items);
  }, [html]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 3) return null;

  return (
    <nav className="hidden xl:block flex-shrink-0">
      <div
        className="sticky top-20 p-4 rounded-lg border max-h-[calc(100vh-120px)] overflow-y-auto"
        style={{
          background: 'var(--bg-secondary)',
          borderColor: 'var(--border-primary)',
        }}
      >
        <h4
          className="font-semibold text-sm mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          On this page
        </h4>
        <ul className="space-y-2 text-sm">
          {headings.map((heading) => (
            <li
              key={heading.id}
              style={{ paddingLeft: heading.level === 3 ? '12px' : '0' }}
            >
              <a
                href={`#${heading.id}`}
                className={`block transition-colors hover:text-[var(--text-primary)] break-words leading-snug ${
                  activeId === heading.id
                    ? 'text-[var(--accent-blue)] font-medium'
                    : ''
                }`}
                style={{
                  color: activeId === heading.id ? undefined : 'var(--text-muted)',
                }}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(heading.id)?.scrollIntoView({
                    behavior: 'smooth',
                  });
                }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export function generateHeadingIds(html: string): string {
  // Add IDs to headings for anchor links
  let counter = 0;
  return html.replace(/<(h[23])>(.*?)<\/\1>/gi, (match, tag, content) => {
    const id = content
      .toLowerCase()
      .replace(/<[^>]+>/g, '') // Remove HTML tags
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with dashes
      .replace(/^-|-$/g, ''); // Remove leading/trailing dashes
    counter++;
    return `<${tag} id="${id || `heading-${counter}`}">${content}</${tag}>`;
  });
}

export function calculateReadingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, '');
  const words = text.split(/\s+/).length;
  return Math.ceil(words / 200); // 200 words per minute
}
