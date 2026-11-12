import { CaretRightIcon } from '@phosphor-icons/react/ssr';

import Link from 'next/link';
import type { ReactNode } from 'react';

import { ICON_SIZE_XS } from '@/ui/iconSizes';
import { css, cx } from '@/ui/styled';

// 右の内側の余白を打ち消す負の margin は、ルートではなく内側のアンカーに持たせる（Zero Margin Principle）。
const rootStyle = css`
  display: flex;
`;

const linkMoreStyle = css`
  /* 見本の 6px にしない。shadcn の標準値だが、4px の縦グリッドに乗らないため */
  gap: var(--spacing-75);
  margin-right: calc(var(--link-padding-inline) * -1);
  font-size: var(--font-sizes-sm);
  line-height: var(--grid-line-height-sm);
`;

/**
 * @summary 「もっと見る」リンク
 */
export function LinkMore({ href, text }: { href: string; text: string | ReactNode }) {
  return (
    <span className={rootStyle}>
      <Link className={cx('link-style link-style--hover-effect', linkMoreStyle)} href={href}>
        {text}
        <CaretRightIcon aria-hidden="true" height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
      </Link>
    </span>
  );
}
