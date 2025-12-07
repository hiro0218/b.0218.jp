const semanticColorTokens = {
  // Existing tokens
  darkBackgrounds: { value: { base: '{colors.grayA.1000}' } },
  darkForegrounds: { value: { base: '{colors.gray.25}' } },
  overlayBackgrounds: { value: { base: '{colors.grayA.900}' } },
  bodyBackground: { value: { base: '{colors.gray.25}' } },
  backgroundAccentGradientFrom: { value: { base: '{colors.accent.300}' } },
  backgroundAccentGradientTo: { value: { base: '{colors.accent.200}' } },
  tableShadowColor: { value: { base: '{colors.grayA.100}' } },
  postNoteIcon: { value: { base: '{colors.grass.1200}' } },

  // Adobe Spectrum semantic colors
  // https://spectrum.adobe.com/page/color-system/
  spectrum: {
    informative: { value: { base: '{colors.blue.1200}' } }, // 情報（Informative）
    accent: { value: { base: '{colors.blue.1200}' } }, // 強調（Accent）
    negative: { value: { base: '{colors.red.1200}' } }, // 否定/エラー（Negative）
    notice: { value: { base: '{colors.orange.1200}' } }, // 注意（Notice）
    positive: { value: { base: '{colors.grass.1200}' } }, // 肯定/成功（Positive）
  },

  // Alert variants (existing)
  alert: {
    note: { value: { base: '{colors.blue.1200}' } },
    important: { value: { base: '{colors.purple.1200}' } },
    warning: { value: { base: '{colors.yellow.1200}' } },
    caution: { value: { base: '{colors.red.1200}' } },
  },
};

export default semanticColorTokens;
