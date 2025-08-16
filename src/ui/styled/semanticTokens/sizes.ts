import { ICON_SIZE_LG, ICON_SIZE_MD, ICON_SIZE_SM, ICON_SIZE_XL, ICON_SIZE_XS } from '@/ui/icons';
import type { TokenValues } from '../tokens/types';

export const sizes: TokenValues<'sizes'> = {
  'icon-xs': { value: `${ICON_SIZE_XS}px` },
  'icon-sm': { value: `${ICON_SIZE_SM}px` },
  'icon-md': { value: `${ICON_SIZE_MD}px` },
  'icon-lg': { value: `${ICON_SIZE_LG}px` },
  'icon-xl': { value: `${ICON_SIZE_XL}px` },
};

export default sizes;
