import type { ReactNode } from 'react';

import { css, styled } from '@/ui/styled';

type Props = {
  heading: string;
  paragraph?: ReactNode;
};

export function Title({ heading, paragraph = undefined }: Props) {
  return (
    <header className={containerStyle}>
      <h1 dangerouslySetInnerHTML={{ __html: heading }}></h1>
      {!!paragraph && <P>{paragraph}</P>}
    </header>
  );
}

const containerStyle = css`
  overflow-wrap: break-word;
`;

const P = styled.p`
  margin-top: var(--spacing-1);
  font-size: var(--font-sizes-md);
  color: var(--colors-gray-11);
`;
