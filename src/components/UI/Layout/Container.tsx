import type { ReactNode } from 'react';
import { css, cx, styled } from '@/ui/styled';

type Props = {
  size?: 'small' | 'default' | 'large';
  space?: boolean;
  children: ReactNode;
  className?: string;
};

const sizeStyles = {
  small: css`
    max-width: var(--sizes-container-sm);
  `,
  default: css`
    max-width: var(--sizes-container-md);
  `,
  large: css`
    max-width: var(--sizes-container-lg);
  `,
} as const;

const Root = styled.div`
  width: 100%;
  margin: auto;
`;

const spaceStyle = css`
  padding-block: 0;
  padding-inline: var(--spacing-3);

  @media (--isMobile) {
    padding-inline: var(--spacing-2);
  }
`;

export function Container({ size = 'default', space = true, children, className }: Props): ReactNode {
  return <Root className={cx(className, space && spaceStyle, sizeStyles[size])}>{children}</Root>;
}
