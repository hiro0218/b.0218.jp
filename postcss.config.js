module.exports = {
  plugins: {
    'postcss-calc': {},
    'postcss-nested': {},
    'postcss-extend': {},
    'postcss-flexbugs-fixes': {},
    'postcss-custom-media': {
      importFrom: './styles/Settings/_custom-media.css',
    },
    'postcss-sort-media-queries': {
      sort: 'mobile-first',
    },
    'postcss-preset-env': {
      stage: 3,
      autoprefixer: {
        grid: 'autoplace',
        cascade: false,
      },
      features: {
        'custom-properties': false,
        'nesting-rules': true,
      },
    },
  },
};
