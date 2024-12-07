import type { ElementType, HTMLAttributes } from 'react';

import { styled } from '@/ui/styled';
import { SrOnlyClassName } from '@/ui/styled/constant';

type Props = {
  as?: ElementType;
  text: string;
} & HTMLAttributes<HTMLSpanElement>;

const SrOnly = styled.span();

export function ScreenReaderOnlyText({ as = 'span', text, ...props }: Props) {
  return (
    <SrOnly as={as} className={SrOnlyClassName} {...props}>
      {text}
    </SrOnly>
  );
}
