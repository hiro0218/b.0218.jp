import React, { FC } from 'react';

import style from '@/styles/Components/post-meta.module.css';
import { Post } from '@/types/source';
import { convertDateToSimpleFormat, isSameDate } from '@/utils/date';

type Props = Pick<Post, 'date' | 'updated'>;

const PostDate: FC<Props> = ({ date, updated }) => {
  const existsModified = !isSameDate(date, updated);

  return (
    <>
      <div className={style['c-post-meta']}>
        <div className={!existsModified ? style['c-post-meta__date'] : style['c-post-meta__date--strike']}>
          <time dateTime={date} itemProp="datePublished">
            {convertDateToSimpleFormat(date)}
          </time>
        </div>
        {existsModified && (
          <div className={style['c-post-meta__date']}>
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
