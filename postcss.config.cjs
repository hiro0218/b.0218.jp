module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-mixins': {},
    'postcss-custom-media-generator': {
      '--isDesktop': `(min-width: ${992}px)`,
    },
    'postcss-custom-media': {},
    'postcss-media-hover-any-hover': {},
    '@pandacss/dev/postcss': {},
  },
};
