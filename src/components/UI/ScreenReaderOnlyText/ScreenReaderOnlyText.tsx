import { ElementType, HTMLAttributes } from 'react';

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
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border-width: 0;
  white-space: nowrap;
`;

export const ScreenReaderOnlyText = ({ as, text, ...props }: Props) => {
  return (
    <SrOnlyText as={as} {...props}>
      {text}
    </SrOnlyText>
  );
};
