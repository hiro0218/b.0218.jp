import { parser } from '@/components/Page/_shared/parser/HTMLParser';
import { Adsense } from '@/components/UI/Adsense';
import type { Post } from '@/types/source';
import { AdsenseContainer, AdsenseManager } from './Content/AdsenseManager';
import { Client } from './Content/Client';

type ContentProps = {
  content: Post['content'];
};

export function PostContent({ content }: ContentProps) {
  const parsedContent = parser(content);

  return (
    <Client
      adsense={
        <AdsenseContainer>
          <Adsense />
        </AdsenseContainer>
      }
    >
      <AdsenseManager content={parsedContent} />
    </Client>
  );
}
