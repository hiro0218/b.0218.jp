// @ts-check

import withPlugins from 'next-compose-plugins';

/** @type {import('next').NextConfig} */
const nextConfiguration = {
  env: {
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: 'G-J5F29GMZHX',
  },

  swcMinify: true,

  reactStrictMode: true,

  experimental: {
    scrollRestoration: true
  },

  async rewrites() {
    return [
      {
        source: '/:slug*.html', // Old url with .html
        destination: '/:slug*', // Redirect without .html
      },
    ];
  },

  webpack(config) {
    return config;
  },
};

export default withPlugins([], nextConfiguration);
