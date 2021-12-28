const withPlugins = require('next-compose-plugins');

/** @type {import('next').NextConfig} */
const nextConfiguration = {
  env: {
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: 'UA-50805440-1',
  },

  experimental: {
    optimizeCss: true,
  },

  future: {
    strictPostcssConfiguration: true,
  },

  reactStrictMode: true,

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

module.exports = withPlugins([], nextConfiguration);
