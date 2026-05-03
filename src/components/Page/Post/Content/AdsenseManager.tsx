import type { ReactNode } from 'react';
import { Adsense } from '@/components/UI/Adsense';
import { splitReactNode } from '@/lib/react/splitReactNode';
import { styled } from '@/ui/styled';
import { Renderer } from './Renderer';

type AdsenseManagerProps = {
  content: ReactNode;
};

export function AdsenseManager({ content }: AdsenseManagerProps) {
  const { before, after } = splitReactNode(content);

  return (
    <>
      <Renderer content={before} />
      {after && (
        <>
          <AdsenseContainer>
            <Adsense />
          </AdsenseContainer>
          <Renderer content={after} />
        </>
      )}
    </>
  );
}

export const AdsenseContainer = styled.div`
  margin: var(--spacing-4) 0;
  text-align: center;
`;
