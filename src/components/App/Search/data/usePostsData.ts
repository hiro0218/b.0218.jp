'use client';

import { useEffect, useState } from 'react';

import { FILENAME_POSTS_LIST, FILENAME_POSTS_POPULAR } from '@/constants';
import type { PostSummary } from '@/types/source';

import type { SearchProps } from '../types';
import { extractSearchProps } from './postDataExtractor';
import { useDataCache } from './useDataCache';

export type PostsDataState = {
  data: SearchProps[];
  error: Error | null;
  isLoading: boolean;
};

/**
 * 記事一覧データをキャッシュ管理しながら取得
 *
 * @returns データ取得状態（data, error, isLoading）
 *
 * @description
 * - キャッシュがあれば即座に返却
 * - キャッシュがない場合は posts.json と posts-popular.json を並列フェッチ
 * - ビルドID ベースのキャッシュで古いデータを自動削除
 * - コンポーネントアンマウント時に fetch を中断
 * - エラー発生時は error に Error オブジェクトを設定
 */
export const usePostsData = (): PostsDataState => {
  const [state, setState] = useState<PostsDataState>({
    data: [],
    error: null,
    isLoading: true,
  });
  const { getCachedData, setCachedData, clearOldCache } = useDataCache<SearchProps[]>(FILENAME_POSTS_LIST);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        const cachedData = getCachedData();
        if (cachedData) {
          setState({ data: cachedData, error: null, isLoading: false });
          clearOldCache();
          return;
        }

        const [postsResponse, popularResponse] = await Promise.all([
          fetch(`/${FILENAME_POSTS_LIST}.json`, {
            signal: abortController.signal,
          }),
          fetch(`/${FILENAME_POSTS_POPULAR}.json`, {
            signal: abortController.signal,
          }),
        ]);

        if (!postsResponse.ok) {
          throw new Error(`HTTP error: status code is ${postsResponse.status}`);
        }

        const postsJson = (await postsResponse.json()) as PostSummary[];
        const popularJson = popularResponse.ok ? ((await popularResponse.json()) as Record<string, number>) : {};
        const postList = extractSearchProps(postsJson, popularJson);

        setState({ data: postList, error: null, isLoading: false });
        setCachedData(postList);
      } catch (error) {
        if (!abortController.signal.aborted) {
          const errorObj = error instanceof Error ? error : new Error(String(error));
          setState({ data: [], error: errorObj, isLoading: false });
          console.error('Failed to fetch posts:', errorObj);
        }
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [getCachedData, setCachedData, clearOldCache]);

  return state;
};
