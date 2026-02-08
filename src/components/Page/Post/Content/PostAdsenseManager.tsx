import type { ReactNode } from 'react';
import { Adsense } from '@/components/UI/Adsense';
import { splitReactNode } from '@/lib/react/splitReactNode';
import { styled } from '@/ui/styled';
import { PostContentRenderer } from './PostContentRenderer';

type PostAdsenseManagerProps = {
  content: ReactNode;
};

export function PostAdsenseManager({ content }: PostAdsenseManagerProps) {
  const { before, after } = splitReactNode(content);

  return (
    <>
      <PostContentRenderer content={before} />
      {after && (
        <>
          <AdsenseContainer>
            <Adsense />
          </AdsenseContainer>
          <PostContentRenderer content={after} />
        </>
      )}
    </>
  );
}

export const AdsenseContainer = styled.div`
  margin: var(--spacing-4) 0;
  text-align: center;
`;
