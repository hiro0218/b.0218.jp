import type { HTMLAttributes } from 'react';

import { SrOnlyClassName } from '@/components/Functional/CssBaseline/Generic';
import { styled } from '@/ui/styled';

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
