import { Metadata } from 'next';
import Link from 'next/link';
import { getAllDatasets, getDatasetSample } from '@/lib/dataset-utils';
import { Container } from '@/components/Container';
import { DatasetsSection } from '../learn/DatasetsSection';

export const metadata: Metadata = {
  title: 'Free JSON Datasets - Download Open Source Data | JSONLint',
  description:
    'Browse and download free JSON datasets for testing, learning, and development. Curated collections of countries, languages, programming data, and more.',
  openGraph: {
    title: 'Free JSON Datasets - Download Open Source Data | JSONLint',
    description:
      'Browse and download free JSON datasets for testing, learning, and development.',
  },
};

export default async function DatasetsPage() {
  const datasets = getAllDatasets();

  // Get sample data for each dataset
  const samples: Record<string, string> = {};
  for (const dataset of datasets) {
    const sample = await getDatasetSample(dataset.jsonPath, 1);
    if (sample) {
      samples[dataset.slug] = JSON.stringify(sample, null, 2);
    }
  }

  return (
    <div style={{ background: 'var(--bg-primary)' }}>
      <Container className="py-8">
        {/* Header */}
        <header className="text-center mb-10">
          <h1
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Free JSON Datasets
          </h1>
          <p
            className="text-lg max-w-2xl mx-auto mb-6"
            style={{ color: 'var(--text-secondary)' }}
          >
            Curated, open-source JSON datasets for testing, learning, and building applications.
            All datasets are free to use in your projects.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm" style={{ color: 'var(--text-muted)' }}>
            <div className="flex items-center gap-2">
              <CheckIcon className="w-4 h-4" style={{ color: 'var(--accent-green)' }} />
              <span>Open Source</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon className="w-4 h-4" style={{ color: 'var(--accent-green)' }} />
              <span>No API Key Required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon className="w-4 h-4" style={{ color: 'var(--accent-green)' }} />
              <span>Ready to Download</span>
            </div>
          </div>
        </header>

        {/* Datasets Section */}
        <DatasetsSection datasets={datasets} samples={samples} />

        {/* CTA Section */}
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
            Work with your JSON data
          </h2>
          <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
            Use our free online tools to validate, format, convert, and transform JSON.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/" className="btn btn-primary">
              JSON Validator
            </Link>
            <Link href="/json-to-csv" className="btn btn-secondary">
              JSON to CSV
            </Link>
            <Link href="/json-schema" className="btn btn-secondary">
              Schema Validator
            </Link>
          </div>
        </section>

        {/* Contribute CTA */}
        <section className="mt-8 text-center">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Have a dataset to share?{' '}
            <a
              href="https://github.com/circlecell/jsonlint/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
              style={{ color: 'var(--accent-blue)' }}
            >
              Submit a contribution
            </a>
          </p>
        </section>
      </Container>
    </div>
  );
}

function CheckIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
