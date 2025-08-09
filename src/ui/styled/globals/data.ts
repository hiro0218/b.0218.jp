import { fontSizesHeading } from '@/ui/styled/tokens/fontSizes';
import { SPACE_KEYS, Spaces } from '@/ui/styled/variables/space';

type SpacingDataAttr = `data-${'mt' | 'gap'}='${(typeof Spaces)[number]}'`;
type SpacingCSSProps = Record<'marginTop' | 'gap', `var(${(typeof SPACE_KEYS)[number]})`>;
type SpacingStyleMap = Record<SpacingDataAttr extends string ? SpacingDataAttr : never, Partial<SpacingCSSProps>>;
type InitialSpacingStyleMap = Record<SpacingDataAttr, Partial<SpacingCSSProps>>;

const mtStyles: SpacingStyleMap = {} as InitialSpacingStyleMap;
const gapStyles: SpacingStyleMap = {} as InitialSpacingStyleMap;

Spaces.forEach((value, i) => {
  mtStyles[`[data-mt='${value}']`] = {
    marginTop: `var(${SPACE_KEYS[i]})`,
  };
  gapStyles[`[data-gap='${value}']`] = {
    gap: `var(${SPACE_KEYS[i]})`,
  };
});

type FontSizeHeadingDataAttr = `data-font-size-h='${string}'`;
type FontSizeHeadingCSSProps = Record<'fontSize', `var(${string})`>;
type FontSizeHeadingStyleMap = Record<FontSizeHeadingDataAttr, Partial<FontSizeHeadingCSSProps>>;

const mtFontSizeHeading: FontSizeHeadingStyleMap = {};

Object.keys(fontSizesHeading).forEach((key, index) => {
  mtFontSizeHeading[`[data-font-size-h='${index + 1}']`] = {
    fontSize: `var(--font-sizes-${key})`,
  };
});

export const dataCss = {
  ...mtStyles,
  ...gapStyles,
  ...mtFontSizeHeading,
};
