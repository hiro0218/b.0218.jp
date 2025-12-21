import nextBuildId from 'next-build-id';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  devIndicators: false,

  reactCompiler: true,

  experimental: {
    scrollRestoration: false,
  },

  // Turbopack configuration (empty to acknowledge and silence webpack warning)
  turbopack: {},

  generateBuildId: () => nextBuildId({ dir: import.meta.dirname }),

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

export default nextConfig;
