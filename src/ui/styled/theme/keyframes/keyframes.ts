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
  rotate: {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
  floatingFade: {
    '0%': { transform: 'translateY(0)', opacity: '1' },
    '50%': { transform: 'translateY(-50%)', opacity: '0' },
    '50.1%': { transform: 'translateY(80%)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' },
  },
  'view-transition-hide': {
    '0%': {
      opacity: '1',
      filter: 'blur(0)',
    },
    '100%': {
      opacity: '0',
      filter: 'blur(4px)',
    },
  },
  'view-transition-show': {
    '0%': {
      opacity: '0',
      filter: 'blur(2px)',
    },
    '100%': {
      opacity: '1',
      filter: 'blur(0)',
    },
  },
  zoomIn: {
    '0%': {
      opacity: '0',
      transform: 'scale3d(0.8, 0.8, 0.8)',
    },
    '50%': {
      opacity: '1',
    },
    '100%': {
      opacity: '1',
      transform: 'scale3d(1, 1, 1)',
    },
  },
  zoomOut: {
    '0%': {
      opacity: '1',
    },
    '50%': {
      opacity: '0',
      transform: 'scale3d(0.8, 0.8, 0.8)',
    },
    '100%': {
      opacity: '0',
    },
  },
});
