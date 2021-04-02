import React, { FC } from 'react';

import HatenaLogo from '@/images/sns_hatenabookmark.svg';
import TwitterLogo from '@/images/sns_twitter.svg';
import styleShare from '@/styles/Components/share.module.css';

interface Props {
  title: string;
  url: string;
}

const PostShare: FC<Props> = ({ title, url }) => {
  const copyToUrl = (e) => {
    e.preventDefault();

    const input = document.createElement('input');
    input.value = url;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    input.remove();

    alert('記事のURLをコピーしました。');
  };

  return (
    <div className={styleShare['c-share']}>
      <a
        href={'https://twitter.com/intent/tweet?url=' + url + '&text=' + encodeURIComponent(title)}
        className={styleShare['c-share__item']}
        title="Share Twitter"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Twitter"
      >
        <TwitterLogo />
      </a>
      <a
        href={'http://b.hatena.ne.jp/add?url=' + url}
        className={styleShare['c-share__item']}
        title="Share HatenaBookmark"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hatena Bookmark"
      >
        <HatenaLogo />
      </a>
      <a
        href="#"
        onClick={copyToUrl}
        className={styleShare['c-share__item--copy']}
        title="Copy URL"
        aria-label="Copy URL"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
            clipRule="evenodd"
          />
        </svg>
      </a>
    </div>
  );
};

export default PostShare;
