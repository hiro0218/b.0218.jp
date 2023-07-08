import { notSrOnly, srOnly } from '@/components/Functional/CssBaseline/Generic';
import { fadeIn } from '@/ui/animation';
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
    transform: translate(-50%, 0%);
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
      animation: ${fadeIn} 0.6s ease;
      animation-fill-mode: both;
    }
  }
`;
