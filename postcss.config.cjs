const pkg = require('./package.json');

module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-mixins': {},
    'postcss-custom-media-generator': {
      '--isMobile': `(max-width: ${992 - 1}px)`,
      '--isDesktop': `(min-width: ${992}px)`,
    },
    'postcss-custom-media': {},
    'postcss-media-hover-any-hover': {},
    'postcss-lightningcss': {
      browsers: pkg.browserslist,
      lightningcssOptions: {
        minify: true,
        drafts: {
          nesting: false,
          customMedia: true,
        },
      },
    },
    '@pandacss/dev/postcss': {},
  },
};
