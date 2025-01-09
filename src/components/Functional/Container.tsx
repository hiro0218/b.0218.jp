import { isMobile } from '@/ui/lib/mediaQuery';
import { SPACE_STEPS } from '@/ui/styled/CssBaseline/Settings/Space';
import { styled } from '@/ui/styled/dynamic';

type Props = {
  size?: 'small' | 'default' | 'large' | string;
  space?: boolean;
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

export const Container = styled.div<Props>`
  max-width: ${({ size }) => size};
  padding-inline: ${({ space = true }) => space && 'var(--space-3)'};
  margin: var(--space-3) auto 0;

  ${isMobile} {
    padding: ${({ space = true }) => space && '0 var(--space-3)'};
  }
`;
