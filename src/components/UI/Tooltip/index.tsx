import { notSrOnly, srOnly } from '@/components/Functional/CssBaseline/Generic';
import { fadeIn } from '@/ui/animation';
import { easeOutExpo } from '@/ui/foundation/easing';
import { styled } from '@/ui/styled';

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
  z-index: 1;
  width: 100%;
  height: 100%;

  & > span {
    ${srOnly}

    top: calc(100% + var(--space-½));
    left: 50%;
    font-size: var(--font-size-xs);
    line-height: var(--line-height-sm);
    transform: translate(-50%, 0%);
    will-change: opacity;
  }

  &:hover {
    & > span {
      ${notSrOnly}

      position: absolute;
      padding: var(--space-½) var(--space-1);
      line-height: 1.5;
      color: var(--dark-foregrounds);
      white-space: nowrap;
      pointer-events: none;
      background-color: var(--dark-backgrounds);
      border-radius: var(--border-radius-4);
      animation: ${fadeIn} 1s ${easeOutExpo};
      animation-fill-mode: both;
    }
  }
`;
