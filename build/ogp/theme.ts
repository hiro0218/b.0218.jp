import spectrumTokens from '@adobe/spectrum-tokens/dist/json/variables.json' with { type: 'json' };

export type OgpTheme = {
  background: string;
  text: string;
  footerText: string;
  decorationEnd: string;
  decorationEndOpacity: string;
  decorationStart: string;
  decorationStartOpacity: string;
};

type SpectrumColorToken = {
  sets?: { light?: { value?: string } };
  value?: string | number;
};

const CONAN_TAG = '名探偵コナン';
const spectrumColorTokens = spectrumTokens as unknown as Record<string, SpectrumColorToken>;

const getLightColor = (tokenName: string): string => {
  const value = spectrumColorTokens[tokenName]?.sets?.light?.value;

  if (!value) {
    throw new Error(`Spectrum light color token not found: ${tokenName}`);
  }

  return value;
};

const getColorValue = (tokenName: string): string => {
  const value = spectrumColorTokens[tokenName]?.value;

  if (typeof value !== 'string') {
    throw new Error(`Spectrum color token not found: ${tokenName}`);
  }

  return value;
};

const COMMON_OGP_THEME = {
  background: getLightColor('gray-100'),
  text: getLightColor('gray-800'),
  footerText: getLightColor('gray-600'),
} satisfies Pick<OgpTheme, 'background' | 'text' | 'footerText'>;

const DEFAULT_OGP_THEME: OgpTheme = {
  ...COMMON_OGP_THEME,
  decorationEnd: getColorValue('transparent-black-75'),
  decorationEndOpacity: '1',
  decorationStart: getColorValue('transparent-black-75'),
  decorationStartOpacity: '1',
};

const CONAN_OGP_THEME: OgpTheme = {
  ...COMMON_OGP_THEME,
  decorationEnd: getLightColor('red-500'),
  decorationEndOpacity: '0.5',
  decorationStart: getLightColor('blue-500'),
  decorationStartOpacity: '0.5',
};

export const getOgpTheme = (tags: readonly string[]): OgpTheme =>
  tags.includes(CONAN_TAG) ? CONAN_OGP_THEME : DEFAULT_OGP_THEME;
