import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { HiSearch } from 'react-icons/hi';

import { mobile } from '@/lib/mediaQuery';
import { Post } from '@/types/source';
import { fadeIn } from '@/ui/mixin';
import { styled } from '@/ui/styled';

export const SearchPanel = () => {
  const refInput = useRef(null);

  const [data, setData] = useState({
    keyword: '',
    suggest: [],
  });
  const [archives, setArchives] = useState<Array<Post>>([]);

  useEffect(() => {
    refInput.current.focus();

    (async () => {
      return await fetch('/posts-list.json')
        .then((response) => response.json())
        .then((json: Array<Post>) => {
          setArchives(json);
        });
    })();
  }, []);

  const onKeyup = (e) => {
    const { target } = e;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    const value = target.value.trim();

    // Enterを押した場合
    if (!e.isComposing && e.key === 'Enter') {
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

  return (
    <SearchMain>
      <SearchHeader>
        <SearchHeaderIcon htmlFor="search-input">
          <HiSearch />
        </SearchHeaderIcon>
        <SearchInput
          type="search"
          placeholder="記事のタイトルから検索する"
          id="search-input"
          autoComplete="off"
          ref={refInput}
          onKeyUp={(e) => onKeyup(e)}
        />
      </SearchHeader>
      {data.suggest.length > 0 && (
        <>
          <SearchResult>
            {data.suggest.map((post, index) => {
              return (
                <Link key={index} href={`/${post.slug}.html`} passHref prefetch={false}>
                  <SearchResultAnchor>{post.title}</SearchResultAnchor>
                </Link>
              );
            })}
          </SearchResult>
          <SearchFooter>
            <div>
              {data.suggest.length > 0 && <span>Result: {data.suggest.length} posts</span>}
            </div>
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
  width: 50vw;
  margin: auto;
  overflow: hidden;
  animation: ${fadeIn} 0.8s ease;
  border-radius: 4px;
  opacity: 0;
  background: #fff;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  animation-fill-mode: both;

  ${mobile} {
    width: 80vw;
  }
`

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

`

const SearchHeader = styled.div`
  display: flex;
  height: 3rem;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.16);
`;

const SearchHeaderIcon = styled.label`
  display: flex;
  align-items: center;
  padding: 0 .5rem 0 0.75rem;

  svg {
    width: 1.5rem;
    height: 100%;
    color: var(--text-11);
  }
`

const SearchResult = styled.div`
  max-height: 50vh;
  margin: 0;
  padding: 0;
  overflow-x: none;
  overflow-y: auto;

  ${mobile} {
    max-height: 60vh;
  }
`

const SearchResultAnchor = styled.a`
    display: block;
    padding: 0.75em 1.5em;
    font-size: var(--font-size-sm);

    &:hover {
      background-color: var(--component-backgrounds-4);
    }
`

const SearchFooter = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0.5rem;
  box-shadow: 2px 0 4px 0 rgba(0, 0, 0, 0.16);
  color: var(--text-11);
  font-size: var(--font-size-sm);
`
