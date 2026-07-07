/**
 * Adobe Spectrum spacing スケール（primitive 12 段、2px〜96px）から抽出した余白トークン。
 * gap API（{@link SpaceGap}）はサイトで使用する 7 段の subset のみを公開する。
 */
import spacingTokens from '@adobe/spectrum-tokens/dist/json/variables.json' with { type: 'json' };

import { pxToRem } from '../../../lib/fonts';
import type { TokenValues } from './types';

const SPACING_SCALE = [50, 75, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000] as const;

const EXPECTED_PX: Record<(typeof SPACING_SCALE)[number], number> = {
  50: 2,
  75: 4,
  100: 8,
  200: 12,
  300: 16,
  400: 24,
  500: 32,
  600: 40,
  700: 48,
  800: 64,
  900: 80,
  1000: 96,
};

export type SpaceGap = 75 | 100 | 300 | 400 | 600 | 800 | 1000;

const spacingValues: TokenValues<'spacing'> = {};

for (const key of SPACING_SCALE) {
  const token = (spacingTokens as unknown as Record<string, { value: string } | undefined>)[`spacing-${key}`];

  // @adobe/spectrum-tokens の更新で token 名が消えた・変わった場合に codegen 時点で検知する
  if (!token) {
    throw new Error(`spacing-${key} not found in @adobe/spectrum-tokens variables.json`);
  }

  const px = Number(token.value.replace('px', ''));

  // スケール値の変更を codegen 時点で検知する（px 以外の書式に変わった場合も NaN 比較で必ず throw される）
  if (px !== EXPECTED_PX[key]) {
    throw new Error(`spacing-${key} expected ${EXPECTED_PX[key]}px but got ${token.value}`);
  }

  spacingValues[key] = { value: pxToRem(px) };
}

export default spacingValues;
