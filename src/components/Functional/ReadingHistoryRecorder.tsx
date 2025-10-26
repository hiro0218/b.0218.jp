'use client';

import { useEffect } from 'react';

import { useReadingHistory } from '@/hooks/useReadingHistory';
import type { ReadingHistoryInput } from '@/types/source';

/**
 * 記事閲覧履歴を記録するコンポーネント
 */
export function ReadingHistoryRecorder({ slug, title, tags, date }: ReadingHistoryInput) {
  const { addToHistory } = useReadingHistory();

  useEffect(() => {
    // 依存配列により、記事情報が変化したタイミングで実行される
    addToHistory({
      slug,
      title,
      tags,
      date,
    });
  }, [addToHistory, date, slug, tags, title]);

  return null;
}
