'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

type WidgetManagerProps = {
  contentRef: React.RefObject<HTMLDivElement>;
};

export function WidgetManager({ contentRef }: WidgetManagerProps) {
  const pathname = usePathname();

  // biome-ignore lint/correctness/useExhaustiveDependencies: This effect should re-run when the pathname changes to load Twitter widgets for the new page.
  useEffect(() => {
    if (!contentRef.current) {
      return;
    }

    // twttr?. の ? を外さない。widgets.js は Page/Post/Content.tsx が tweet を含む記事だけで読み込むため、twttr が無い記事がある
    window.twttr?.widgets.load(contentRef.current);
  }, [pathname, contentRef]);

  return null;
}
