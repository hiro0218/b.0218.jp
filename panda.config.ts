import { defineConfig } from '@pandacss/dev';
import { keyframes } from '@/ui/styled/animations';
import { dataCss, hljsCss } from '@/ui/styled/globals';
import globalVars from '@/ui/styled/variables';
import colorTokens from '@/ui/styled/variables/color';

export default defineConfig({
  // Whether to use css reset
  preflight: false,

  // styled system options
  syntax: 'template-literal',
  jsxFramework: 'react',

  // Where to look for your css declarations
  include: [
    './src/components/**/*.{ts,tsx}',
    './src/pages/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
    './src/ui/**/*.{ts,tsx}',
  ],
  exclude: ['./src/ui/lib/**/*.{ts,tsx}'],

  lightningcss: true,
  logLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  minify: process.env.NODE_ENV === 'production' ? true : false,
  hash: true,

  importMap: {
    css: '@/ui/styled/static',
    jsx: '@/ui/styled/static',
  },

  // Removing default tokens -> []
  presets: [],

  // Removing default utilities
  eject: true,

  // Global variables
  globalVars,

  globalCss: {
    ...dataCss,
    ...hljsCss,
  },

  theme: {
    extend: {
      keyframes,
      tokens: {
        colors: colorTokens,
      },
    },
  },

  // The output directory for your css system
  outdir: 'styled-system',
});
