import { styled } from '@/ui/styled';

export const Container = styled.div`
  position: relative;
  display: flex;
`;

export const Trigger = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(var(--sizes-icon-sm) * 2);
  height: calc(var(--sizes-icon-sm) * 2);

  &:has(+ [aria-expanded='true']) {
    &::after {
      background-color: var(--colors-gray-a-200);
      opacity: 1;
      transform: scale(1);
    }
  }
`;

export const Content = styled.div`
  position: absolute;
  top: 100%;
  z-index: var(--z-index-base);
  visibility: hidden;
  min-width: max-content;
  height: fit-content;
  padding: var(--spacing-½);
  pointer-events: none;
  background-color: var(--colors-white);
  border: var(--border-widths-thin) solid var(--colors-gray-a-200);
  border-radius: var(--radii-sm);
  box-shadow: var(--shadows-md);
  opacity: 0;
  transform: scale(0.95);
  transition:
    opacity var(--transition-normal),
    transform var(--transition-normal),
    visibility 0s var(--durations-normal);

  &[data-position='left'] {
    left: 0;
    transform-origin: 0 0;
  }

  &[data-position='right'] {
    right: 0;
    transform-origin: 100% 0;
  }

  &[aria-expanded='true'] {
    visibility: visible;
    pointer-events: auto;
    transition-delay: 0s;
    animation: dropdownEnter var(--transition-slow) forwards;
  }

  @media (prefers-reduced-motion: reduce) {
    &[aria-expanded='true'] {
      opacity: 1;
      transform: scale(1);
      animation: none;
    }
  }
`;

export const MenuItemContainer = styled.div`
  & > a {
    display: flex;
    align-items: center;
    padding: var(--spacing-½) var(--spacing-1);
    line-height: var(--line-heights-lg);
    border-radius: var(--radii-sm);
  }
`;
