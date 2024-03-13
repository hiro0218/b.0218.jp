import type { HTMLAttributes } from 'react';

import { styled } from '@/ui/styled';
import { SrOnlyClassName } from '@/ui/styled/CssBaseline/Generic';

type Props = {
  as?: keyof JSX.IntrinsicElements;
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
