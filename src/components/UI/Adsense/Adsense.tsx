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

export function Adsense() {
  const { asPath } = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, [asPath, setIsLoaded]);

  useEffect(() => {
    try {
      if (isLoaded) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.log(err);
    }
  }, [asPath, isLoaded]);

  return (
    <Container key={asPath}>
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
