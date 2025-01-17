import { notSrOnly, srOnly } from '@/ui/styled/CssBaseline/Utilities';
import { styled } from '@/ui/styled/dynamic';

type Props = {
  text: string;
};

export const Tooltip = ({ text }: Props) => {
  return (
    <Container>
      <span>{text}</span>
    </Container>
  );
};

const Container = styled.span`
  position: absolute;
  z-index: var(--zIndex-base);
  width: 100%;
  height: 100%;
  user-select: none;

  & > span {
    ${srOnly}

    top: calc(100% + var(--space-½));
    left: 50%;
    font-size: var(--font-size-xs);
    line-height: var(--line-height-sm);
    transform: translate(-50%, -100%);
    transition: transform 0.2s var(--easing-ease-out-expo);
    will-change: opacity, transform;
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
