import { css } from '@/ui/styled';

/**
 * `link-style--hover-effect` の class と一緒に付ける。hover の面（::before）はその class が描き、ここでは面の形（円）と、`data-active='true'` のときに面を強制して出す指定だけを決める。
 * IconButton（`<button>`）と IconLink（`<a>`）が共有する。
 */
export const iconControl = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--control-min-size);
  height: var(--control-min-size);
  color: var(--colors-gray-1000);
  cursor: pointer;
  background-color: transparent;
  border: none;
  border-radius: var(--radii-full);
  transition: transform var(--transition-fast);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  &::before {
    border-radius: var(--radii-full);
  }

  &:active {
    transform: scale(0.96);
  }

  &:disabled {
    cursor: not-allowed;
  }

  &[data-size='touch'] {
    width: var(--sizes-touch-target);
    height: var(--sizes-touch-target);
  }

  &[data-active='true']::before {
    background-color: var(--colors-gray-a-200);
    opacity: 1;
    transform: scale(1);
  }
`;
