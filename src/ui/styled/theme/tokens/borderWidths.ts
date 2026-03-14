import type { TokenValues } from './types';

const borderWidthValues: TokenValues<'borderWidths'> = {
  thin: { value: '1px' },
  medium: { value: '2px' },
  thick: { value: '4px' },
};

export default borderWidthValues;
