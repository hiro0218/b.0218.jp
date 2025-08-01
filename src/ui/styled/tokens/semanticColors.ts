import { blue, grass, purple, red, yellow } from '@radix-ui/colors';

const semanticColorTokens = {
  darkBackgrounds: { value: { base: '{colors.grayA.12}' } },
  darkForegrounds: { value: { base: '{colors.gray.1}' } },
  overlayBackgrounds: { value: { base: '{colors.grayA.10}' } },
  bodyBackground: { value: { base: '{colors.gray.1}' } },
  backgroundAccentGradientFrom: { value: { base: '{colors.accent.4}' } },
  backgroundAccentGradientTo: { value: { base: '{colors.accent.3}' } },
  tableShadowColor: { value: { base: '{colors.grayA.3}' } },
  postNoteIcon: { value: { base: grass.grass11 } },
  alert: {
    note: { value: { base: blue.blue11 } },
    important: { value: { base: purple.purple11 } },
    warning: { value: { base: yellow.yellow11 } },
    caution: { value: { base: red.red11 } },
  },
};

export default semanticColorTokens;
