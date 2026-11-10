import Link from 'next/link';
import { SITE_NAME } from '@/constants';
import { css, cx } from '@/ui/styled';
import { stateLayerControl } from '@/ui/styled/components/stateLayerControl';

// padding-inline だけを変えない。Header.tsx と Footer.tsx の LogoContainer が、同じ値の負の margin で打ち消し、ロゴの左端を本文の左端にそろえているため
const anchorStyle = css`
  padding-inline: var(--control-padding-inline);
`;

/**
 * サイトロゴ。トップページへのリンクを兼ねる。
 * @summary サイトロゴ（トップページリンク）
 */
export const Logo = () => {
  return (
    <Link className={cx(stateLayerControl, anchorStyle)} href="/" prefetch={false}>
      <img alt={SITE_NAME} height="25" src="/logo.v2.svg" width="80" />
    </Link>
  );
};
