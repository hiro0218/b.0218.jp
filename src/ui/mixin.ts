import { css } from '@/ui/styled/dynamic';

export const hoverLinkStyle = css`
  &:hover {
    background-color: var(--color-gray-3A);
  }

  &:active {
    background-color: var(--color-gray-4A);
  }

  &:focus-visible {
    outline: 0;
    box-shadow: inset 0 0 0 2px var(--color-gray-7);
  }
`;

export const lineClamp = (lineCount = 2) => css`
  display: -webkit-box;
  overflow-y: clip;
  -webkit-line-clamp: ${lineCount};
  -webkit-box-orient: vertical;
`;
