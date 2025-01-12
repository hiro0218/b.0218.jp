import { ICON_SIZE_LG, ICON_SIZE_MD, ICON_SIZE_SM, ICON_SIZE_XL, ICON_SIZE_XS } from '@/ui/icons';

export const iconVariables = {
  '--icon-size-xs': `${ICON_SIZE_XS}px`,
  '--icon-size-sm': `${ICON_SIZE_SM}px`,
  '--icon-size-md': `${ICON_SIZE_MD}px`,
  '--icon-size-lg': `${ICON_SIZE_LG}px`,
  '--icon-size-xl': `${ICON_SIZE_XL}px`,
} as const;
