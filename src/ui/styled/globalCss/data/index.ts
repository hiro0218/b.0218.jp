import type { GlobalStyleObject } from '@pandacss/types';
import { fontSizeDataStyles } from './fontSizes';
import { spacingDataStyles } from './spacing';

export const dataCss: GlobalStyleObject = {
  ...spacingDataStyles,
  ...fontSizeDataStyles,
};
