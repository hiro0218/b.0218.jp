import { defineConfig } from '@pandacss/dev';
import { keyframes } from '@/ui/styled/animations';
import { dataCss, hljsCss } from '@/ui/styled/globalCss';
import { semanticTokens } from '@/ui/styled/semanticTokens';
import { tokens } from '@/ui/styled/tokens';
import globalVars from '@/ui/styled/variables';

export default defineConfig({
  // Whether to use css reset
  preflight: false,

  // styled system options
  syntax: 'template-literal',
  jsxFramework: 'react',

  // Where to look for your css declarations
  include: ['./src/{app,components,ui}/**/*.{ts,tsx}'],
  exclude: ['./src/ui/lib/**/*.{ts,tsx}'],

  lightningcss: true,
  logLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  minify: process.env.NODE_ENV === 'production' ? true : false,
  hash: {
    cssVar: false,
    className: true,
  },

  importMap: {
    css: '@/ui/styled',
    jsx: '@/ui/styled',
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
    tokens,
    semanticTokens,
    keyframes,
  },

  // The output directory for your css system
  outdir: 'styled-system',
});
