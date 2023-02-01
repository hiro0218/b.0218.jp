import { ElementType, HTMLAttributes } from 'react';

import { srOnly } from '@/components/Functional/CssBaseline/Generic';
import { styled } from '@/ui/styled';

type Props = {
  as?: ElementType;
  text: string;
} & HTMLAttributes<HTMLSpanElement>;

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
