'use client';

import { useMemo, useRef } from 'react';
import { Adsense } from '@/components/UI/Adsense';
import type { Post } from '@/types/source';
import Mokuji from '../Mokuji';
import { AdsenseContainer, PostAdsenseManager } from './PostAdsenseManager';
import { PostWidgetManager } from './PostWidgetManager';
import { parser } from './parser/HTMLParser';

type ContentProps = {
  content: Post['content'];
};

export default function Content({ content }: ContentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const parsedContent = useMemo(() => parser(content), [content]);

  return (
    <>
      <Mokuji refContent={ref} />
      <PostWidgetManager contentRef={ref}>
        <PostAdsenseManager content={parsedContent} />
      </PostWidgetManager>
      <AdsenseContainer>
        <Adsense />
      </AdsenseContainer>
    </>
  );
}
