import { notSrOnly, srOnly } from '@/ui/styled/CssBaseline/Utilities';
import { styled } from '@/ui/styled/dynamic';

type Props = {
  text: string;
  position?: 'top' | 'bottom';
};

export const Tooltip = ({ text, position = 'bottom' }: Props) => {
  return (
    <Container>
      <span data-position={position} dangerouslySetInnerHTML={{ __html: text }} />
    </Container>
  );
};

const Container = styled.span`
  position: absolute;
  z-index: var(--zIndex-base);
  width: 100%;
  height: 100%;
  text-align: center;
  user-select: none;

  & > span {
    ${srOnly}

    left: 50%;
    font-size: var(--font-size-xs);
    line-height: var(--line-height-sm);
    transition: transform 0.4s var(--easing-ease-out-expo);
    will-change: transform;

    &[data-position='top'] {
      bottom: calc(100% + var(--space-½));
      transform: translate(-50%, 100%);
    }

    &[data-position='bottom'] {
      top: calc(100% + var(--space-½));
      transform: translate(-50%, -100%);
    }
  }

  &:hover {
    & > span {
      ${notSrOnly}

      position: absolute;
      padding: var(--space-½) var(--space-1);
      line-height: var(--line-height-md);
      color: var(--dark-foregrounds);
      white-space: nowrap;
      pointer-events: none;
      background-color: var(--dark-backgrounds);
      border-radius: var(--border-radius-4);
      transform: translate(-50%, 0%);
    }
  }
`;
