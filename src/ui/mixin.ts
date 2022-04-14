import { css } from '@emotion/react';

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
    background-color: var(--component-backgrounds-4);
    border-radius: 0.25rem;
    transform: scale(0.1);
    opacity: 0;
    z-index: -1;
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s;
  }

  &:hover {
    &::after {
      opacity: 1;
      width: 100%;
      height: 100%;
      transform: scale(1);
    }
  }
`;
