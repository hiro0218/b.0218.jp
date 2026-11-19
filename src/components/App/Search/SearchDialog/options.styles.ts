import { css } from '@/ui/styled';

// 面の色（hover・active・選択中）をここに置かず、行の種類ごとの class に持たせる。ここに置くと、2 つの class が同じ property（background-color）を持ち、適用順が定まらない。
// 選ばれていない行を transition: none にしない。hover・active が瞬時に切り替わり、サイトのほかの一覧と動きがそろわない。
// ベース CSS の a の transition（slow）を残さない。残すと、選択を動かすたびに面が遅れて追従する
export const optionStyle = css`
  font-size: var(--font-sizes-sm);
  line-height: var(--grid-line-height-sm);
  color: var(--colors-gray-900);
  cursor: pointer;
  user-select: none;
  scroll-margin-block: var(--spacing-100);
  border-radius: var(--radii-md);
  transition: background-color var(--transition-fast);

  &[aria-selected='true'] {
    transition: none;
  }
`;

// 選ばれた行を太字にせず、面だけで示す。太字にすると文字の幅が変わり、折り返しの位置が動く。
// hover を :hover だけで書かない。生成される CSS は書いた順でなく 選択中・hover・active の順に並び、選択中の行にマウスを載せると hover が勝って濃さが薄くなるため。
// 選択中を除く条件を、:where で包まずに :not だけにしない。詳細度が active より高くなり、押している間も hover が勝つため。
// min-height に --control-min-size を使わない。マウスの画面では 36px に縮み、行が詰まる。
// タイトルの text-wrap を balance にしない。全行の幅をそろえるために、1 行に収まる語まで次の行へ送られ、右側が空く
export const postRowStyle = css`
  display: flex;
  gap: var(--spacing-300);
  align-items: center;
  min-height: var(--sizes-touch-target);
  padding: var(--spacing-100) var(--spacing-300);

  &:hover:where(:not([aria-selected='true'])) {
    background-color: var(--colors-gray-a-75);
  }

  &[aria-selected='true'] {
    background-color: var(--colors-gray-a-200);
  }

  &:active {
    background-color: var(--colors-gray-a-300);
  }

  & > :first-child {
    flex: 1;
    min-width: 0;
    word-break: auto-phrase;
    text-wrap: pretty;
  }

  mark {
    padding: 0;
    font-weight: var(--font-weights-bold);
    color: inherit;
    background-color: transparent;
    border-radius: 0;
  }
`;

// 一致したタグ（行末）を省かない。タグだけに一致した行は、タイトルに太字が無く、一致の理由が見えなくなる
export const matchedTagStyle = css`
  display: inline-flex;
  flex-shrink: 0;
  gap: var(--spacing-50);
  align-items: center;
  font-size: var(--font-sizes-xs);
  color: var(--colors-gray-700);
`;

// 選択中を、hover と同じ黒 12% にしない。マウスを載せた chip と ↑↓ で選んだ chip を見分けられないため。
// hover・選択中・active を、background-image の層にしない。transition が効かず、切り替えが即座になって、タグや一覧の行と動きがそろわないため。
// hover を :hover だけで書かない。理由は postRowStyle の注と同じ
export const recentChipStyle = css`
  display: inline-flex;
  gap: var(--spacing-75);
  align-items: center;
  min-height: var(--control-min-size);
  padding-inline: var(--spacing-100) var(--spacing-300);
  background-color: var(--colors-gray-a-100);

  &:hover:where(:not([aria-selected='true'])) {
    background-color: var(--colors-gray-a-200);
  }

  &[aria-selected='true'] {
    background-color: var(--colors-gray-a-300);
  }

  &:active {
    background-color: var(--colors-gray-a-300);
  }

  svg {
    flex-shrink: 0;
    color: var(--colors-gray-700);
  }
`;
