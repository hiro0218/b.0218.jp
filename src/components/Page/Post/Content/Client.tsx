'use client';

import type { ReactNode } from 'react';
import { useRef } from 'react';
import { css, cx } from '@/ui/styled';
import { Mokuji } from '../Mokuji';
import { ArticleAd } from './ArticleAd';
import { WidgetManager } from './WidgetManager';

type ClientProps = {
  children: ReactNode;
};

export function Client({ children }: ClientProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div>
      <Mokuji className={mokujiStyle} refContent={ref} />
      {/* e-content を .post-content に付けない。広告分割で本文が複数の .post-content に分かれるため、全体を包むこの要素だけに付ける */}
      <section className={cx('e-content', contentStyle)} ref={ref}>
        {children}
      </section>
      <WidgetManager contentRef={ref} />
      <ArticleAd />
    </div>
  );
}

// 1024px 以上は上の余白を付けない。目次が PostContainer の 2 列目に重なる（Mokuji の absolute）ため
const mokujiStyle = css`
  margin-top: var(--spacing-400);

  @media (--isPostTwoColumn) {
    margin-top: 0;
  }
`;

const contentStyle = css`
  margin-top: var(--spacing-page);
`;
