import type { CSSProperties, ReactNode } from 'react';
import { styled } from '@/ui/styled';

type Props = {
  size?: 'small' | 'default' | 'large';
  space?: boolean;
  children: ReactNode;
  className?: string;
};

const SIZE_MAP = {
  small: 'clamp(16rem, 90vw, 48rem)',
  default: 'clamp(16rem, 90vw, 64rem)',
  large: 'clamp(16rem, 90vw, 80rem)',
} as const;

const Root = styled.div`
  width: 100%;
  max-width: var(--container-size);
  margin: auto;

  &[data-has-space='true'] {
    padding-inline: var(--spacing-3);
    padding-block: 0;

    @media (--isMobile) {
      padding-inline: var(--spacing-2);
    }
  }
`;

export const Container = ({ space = true, size = 'default', children, className }: Props) => {
  const style = { '--container-size': SIZE_MAP[size] } as CSSProperties;

  return (
    <Root className={className} data-has-space={space} style={style}>
      {children}
    </Root>
  );
};
