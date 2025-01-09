import { easeOut, easeOutExpo } from '@/ui/foundation/easing';

export const easingVariables = {
  '--easing-ease-out': easeOut,
  '--easing-ease-out-expo': easeOutExpo,
} as const;
