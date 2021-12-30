import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';

export const GOOGLE_ADSENSE = {
  LAYOUT: 'in-article',
  FORMAT: 'fluid',
  CLIENT: 'ca-pub-7651142413133023',
  SLOT: '4045255408',
} as const;

const Adsense: FC = () => {
  const { asPath } = useRouter();

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.log(err);
    }
  }, [asPath]);

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

export default Adsense;

const Ads = styled.div`
  max-width: 336px;
  height: 280px;
  margin: 2rem auto;

  @media (max-width: 959px) {
    min-height: 100px;
  }
`;
