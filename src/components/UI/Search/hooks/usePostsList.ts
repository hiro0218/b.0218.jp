'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { FILENAME_POSTS_LIST, FILENAME_POSTS_POPULAR } from '@/constant';
import { parseJSON } from '@/lib/parseJSON';
import type { PostSummary } from '@/types/source';

import type { SearchProps } from '../types';

const STORAGE_KEY = `${process.env.BUILD_ID}_${FILENAME_POSTS_LIST}`;

/**
 * 検索機能の応答性向上とサーバー負荷軽減のため、記事一覧データをlocalStorageにキャッシュして管理する
 * ビルドIDベースのキーで古いキャッシュを無効化し、デプロイ後の即座な更新を保証
 */
export const usePostsList = (): SearchProps[] => {
  const [archives, setArchives] = useState<SearchProps[]>([]);

  const getCachedData = useCallback((): SearchProps[] | null => {
    try {
      const cachedValue = window.localStorage.getItem(STORAGE_KEY);
      return cachedValue ? parseJSON<SearchProps[]>(cachedValue) : null;
    } catch (e) {
      console.warn('Cache parsing failed:', e);
      return null;
    }
  }, []);

  const extractPostList = useMemo(
    () =>
      (data: PostSummary[], popularityScores: Record<string, number> = {}): SearchProps[] => {
        return data.map(({ title, tags, slug }) => ({
          title,
          tags,
          slug,
          score: popularityScores[slug],
        }));
      },
    [],
  );

  const resetLocalStorage = useCallback((query = FILENAME_POSTS_LIST) => {
    if (typeof window === 'undefined' || !('localStorage' in window)) return;

    Object.keys(localStorage).forEach((key) => {
      if ((key !== STORAGE_KEY && key.match(query)) || (!query && typeof key === 'string')) {
        localStorage.removeItem(key);
      }
    });
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    let isMounted = true;

    const fetchData = async () => {
      try {
        const cachedData = getCachedData();
        if (cachedData) {
          if (isMounted) {
            setArchives(cachedData);
            resetLocalStorage();
          }
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
        const postList = extractPostList(postsJson, popularJson);

        if (isMounted) {
          setArchives(postList);
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(postList));
        }
      } catch (error) {
        if (!abortController.signal.aborted && isMounted) {
          console.error('Failed to fetch posts:', error);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [getCachedData, extractPostList, resetLocalStorage]);

  return archives;
};
