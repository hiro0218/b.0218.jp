import { FC } from 'react';
import { FaTwitter } from 'react-icons/fa';

interface Props {
  title: string;
  url: string;
}

const PostShare: FC<Props> = ({ title, url }) => {
  return (
    <div className="c-share">
      <a
        href={'https://twitter.com/intent/tweet?url=' + url + '&text=' + encodeURIComponent(title)}
        className="c-share__item"
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
