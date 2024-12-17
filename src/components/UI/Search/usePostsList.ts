import { useEffect, useState } from 'react';

import { FILENAME_POSTS_LIST } from '@/constant';
import { parseJSON } from '@/lib/parseJSON';
import type { PostListProps } from '@/types/source';

import type { SearchProps } from './type';

const STORAGE_KEY = `${process.env.BUILD_ID}_${FILENAME_POSTS_LIST}`;

/**
 * posts-list.jsonを取得する
 * 複数リクエストをさせないようにlocalStorageへキャッシュ
 */
export const usePostsList = () => {
  const [archives, setArchives] = useState<SearchProps[]>([]);

  useEffect(() => {
    const abortController = new AbortController();
    const cachedValue = window.localStorage.getItem(STORAGE_KEY);

    // データがキャッシュされている場合、それを使用
    if (cachedValue) {
      setArchives(parseJSON<SearchProps[]>(cachedValue));
      resetLocalStorage();
      return;
    }

    const fetchData = async () => {
      try {
        // キャッシュがなければフェッチ
        const response = await fetch(`/${FILENAME_POSTS_LIST}.json`, {
          signal: abortController.signal,
        });
        const json = (await response.json()) as PostListProps[];

        // 必要なプロパティだけを抽出
        const data = json.map(({ title, tags, slug }) => {
          return {
            title,
            tags,
            slug,
          };
        });

        setArchives(data);

        // キャッシュ
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        // リクエストが中止された場合を除くすべてのエラー
        if (!abortController.signal.aborted) {
          console.error(error);
        }
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, []);

  return archives;
};

const resetLocalStorage = (query = FILENAME_POSTS_LIST) => {
  if (typeof window !== 'undefined' && 'localStorage' in window) {
    Object.keys(localStorage).forEach((key) => {
      if ((key !== STORAGE_KEY && key.match(query)) || (!query && typeof key === 'string')) {
        localStorage.removeItem(key);
      }
    });
  }
};
