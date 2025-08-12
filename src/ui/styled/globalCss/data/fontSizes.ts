import type { GlobalStyleObject } from '@pandacss/types';
import { fontSizesHeading } from '@/ui/styled/tokens/fontSizes';

type FontSizeHeadingDataAttr = `data-font-size-h='${string}'`;
type FontSizeHeadingCSSProps = Record<'fontSize', `var(${string})`>;
type FontSizeHeadingStyleMap = Record<FontSizeHeadingDataAttr, Partial<FontSizeHeadingCSSProps>>;

const fontSizeHeadingStyles: FontSizeHeadingStyleMap = {};

Object.keys(fontSizesHeading).forEach((key, index) => {
  fontSizeHeadingStyles[`[data-font-size-h='${index + 1}']`] = {
    fontSize: `var(--font-sizes-${key})`,
  };
});

export const fontSizeDataStyles: GlobalStyleObject = {
  ...fontSizeHeadingStyles,
};
