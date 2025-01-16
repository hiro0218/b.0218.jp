module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-custom-media-generator': {
      '--isMobile': `(max-width: ${992 - 1}px)`,
      '--isDesktop': `(min-width: ${992}px)`,
    },
    'postcss-custom-media': {},
    'postcss-media-hover-any-hover': {},
    '@pandacss/dev/postcss': {},
  },
};
