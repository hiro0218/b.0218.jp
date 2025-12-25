import { cpus, totalmem } from 'node:os';
import nextBuildId from 'next-build-id';

const getStaticGenerationConfig = () => {
  const memoryGB = totalmem() / (1024 ** 3);
  const maxConcurrency = Math.max(2, Math.min(cpus().length - 1, 16));
  const minPagesPerWorker = memoryGB < 8 ? 15 : memoryGB >= 16 ? 50 : 25;

  return {
    staticGenerationMaxConcurrency: maxConcurrency,
    staticGenerationMinPagesPerWorker: minPagesPerWorker,
    staticGenerationRetryCount: 1,
  };
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  devIndicators: false,

  reactCompiler: true,

  experimental: {
    scrollRestoration: false,
    ...getStaticGenerationConfig(),
    webpackBuildWorker: true,
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
