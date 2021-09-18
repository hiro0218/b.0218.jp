/** @type {import('next').NextConfig} */
module.exports = {
  env: {
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: 'UA-50805440-1',
  },

  experimental: {},

  future: {
    strictPostcssConfiguration: true,
  },

  webpack5: true,

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
