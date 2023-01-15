import router from 'next/router';
import { ChangeEvent, KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { HiSearch } from 'react-icons/hi';

import { Anchor as _Anchor } from '@/components/UI/Anchor';
import useEffectOnce from '@/hooks/useEffectOnce';
import { parseJSON } from '@/lib/parseJSON';
import { Post } from '@/types/source';
import { fadeIn } from '@/ui/animation';
import { isMobile } from '@/ui/lib/mediaQuery';
import { styled } from '@/ui/styled';

type Props = {
  closeDialog: () => void;
};

type DataProps = {
  keyword: string;
  suggest: Post[];
};

const STORAGE_KEY = `${process.env.BUILD_ID}_posts-list`;

const initialData: DataProps = {
  keyword: '',
  suggest: [],
};

const resetLocalStorage = (query = 'posts-list') => {
  if (typeof window === 'undefined' || !('localStorage' in window)) {
    return;
  }

  for (const key in window.localStorage) {
    if (window.localStorage.hasOwnProperty(key)) {
      if ((key !== STORAGE_KEY && key.match(query)) || (!query && typeof key === 'string')) {
        window.localStorage.removeItem(key);
      }
    }
  }
};

export const SearchPanel = ({ closeDialog }: Props) => {
  const refInput = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<DataProps>(initialData);
  const [archives, setArchives] = useState<Array<Post>>([]);

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
      setArchives(parseJSON(cachedValue));
      window.requestIdleCallback(() => resetLocalStorage());
      return;
    }

    (async () => {
      await fetch('/posts-list.json')
        .then<Post[]>((response) => response.json())
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

  useEffect(() => {
    router.events.on('routeChangeComplete', closeDialog);

    return () => {
      router.events.off('routeChangeComplete', closeDialog);
    };
  }, [closeDialog]);

  return (
    <SearchMain>
      <SearchHeader>
        <SearchHeaderIcon htmlFor="search-input">
          <HiSearch size="24" />
        </SearchHeaderIcon>
        <SearchInput
          type="text"
          placeholder="記事のタイトルから検索する（入力してEnterを押すと検索結果が表示）"
          id="search-input"
          autoComplete="off"
          ref={refInput}
          onKeyUp={onKeyup}
        />
      </SearchHeader>
      {data.suggest.length > 0 && (
        <>
          <SearchResult>
            {data.suggest.map((post) => (
              <Anchor key={post.slug} href={`/${post.slug}.html`} passHref prefetch={true} onClick={closeDialog}>
                {post.title}
              </Anchor>
            ))}
          </SearchResult>
          <SearchFooter>
            <div>Result: {data.suggest.length} posts</div>
            <div>
              <a href="https://www.google.com/search?q=site:b.0218.jp" target="_blank" rel="noopener noreferrer">
                Google 検索
              </a>
            </div>
          </SearchFooter>
        </>
      )}
    </SearchMain>
  );
};

const SearchMain = styled.div`
  display: block;
  z-index: var(--zIndex-search);
  isolation: isolate;
  width: 50vw;
  margin: auto;
  overflow: hidden;
  animation: ${fadeIn} 0.8s ease;
  border-radius: 4px;
  opacity: 0;
  background: #fff;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  animation-fill-mode: both;

  ${isMobile} {
    width: 80vw;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  padding: 0;
  border: none;
  font-size: var(--font-size-md);

  &::placeholder {
    color: var(--text-11);
    font-size: var(--font-size-sm);
  }

  &::-webkit-search-cancel-button {
    -webkit-appearance: none;
  }

  &:focus {
    outline: none;
  }
`;

const SearchHeader = styled.div`
  display: flex;
  height: 3rem;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.16);
`;

const SearchHeaderIcon = styled.label`
  display: flex;
  align-items: center;
  padding: 0 0.5rem 0 0.75rem;

  svg {
    color: var(--text-11);
  }
`;

const SearchResult = styled.div`
  max-height: 50vh;
  margin: 0;
  padding: 0;
  overflow-x: none;
  overflow-y: auto;

  ${isMobile} {
    max-height: 60vh;
  }
`;

const Anchor = styled(_Anchor)`
  display: block;
  padding: 0.75em 1.5em;
  font-size: var(--font-size-sm);

  &:hover {
    background-color: var(--component-backgrounds-4);
  }
`;

const SearchFooter = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0.5rem;
  box-shadow: 2px 0 4px 0 rgba(0, 0, 0, 0.16);
  color: var(--text-11);
  font-size: var(--font-size-sm);
`;
