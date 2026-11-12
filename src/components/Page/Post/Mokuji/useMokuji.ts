import { Mokuji as MokujiJs, type MokujiOption } from 'mokuji.js';
import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';

import { HEADER_HEIGHT_PX } from '@/ui/styled/constant';

// SCROLL_SPY_OFFSET_PX を、post-content/index.css の scroll-margin-top（ヘッダー + 16px）より小さくしない。
// 目次のリンクで着地した見出しは、その位置に止まる。下回ると、押した項目が現在地にならない。
const SCROLL_SPY_OFFSET_PX = HEADER_HEIGHT_PX + 36;

const MOKUJI_OPTIONS: MokujiOption = {
  anchorType: false,
  anchorLink: true,
  anchorLinkSymbol: '#',
  anchorLinkPosition: 'after',
  scrollSpy: true,
  scrollSpyOffset: SCROLL_SPY_OFFSET_PX,
} as const;

type Props = {
  refContent: RefObject<HTMLDivElement>;
  /** 値は使わない。変わったとき（別の記事へ遷移したとき）に目次を作り直す合図 */
  pathname: string;
};

type ReturnProps = {
  mokujiContainerRef: RefObject<HTMLDivElement>;
  mokujiDetailsRef: RefObject<HTMLDetailsElement>;
  mokujiListContainerRef: RefObject<HTMLDivElement>;
};

export const useMokuji = ({ refContent, pathname }: Props): ReturnProps => {
  const mokujiContainerRef = useRef<HTMLDivElement>(null);
  const mokujiDetailsRef = useRef<HTMLDetailsElement>(null);
  const mokujiListContainerRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathnameはルーティング毎に目次を再生成するために必要
  useEffect(() => {
    if (!mokujiListContainerRef.current || !mokujiContainerRef.current || !refContent.current) {
      return;
    }

    // 目次の作成前は、一覧の入れ物を空にしない。前回の目次は、cleanup の destroy（mokuji.js が一覧と「#」リンクを DOM から取り除く）で消えているため
    const mokujiListElement = mokujiListContainerRef.current;
    const mokujiContainerElement = mokujiContainerRef.current;
    const articleContentElement = refContent.current;

    // 2 列目に置く配置かどうかは、breakpoint の数値で決めず、Mokuji.tsx のメディアクエリの適用結果（position: absolute）から読む。数値を足すと二重管理になるため
    const isSideLayout = () => getComputedStyle(mokujiContainerElement).position === 'absolute';
    let scrollFollowObserver: MutationObserver | null = null;

    const result = MokujiJs(articleContentElement, MOKUJI_OPTIONS);
    if (result) {
      const hasMokujiItems = result.list?.children.length > 0;
      if (hasMokujiItems) {
        mokujiListElement.appendChild(result.list);
        mokujiContainerElement.setAttribute('data-visible', 'true');

        // 「#」リンクの名前を「#」のままにしない。読み上げでは行き先が分からないため、見出しの文字を含めた名前にする。
        // 文字は見出しの textContent から取らない。「#」リンク自身の文字が混ざるため、目次の項目から取る（mokuji.js は目次の項目と「#」リンクを同じ見出しの順に作る）。
        const tocLinks = result.list.querySelectorAll('a');
        for (const [index, anchor] of articleContentElement.querySelectorAll('a[data-mokuji-anchor]').entries()) {
          anchor.setAttribute('aria-label', `「${tocLinks[index].textContent}」へのリンク`);
        }

        // 2 列目に置く配置では、初期値を閉じた状態としない。常時表示のサイドバーとして振る舞うため
        if (mokujiDetailsRef.current && isSideLayout()) {
          mokujiDetailsRef.current.open = true;
        }

        // インライン配置では scrollIntoView を呼ばない。ページ全体がスクロールしてしまうため
        scrollFollowObserver = new MutationObserver(() => {
          if (!isSideLayout()) return;
          const activeAnchor = mokujiListElement.querySelector("a[aria-current='true']");
          activeAnchor?.scrollIntoView({ block: 'nearest' });
        });
        scrollFollowObserver.observe(mokujiListElement, {
          attributes: true,
          attributeFilter: ['aria-current'],
          subtree: true,
        });
      } else {
        mokujiContainerElement.setAttribute('data-visible', 'false');
      }
    } else {
      // この else を省かない。見出しが 1 つも無い記事（引用の中にしか無い場合も含む）で、mokuji.js は空の目次を作らない。戻り値は undefined になる。
      // 上の hasMokujiItems の else には届かず、隠さないと、枠だけが出て、開いても空のままだ
      mokujiContainerElement.setAttribute('data-visible', 'false');
    }

    return () => {
      scrollFollowObserver?.disconnect();
      result?.destroy();
    };
  }, [pathname, refContent]);

  return { mokujiContainerRef, mokujiDetailsRef, mokujiListContainerRef };
};
