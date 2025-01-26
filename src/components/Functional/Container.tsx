import { styled } from '@/ui/styled/dynamic';
import { SPACE_STEPS } from '@/ui/styled/variables/space';
import type { ReactNode } from 'react';

type Props = {
  size?: 'small' | 'default' | 'large' | string;
  space?: boolean;
  children: ReactNode;
  className?: string;
};

export const getSize = (size: Props['size']) => {
  const sizeValue = (() => {
    switch (size) {
      case 'small':
        // 768px
        return 96;
      case 'default':
      default:
        // 1024px
        return 128;
      case 'large':
        // 1280px
        return 160;
    }
  })();

  const space1 = SPACE_STEPS['--space-1'];

  return `calc(${sizeValue} * ${space1})`;
};

const _Container = styled.div<Props>`
  max-width: ${({ size }) => size};
  margin: var(--space-3) auto 0;

  &[data-has-space='true'] {
    padding-inline: var(--space-3);

    @media (--isMobile) {
      padding: 0 var(--space-3);
    }
  }
`;

export const Container = ({ space = true, size, children, className }: Props) => {
  return (
    <_Container className={className} data-has-space={space} size={size}>
      {children}
    </_Container>
  );
};
