import Link from 'next/link';

import style from '@/styles/Components/hover-card.module.css';
import { convertDateToSimpleFormat } from '@/utils/date';

interface Props {
  link: string;
  title: string;
  date: string;
  excerpt: string;
}

const HoverCard = ({ link, title, date, excerpt }: Props) => {
  return (
    <Link href={link}>
      <a className={style['hover-card']}>
        <div className={style['hover-card-main']}>
          <h3 className={style['hover-card__title']}>{title}</h3>
          <div className={style['hover-card__text']}>
            <time dateTime={date}>{convertDateToSimpleFormat(date)}: </time>
            {excerpt}
          </div>
        </div>
        <div className={style['hover-card-icon']}>
          <div className={style['hover-card-icon__arrow']}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default HoverCard;
