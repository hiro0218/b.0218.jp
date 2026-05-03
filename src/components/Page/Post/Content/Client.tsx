'use client';

import type { ReactNode } from 'react';
import { useRef } from 'react';
import { Mokuji } from '../Mokuji';
import { WidgetManager } from './WidgetManager';

type ClientProps = {
  children: ReactNode;
  adsense: ReactNode;
};

export function Client({ children, adsense }: ClientProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <>
      <Mokuji refContent={ref} />
      <WidgetManager contentRef={ref}>{children}</WidgetManager>
      {adsense}
    </>
  );
}
