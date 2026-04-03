const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

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
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
