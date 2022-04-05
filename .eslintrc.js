// @ts-check

/** @type {import('eslint/lib/shared/types').ConfigData} */
module.exports = {
  env: {
    es6: true,
    node: true,
    browser: true,
    commonjs: true,
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    React: 'writable',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: ['jsx-a11y', 'simple-import-sort', 'react-hooks', 'react', '@typescript-eslint'],
  extends: [
    'next',
    'next/core-web-vitals',
    'plugin:jsx-a11y/recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'eslint-config-prettier',
  ],
  rules: {
    complexity: ['error', 10],
    'jsx-a11y/anchor-is-valid': 'off',
    'simple-import-sort/imports': 'warn',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@next/next/no-img-element': 'off',
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },
  ],
};
