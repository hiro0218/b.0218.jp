import { keyframes } from '@/ui/styled';

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

export const fade = (type: 'in' | 'out') => {
  if (type === 'in') {
    return fadeIn;
  } else if (type === 'out') {
    return fadeOut;
  }
};

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    visibility: hidden;
    opacity: 0;
  }
`;
