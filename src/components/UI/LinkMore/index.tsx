import type { ReactNode } from 'react';

import { Anchor } from '@/components/UI/Anchor';
import { CaretRightIcon, ICON_SIZE_XS } from '@/ui/icons';
import { css, cx } from '@/ui/styled';

const linkMoreStyle = css`
  font-size: var(--font-sizes-sm);
`;

export function LinkMore({ href, text }: { href: string; text: string | ReactNode }) {
  return (
    <Anchor className={cx('link-style link-style--hover-effect', linkMoreStyle)} href={href}>
      {text}
      <CaretRightIcon aria-hidden="true" fill="currentColor" height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
    </Anchor>
  );
}
