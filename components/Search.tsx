import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';

import style from '@/styles/Components/search.module.css';
import { Archives } from '@/types/source';

interface Props {
  isOpen: boolean;
  toggleHandler: () => void;
}

const Search = ({ isOpen = false, toggleHandler }: Props) => {
  const refInput = useRef(null);

  const [data, setData] = useState({
    keyword: '',
    suggest: [],
  });
  const [archives, setArchives] = useState([] as Array<Archives>);

  useEffect(() => {
    refInput.current.focus();

    (async () => {
      return await fetch('/archives.json')
        .then((response) => response.json())
        .then((archives: Array<Archives>) => {
          setArchives(archives);
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

      const suggest = archives.filter((post: Archives) => {
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
    <>
      <div role="dialog" className={`${style['c-search']} ${isOpen ? style['is-open'] : ''}`}>
        <div className={style['c-search-header']}>
          <label className={style['c-search-header__icon']} htmlFor="search-input">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
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
                  <Link key={index} href={'/' + post.path}>
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
      <div className={`${style['c-search-overlay']} ${isOpen ? style['is-open'] : ''}`} onClick={toggleHandler}></div>
    </>
  );
};

export default Search;
