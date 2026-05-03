import type { ReactNode } from 'react';

import { styled } from '@/ui/styled';
import { textEllipsis } from '@/ui/styled/utilities/text-ellipsis';

type Props = {
  excerpt: ReactNode | string;
};

export function Excerpt({ excerpt }: Props) {
  return (
    <Paragraph as={typeof excerpt === 'string' ? 'p' : 'div'} className={textEllipsis}>
      {excerpt}
    </Paragraph>
  );
}

const Paragraph = styled.p`
  color: var(--colors-gray-900);
  letter-spacing: var(--letter-spacings-sm);
`;
