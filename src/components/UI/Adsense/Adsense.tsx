import { usePathname } from 'next/navigation';
import { type CSSProperties, useEffect, useState } from 'react';

import { GOOGLE_ADSENSE } from '@/constant';
import { styled } from '@/ui/styled/static';

type Size = {
  adsWidth?: number;
  adsHeight?: number;
};
type Props = Size;

export function Adsense({ adsWidth = 336, adsHeight = 280 }: Props) {
  const pathname = usePathname();
  const [isLoaded, setIsLoaded] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setIsLoaded(true);
  }, [pathname, setIsLoaded]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    try {
      if (isLoaded) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.log(err);
    }
  }, [pathname, isLoaded]);

  /**
   * aria-label
   * @link https://support.google.com/adsense/answer/4533986?hl=ja
   */
  return (
    <Container aria-label="スポンサーリンク" key={pathname}>
      <Ads
        style={
          {
            '--ads-height': `${adsHeight}px`,
            '--ads-width': `${adsWidth}px`,
            backgroundColor: process.env.NODE_ENV === 'development' && 'var(--color-gray-3)',
          } as CSSProperties
        }
      >
        <Ins />
      </Ads>
    </Container>
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

const Container = styled.aside`
  display: flex;
  gap: var(--space-2);
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
