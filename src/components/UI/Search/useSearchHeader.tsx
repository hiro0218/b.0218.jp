import { KeyboardEvent, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';

import { FILENAME_POSTS_LIST } from '@/constant';
import useEffectOnce from '@/hooks/useEffectOnce';
import { parseJSON } from '@/lib/parseJSON';
import { Post } from '@/types/source';
import { RxMagnifyingGlass } from '@/ui/icons';
import { styled } from '@/ui/styled';

type Props = {
  closeDialog: () => void;
};

type SearchProps = Pick<Post, 'title' | 'tags' | 'slug'>;

type DataProps = {
  keyword: string;
  suggest: SearchProps[];
};

const STORAGE_KEY = `${process.env.BUILD_ID}_${FILENAME_POSTS_LIST}`;

const initialData: DataProps = {
  keyword: '',
  suggest: [],
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

export const useSearchHeader = ({ closeDialog }: Props) => {
  const refInput = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<DataProps>(initialData);
  const [archives, setArchives] = useState<SearchProps[]>([]);
  const searchInputId = useId();

  useEffect(() => {
    refInput.current.focus();
  }, []);

  /**
   * posts-list.jsonを取得する
   * 複数リクエストをさせないようにlocalStorageへキャッシュ
   */
  useEffectOnce(() => {
    const cachedValue = window.localStorage.getItem(STORAGE_KEY);

    if (cachedValue) {
      setArchives(parseJSON<SearchProps[]>(cachedValue));
      resetLocalStorage();
      return;
    }

    (async () => {
      await fetch(`/${FILENAME_POSTS_LIST}.json`)
        .then<Post[]>((response) => response.json())
        .then((json) => {
          return json.map((obj) => {
            return {
              title: obj.title,
              tags: obj.tags,
              slug: obj.slug,
            };
          });
        })
        .then((json) => {
          setArchives(json);
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(json));
        });
    })();
  });

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

  const SearchHeader = useMemo(
    () => (
      <Header>
        <HeaderIcon htmlFor={searchInputId}>
          <RxMagnifyingGlass size="24" />
        </HeaderIcon>
        <SearchInput
          autoComplete="off"
          id={searchInputId}
          onKeyUp={onKeyup}
          placeholder="記事タイトルやタグから検索する（Enterで検索結果表示）"
          ref={refInput}
          type="text"
        />
      </Header>
    ),
    [onKeyup, searchInputId],
  );

  return {
    SearchHeader,
    searchData: data,
  };
};

const Header = styled.div`
  display: flex;
  height: 3rem;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.16);
`;

const HeaderIcon = styled.label`
  display: flex;
  align-items: center;
  padding: 0 var(--space-1);
`;

const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  padding: 0;
  font-size: var(--font-size-md);
  border: none;

  &::placeholder {
    font-size: var(--font-size-sm);
    color: var(--text-11);
  }

  &:focus {
    outline: none;
  }
`;
