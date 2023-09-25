import { useRef } from 'react';

import Mokuji from '@/client/post/Mokuji';
import useTwitterWidgetsLoad from '@/hooks/useTwitterWidgetsLoad';
import type { PostProps } from '@/types/source';

import PostContentStyle from './style';

type Props = {
  enableMokuji?: boolean;
  content: PostProps['content'];
};

export default function Content({ enableMokuji = true, content }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useTwitterWidgetsLoad({ ref });

  return (
    <>
      {enableMokuji && <Mokuji refContent={ref} />}
      <section
        css={PostContentStyle}
        dangerouslySetInnerHTML={{
          __html: content,
        }}
        ref={ref}
      />
    </>
  );
}
