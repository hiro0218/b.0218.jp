module.exports = {
  '*.{js,ts,tsx}': ['eslint --fix', 'npm test -- --forceExit --runInBand --bail --findRelatedTests', 'git add'],
  '*.{css}': ['stylelint **/*.scss --fix', 'git add'],
};
