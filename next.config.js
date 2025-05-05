const withPlugins = require('next-compose-plugins');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const nextBuildId = require('next-build-id');

/** @type {import('next').NextConfig} */
const nextConfiguration = {
  reactStrictMode: true,

  devIndicators: false,

  experimental: {
    scrollRestoration: true,
  },

  generateBuildId: () => nextBuildId({ dir: __dirname }),

  modularizeImports: {
    '@radix-ui': {
      transform: '@radix-ui/{{member}}',
    },
  },

  webpack(config, { webpack, buildId }) {
    const module = config.module || {};
    const rules = module.rules || {};

    config.module = {
      ...module,
      rules: [
        ...rules,
        {
          test: /src\/.*\/index\.ts?$/,
          sideEffects: false,
        },
      ],
    };

    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.BUILD_ID': JSON.stringify(buildId),
      }),
    );

    return config;
  },
};

module.exports = withPlugins([withBundleAnalyzer], nextConfiguration);
