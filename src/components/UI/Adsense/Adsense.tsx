import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { isMobile } from '@/ui/lib/mediaQuery';
import { styled } from '@/ui/styled';

export const GOOGLE_ADSENSE = {
  LAYOUT: 'in-article',
  FORMAT: 'fluid',
  CLIENT: 'ca-pub-7651142413133023',
  SLOT: '4045255408',
} as const;

export const Adsense = () => {
  const { asPath } = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, [asPath, setIsLoaded]);

  useEffect(() => {
    try {
      window.requestAnimationFrame(() => {
        if (isLoaded) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      });
    } catch (err) {
      console.log(err);
    }
  }, [asPath, isLoaded]);

  return (
    <Ads key={asPath}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-layout={GOOGLE_ADSENSE.LAYOUT}
        data-ad-format={GOOGLE_ADSENSE.FORMAT}
        data-ad-client={GOOGLE_ADSENSE.CLIENT}
        data-ad-slot={GOOGLE_ADSENSE.SLOT}
      />
    </Ads>
  );
};

const Ads = styled.div`
  max-width: 336px;
  height: 280px;
  margin: 2rem auto;

  ${isMobile} {
    min-height: 100px;
  }
`;
