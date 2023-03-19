/** @type {import('eslint/lib/shared/types').ConfigData} */
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  extends: ['next/core-web-vitals', 'plugin:@typescript-eslint/recommended', 'eslint-config-prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['import', 'simple-import-sort', '@typescript-eslint', 'unused-imports', 'jsx-expressions'],
  rules: {
    '@next/next/no-img-element': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    complexity: ['error', 10],
    'import/no-unassigned-import': 'off',
    'import/no-default-export': 'off',
    'import/no-cycle': 'off',
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    'import/no-duplicates': ['error', { considerQueryString: true }],
    'jsx-expressions/strict-logical-expressions': 'error',
    'react/jsx-sort-props': 'warn',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'simple-import-sort/imports': 'warn',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'error',
      {
        args: 'after-used',
        argsIgnorePattern: '^_',
        vars: 'all',
        varsIgnorePattern: '^_',
      },
    ],
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
};
