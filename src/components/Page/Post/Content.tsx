import Script from 'next/script';
import { parser } from '@/components/Page/_shared/HTMLParser';
import type { Post } from '@/types/source';
import { AdsenseManager } from './Content/AdsenseManager';
import { Client } from './Content/Client';

type ContentProps = {
  content: Post['content'];
};

export function PostContent({ content }: ContentProps) {
  const parsedContent = parser(content);
  const hasTweet = content.includes('twitter-tweet');

  return (
    <>
      {hasTweet && <Script src="https://platform.twitter.com/widgets.js" strategy="lazyOnload" />}
      <Client>
        <AdsenseManager content={parsedContent} />
      </Client>
    </>
  );
}
