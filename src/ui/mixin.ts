import easing from '@/ui/foundation/easing';
import { css } from '@/ui/styled';

export const showHoverShadow = css`
  transition: box-shadow 0.3s ${easing.easeOutBack};

  &:hover {
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.12);
  }
`;

export const showHoverBackground = css`
  position: relative;

  &::after {
    content: '';
    display: block;
    position: absolute;
    isolation: isolate;
    inset: 0;
    margin: auto;
    transform: scale(0);
    transition: transform 0.1s ${easing.easeOut};
    border-radius: 0.25rem;
    opacity: 0;
    background-image: linear-gradient(120deg, var(--backgrounds-2A), var(--component-backgrounds-4A));
    pointer-events: none;
  }

  &:hover,
  &:focus,
  &:focus-within {
    &::after {
      width: 100%;
      height: 100%;
      transform: scale(1);
      opacity: 1;
    }
  }

  &:focus-visible {
    outline: 0;
    box-shadow: inset 0 0 0 2px var(--borders-7);
  }
`;
