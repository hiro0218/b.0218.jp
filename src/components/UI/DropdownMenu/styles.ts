import { css, styled } from '@/ui/styled';

export const Container = styled.div`
  position: relative;
  display: flex;

  /* 同じページに複数のドロップダウンがあっても、各パネルが自分のトリガーだけを基準にするようアンカー名の有効範囲を閉じる */
  @supports (anchor-scope: --dropdown-trigger) and (position-anchor: --dropdown-trigger) and (position-area: bottom) and
    (position-try-fallbacks: flip-inline) {
    anchor-scope: --dropdown-trigger;
  }
`;

/** トリガーを Anchor Positioning のアンカーにする。対応ブラウザでのみ有効 */
export const triggerAnchorStyle = css`
  @supports (anchor-scope: --dropdown-trigger) and (position-anchor: --dropdown-trigger) and (position-area: bottom) and
    (position-try-fallbacks: flip-inline) {
    anchor-name: --dropdown-trigger;
  }
`;

export const Content = styled.div`
  position: absolute;
  top: 100%;
  z-index: var(--z-index-base);
  visibility: hidden;
  min-width: max-content;
  height: fit-content;
  padding: var(--spacing-75);
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

  &[data-expanded='true'] {
    visibility: visible;
    pointer-events: auto;
    transition-delay: 0s;
    animation: dropdownEnter var(--transition-slow) forwards;
  }

  & > a {
    display: flex;
    align-items: center;
    padding: var(--spacing-75) var(--spacing-100);
    line-height: var(--line-heights-lg);
    border-radius: var(--radii-sm);
  }

  @media (prefers-reduced-motion: reduce) {
    &[data-expanded='true'] {
      opacity: 1;
      transform: scale(1);
      animation: none;
    }
  }

  /*
   * 対応ブラウザではトリガーに紐づけて viewport 基準で配置し、はみ出す場合は左右・上下を自動で反転する。
   * 未対応ブラウザは上の absolute 配置のまま。
   * position: fixed にするのは、はみ出し判定の基準（包含ブロック）を Container ではなく viewport にするため。
   */
  @supports (anchor-scope: --dropdown-trigger) and (position-anchor: --dropdown-trigger) and (position-area: bottom) and
    (position-try-fallbacks: flip-inline) {
    position: fixed;
    position-anchor: --dropdown-trigger;
    position-try-fallbacks: flip-inline, flip-block, flip-block flip-inline;

    /*
     * 閉じている間はボックスごと消す。Chrome はボックスが残る限り、一度選んだ反転の向きを開閉をまたいで記憶し、
     * 読み進めて画面下から入ってくるトリガーでは上向きが記憶されて、下に余白があっても常に上に開いてしまうため
     * （position-try-fallbacks: none への切り替えでは記憶は消えない。Chrome 153 で確認）。
     */
    &[data-expanded='false'] {
      display: none;
    }

    /* 基底の top: 100% と、&[data-position] の left: 0 / right: 0 を打ち消す。同じ詳細度で後勝ちにするため同じセレクタに書く */
    &[data-position='left'] {
      inset: auto;
      position-area: bottom span-right;
    }

    &[data-position='right'] {
      inset: auto;
      position-area: bottom span-left;
    }
  }
`;
