'use client';

import type { ReactNode } from 'react';
import { useRef } from 'react';
import Mokuji from '../Mokuji';
import { PostWidgetManager } from './PostWidgetManager';

type PostContentClientProps = {
  children: ReactNode;
  adsense: ReactNode;
};

export function PostContentClient({ children, adsense }: PostContentClientProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <>
      <Mokuji refContent={ref} />
      <PostWidgetManager contentRef={ref}>{children}</PostWidgetManager>
      {adsense}
    </>
  );
}
