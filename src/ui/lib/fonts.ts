import breakpoints from '../breakpoints.json';

const BASE_FONT_SIZE = 16;

export const pxToRem = (px: `${number}px` | number): `${number}rem` => {
  const pxNumber = typeof px === 'string' ? Number(px.replace('px', '')) : px;
  return `${pxNumber / BASE_FONT_SIZE}rem`;
};

const MIN_VIEWPORT = 430;
// constants.ts の BREAKPOINT を使わない。URL や広告の値を持つサイト定数に、Panda のトークン生成が依存するため
const MAX_VIEWPORT = breakpoints.desktopPx;

export const clampFontSize = (maxValue: number, minValue: number) => {
  if (maxValue === minValue) {
    return `${maxValue}px`;
  }

  const slope = `${(maxValue - minValue) / (MAX_VIEWPORT - MIN_VIEWPORT)}`;
  const fluidFontSize = `calc(${slope} * (100vw - ${MIN_VIEWPORT}px) + ${minValue}px)`;

  return `clamp(${minValue}px, ${fluidFontSize}, ${maxValue}px)`;
};
