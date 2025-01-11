import { Anchor } from '@/components/UI/Anchor';
import { SITE_NAME } from '@/constant';
import { css, cx } from '@/ui/styled/static';

export const Logo = () => {
  return (
    <Anchor
      className={cx(
        'link-style link-style--hover-effect',
        css`
          padding: var(--space-1);
          pointer-events: auto;
        `,
      )}
      href="/"
      prefetch={false}
    >
      <img src="/logo.v2.svg" alt={SITE_NAME} height="25" width="80" />
    </Anchor>
  );
};
