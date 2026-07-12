import type { ReactNode } from 'react';
import { Center } from '@/components/UI/Layout/Center';
import { styled } from '@/ui/styled';

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * @summary 記事本文の内容幅を制御する Container。max 50rem (800px) で中央寄せし、左右に viewport 適応の gutter を確保する。
 */
export function PostContainer({ children, className }: Props) {
  return (
    <Root>
      <Center className={className} maxWidth="var(--sizes-container-article)" minWidth="0px">
        {children}
      </Center>
    </Root>
  );
}

const Root = styled.div`
  padding-inline: clamp(var(--spacing-300), 3vw, var(--spacing-400));
`;
