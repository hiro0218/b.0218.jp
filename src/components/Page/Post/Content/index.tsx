'use client';

import { useRef } from 'react';

import { Adsense } from '@/components/UI/Adsense';
import useTwitterWidgetsLoad from '@/hooks/useTwitterWidgetsLoad';
import { splitReactNode } from '@/lib/splitHtml';
import type { PostProps } from '@/types/source';
import { styled } from '@/ui/styled/static';
import Mokuji from '../Mokuji';
import { parser } from './inject';

type Props = {
  enableMokuji?: boolean;
  content: PostProps['content'];
};

export default function Content({ enableMokuji = true, content }: Props) {
  const reactNodeContent = parser(content);
  const { before, after } = splitReactNode(reactNodeContent);
  const ref = useRef<HTMLDivElement>(null);
  useTwitterWidgetsLoad({ ref });

  return (
    <>
      {enableMokuji && <Mokuji refContent={ref} />}
      <section ref={ref}>
        <div className="post-content">{before}</div>
        {!!after && (
          <>
            <AdsenseContainer>
              <Adsense />
            </AdsenseContainer>
            <div className="post-content">{after}</div>
          </>
        )}
      </section>
      <AdsenseContainer>
        <Adsense />
      </AdsenseContainer>
    </>
  );
}

const AdsenseContainer = styled.div`
  margin: var(--space-4) 0;
  text-align: center;
`;
