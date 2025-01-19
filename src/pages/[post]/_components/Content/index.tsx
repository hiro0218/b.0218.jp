import { type DOMAttributes, useRef } from 'react';

import { Adsense } from '@/components/UI/Adsense';
import useTwitterWidgetsLoad from '@/hooks/useTwitterWidgetsLoad';
import type { PostProps } from '@/types/source';

import { styled } from '@/ui/styled/static';
import { splitHtml } from '../../_libs/splitHtml';
import Mokuji from '../Mokuji';
import PostContentStyle from './style';

type Props = {
  enableMokuji?: boolean;
  content: PostProps['content'];
};

const ContentSection = ({ html }: { html: DOMAttributes<HTMLDivElement>['dangerouslySetInnerHTML']['__html'] }) => (
  <div
    className="post-content"
    css={PostContentStyle}
    dangerouslySetInnerHTML={{
      __html: html,
    }}
  />
);

export default function Content({ enableMokuji = true, content }: Props) {
  const { before, after } = splitHtml(content);
  const ref = useRef<HTMLDivElement>(null);
  useTwitterWidgetsLoad({ ref });

  return (
    <>
      {enableMokuji && <Mokuji refContent={ref} />}
      <section ref={ref}>
        <ContentSection html={before} />
        {!!after && (
          <>
            <AdsenseContainer>
              <Adsense />
            </AdsenseContainer>
            <ContentSection html={after} />
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
