import type { ReactNode } from 'react';
import { Adsense } from '@/components/UI/Adsense';
import { splitReactNode } from '@/lib/react/splitReactNode';
import { styled } from '@/ui/styled';

type AdsenseManagerProps = {
  content: ReactNode;
};

export function AdsenseManager({ content }: AdsenseManagerProps) {
  const { before, after } = splitReactNode(content);

  return (
    <>
      <div className="post-content">{before}</div>
      {after ? (
        <>
          <AdsenseContainer>
            <Adsense />
          </AdsenseContainer>
          <div className="post-content">{after}</div>
        </>
      ) : null}
    </>
  );
}

export const AdsenseContainer = styled.div`
  margin: var(--spacing-600) 0;
  text-align: center;
`;
