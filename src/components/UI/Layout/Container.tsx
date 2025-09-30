import type { CSSProperties, ReactNode } from 'react';
import { useMemo } from 'react';
import { styled } from '@/ui/styled';

type Props = {
  size?: 'small' | 'default' | 'large';
  space?: boolean;
  children: ReactNode;
  className?: string;
};

const getSize = (size: Props['size']) => {
  switch (size) {
    case 'small':
      return '768px';
    case 'default':
    default:
      return '1024px';
    case 'large':
      return '1280px';
  }
};

const Root = styled.div`
  width: 100%;
  max-width: var(--container-size);
  margin-inline: auto;

  &[data-has-space='true'] {
    padding-inline: var(--spacing-3);

    @media (--isMobile) {
      padding: 0 var(--spacing-3);
    }
  }
`;

export const Container = ({ space = true, size, children, className }: Props) => {
  const containerSize = getSize(size);

  const style = useMemo(
    () =>
      ({
        '--container-size': containerSize,
      }) as CSSProperties,
    [containerSize],
  );

  return (
    <Root className={className} {...(space && { 'data-has-space': space })} style={style}>
      {children}
    </Root>
  );
};
