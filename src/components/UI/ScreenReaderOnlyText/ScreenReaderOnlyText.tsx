import { ElementType, HTMLAttributes } from 'react';

import { srOnly } from '@/components/Functional/CssBaseline/Generic';
import { styled } from '@/ui/styled';

type Props = {
  as?: ElementType;
  text: string;
} & HTMLAttributes<HTMLSpanElement>;

/**
 * TailwindCSS の sr-only クラス実装を参考
 * @see https://tailwindcss.com/docs/screen-readers
 */
const SrOnlyText = styled.span`
  ${srOnly}
`;

export const ScreenReaderOnlyText = ({ as, text, ...props }: Props) => {
  return (
    <SrOnlyText as={as} {...props}>
      {text}
    </SrOnlyText>
  );
};
