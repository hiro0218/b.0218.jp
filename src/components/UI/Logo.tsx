import { Anchor } from '@/components/UI/Anchor';
import { SITE_NAME } from '@/constants';
import { css, cx } from '@/ui/styled';

const anchorStyle = css`
  padding: var(--spacing-100);
  pointer-events: auto;
`;

/**
 * サイトロゴ。トップページへのリンクを兼ねる。
 * @summary サイトロゴ（トップページリンク）
 */
export const Logo = () => {
  return (
    <Anchor className={cx('link-style link-style--hover-effect', anchorStyle)} href="/" prefetch={false}>
      <img alt={SITE_NAME} height="25" src="/logo.v2.svg" width="80" />
    </Anchor>
  );
};
