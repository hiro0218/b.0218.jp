import { fontSizeHeading } from './heading';
import { fontSizeVariables } from './sizes';

export const fontVariables = {
  ...fontSizeVariables,
  ...fontSizeHeading,
} as const;

export { type FontSizeHeadingProps, fontSizeHeading } from './heading';
