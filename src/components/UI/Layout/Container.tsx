import type { CSSProperties, ReactNode } from 'react';
import { css, cx, styled } from '@/ui/styled';

type Props = {
  size?: 'small' | 'default' | 'large';
  space?: boolean;
  children: ReactNode;
  className?: string;
};

const SIZE_MAP = {
  small: 'var(--sizes-container-sm)',
  default: 'var(--sizes-container-md)',
  large: 'var(--sizes-container-lg)',
} as const;

const Root = styled.div`
  width: 100%;
  max-width: var(--container-size);
  margin: auto;
`;

const spaceStyle = css`
  padding-block: 0;
  padding-inline: var(--spacing-3);

  @media (--isMobile) {
    padding-inline: var(--spacing-2);
  }
`;

export const Container = ({ space = true, size = 'default', children, className }: Props) => {
  const style = { '--container-size': SIZE_MAP[size] } as CSSProperties;

  return (
    <Root className={cx(className, space && spaceStyle)} style={style}>
      {children}
    </Root>
  );
};
