import type { ReactNode } from 'react';

import { Stack } from '@/components/UI/Layout/Stack';
import { css } from '@/ui/styled';

type Props = {
  children: ReactNode;
  /** 見出し下に表示する説明文 */
  paragraph?: ReactNode;
};

/**
 * ページタイトルコンポーネント。h1 見出しと任意の説明文を表示する。
 * @summary ページタイトル（h1 + 説明文）
 */
export function Title({ children, paragraph }: Props) {
  return (
    <Stack as="header" className={containerStyle} gap={100}>
      <h1 className={headingStyle}>{children}</h1>
      {!!paragraph && <p className={paragraphStyle}>{paragraph}</p>}
    </Stack>
  );
}

const containerStyle = css`
  overflow-wrap: break-word;
`;

const headingStyle = css`
  font-size: var(--font-sizes-display);
  /* xs（1.25）にしない。2 行以上に折り返すと行どうしが詰まる */
  line-height: var(--grid-line-height-sm);
  color: var(--colors-gray-900);
`;

// gray-600 にしない。ページ上部の帯の上で 4.5:1 に届かない（DESIGN.md の Colors）
const paragraphStyle = css`
  font-size: var(--font-sizes-md);
  line-height: var(--grid-line-height-body);
  color: var(--colors-gray-700);
`;
