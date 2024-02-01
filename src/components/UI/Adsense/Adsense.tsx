import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { GOOGLE_ADSENSE } from '@/constant';
import { isMobile } from '@/ui/lib/mediaQuery';
import { styled } from '@/ui/styled';

export function Adsense() {
  const pathname = usePathname();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, [pathname, setIsLoaded]);

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
      <Ads>
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

  ${isMobile} {
    flex-direction: column;
  }
`;

const Ads = styled.div`
  min-width: 336px;
  height: 280px;
  background-color: ${() => process.env.NODE_ENV === 'development' && 'var(--component-backgrounds-3)'};

  ${isMobile} {
    min-width: 250px;
  }
`;
