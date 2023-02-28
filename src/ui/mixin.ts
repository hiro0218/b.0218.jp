import { easeOut, easeOutBack } from '@/ui/foundation/easing';
import { css } from '@/ui/styled';

export const showHoverShadow = css`
  transition: box-shadow 0.3s ${easeOutBack};

  &:hover {
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.12);
  }
`;

export const showHoverBackground = css`
  position: relative;

  &::after {
    position: absolute;
    inset: 0;
    display: block;
    margin: auto;
    pointer-events: none;
    content: '';
    background-color: var(--component-backgrounds-3A);
    isolation: isolate;
    border-radius: var(--border-radius-8);
    opacity: 0;
    transition: transform 0.1s ${easeOut};
    transform: scale(0);
  }

  &:hover,
  &:focus,
  &:focus-within {
    &::after {
      width: 100%;
      height: 100%;
      opacity: 1;
      transform: scale(1);
    }
  }

  &:focus-visible {
    outline: 0;
    box-shadow: inset 0 0 0 2px var(--borders-7);
  }
`;
