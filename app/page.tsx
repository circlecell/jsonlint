import { Suspense } from 'react';
import { ToolNav } from '@/components/ToolNav';
import { JsonValidatorWrapper } from './JsonValidatorWrapper';
import { SeoContent, ToolsSidebar } from '@/components/SeoContent';

export default function HomePage() {
  return (
    <>
      <ToolNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Top ad zone */}
        <div className="mb-4 flex justify-center">
          <div id="bsa-zone_1570746984891-3_123456"></div>
        </div>

        <p
          className="text-sm mb-3"
          style={{ color: 'var(--text-muted)' }}
        >
          To format and validate your JSON, just copy + paste it below:
        </p>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr,280px] gap-6">
          {/* Main editor area */}
          <div className="min-w-0">
            <Suspense fallback={<EditorSkeleton />}>
              <JsonValidatorWrapper />
            </Suspense>

            {/* Native ad */}
            <div className="native-ad-container mt-6"></div>

            {/* SEO Content */}
            <SeoContent />
          </div>

          {/* Sidebar */}
          <aside className="hidden xl:block">
            <div className="sticky top-20">
              {/* Sidebar ad zone */}
              <div className="mb-4">
                <div id="bsa-zone_1605730077127-6_123456"></div>
              </div>

              <ToolsSidebar />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

function EditorSkeleton() {
  return (
    <div
      className="rounded-lg animate-pulse"
      style={{
        background: 'var(--bg-secondary)',
        height: '400px',
      }}
    />
  );
}
