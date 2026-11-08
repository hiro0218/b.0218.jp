import { ICON_SIZE_LG, ICON_SIZE_MD, ICON_SIZE_SM, ICON_SIZE_XL, ICON_SIZE_XS } from '../../../iconSizes';
import { pxToRem } from '../../../lib/fonts';
import { HEADER_HEIGHT_PX } from '../../constant';
import type { TokenValues } from '../tokens/types';

const sizes: TokenValues<'sizes'> = {
  'icon-xs': { value: `${ICON_SIZE_XS}px` },
  'icon-sm': { value: `${ICON_SIZE_SM}px` },
  'icon-md': { value: `${ICON_SIZE_MD}px` },
  'icon-lg': { value: `${ICON_SIZE_LG}px` },
  'icon-xl': { value: `${ICON_SIZE_XL}px` },
  'container-md': { value: 'clamp(16rem, 90vw, 48rem)' },
  'container-lg': { value: 'clamp(16rem, 90vw, 80rem)' },
  'container-article': { value: '50rem' },
  'touch-target': { value: '44px' },
  control: { value: '36px' },
  // 4rem を直書きしない。スクロールの判定で使う HEADER_HEIGHT_PX と、値がずれるため
  header: { value: pxToRem(HEADER_HEIGHT_PX) },
  'link-preview-thumbnail': { value: '120px' },
};

export default sizes;
