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
        <h3 className={style['hover-card__title']}>{title}</h3>
        <div className={style['hover-card__text']}>
          <time dateTime={date}>{convertDateToSimpleFormat(date)}: </time>
          {excerpt}
        </div>
      </a>
    </Link>
  );
};

export default HoverCard;
