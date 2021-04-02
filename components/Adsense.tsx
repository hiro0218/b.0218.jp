import React, { FC, useEffect } from 'react';

import style from '@/styles/Components/adsense.module.css';

export const GOOGLE_ADSENSE = {
  LAYOUT: 'in-article',
  FORMAT: 'fluid',
  CLIENT: 'ca-pub-7651142413133023',
  SLOT: '4045255408',
} as const;

const Adsense: FC = () => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <div className={style['c-adsense']}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-layout={GOOGLE_ADSENSE.LAYOUT}
        data-ad-format={GOOGLE_ADSENSE.FORMAT}
        data-ad-client={GOOGLE_ADSENSE.CLIENT}
        data-ad-slot={GOOGLE_ADSENSE.SLOT}
      />
    </div>
  );
};

export default Adsense;
