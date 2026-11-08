'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { GOOGLE_ADSENSE } from '@/constants';
import { isDevelopment } from '@/lib/config/environment';
import { css, styled } from '@/ui/styled';

function pushAd() {
  try {
    // biome-ignore lint/suspicious/noAssignInExpressions: AdSense SDK の初期化パターン
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch (error) {
    console.error('Failed to load AdSense ad:', error);
  }
}

/**
 * @summary 記事の本文の流れの中に置く Google AdSense 広告枠。前後の余白も持つ。
 */
export function ArticleAd() {
  const pathname = usePathname();

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname を依存配列から外さない。ルートが変わるたびに広告を読み込み直す契機にしているため
  useEffect(() => {
    pushAd();
  }, [pathname]);

  return (
    <Outer>
      <aside aria-label="スポンサーリンク" className={containerStyle} key={pathname}>
        <Ads style={isDevelopment ? { backgroundColor: 'var(--colors-gray-100)' } : undefined}>
          <Ins />
        </Ads>
      </aside>
    </Outer>
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

const Outer = styled.div`
  margin: var(--spacing-400) 0;
  text-align: center;
`;

const containerStyle = css`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-300);
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  overflow-x: auto;
  overflow-y: hidden;
`;

const Ads = styled.div`
  flex: 1 1 250px;
  /* 高さを広告の読み込みに任せず固定する。任せると、読み込みの前後で本文の位置が動く */
  height: 280px;
`;
