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

  /*
   * 閉じている間はボックスごと消す(visibility ではなく display)。Chrome はボックスが残る限り、
   * 一度選んだ反転の向きを開閉をまたいで記憶するため
   * (position-try-fallbacks: none への切り替えでは記憶は消えない。Chrome 153 で確認)。
   * Anchor Positioning 未対応ブラウザの absolute 配置でも同じにして、開閉状態の作り方を 1 通りにする。
   */
  display: none;
  min-width: max-content;
  height: fit-content;
  padding: var(--spacing-75);
  background-color: var(--colors-white);
  border: var(--border-widths-thin) solid var(--colors-gray-a-200);
  border-radius: var(--radii-sm);
  box-shadow: var(--shadows-md);
  opacity: 0;
  transform: scale(0.95);

  /* 反転後の向きは CSS から判定できないため、向きに依存しない中央を起点にする。 */
  transform-origin: center;

  /*
   * 閉じるときは display: none になる前にフェードさせるため display も離散遷移させる。
   * transition-behavior は shorthand の後に置く(先に置くと shorthand が normal に戻す)。
   * Firefox は display の離散遷移に未対応なので閉じる側だけ即時に消える。
   */
  transition:
    opacity var(--transition-normal),
    transform var(--transition-normal),
    display var(--transition-normal);
  transition-behavior: allow-discrete;

  &[data-position='left'] {
    left: 0;
  }

  &[data-position='right'] {
    right: 0;
  }

  &[data-expanded='true'] {
    display: block;
    opacity: 1;
    transform: scale(1);

    /* display: none から現れる最初のフレームの値。ここから上の opacity / transform へ遷移する。
       表示状態を keyframes + forwards で作ると、閉じる側の transition が始まらないため通常の宣言にする */
    @starting-style {
      opacity: 0;
      transform: scale(0.95);
    }
  }

  & > a {
    display: flex;
    align-items: center;
    padding: var(--spacing-75) var(--spacing-100);
    line-height: var(--line-heights-lg);
    border-radius: var(--radii-sm);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
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
