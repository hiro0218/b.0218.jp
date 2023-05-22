const nextBuildId = require('next-build-id');

const withBundleAnalyzer =
  process.env.ANALYZE === 'true' ? require('@next/bundle-analyzer')({ enabled: true }) : (config) => config;

/** @type {import('next').NextConfig} */
const nextConfiguration = {
  reactStrictMode: true,

  swcMinify: true,

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
    legacyBrowsers: false,
    fallbackNodePolyfills: false,
  },

  generateBuildId: () => nextBuildId({ dir: __dirname }),

  webpack(config, { webpack, buildId }) {
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
        {
          test: /\.svg$/,
          use: [
            {
              loader: '@svgr/webpack',
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
