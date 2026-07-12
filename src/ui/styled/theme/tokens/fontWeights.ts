import type { TokenValues } from './types';

// Noto Sans JP の名前付きインスタンスに一致させる: Regular(400) / Bold(700) / Black(900)。
// bold は CSS キーワード bold と同値の 700。font-synthesis: none 下でフォールバック(Meiryo Bold=700 等)でも一貫して太字化される。
const fontWeights: TokenValues<'fontWeights'> = {
  normal: { value: 400 },
  bold: { value: 700 },
  bolder: { value: 900 },
};

export default fontWeights;
