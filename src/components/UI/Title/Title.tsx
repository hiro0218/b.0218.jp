import type { ReactNode } from 'react';

import { Stack } from '@/components/UI/Layout';
import { css } from '@/ui/styled';

type Props = {
  children: ReactNode;
  paragraph?: ReactNode;
};

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
