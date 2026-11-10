import { css } from '@/ui/styled';

// container-type: inline-size を持たない祖先の下では使わない。切り替えは祖先の container query（コンテナ幅 40rem）で行うため。
// 12 列に分ける幅を 40rem より狭くしない。日付の列（2 列）が日付の文字幅（10 文字の等幅）に収まらなくなるため。
// この class の要素には、display・grid-template-columns・column-gap を別の class で足さない。出力順で勝ち負けが決まるため。
// この 40rem を、PostTimeline.tsx の Item・Time と Archive/Chart.tsx の @container だけ別の幅にしない。列の変わる位置が食い違うため
export const timelineGrid = css`
  display: grid;
  grid-template-columns: minmax(0, 1fr);

  @container (min-width: 40rem) {
    grid-template-columns: repeat(12, minmax(0, 1fr));
    column-gap: var(--spacing-400);
  }
`;

export const timelineSideColumn = css`
  @container (min-width: 40rem) {
    grid-column: span 2;
  }
`;

export const timelineMainColumn = css`
  @container (min-width: 40rem) {
    grid-column: span 10;
  }
`;
