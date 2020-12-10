module.exports = {
  root: true,
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  plugins: ['@typescript-eslint', 'simple-import-sort'],
  extends: ['@nuxtjs/eslint-config-typescript', '@hiro0218/eslint-config'],
  rules: {
    'simple-import-sort/imports': 'warn',
  },
};
