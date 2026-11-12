import { css } from '@/ui/styled';

// 既定の大きさ（min-height・padding・font-size・line-height・border-radius）をここに置かない。使う側が同じプロパティを上書きすると、勝ち負けは CSS の出力順で決まるため
export const postTagAnchor = css`
  display: inline-flex;
  gap: var(--spacing-100);
  align-items: center;
  justify-content: center;
  color: var(--colors-gray-700);
  text-align: center;
  white-space: nowrap;
  background-color: var(--colors-gray-a-100);

  /* リンクでないタグ（span）の文字色を gray-500 で弱めない。面の上で 2.49:1 になり、文字が読めないため */
  &:is(span) {
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
