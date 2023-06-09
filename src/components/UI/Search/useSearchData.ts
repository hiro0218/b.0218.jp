import { type KeyboardEvent, useCallback, useState } from 'react';

import type { PostProps } from '@/types/source';

type SearchProps = Pick<PostProps, 'title' | 'tags' | 'slug'>;

type DataProps = {
  keyword: string;
  suggest: SearchProps[];
};

const initialData: DataProps = {
  keyword: '',
  suggest: [],
};

/**
 * 検索データを返す
 */
export const useSearchData = (archives: SearchProps[], closeDialog: () => void) => {
  const [data, setData] = useState<DataProps>(initialData);

  const onKeyup = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (!(e.target instanceof HTMLInputElement)) {
        return;
      }

      if (e.key === 'Escape' || e.key === 'Esc') {
        closeDialog();
        return;
      }

      const value = e.target.value.trim().toLowerCase();

      // 入力値が空
      if (!value) {
        setData(initialData);
        return;
      }

      // Enter以外はスキップ
      if (e.nativeEvent.isComposing || e.key !== 'Enter') {
        return;
      }

      // 入力値が同じなら検索しない
      if (value === data.keyword.toLowerCase()) {
        return;
      }

      const values = value.split(' ');

      const suggest = archives.filter((post) => {
        const { title, tags } = post;

        // AND検索のため入力値をスペースで区切って、それぞれの条件に一致するか
        return values.every((word) => {
          // 「タイトル」もしくは「タグ」に一致するか
          return title.toLowerCase().includes(word) || tags?.includes(word);
        });
      });

      setData({
        keyword: value,
        suggest,
      });
    },
    [archives, closeDialog, data.keyword],
  );

  return {
    searchData: data,
    onKeyup,
  };
};
