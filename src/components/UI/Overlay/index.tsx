import { styled } from '@/ui/styled/static';

type Props = {
  onClick: () => void;
};

export function Overlay({ onClick }: Props) {
  return <Div onClick={onClick} tabIndex={-1} />;
}

const Div = styled.div`
  position: fixed;
  inset: 0;
  z-index: var(--zIndex-overlay);
  visibility: hidden;
  background-color: var(--colors-semantic-overlay-backgrounds);
  isolation: isolate;
  opacity: 0;
  transition:
    opacity 0.4s ease,
    visibility 0.4s ease;
  animation: fadeIn 0.4s ease;

  [data-is-zoom-image='true'] ~ &,
  dialog[open] ~ & {
    visibility: visible;
    content-visibility: hidden;
    opacity: 1;
  }
`;
