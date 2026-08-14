const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ESLint runs as a separate step (`npm run lint`); don't couple it to
  // production builds. There is a backlog of pre-existing lint errors
  // (unescaped entities, <a> vs <Link>) to clear separately.
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Tree-shake heavy libraries that re-export everything from a barrel file
  experimental: {
    optimizePackageImports: [
      'shiki',
      '@shikijs/monaco',
      '@shikijs/rehype',
      'ajv',
      'jsonpath-plus',
      'fast-xml-parser',
      'js-tiktoken',
      'diff',
      'jsonrepair',
      'lucide-react',
    ],
  },

  async redirects() {
    return [
      {
        source: '/icons/icon-hires.png',
        destination: '/images/logo.png',
        permanent: true,
      },
      {
        source: '/benefits-of-using-a-json-beautifier',
        destination: '/json-formatter',
        permanent: true,
      },
      {
        source: '/common-mistakes-in-json-and-how-to-avoid-them',
        destination: '/json-parse-error',
        permanent: true,
      },
      {
        source: '/json-syntax-error',
        destination: '/json-parse-error',
        permanent: true,
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
