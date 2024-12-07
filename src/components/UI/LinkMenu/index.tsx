import { hoverLinkStyle } from '@/ui/mixin';
import { css } from '@/ui/styled';

export const LinkStyle = css`
  display: inline-flex;
  align-items: center;
  padding: var(--space-½) var(--space-1);
  color: var(--color-gray-12);
  border-radius: var(--border-radius-4);

  ${hoverLinkStyle}
`;
