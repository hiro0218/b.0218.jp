import type { TokenValues } from './types';

const fontsValues: TokenValues<'fonts'> = {
  'family-sans-serif': {
    value: ['Noto Sans JP', 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', 'Meiryo', 'sans-serif'],
  },
  'family-monospace': {
    value: [
      'SFMono-Regular',
      'Consolas',
      'Liberation Mono',
      'Menlo',
      'Apple Color Emoji',
      'Segoe UI Emoji',
      'Segoe UI Symbol',
      'Noto Color Emoji',
      'monospace',
    ],
  },
};

export default fontsValues;
