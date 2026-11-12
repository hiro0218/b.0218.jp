import type { ReactNode } from 'react';
import { styled } from '@/ui/styled';
import { postLayoutFrame } from '@/ui/styled/components/postLayout';

type Props = {
  children: ReactNode;
};

/**
 * @summary 記事ページの枠。本文と目次の 2 列を中央に寄せる。1024px 未満は 1 列で、目次は本文の中に置く。
 */
export function PostContainer({ children }: Props) {
  // data-post-layout を外さない。記事ページのフッターが、:root:has([data-post-layout]) で記事ページかを判定するため
  return (
    <Root className={postLayoutFrame} data-post-layout>
      {children}
    </Root>
  );
}

// position: relative を外さない。Mokuji が position: absolute で枠の 2 列目へ重なるときの基準にするため
const Root = styled.div`
  position: relative;
`;
