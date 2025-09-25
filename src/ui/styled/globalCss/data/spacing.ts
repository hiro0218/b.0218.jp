import type { GlobalStyleObject } from '@pandacss/types';
import { SPACE_KEYS, Spaces } from '@/ui/styled/tokens/spacing';

export const spacingDataStyles: GlobalStyleObject = (() => {
  const styles: GlobalStyleObject = {};

  Spaces.forEach((value, i) => {
    styles[`[data-mt='${value}']`] = {
      marginTop: `var(${SPACE_KEYS[i]})`,
    };
    styles[`[data-gap='${value}']`] = {
      gap: `var(${SPACE_KEYS[i]})`,
    };
  });

  return styles;
})();
