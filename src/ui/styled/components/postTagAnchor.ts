import { css } from '@/ui/styled';

export const postTagAnchor = css`
  display: inline-flex;
  gap: var(--spacing-1);
  align-items: center;
  justify-content: center;
  min-height: var(--sizes-touch-target);
  padding: var(--spacing-½) var(--spacing-2);
  font-size: var(--font-sizes-sm);
  line-height: var(--line-heights-sm);
  color: var(--colors-gray-700);
  text-align: center;
  white-space: nowrap;
  background-color: var(--colors-gray-a-100);
  border-radius: var(--radii-md);

  @media (--isDesktop) {
    min-height: auto;
  }

  &:is(span) {
    color: var(--colors-gray-500);
    user-select: none;
  }

  &:hover {
    background-color: var(--colors-gray-a-200);
  }

  &:active {
    background-color: var(--colors-gray-a-300);
  }

  &:is(span):hover {
    cursor: not-allowed;
    background-color: var(--colors-gray-a-100);
  }
`;
