import { css } from '@/ui/styled';

export const postTagAnchor = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-½) var(--spacing-2);
  font-size: var(--font-sizes-sm);
  line-height: var(--line-heights-sm);
  color: var(--colors-gray-700);
  text-align: center;
  white-space: nowrap;
  background-color: var(--colors-gray-a-100);
  border-radius: var(--radii-8);

  &:hover {
    background-color: var(--colors-gray-a-200);
  }

  &:active {
    background-color: var(--colors-gray-a-300);
  }

  /* 要素がspanの場合 */
  &:is(span) {
    &:hover {
      cursor: not-allowed;
      background-color: var(--colors-gray-a-100);
    }
  }
`;
