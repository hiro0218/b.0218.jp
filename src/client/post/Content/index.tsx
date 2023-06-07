import { useRef } from 'react';

import useTwitterWidgetsLoad from '@/hooks/useTwitterWidgetsLoad';
import type { PostProps } from '@/types/source';

import Mokuji from '../Mokuji';
import PostContentStyle from './style';

type Props = {
  content: PostProps['content'];
};

export default function Content({ content }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useTwitterWidgetsLoad({ ref });

  return (
    <>
      <Mokuji refContent={ref} />
      <div
        css={PostContentStyle}
        dangerouslySetInnerHTML={{
          __html: content,
        }}
        itemProp="articleBody"
        ref={ref}
      />
    </>
  );
}
