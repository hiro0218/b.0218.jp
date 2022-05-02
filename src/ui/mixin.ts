import easing from '@/ui/foundation/easing';
import { css, keyframes } from '@/ui/styled';

export const showHoverBackground = css`
  position: relative;

  &::after {
    content: '';
    position: absolute;
    display: block;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 50%;
    height: 50%;
    background-image: linear-gradient(120deg, var(--backgrounds-2), var(--component-backgrounds-4));
    border-radius: 0.25rem;
    transform: scale(0.1);
    opacity: 0;
    z-index: -1;
    transition: transform 0.4s ${easing.easeOutBack}, opacity 0.4s;
  }

  &:hover,
  &:focus {
    &::after {
      opacity: 1;
      width: 100%;
      height: 100%;
      transform: scale(1);
    }
  }

  &:focus {
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
