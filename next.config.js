const nextBuildId = require('next-build-id');

const withBundleAnalyzer =
  process.env.ANALYZE === 'true' ? require('@next/bundle-analyzer')({ enabled: true }) : (config) => config;

/** @type {import('next').NextConfig} */
const nextConfiguration = {
  output: 'export',

  reactStrictMode: true,

  devIndicators: false,

  experimental: {
    viewTransition: true,
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

module.exports = withBundleAnalyzer(nextConfiguration);
