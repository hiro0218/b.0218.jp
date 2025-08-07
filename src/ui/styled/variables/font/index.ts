import { fontSizeHeading } from './heading';
import { fontSizeVariables } from './sizes';

const globalVars = {
  '--container-width': '800px',
};

export const fontVariables = {
  ...globalVars,
  ...fontSizeVariables,
  ...fontSizeHeading,
} as const;

export { type FontSizeHeadingProps, fontSizeHeading } from './heading';
