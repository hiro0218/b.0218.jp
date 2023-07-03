import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import postcss from 'postcss';
import combineSelectors from 'postcss-combine-duplicated-selectors';
import postcssSortMediaQueries from 'postcss-sort-media-queries';

import packageJson from '@/../package.json';

export const processedCss = (css: string) => {
  return postcss([
    autoprefixer({
      overrideBrowserslist: packageJson.browserslist,
    }),
    cssnano({
      preset: ['cssnano-preset-advanced'],
      plugins: [],
    }),
    postcssSortMediaQueries,
    combineSelectors({ removeDuplicatedProperties: true }),
  ]).process(css).css;
};
