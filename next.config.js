// @ts-check

/** @type {import('next').NextConfig} */
const nextConfiguration = {
  reactStrictMode: true,

  swcMinify: true,

  experimental: {
    scrollRestoration: true,
    legacyBrowsers: false,
    fallbackNodePolyfills: false,
  },

  webpack(config) {
    // eslint-disable-next-line @next/next/no-assign-module-variable
    const module = config.module || {};
    const rules = module.rules || {};

    config.module = {
      ...module,
      rules: [
        ...rules,
        {
          test: /src\/components\/.*\/index\.ts/i,
          sideEffects: false,
        },
      ],
    };

    return config;
  },
};

module.exports = nextConfiguration;
