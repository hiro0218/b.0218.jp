import { easeOut } from '@/ui/foundation/easing';
import { css } from '@/ui/styled';

export const textEllipsis = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const outlineLinkStyle = css`
  &:focus-visible {
    outline: 0;
    box-shadow: inset 0 0 0 2px var(--borders-7);
  }
`;

export const hoverLinkStyle = css`
  &:hover {
    background-color: var(--component-backgrounds-3A);
  }

  &:active {
    background-color: var(--component-backgrounds-4A);
  }

  ${outlineLinkStyle}
`;

export const showHoverBackground = css`
  position: relative;

  &::after {
    position: absolute;
    inset: 0;
    display: block;
    pointer-events: none;
    content: '';
    background-color: var(--component-backgrounds-3A);
    isolation: isolate;
    border-radius: var(--border-radius-8);
    transition:
      transform 0.1s ${easeOut},
      opacity 0.2s;
    transform: scale(0.5);
    opacity: 0;
    content-visibility: auto;
  }

  &:hover,
  &:focus,
  &:focus-within {
    &::after {
      opacity: 1;
      transform: scale(1);
    }
  }

  &:active {
    &::after {
      background-color: var(--component-backgrounds-4A);
    }
  }

  ${outlineLinkStyle}
`;

export const lineClamp = (lineCount = 2) => css`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${lineCount};
`;
