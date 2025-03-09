import { SPACE_KEYS, Spaces } from '@/ui/styled/variables/space';

const mtStyles: Record<string, { marginTop: string }> = {};

Spaces.forEach((value, i) => {
  mtStyles[`[data-mt='${value}']`] = {
    marginTop: `var(${SPACE_KEYS[i]})`,
  };
});

export const dataCss = {
  ...mtStyles,
};
