import type { Config } from '@markuplint/ml-config';

const config: Config = {
  excludeFiles: [
    '**/*.ts', // TypeScriptファイル（JSXなし）
    '**/*.test.tsx', // テストファイル
    '.next/**', // Next.jsビルド成果物
    'styled-system/**', // Panda CSSビルド成果物
    '_article/**', // Git submodule（読み取り専用）
  ],
  parser: {
    '\\.[jt]sx?$': '@markuplint/jsx-parser',
  },
  specs: {
    '\\.[jt]sx?$': '@markuplint/react-spec',
  },
  extends: ['markuplint:recommended-react'],
  nodeRules: [
    {
      selector: 'meta[property]',
      rules: {
        'invalid-attr': {
          options: {
            allowAttrs: [
              {
                name: 'property',
                value: {
                  pattern: '/^(og|article):.+/',
                },
              },
              {
                name: 'content',
                value: {
                  type: 'NoEmptyAny',
                },
              },
            ],
          },
        },
        'required-attr': false,
      },
    },
    {
      selector: '*',
      rules: {
        'invalid-attr': {
          options: {
            allowAttrs: [
              {
                name: 'css',
                value: {
                  type: 'Any',
                },
              },
            ],
          },
        },
      },
    },
  ],
};

export default config;
