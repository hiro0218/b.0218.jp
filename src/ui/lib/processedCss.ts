import postcss from 'postcss';
import combineSelectors from 'postcss-combine-duplicated-selectors';
import postcssLightningcss from 'postcss-lightningcss';
import postcssMediaHoverAnyHover from 'postcss-media-hover-any-hover';
import postcssSortMediaQueries from 'postcss-sort-media-queries';

import packageJson from '@/../package.json';

export const processedCss = (css: string) => {
  const result = postcss([
    postcssLightningcss({
      browsers: packageJson.browserslist,
      lightningcssOptions: {
        minify: true,
        sourceMap: false,
        drafts: {
          nesting: false,
        },
      },
    }),
    postcssSortMediaQueries(),
    combineSelectors({ removeDuplicatedProperties: true }),
    postcssMediaHoverAnyHover(),
  ]).process(css).css;

  return result;
};
