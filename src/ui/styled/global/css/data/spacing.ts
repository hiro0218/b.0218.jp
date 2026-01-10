import type { GlobalStyleObject } from '@pandacss/types';
import { SPACE_KEYS, Spaces } from '@/ui/styled/theme/tokens/spacing';

export const spacingDataStyles: GlobalStyleObject = (() => {
  const styles: GlobalStyleObject = {};

  Spaces.forEach((value, i) => {
    styles[`[data-gap='${value}']`] = {
      gap: `var(${SPACE_KEYS[i]})`,
    };
  });

  return styles;
})();
