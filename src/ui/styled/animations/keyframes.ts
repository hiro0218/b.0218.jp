import { defineKeyframes } from '@pandacss/dev';

export const keyframes = defineKeyframes({
  slideIn: {
    '0%': { transform: 'translateY(400px)', animationTimingFunction: 'ease-out' },
    '60%': { transform: 'translateY(-30px)', animationTimingFunction: 'ease-in' },
    '80%': { transform: 'translateY(10px)', animationTimingFunction: 'ease-out' },
    '100%': { transform: 'translateY(0)', animationTimingFunction: 'ease-in' },
  },
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
  fadeOut: {
    '0%': { opacity: '1' },
    '100%': { visibility: 'hidden', opacity: '0' },
  },
  floatingFade: {
    '0%': { transform: 'translateY(0)', opacity: '1' },
    '50%': { transform: 'translateY(-50%)', opacity: '0' },
    '50.1%': { transform: 'translateY(80%)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' },
  },
});
