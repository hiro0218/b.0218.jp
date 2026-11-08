import { css } from '@/ui/styled';

/**
 * 現在地の文字を太字にしない。DESIGN.md の「ナビの現在地」が、文字は 400 のままと定めているため。
 * 層を background-color で重ねない。現在地の面が background-color を使うため。
 * 影と枠線では区別しない。面と余白で区切るデザインのため、状態の区別も色相を使わず、濃さの差だけにする。
 */
export const stateLayerControl = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: var(--control-min-size);
  min-height: var(--control-min-size);
  color: var(--colors-gray-900);
  cursor: pointer;
  background-color: transparent;
  border-radius: var(--radii-md);

  &:hover {
    background-image: linear-gradient(var(--colors-gray-a-75), var(--colors-gray-a-75));
  }

  &:active {
    background-image: linear-gradient(var(--colors-gray-a-300), var(--colors-gray-a-300));
  }

  &[aria-current='page'] {
    background-color: var(--colors-gray-a-200);
  }

  &:focus-visible {
    outline: var(--border-widths-medium) solid transparent;
    outline-offset: var(--border-widths-medium);
    box-shadow: var(--focus-ring-shadow);
  }
`;

/**
 * 自分の面（background-color）を持つ要素に重ねる。
 * 重ねる側の class に background-image を持たせない。
 * 層は background-image で重なる。同じ property を持つ class と合成した場合、適用順が定まらないため。
 */
export const stateLayer = css`
  &:hover {
    background-image: linear-gradient(var(--colors-gray-a-75), var(--colors-gray-a-75));
  }

  &:active {
    background-image: linear-gradient(var(--colors-gray-a-300), var(--colors-gray-a-300));
  }
`;
