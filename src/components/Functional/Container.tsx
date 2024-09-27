import { isMobile } from '@/ui/lib/mediaQuery';
import { styled } from '@/ui/styled';

type Props = {
  size?: 'small' | 'default' | 'large';
  space?: boolean;
};

const getSize = (size: Props['size']) => {
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
};

export const Container = styled.div<Props>`
  max-width: ${({ size }) => `calc(var(--space-1) * ${getSize(size)})`};
  padding-inline: ${({ space = true }) => space && 'var(--space-3)'};
  margin: var(--space-3) auto 0;

  ${isMobile} {
    padding: ${({ space = true }) => space && '0 var(--space-3)'};
  }
`;
