import { Fragment, type ReactNode } from 'react';
import { Adsense } from '@/components/UI/Adsense';
import { styled } from '@/ui/styled';
import { splitContentForAds } from './AdsenseManager/splitContentForAds';

type AdsenseManagerProps = {
  content: ReactNode;
};

export function AdsenseManager({ content }: AdsenseManagerProps) {
  const sections = splitContentForAds(content);

  return (
    <>
      {sections.map((section, index) => {
        const isContinued = index > 0;
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: sections は記事本文から静的に導出され、レンダリング中に順序や件数が変わらない
          <Fragment key={index}>
            {isContinued ? (
              <AdsenseContainer>
                <Adsense />
              </AdsenseContainer>
            ) : null}
            <div className="post-content">{section}</div>
          </Fragment>
        );
      })}
    </>
  );
}

export const AdsenseContainer = styled.div`
  margin: var(--spacing-600) 0;
  text-align: center;
`;
