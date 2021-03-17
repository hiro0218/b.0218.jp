import React, { FC } from 'react';

import style from '@/styles/Components/post-meta.module.css';
import { Post } from '@/types/source';
import { convertDateToSimpleFormat, isSameDate } from '@/utils/date';

type Props = Pick<Post, 'date' | 'updated'>;

const PostDate: FC<Props> = ({ date, updated }) => {
  return (
    <>
      <div className={style['c-post-meta']}>
        <div className={style['c-post-meta__item--date']}>
          <time dateTime={date} itemProp="datePublished">
            {convertDateToSimpleFormat(date)}
          </time>
        </div>
        {!isSameDate(date, updated) && (
          <div className={style['c-post-meta__item--date']}>
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
