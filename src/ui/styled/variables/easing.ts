import { easeInOutCirc, easeOut, easeOutExpo } from 'css-in-js-easing';

export const easingVariables = {
  '--easing-ease-out': easeOut,
  '--easing-ease-in-out-circ': easeInOutCirc,
  '--easing-ease-out-expo': easeOutExpo,
} as const;
