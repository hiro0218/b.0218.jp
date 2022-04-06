module.exports = {
  plugins: {
    'postcss-calc': {},
    'postcss-nested': {},
    'postcss-extend': {},
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
    cssnano: {
      preset: 'default',
    },
  },
};
