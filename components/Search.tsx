import Link from 'next/link';
import { FC, useEffect, useRef, useState } from 'react';
import { HiSearch } from 'react-icons/hi';

import style from '@/styles/Components/search.module.css';
import { Post } from '@/types/source';

const Search: FC = () => {
  const refInput = useRef(null);

  const [data, setData] = useState({
    keyword: '',
    suggest: [],
  });
  const [archives, setArchives] = useState([] as Array<Post>);

  useEffect(() => {
    refInput.current.focus();

    (async () => {
      return await fetch('/posts.json')
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
          .every((el: string) => post.title.toLowerCase().includes(el));
      });
      const keyword = value;
      setData({
        keyword,
        suggest,
      });
    }
  };

  return (
    <div className={`${style['c-search']}`}>
      <div className={style['c-search-header']}>
        <label className={style['c-search-header__icon']} htmlFor="search-input">
          <HiSearch />
        </label>
        <input
          type="search"
          className={style['c-search__input']}
          placeholder="記事のタイトルから検索する"
          id="search-input"
          autoComplete="off"
          ref={refInput}
          onKeyUp={(e) => onKeyup(e)}
        />
      </div>
      {data.suggest.length > 0 && (
        <>
          <div className={style['c-search-list']}>
            {data.suggest.map((post, index) => {
              return (
                <Link key={index} href={`/${post.slug}.html`}>
                  <a className={style['c-search-list__link']}>{post.title}</a>
                </Link>
              );
            })}
          </div>
          <div className={style['c-search-footer']}>
            <div className={style['c-search-footer__search-result']}>
              {data.suggest.length > 0 && <span>Result: {data.suggest.length} posts</span>}
            </div>
            <div className={style['c-search-footer__search-external']}>
              <a href="https://www.google.com/search?q=site:b.0218.jp" target="_blank" rel="noopener noreferrer">
                Google 検索
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Search;
