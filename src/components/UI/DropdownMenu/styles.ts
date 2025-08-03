import { styled } from '@/ui/styled/static';

/**
 * ドロップダウンメニューのコンテナ要素
 * 相対位置を指定し、メニューの位置の基準点となる
 */
export const Container = styled.div`
  position: relative;
  display: flex;
`;

/**
 * ドロップダウンメニューのトリガーボタン
 * クリックするとメニューが開閉する
 */
export const Trigger = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(var(--icon-size-sm) * 2);
  height: calc(var(--icon-size-sm) * 2);

  &:has(+ [aria-expanded='true']) {
    &::after {
      background-color: var(--colors-gray-a-4);
      opacity: 1;
      transform: scale(1);
    }
  }
`;

/**
 * ドロップダウンメニューのコンテンツ部分
 * aria-expanded属性によって表示/非表示が切り替わる
 */
export const Content = styled.div`
  position: absolute;
  top: 100%;
  z-index: var(--zIndex-base);
  min-width: max-content;
  height: fit-content;
  padding: var(--space-½);
  content-visibility: hidden;
  background-color: var(--colors-white);
  border: 1px solid var(--colors-gray-a-4);
  border-radius: var(--radii-4);
  box-shadow: var(--shadows-md);
  opacity: 0;
  transform: scale(0.8);
  transition: transform 0.1s linear;

  &[data-position='left'] {
    left: 0;
  }

  &[data-position='right'] {
    right: 0;
  }

  &[aria-expanded='true'] {
    content-visibility: visible;
    opacity: 1;
    transform: scale(1);

    @starting-style {
      opacity: 0;
    }
  }

  & > a {
    padding: var(--space-½) var(--space-1);
    line-height: var(--line-heights-lg);
    border-radius: var(--radii-4);
  }
`;
