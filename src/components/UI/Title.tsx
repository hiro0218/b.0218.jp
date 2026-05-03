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
    <Stack as="header" className={containerStyle} gap={1}>
      <h1>{children}</h1>
      {!!paragraph && <p className={paragraphStyle}>{paragraph}</p>}
    </Stack>
  );
}

const containerStyle = css`
  overflow-wrap: break-word;
`;

const paragraphStyle = css`
  font-size: var(--font-sizes-md);
  color: var(--colors-gray-600);
`;
