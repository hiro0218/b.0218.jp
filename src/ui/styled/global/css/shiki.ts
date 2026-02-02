import { defineGlobalStyles } from '@pandacss/dev';

/**
 * Shiki syntax highlighting styles
 *
 * Shiki uses CSS variables for theming:
 * - --shiki-light: light theme token color
 * - --shiki-dark: dark theme token color
 * - --shiki-light-bg: light theme background color
 * - --shiki-dark-bg: dark theme background color
 */
export const shikiCss = defineGlobalStyles({
  '.shiki': {
    overflow: 'auto',
  },

  // Light mode
  'html:not(.dark) .shiki, html:not(.dark) .shiki span': {
    color: 'var(--shiki-light)',
  },

  // Dark mode
  '.dark .shiki, .dark .shiki span': {
    color: 'var(--shiki-dark)',
  },
});
