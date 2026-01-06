/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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

module.exports = nextConfig;
