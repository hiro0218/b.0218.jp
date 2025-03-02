import { styled } from '@/ui/styled/static';
import { SPACE_STEPS } from '@/ui/styled/variables/space';
import type { CSSProperties, ReactNode } from 'react';

type Props = {
  size?: 'small' | 'default' | 'large';
  space?: boolean;
  children: ReactNode;
  className?: string;
};

const getSize = (size: Props['size']) => {
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

const Root = styled.div`
  max-width: var(--container-size);
  margin-inline: auto;

  &[data-has-space='true'] {
    padding-inline: var(--space-3);

    @media (--isMobile) {
      padding: 0 var(--space-3);
    }
  }
`;

export const Container = ({ space = true, size, children, className }: Props) => {
  const containerSize = getSize(size);
  return (
    <Root
      className={className}
      {...(space && { 'data-has-space': space })}
      style={
        {
          '--container-size': containerSize,
        } as CSSProperties
      }
    >
      {children}
    </Root>
  );
};
