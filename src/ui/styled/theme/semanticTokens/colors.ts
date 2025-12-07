const semanticColorTokens = {
  darkBackgrounds: { value: { base: '{colors.grayA.1000}' } },
  darkForegrounds: { value: { base: '{colors.gray.25}' } },
  overlayBackgrounds: { value: { base: '{colors.grayA.500}' } },
  bodyBackground: { value: { base: '{colors.gray.50}' } },
  backgroundAccentGradientFrom: { value: { base: '{colors.accent.300}' } },
  backgroundAccentGradientTo: { value: { base: '{colors.accent.200}' } },
  tableShadowColor: { value: { base: '{colors.grayA.100}' } },
  postNoteIcon: { value: { base: '{colors.grass.1200}' } },

  // Alert variants (existing)
  alert: {
    note: { value: { base: '{colors.blue.1200}' } },
    important: { value: { base: '{colors.purple.1200}' } },
    warning: { value: { base: '{colors.yellow.1200}' } },
    caution: { value: { base: '{colors.red.1200}' } },
  },
};

export default semanticColorTokens;
