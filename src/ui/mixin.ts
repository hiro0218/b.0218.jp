import easing from '@/ui/foundation/easing';
import { css, keyframes } from '@/ui/styled';

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
    z-index: -1;
    inset: 0;
    width: 0;
    height: 0;
    margin: auto;
    transform: scale(0.1);
    transition: transform 0.4s ${easing.easeOutBack};
    border-radius: 0.25rem;
    opacity: 0;
    background-image: linear-gradient(120deg, var(--backgrounds-2), var(--component-backgrounds-4));
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

export const slideIn = keyframes`
  0% {
    transform: translateY(400px);
    animation-timing-function: ease-out;
  }
  60% {
    transform: translateY(-30px);
    animation-timing-function: ease-in;
  }
  80% {
    transform: translateY(10px);
    animation-timing-function: ease-out;
  }
  100% {
    transform: translateY(0);
    animation-timing-function: ease-in;
  }
`;

export const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;
