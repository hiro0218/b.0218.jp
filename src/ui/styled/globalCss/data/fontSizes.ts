import type { GlobalStyleObject } from '@pandacss/types';
import { fontSizesHeading } from '@/ui/styled/tokens/fontSizes';

type FontSizeHeadingDataAttr = `data-font-size-h='${string}'`;
type FontSizeHeadingCSSProps = Record<'fontSize', `var(${string})`>;
type FontSizeHeadingStyleMap = Record<FontSizeHeadingDataAttr, Partial<FontSizeHeadingCSSProps>>;

export const fontSizeDataStyles: GlobalStyleObject = (() => {
  const styles: FontSizeHeadingStyleMap = {};

  Object.keys(fontSizesHeading).forEach((key, index) => {
    styles[`[data-font-size-h='${index + 1}']`] = {
      fontSize: `var(--font-sizes-${key})`,
    };
  });

  return styles;
})();
