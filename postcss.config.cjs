const pkg = require('./package.json');
const { Features } = require('lightningcss');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-mixins': {},
    'postcss-custom-media-generator': {
      '--isDesktop': `(min-width: ${992}px)`,
    },
    'postcss-custom-media': {},
    'postcss-media-hover-any-hover': {},
    'postcss-lightningcss': {
      browsers: pkg.browserslist,
      lightningcssOptions: {
        include: Features.Nesting,
        minify: !isDev,
        drafts: {
          customMedia: true,
        },
      },
    },
    '@pandacss/dev/postcss': {},
  },
};
