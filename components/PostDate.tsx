import React, { FC } from 'react';

import { Post } from '@/types/source';
import { convertDateToSimpleFormat, isSameDate } from '@/utils/date';

type Props = Pick<Post, 'date' | 'updated'>;

const PostDate: FC<Props> = ({ date, updated }) => {
  const existsModified = !isSameDate(date, updated);

  return (
    <>
      <div className={'c-post-meta-date'}>
        <div className={!existsModified ? 'c-post-meta__date' : 'c-post-meta__date--strike'}>
          <time dateTime={date} itemProp="datePublished">
            {convertDateToSimpleFormat(date)}
          </time>
        </div>
        {existsModified && (
          <div className={'c-post-meta__date'}>
            <time dateTime={updated} itemProp="dateModified">
              {convertDateToSimpleFormat(updated)}
            </time>
          </div>
        )}
      </div>
    </>
  );
};

export default PostDate;
