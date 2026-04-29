module.exports = {
  extends: ['stylelint-config-recommended', 'stylelint-config-recess-order'],
  plugins: [
    'stylelint-plugin-isolate-on-stack',
    'stylelint-declaration-block-no-ignored-properties',
    'stylelint-browser-compat',
  ],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['extend', 'mixin', 'define-mixin'],
      },
    ],
    'media-feature-name-disallowed-list': [
      ['any-hover'],
      { message: ':hover を直接書いてください。PostCSS が自動で any-hover ラップします' },
    ],
    'color-hex-length': 'short',
    'color-no-invalid-hex': true,
    'length-zero-no-unit': true,
    'no-empty-source': null,
    'plugin/declaration-block-no-ignored-properties': true,
    'selector-pseudo-element-colon-notation': 'double',
    'plugin/browser-compat': [
      true,
      {
        ignore: ['properties.animation-timeline', 'properties.scroll-timeline'],
      },
    ],
    'stylelint-plugin-isolate-on-stack/no-redundant-declaration': true,
    'stylelint-plugin-isolate-on-stack/ineffective-on-background-blend': true,
    // shorthand プロパティが longhand を暗黙的に initial 値へ上書きする事故を防ぐ
    // - background: url/gradient を含む値 (画像・グラデーション) は shorthand を許容
    // - font: CSS-wide keywords (inherit/initial/unset/revert) のみ許容
    'declaration-property-value-disallowed-list': [
      {
        background: ['/^(?!.*(url\\(|gradient)).+$/'],
        font: ['/^(?!(inherit|initial|unset|revert)$).+$/'],
      },
      {
        message: (name) => {
          const longhands = {
            background: 'background-color / background-image など',
            font: 'font-size / font-family / font-weight / line-height など',
          };
          return `"${name}" shorthand は省略された sub-property を initial 値で上書きします。${longhands[name]}個別プロパティを使用してください`;
        },
      },
    ],
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
        'no-invalid-position-declaration': null,
        'nesting-selector-no-missing-scoping-root': null,
      },
    },
  ],
};
