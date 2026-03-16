import { Adsense } from '@/components/UI/Adsense';
import type { Post } from '@/types/source';
import { AdsenseContainer, PostAdsenseManager } from './PostAdsenseManager';
import { PostContentClient } from './PostContentClient';
import { parser } from './parser/HTMLParser';

type ContentProps = {
  content: Post['content'];
};

export default function Content({ content }: ContentProps) {
  const parsedContent = parser(content);

  return (
    <PostContentClient
      adsense={
        <AdsenseContainer>
          <Adsense />
        </AdsenseContainer>
      }
    >
      <PostAdsenseManager content={parsedContent} />
    </PostContentClient>
  );
}
