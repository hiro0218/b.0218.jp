import type { ElementType, HTMLAttributes } from 'react';

import { srOnly } from '@/components/Functional/CssBaseline/Generic';
import { styled } from '@/ui/styled';

type Props = {
  as?: ElementType;
  text: string;
} & HTMLAttributes<HTMLSpanElement>;

const SrOnlyText = styled.span`
  ${srOnly}
`;

export function ScreenReaderOnlyText({ as = 'span', text, ...props }: Props) {
  return (
    <SrOnlyText as={as} {...props}>
      {text}
    </SrOnlyText>
  );
}
