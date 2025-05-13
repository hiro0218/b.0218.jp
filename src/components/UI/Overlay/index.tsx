import { styled } from '@/ui/styled/static';

type Props = {
  onClick: () => void;
};

export function Overlay({ onClick }: Props) {
  return <Div onClick={onClick} />;
}

const Div = styled.div`
  position: fixed;
  inset: 0;
  z-index: calc(var(--zIndex-search) - 1);
  visibility: hidden;
  background-color: var(--overlay-backgrounds);
  isolation: isolate;
  opacity: 0;
  transition:
    opacity 0.4s ease,
    visibility 0.4s ease;

  [data-is-zoom-image='true'] ~ &,
  dialog[open] ~ & {
    visibility: visible;
    opacity: 1;
    content-visibility: hidden;
  }
`;
