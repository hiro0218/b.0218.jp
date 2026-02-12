import { usePathname } from 'next/navigation';
import { type CSSProperties, useEffect, useState } from 'react';

import { GOOGLE_ADSENSE } from '@/constants';
import { css, styled } from '@/ui/styled';

type Size = {
  adsWidth?: number;
  adsHeight?: number;
};
type Props = Size;

export function Adsense({ adsWidth = 336, adsHeight = 280 }: Props) {
  const pathname = usePathname();
  const [isLoaded, setIsLoaded] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname change should trigger ad reload
  useEffect(() => {
    setIsLoaded(true);
  }, [pathname]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally depending on isLoaded state only
  useEffect(() => {
    try {
      if (isLoaded) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('Failed to load AdSense ad:', error);
    }
  }, [pathname, isLoaded]);

  const adsStyle = {
    '--ads-height': `${adsHeight}px`,
    '--ads-width': `${adsWidth}px`,
    backgroundColor: process.env.NODE_ENV === 'development' ? 'var(--colors-gray-100)' : undefined,
  } as CSSProperties;

  /**
   * aria-label
   * @link https://support.google.com/adsense/answer/4533986?hl=ja
   */
  return (
    <aside aria-label="スポンサーリンク" className={containerStyle} key={pathname}>
      <Ads style={adsStyle}>
        <Ins />
      </Ads>
    </aside>
  );
}

const Ins = () => {
  return (
    <ins
      className="adsbygoogle"
      data-ad-client={GOOGLE_ADSENSE.CLIENT}
      data-ad-format={GOOGLE_ADSENSE.FORMAT}
      data-ad-layout={GOOGLE_ADSENSE.LAYOUT}
      data-ad-slot={GOOGLE_ADSENSE.SLOT}
      style={{ display: 'block', textAlign: 'center' }}
    />
  );
};

const containerStyle = css`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
  align-items: center;
  justify-content: center;
  margin: 0 auto;
`;

const Ads = styled.div`
  flex: 1 1 250px;
  height: var(--ads-height);
`;
