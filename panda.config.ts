import { keyframes } from '@/ui/styled/animations';
import globalVars from '@/ui/styled/variables';
import { defineConfig } from '@pandacss/dev';

export default defineConfig({
  // Whether to use css reset
  preflight: false,

  // styled system options
  syntax: 'template-literal',
  jsxFramework: 'react',

  // Where to look for your css declarations
  include: ['./src/components/**/*.{ts,tsx}', './src/pages/**/*.{ts,tsx}', './src/ui/**/*.{ts,tsx}'],
  exclude: [],

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

  theme: {
    extend: {
      keyframes,
    },
  },

  // The output directory for your css system
  outdir: 'styled-system',
});
