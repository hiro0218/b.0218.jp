import { defineKeyframes } from '@pandacss/dev';

export const keyframes = defineKeyframes({
  dropdownEnter: {
    '0%': { opacity: '0', transform: 'scale(0.95)' },
    '100%': { opacity: '1', transform: 'scale(1)' },
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
      transform: 'scale3d(0.95, 0.95, 0.95)',
    },
    '100%': {
      opacity: '1',
      transform: 'scale3d(1, 1, 1)',
    },
  },
  zoomOut: {
    '0%': {
      opacity: '1',
      transform: 'scale3d(1, 1, 1)',
    },
    '100%': {
      opacity: '0',
      transform: 'scale3d(0.95, 0.95, 0.95)',
    },
  },
});
