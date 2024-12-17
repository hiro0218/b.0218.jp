import debounce from '@/lib/debounce';
import { useCallback, useMemo, useState } from 'react';
import type { SearchProps, onCloseDialogProps, onKeyupEventProps } from './type';

type DataProps = {
  keyword: string;
  suggestions: SearchProps[];
};

type IndexItem = {
  term: string;
  post: SearchProps;
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

  const searchIndex = useMemo(() => {
    // タイトルと各タグごとに記事をグループ化
    const allTerms = archives.flatMap((post) => {
      const terms = [post.title.toLowerCase()];
      if (post.tags) {
        terms.push(...post.tags.map((tag) => tag.toLowerCase()));
      }
      return terms.map((term) => ({
        term,
        post,
      }));
    });

    return Object.groupBy(allTerms, (item: IndexItem) => item.term);
  }, [archives]);

  // 検索実行関数をメモ化
  const performSearch = useMemo(() => {
    const search = (value: string) => {
      // 入力値が空
      if (!value) {
        setData(initialData);
        return;
      }

      const searchTerms = value.toLowerCase().split(' ').filter(Boolean);

      // 各検索語に一致する記事を取得
      const matchesByTerm = searchTerms.map((term) => {
        const matches = new Set<SearchProps>();

        // 部分一致検索
        Object.entries(searchIndex).forEach(([indexTerm, items]) => {
          if (indexTerm.includes(term)) {
            items.forEach(({ post }) => matches.add(post));
          }
        });

        return matches;
      });

      // 最初の検索語にマッチする記事から開始
      const firstMatches = matchesByTerm[0] || new Set<SearchProps>();

      // AND検索: 全ての検索語に一致する記事を抽出
      const suggestions = Array.from(firstMatches).filter((post) =>
        matchesByTerm.every((termMatches) => termMatches.has(post)),
      );

      setData({
        keyword: value,
        suggestions,
      });
    };

    return debounce<string>((value: string) => search(value), 300);
  }, [searchIndex]);

  const onKeyup = useCallback(
    (e: onKeyupEventProps) => {
      if (!(e.currentTarget instanceof HTMLInputElement)) {
        return;
      }

      if (e.key === 'Escape' || e.key === 'Esc') {
        closeDialog();
        return;
      }

      const value = e.currentTarget.value.trim();

      if (e.nativeEvent.isComposing) {
        return;
      }

      if (value === data.keyword) {
        return;
      }

      // Enterキーの場合は即時検索
      if (e.key === 'Enter') {
        performSearch(value);
        return;
      }

      performSearch(value);
    },
    [closeDialog, data.keyword, performSearch],
  );

  return {
    searchData: data,
    onKeyup,
  };
};
