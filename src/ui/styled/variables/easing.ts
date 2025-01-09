import { easeOut, easeOutExpo } from 'css-in-js-easing';

export const easingVariables = {
  '--easing-ease-out': easeOut,
  '--easing-ease-out-expo': easeOutExpo,
} as const;
