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

export const dataCss = {
  ...mtStyles,
  ...gapStyles,
};
