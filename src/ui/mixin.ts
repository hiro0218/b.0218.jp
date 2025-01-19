import { css } from '@/ui/styled/dynamic';

export const lineClamp = (lineCount = 2) => css`
  display: -webkit-box;
  overflow-y: clip;
  -webkit-line-clamp: ${lineCount};
  -webkit-box-orient: vertical;
`;
