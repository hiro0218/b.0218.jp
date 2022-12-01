import { styled } from '@/ui/styled';

type Props = {
  text: string;
};

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

export const ScreenReaderOnlyText = ({ text }: Props) => {
  return <SrOnlyText>{text}</SrOnlyText>;
};
