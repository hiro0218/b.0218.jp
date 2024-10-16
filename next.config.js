const nextBuildId = require('next-build-id');

const withBundleAnalyzer =
  process.env.ANALYZE === 'true' ? require('@next/bundle-analyzer')({ enabled: true }) : (config) => config;

/** @type {import('next').NextConfig} */
const nextConfiguration = {
  reactStrictMode: true,

  pageExtensions: ['page.tsx'],

  compiler: {
    emotion: {
      autoLabel: 'dev-only',
      importMap: {
        ['@/ui/styled']: {
          ['styled']: {
            canonicalImport: ['@emotion/styled', 'default'],
            styledBaseImport: ['@/ui/styled', 'styled'],
          },
        },
      },
    },
  },

  experimental: {
    webpackBuildWorker: true,
    scrollRestoration: true,
  },

  generateBuildId: () => nextBuildId({ dir: __dirname }),

  modularizeImports: {
    '@radix-ui': {
      transform: '@radix-ui/{{member}}',
    },
    '@emotion': {
      transform: '@emotion/{{member}}',
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
        {
          test: /\.svg$/,
          use: [
            {
              loader: '@svgr/webpack',
              options: {
                typescript: true,
                memo: true,
              },
            },
          ],
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
