import React, { FC } from 'react';
import { FaTwitter } from 'react-icons/fa';

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
        <FaTwitter />
      </a>
    </div>
  );
};

export default PostShare;
