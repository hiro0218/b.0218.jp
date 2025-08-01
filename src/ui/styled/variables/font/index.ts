import { fontSizeHeading } from './heading';
import { fontSizeVariables, lineHeightVariables } from './sizes';

export const fontVariables = {
  ...fontSizeVariables,
  ...fontSizeHeading,
  ...lineHeightVariables,
} as const;

export { type FontSizeHeadingProps, fontSizeHeading } from './heading';
export { fontSizeVariables, lineHeightVariables } from './sizes';
