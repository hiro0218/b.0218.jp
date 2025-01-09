import { keyframes } from '@/ui/styled/animations';
import { colorVariables, easingVariables, fontVariables, spaceVariables } from '@/ui/styled/variables';
import { defineConfig } from '@pandacss/dev';

export default defineConfig({
  // Whether to use css reset
  preflight: false,

  // styled system options
  syntax: 'template-literal',
  jsxFramework: 'react',

  // Where to look for your css declarations
  include: ['./src/**/*.{ts,tsx}'],

  lightningcss: true,
  logLevel: 'debug',
  minify: true,

  importMap: {
    css: '@/ui/styled/static',
    jsx: '@/ui/styled/static',
  },

  // Removing default tokens -> []
  presets: [],

  // Removing default utilities
  eject: true,

  // Files to exclude
  exclude: ['./src/build/**/*.{ts,tsx}'],

  // Global variables
  globalVars: {
    ...fontVariables,
    ...spaceVariables,
    ...colorVariables,
    ...easingVariables,
  },

  theme: {
    extend: {
      keyframes,
    },
  },

  // The output directory for your css system
  outdir: 'styled-system',
});
