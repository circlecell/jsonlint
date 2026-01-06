'use client';

import { useState, useMemo } from 'react';
import { DatasetCard } from '@/components/DatasetCard';
import { DatasetMetadata, DatasetCategory, CATEGORY_CONFIG } from '@/lib/dataset-types';

interface DatasetsSectionProps {
  datasets: DatasetMetadata[];
  samples: Record<string, string>;
}

type FilterCategory = DatasetCategory | 'all';

export function DatasetsSection({ datasets, samples }: DatasetsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Get unique categories from the datasets
  const availableCategories = useMemo(() => {
    const cats = new Set<DatasetCategory>();
    datasets.forEach(d => cats.add(d.category));
    return Array.from(cats);
  }, [datasets]);

  // Filter datasets based on category and search
  const filteredDatasets = useMemo(() => {
    let result = datasets;

    // Filter by category
    if (activeCategory !== 'all') {
      result = result.filter(d => d.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(d => {
        const searchableText = [
          d.title,
          d.description,
          ...d.tags,
          d.category,
        ].join(' ').toLowerCase();
        return searchableText.includes(query);
      });
    }

    return result;
  }, [datasets, activeCategory, searchQuery]);

  return (
    <section id="datasets">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <DatabaseIcon className="w-5 h-5" style={{ color: 'var(--accent-amber)' }} />
        <h2
          className="text-xl font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          Free JSON Datasets
        </h2>
      </div>

      <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
        Use these datasets for testing, learning, or in your projects. All
        datasets are free and open source.
      </p>

      {/* Filter Bar */}
      <div className="mb-6 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <SearchIcon 
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" 
            style={{ color: 'var(--text-muted)' }} 
          />
          <input
            type="text"
            placeholder="Search datasets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg text-sm"
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-primary)',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-[var(--bg-secondary)]"
              style={{ color: 'var(--text-muted)' }}
            >
              <CloseIcon className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === 'all' ? 'ring-2 ring-offset-2 ring-[var(--accent-blue)] ring-offset-[var(--bg-primary)]' : ''
            }`}
            style={{
              background: activeCategory === 'all' ? 'var(--accent-blue)' : 'var(--bg-tertiary)',
              color: activeCategory === 'all' ? 'white' : 'var(--text-secondary)',
            }}
          >
            All ({datasets.length})
          </button>
          
          {availableCategories.map((category) => {
            const config = CATEGORY_CONFIG[category];
            const count = datasets.filter(d => d.category === category).length;
            const isActive = activeCategory === category;
            
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ring-offset-[var(--bg-primary)] ${
                  isActive ? 'ring-2 ring-offset-2' : ''
                }`}
                style={{
                  background: isActive ? config.color : 'var(--bg-tertiary)',
                  color: isActive ? 'white' : 'var(--text-secondary)',
                  // Use CSS custom property for ring color
                  ['--tw-ring-color' as string]: config.color,
                }}
              >
                {config.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count */}
      {(activeCategory !== 'all' || searchQuery) && (
        <p className="mb-4 text-sm" style={{ color: 'var(--text-muted)' }}>
          Showing {filteredDatasets.length} of {datasets.length} datasets
          {activeCategory !== 'all' && ` in "${CATEGORY_CONFIG[activeCategory].label}"`}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
      )}

      {/* Dataset Grid */}
      {filteredDatasets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDatasets.map((dataset) => (
            <DatasetCard
              key={dataset.slug}
              dataset={dataset}
              sampleData={samples[dataset.slug]}
            />
          ))}
        </div>
      ) : (
        <div 
          className="text-center py-12 rounded-lg"
          style={{ background: 'var(--bg-secondary)' }}
        >
          <DatabaseIcon 
            className="w-12 h-12 mx-auto mb-4" 
            style={{ color: 'var(--text-muted)' }} 
          />
          <p 
            className="text-lg font-medium mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            No datasets found
          </p>
          <p 
            className="text-sm mb-4"
            style={{ color: 'var(--text-muted)' }}
          >
            Try adjusting your search or filter criteria.
          </p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
            }}
            className="btn btn-secondary"
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}

// Icons
function DatabaseIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

function SearchIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
