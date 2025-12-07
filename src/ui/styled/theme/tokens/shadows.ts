import type { TokenValues } from './types';

const shadows: TokenValues<'shadows'> = {
  base: { value: 'color-mix(in oklab, var(--colors-gray-a-100), var(--colors-gray-a-100) 25%)' },
  xs: { value: '0 1px 2px var(--shadows-base), 0 0 1px var(--colors-gray-a-700)' },
  sm: { value: '0 2px 4px var(--shadows-base), 0 0 1px var(--colors-gray-a-700)' },
  md: { value: '0 4px 8px var(--shadows-base), 0 0 1px var(--colors-gray-a-700)' },
  lg: { value: '0 8px 16px var(--shadows-base), 0 0 1px var(--colors-gray-a-700)' },
  xl: { value: '0 16px 24px var(--shadows-base), 0 0 1px var(--colors-gray-a-700)' },
  '2xl': { value: '0 24px 40px var(--shadows-base), 0 0 1px var(--colors-gray-a-700)' },
};

export default shadows;
