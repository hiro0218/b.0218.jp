import router from 'next/router';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { HiSearch } from 'react-icons/hi';

import { Anchor as _Anchor } from '@/components/UI/Anchor';
import useEffectOnce from '@/hooks/useEffectOnce';
import { Post } from '@/types/source';
import { fadeIn } from '@/ui/animation';
import { isMobile } from '@/ui/lib/mediaQuery';
import { styled } from '@/ui/styled';

type Props = {
  closeDialog: () => void;
};

export const SearchPanel = ({ closeDialog }: Props) => {
  const refInput = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<{
    keyword: string;
    suggest: Post[];
  }>({
    keyword: '',
    suggest: [],
  });
  const [archives, setArchives] = useState<Array<Post>>([]);

  useEffect(() => {
    refInput.current.focus();
  }, []);

  useEffectOnce(() => {
    (async () => {
      await fetch('/posts-list.json')
        .then((response) => response.json())
        .then((json: Array<Post>) => {
          setArchives(json);
        });
    })();
  });

  const onKeyup = (e: KeyboardEvent<HTMLInputElement>) => {
    const { target } = e;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    const value = target.value.trim();

    // Enterを押した場合
    if (!e.nativeEvent.isComposing && e.key === 'Enter') {
      // 入力値が同じなら検索しない
      if (value === data.keyword) {
        return;
      }

      // 入力値が空
      if (!value) {
        setData({
          keyword: '',
          suggest: [],
        });
        return;
      }

      const suggest = archives.filter((post: Post) => {
        // AND検索のため入力値をスペースで区切って、それぞれの条件に一致するか
        return value
          .toLowerCase()
          .split(' ')
          .every((word: string) => {
            // 「タイトル」もしくは「タグ」に一致するか
            return post.title.toLowerCase().includes(word) || post.tags?.includes(word);
          });
      });
      const keyword = value;
      setData({
        keyword,
        suggest,
      });
    }
  };

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
          type="search"
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
