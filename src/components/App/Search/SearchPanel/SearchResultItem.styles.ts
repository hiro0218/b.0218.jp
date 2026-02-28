import { css } from '@/ui/styled';

export const LinkContainerStyle = css`
  cursor: pointer;
  user-select: none;
  border-radius: var(--radii-8);
`;

export const FocusedContainerStyle = css`
  background-color: var(--colors-gray-100);
  box-shadow: inset 0 0 0 2px var(--colors-gray-a-1000);
`;

export const AnchorStyle = css`
  display: flex;
  gap: var(--spacing-2);
  align-items: center;
  padding: var(--spacing-1) var(--spacing-2);
  font-size: var(--font-sizes-sm);
  border-radius: var(--radii-8);

  &:hover {
    background-color: var(--colors-gray-a-100);
  }

  &:active {
    background-color: var(--colors-gray-a-200);
  }

  &:focus {
    outline: none;
    background-color: transparent;
  }

  svg {
    flex-shrink: 0;
    color: var(--colors-gray-800);
  }
`;
