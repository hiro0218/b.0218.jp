'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { FILENAME_POSTS_LIST } from '@/constant';
import { parseJSON } from '@/lib/parseJSON';
import type { PostListProps } from '@/types/source';

import type { SearchProps } from './type';

const STORAGE_KEY = `${process.env.BUILD_ID}_${FILENAME_POSTS_LIST}`;

/**
 * posts-list.jsonを取得する
 * 複数リクエストをさせないようにlocalStorageへキャッシュ
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
      (data: PostListProps[]): SearchProps[] => {
        return data.map(({ title, tags, slug }) => ({
          title,
          tags,
          slug,
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

        const response = await fetch(`/${FILENAME_POSTS_LIST}.json`, {
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error: status code is ${response.status}`);
        }

        const json = (await response.json()) as PostListProps[];
        const postList = extractPostList(json);

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
