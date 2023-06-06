import { useRef } from 'react';

import { PostContent } from '@/components/Functional/CssIndividual/Pages/Post';
import useTwitterWidgetsLoad from '@/hooks/useTwitterWidgetsLoad';
import type { PostProps } from '@/types/source';

import Mokuji from '../Mokuji';

type Props = {
  content: PostProps['content'];
};

export default function Content({ content }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useTwitterWidgetsLoad({ ref });

  return (
    <>
      <Mokuji refContent={ref} />
      <PostContent
        dangerouslySetInnerHTML={{
          __html: content,
        }}
        itemProp="articleBody"
        ref={ref}
      />
    </>
  );
}
