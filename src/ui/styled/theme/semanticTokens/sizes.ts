import { ICON_SIZE_LG, ICON_SIZE_MD, ICON_SIZE_SM, ICON_SIZE_XL, ICON_SIZE_XS } from '@/ui/icons';
import type { TokenValues } from '../tokens/types';

export const sizes: TokenValues<'sizes'> = {
  'icon-xs': { value: `${ICON_SIZE_XS}px` },
  'icon-sm': { value: `${ICON_SIZE_SM}px` },
  'icon-md': { value: `${ICON_SIZE_MD}px` },
  'icon-lg': { value: `${ICON_SIZE_LG}px` },
  'icon-xl': { value: `${ICON_SIZE_XL}px` },
  'container-xs': { value: 'clamp(16rem, 90vw, 42rem)' },
  'container-sm': { value: 'clamp(16rem, 90vw, 48rem)' },
  'container-md': { value: 'clamp(16rem, 90vw, 64rem)' },
  'container-lg': { value: 'clamp(16rem, 90vw, 80rem)' },
};

export default sizes;
