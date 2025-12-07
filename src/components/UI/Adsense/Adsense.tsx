import { usePathname } from 'next/navigation';
import { type CSSProperties, useEffect } from 'react';

import { GOOGLE_ADSENSE } from '@/constant';
import { useBoolean } from '@/hooks/useBoolean';
import { css, styled } from '@/ui/styled';

type Size = {
  adsWidth?: number;
  adsHeight?: number;
};
type Props = Size;

export function Adsense({ adsWidth = 336, adsHeight = 280 }: Props) {
  const pathname = usePathname();
  const { value: isLoaded, setTrue: setLoaded } = useBoolean(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally including setLoaded for pathname change
  useEffect(() => {
    setLoaded();
  }, [pathname, setLoaded]);

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
  gap: var(--spacing-2);
  align-items: center;
  justify-content: center;
  margin: 0 auto;

  @media (--isMobile) {
    flex-direction: column;
  }
`;

const Ads = styled.div`
  min-width: var(--ads-width);
  height: var(--ads-height);

  @media (--isMobile) {
    min-width: 250px;
  }
`;
