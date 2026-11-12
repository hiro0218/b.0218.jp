import Link from 'next/link';
import { timelineGrid, timelineMainColumn, timelineSideColumn } from '@/components/Page/_shared/timelineGrid';
import { SITE_DESCRIPTION } from '@/constants';
import { css, cx, styled } from '@/ui/styled';
import { containerType } from '@/ui/styled/utilities/container-type';

export function Hero() {
  return (
    <div className={containerType}>
      <div className={cx(timelineGrid, gridStyle)}>
        <Avatar className={timelineSideColumn}>
          <img alt="" fetchPriority="high" height={100} src="/hiro0218.svg" width={100} />
        </Avatar>
        <Body className={timelineMainColumn}>
          <Title>
            hiro<span> ─ web developer</span>
          </Title>
          <p>
            {SITE_DESCRIPTION}
            <br />
            <Link href="/about">about</Link>
          </p>
        </Body>
      </div>
    </div>
  );
}

const gridStyle = css`
  row-gap: var(--spacing-400);
  align-items: start;
  color: var(--colors-gray-900);

  a {
    text-decoration-line: underline;
    text-decoration-thickness: var(--border-widths-medium);
    text-decoration-color: var(--colors-gray-600);
    text-underline-offset: 2%;

    &:hover {
      text-decoration-color: var(--colors-gray-800);
    }
  }

  /* 説明の色を gray-600 にしない。ページ上部の帯の上で 4.5:1 に届かず、名前だけが目立つため */
  p {
    font-size: var(--font-sizes-lg);
    line-height: var(--grid-line-height-md);
  }
`;

const Avatar = styled.div`
  display: grid;
  place-items: center;

  img {
    flex-shrink: 0;
    aspect-ratio: 1/1;
    border-radius: var(--radii-full);
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-100);
  min-width: 0;
`;

// 名前の大きさと太さを、ベース CSS の h2（26→30px）・bold にしない。ほかのページの先頭の見出しより小さく、Home だけ見出しが弱く見えるため。
// 肩書きを中央にそろえず、名前と文字の下端（ベースライン）をそろえる。中央にそろえると、大きな名前の中ほどに浮くため
const Title = styled.h2`
  display: flex;
  gap: var(--spacing-100);
  align-items: baseline;
  font-size: var(--font-sizes-display);
  font-weight: var(--font-weights-bolder);
  line-height: var(--grid-line-height-sm);

  /* 肩書きの行の高さは、名前の行の高さ（60px）を引き継がず 1 にする。引き継ぐと、ベースラインをそろえたときに肩書きの箱が下へはみ出し、見出し全体が 9px 高くなるため */
  & > span {
    font-size: var(--font-sizes-lg);
    font-weight: var(--font-weights-normal);
    line-height: 1;
    color: var(--colors-gray-700);
    letter-spacing: var(--letter-spacings-sm);
  }
`;
