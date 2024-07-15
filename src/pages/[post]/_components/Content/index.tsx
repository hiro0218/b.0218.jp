import { useRef } from 'react';

import { Adsense } from '@/components/UI/Adsense';
import useTwitterWidgetsLoad from '@/hooks/useTwitterWidgetsLoad';
import type { PostProps } from '@/types/source';

import { splitHtml } from '../../_libs/splitHtml';
import Mokuji from '../Mokuji';
import PostContentStyle from './style';

type Props = {
  enableMokuji?: boolean;
  content: PostProps['content'];
};

export default function Content({ enableMokuji = true, content }: Props) {
  const { before, after } = splitHtml(content);
  const ref = useRef<HTMLDivElement>(null);
  useTwitterWidgetsLoad({ ref });

  return (
    <>
      {enableMokuji && <Mokuji refContent={ref} />}
      <section css={PostContentStyle} ref={ref}>
        <div
          dangerouslySetInnerHTML={{
            __html: before,
          }}
        />
        {!!after && <Adsense />}
        {!!after && (
          <div
            dangerouslySetInnerHTML={{
              __html: after,
            }}
          />
        )}
      </section>
      <Adsense />
    </>
  );
}
