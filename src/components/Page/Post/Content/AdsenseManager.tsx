import { Fragment, type ReactNode } from 'react';
import { splitContentForAds } from './AdsenseManager/splitContentForAds';
import { ArticleAd } from './ArticleAd';

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
          // oxlint-disable-next-line react/no-array-index-key -- sections は記事本文から静的に導出され、レンダリング中に順序や件数が変わらない
          <Fragment key={index}>
            {isContinued ? <ArticleAd /> : null}
            <div className="post-content">{section}</div>
          </Fragment>
        );
      })}
    </>
  );
}
