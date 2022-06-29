// @ts-check

import withPlugins from 'next-compose-plugins';

/** @type {import('next').NextConfig} */
const nextConfiguration = {
  env: {
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: 'G-J5F29GMZHX',
  },

  reactStrictMode: true,

  experimental: {
    scrollRestoration: true,
    browsersListForSwc: true,
    legacyBrowsers: false,
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
