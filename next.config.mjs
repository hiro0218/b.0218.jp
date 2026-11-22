import { cpus, totalmem } from 'node:os';
import nextBuildId from 'next-build-id';

const getStaticGenerationConfig = () => {
  const memoryGB = totalmem() / 1024 ** 3;
  const maxConcurrency = Math.max(2, Math.min(cpus().length - 1, 16));
  const minPagesPerWorker = memoryGB < 8 ? 15 : memoryGB >= 16 ? 50 : 25;

  return {
    staticGenerationMaxConcurrency: maxConcurrency,
    staticGenerationMinPagesPerWorker: minPagesPerWorker,
    staticGenerationRetryCount: 1,
  };
};

// generateBuildId と env で別々に git を呼ばない。ビルドの途中で HEAD が動くと、.next/BUILD_ID と OGP の ts が食い違うため
const buildId = nextBuildId.sync({ dir: import.meta.dirname });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  devIndicators: false,

  reactCompiler: true,

  experimental: {
    scrollRestoration: false,
    ...getStaticGenerationConfig(),
    optimizePackageImports: [
      '@react-aria/dialog',
      '@react-aria/focus',
      '@react-aria/interactions',
      '@react-aria/overlays',
      '@react-aria/textfield',
      '@react-aria/tooltip',
      '@react-aria/utils',
      'html-react-parser',
      'react-stately',
    ],
  },

  logging: {
    browserToTerminal: true,
  },

  generateBuildId: () => buildId,

  env: {
    BUILD_ID: buildId,
  },

  modularizeImports: {
    '@radix-ui': {
      transform: '@radix-ui/{{member}}',
    },
  },

  async redirects() {
    return [
      {
        source: '/.well-known/host-meta',
        destination: 'https://fed.brid.gy/.well-known/host-meta',
        permanent: false,
      },
      {
        source: '/.well-known/webfinger',
        destination: 'https://fed.brid.gy/.well-known/webfinger',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
