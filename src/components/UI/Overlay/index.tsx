import { styled } from '@/ui/styled';

type Props = {
  onClick: () => void;
};

export function Overlay({ onClick }: Props) {
  return <Div onClick={onClick} tabIndex={-1} />;
}

const Div = styled.div`
  position: fixed;
  inset: 0;
  z-index: var(--z-index-overlay);
  visibility: hidden;
  background-color: var(--colors-overlay-backgrounds);
  isolation: isolate;
  opacity: 0;
  transition:
    opacity 0.4s ease-out,
    visibility 0.4s ease-out;
  animation: fadeIn 0.4s ease-out;

  [data-is-zoom-image='true'] ~ &,
  dialog[open] ~ & {
    visibility: visible;
    content-visibility: hidden;
    opacity: 1;
  }
`;
