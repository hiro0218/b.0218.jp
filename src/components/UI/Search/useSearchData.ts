import { useCallback, useState } from 'react';

import type { SearchProps, onCloseDialogProps, onKeyupEventProps } from './type';

type DataProps = {
  keyword: string;
  suggestions: SearchProps[];
};

const initialData: DataProps = {
  keyword: '',
  suggestions: [],
};

/**
 * 検索データを返す
 */
export const useSearchData = (archives: SearchProps[], closeDialog: onCloseDialogProps) => {
  const [data, setData] = useState<DataProps>(initialData);

  const onKeyup = useCallback(
    (e: onKeyupEventProps) => {
      if (!(e.currentTarget instanceof HTMLInputElement)) {
        return;
      }

      if (e.key === 'Escape' || e.key === 'Esc') {
        closeDialog();
        return;
      }

      const value = e.currentTarget.value.trim().toLowerCase();

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

      const suggestions = archives.filter((post) => {
        const { title, tags } = post;

        // AND検索のため入力値をスペースで区切って、それぞれの条件に一致するか
        return values.every((word) => {
          // 「タイトル」もしくは「タグ」に一致するか
          return title.toLowerCase().includes(word) || tags?.includes(word);
        });
      });

      setData({
        keyword: value,
        suggestions,
      });
    },
    [archives, closeDialog, data.keyword],
  );

  return {
    searchData: data,
    onKeyup,
  };
};
