module.exports = {
  extends: [
    'stylelint-config-recommended',
    'stylelint-config-property-sort-order-smacss',
    'stylelint-config-prettier',
  ],
  plugins: ['stylelint-declaration-block-no-ignored-properties'],
  rules: {
    'at-rule-no-unknown': [true, {
      ignoreAtRules: ['extend']
    }],
    'block-closing-brace-newline-after': 'always',
    'block-closing-brace-newline-before': 'always',
    'block-opening-brace-newline-after': 'always',
    'block-opening-brace-space-before': 'always',
    'color-hex-length': 'short',
    'color-no-invalid-hex': true,
    'declaration-block-no-duplicate-properties': [true, {
      ignore: ['consecutive-duplicates']
    }],
    'declaration-block-semicolon-newline-after': 'always-multi-line',
    'declaration-block-semicolon-newline-before': 'never-multi-line',
    'declaration-block-semicolon-space-after': 'always-single-line',
    'declaration-block-trailing-semicolon': 'always',
    indentation: 2,
    'length-zero-no-unit': true,
    'max-empty-lines': 2,
    'no-empty-source': null,
    'no-extra-semicolons': true,
    'plugin/declaration-block-no-ignored-properties': true,
    'selector-list-comma-newline-after': 'always',
    'selector-list-comma-space-before': 'never',
    'selector-pseudo-element-colon-notation': 'double',
    'string-quotes': 'single',
    'value-list-comma-space-after': 'always-single-line',
    'value-list-comma-space-before': 'never'
  },
  overrides: [
    {
      files: ['**/*.{ts,jsx,tsx}'],
      customSyntax: '@hiro0218/postcss-css-in-js',
      rules: {
        // CSS in JS との相性が悪いため無効化
        'custom-property-pattern': null,
        'function-name-case': null,
        'function-no-unknown': null,
      }
    },
  ],
};
