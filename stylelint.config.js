module.exports = {
  extends: ['stylelint-config-recommended', 'stylelint-config-recess-order'],
  plugins: ['stylelint-declaration-block-no-ignored-properties', 'stylelint-browser-compat'],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['extend'],
      },
    ],
    'color-hex-length': 'short',
    'color-no-invalid-hex': true,
    'length-zero-no-unit': true,
    'no-empty-source': null,
    'plugin/declaration-block-no-ignored-properties': true,
    'selector-pseudo-element-colon-notation': 'double',
    'plugin/browser-compat': true,
  },
  overrides: [
    {
      files: ['**/*.{ts,jsx,tsx}'],
      customSyntax: 'postcss-styled-syntax',
      rules: {
        // CSS in JS との相性が悪いため無効化
        'block-no-empty': null,
        'custom-property-pattern': null,
        'function-name-case': null,
        'function-no-unknown': null,
        'no-invalid-double-slash-comments': null,
      },
    },
  ],
};
