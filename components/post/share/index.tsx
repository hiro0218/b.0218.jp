import React, { FC } from 'react';

import TwitterLogo from '@/images/sns_twitter.svg';
import styleShare from '@/styles/Components/share.module.css';

interface Props {
  title: string;
  url: string;
}

const PostShare: FC<Props> = ({ title, url }) => {
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
    </div>
  );
};

export default PostShare;
