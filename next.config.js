/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'export',
  basePath: '/graduation-work/pokemon',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

module.exports = nextConfig;
