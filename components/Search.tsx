import Link from 'next/link';
import React, { useState } from 'react';

import archives from '@/_source/archives.json';
import style from '@/styles/Components/search.module.css';
import { Archives } from '@/types/source';

interface Props {
  isOpen: boolean;
  toggleHandler: () => void;
}

const Search = ({ isOpen = false, toggleHandler }: Props) => {
  const [data, setData] = useState({
    keyword: '',
    suggest: [],
  });

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
    <div className={isOpen ? 'is-open-search' : ''}>
      <div className={style['c-search']}>
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
            onKeyUp={(e) => onKeyup(e)}
          />
        </div>
        {data.suggest.length > 0 && (
          <div className={style['c-search-body']}>
            <ul className={style['c-search-list']}>
              {data.suggest.map((post, index) => {
                return (
                  <li key={index} className={style['c-search-list__item']}>
                    <Link href={'/' + post.path}>
                      <a className={style['c-search-list__link']}>{post.title}</a>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
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
      </div>
      <div className={style['c-search-overlay']} onClick={toggleHandler}></div>
    </div>
  );
};

export default Search;
