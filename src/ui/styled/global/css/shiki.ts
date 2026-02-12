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

  // Language label
  'pre > code[data-language]::before': {
    content: 'attr(data-language)',
    marginBottom: 'var(--spacing-½)',
    display: 'block',
    fontSize: 'var(--font-sizes-xs)',
    color: 'var(--colors-gray-500)',
    pointerEvents: 'none',
  },

  // Light mode
  'html:not(.dark) .shiki, html:not(.dark) .shiki span': {
    color: 'var(--shiki-light)',
  },

  // Dark mode
  '.dark .shiki, .dark .shiki span': {
    color: 'var(--shiki-dark)',
  },

  // Diff highlighting
  '.shiki .line[data-diff="add"]': {
    backgroundColor: '#e6ffec',
  },
  '.shiki .line[data-diff="remove"]': {
    backgroundColor: '#ffebe9',
  },
  '.dark .shiki .line[data-diff="add"]': {
    backgroundColor: 'rgba(46, 160, 67, 0.15)',
  },
  '.dark .shiki .line[data-diff="remove"]': {
    backgroundColor: 'rgba(248, 81, 73, 0.15)',
  },
});
