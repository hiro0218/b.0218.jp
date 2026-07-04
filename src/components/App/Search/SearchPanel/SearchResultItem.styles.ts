import { css } from '@/ui/styled';

export const LinkContainerStyle = css`
  cursor: pointer;
  user-select: none;
  scroll-margin-block: var(--spacing-100);
  border-radius: var(--radii-md);
`;

export const FocusedContainerStyle = css`
  background-color: var(--colors-gray-100);
`;

export const AnchorStyle = css`
  display: flex;
  gap: var(--spacing-300);
  align-items: center;
  padding: var(--spacing-100) var(--spacing-300);
  font-size: var(--font-sizes-sm);
  border-radius: var(--radii-md);

  &:hover {
    background-color: var(--colors-gray-a-100);
  }

  &:active {
    background-color: var(--colors-gray-a-200);
  }

  &:focus-visible {
    outline: var(--border-widths-medium) solid var(--colors-gray-a-1000);
    outline-offset: var(--spacing-75);
    background-color: transparent;
  }

  svg {
    flex-shrink: 0;
    color: var(--colors-gray-800);
  }
`;
