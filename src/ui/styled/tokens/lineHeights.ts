import { getStep } from '@/ui/styled/tokens/fontSizes/utils';
import type { TokenValues } from './types';

const lineHeightsValues: TokenValues<'lineHeights'> = {
  xs: { value: String(getStep(0)) },
  sm: { value: String(getStep(1)) },
  md: { value: String(getStep(2)) },
  lg: { value: String(getStep(3)) },
};

export default lineHeightsValues;
