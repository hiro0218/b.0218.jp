const BASE_FONT_SIZE = 16;

export const pxToRem = (px: `${number}px` | number) => {
  const pxNumber = typeof px === 'string' ? Number(px.replace('px', '')) : px;
  return `${pxNumber / BASE_FONT_SIZE}rem`;
};
