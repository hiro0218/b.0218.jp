const pkg = require('./package.json');
const { Features } = require('lightningcss');

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
        include: Features.Nesting,
        minify: true,
        drafts: {
          customMedia: true,
        },
      },
    },
    '@pandacss/dev/postcss': {},
  },
};
