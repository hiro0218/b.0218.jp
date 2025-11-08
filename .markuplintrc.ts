import type { Config } from '@markuplint/ml-config';

const config: Config = {
  excludeFiles: ['./src/**/*.ts', './src/_app.tsx', './src/_document.tsx'],
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
