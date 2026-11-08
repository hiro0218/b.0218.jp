import { CaretLineUpIcon } from '@phosphor-icons/react/ssr';
import { PostTimeline } from '@/components/Page/_shared/PostTimeline';
import { Heading } from '@/components/UI/Heading';
import { IconButton } from '@/components/UI/IconButton';
import { Stack } from '@/components/UI/Layout/Stack';
import type { ArchivesByYear } from '@/types/source';
import { ICON_SIZE_XS } from '@/ui/iconSizes';
import { css } from '@/ui/styled';
import { YEAR_INDEX_ANCHOR_ID, type YearPostCount, yearAnchorId } from './Chart';

// 固定ヘッダーの高さ分だけジャンプ先をずらし、年別一覧からの着地後に見出しがヘッダーへ隠れないようにする。
// h2 は display: block でブロック幅いっぱいに広がるため、fit-content で外接矩形をテキスト幅に絞り、
// hash 遷移後の focus リングが入力欄のように見えるのを防ぐ。
const yearHeadingStyle = css`
  width: fit-content;
  scroll-margin-top: var(--sizes-header);
`;

export function ArchiveTimelinesByYear({ archives, years }: { archives: ArchivesByYear; years: YearPostCount[] }) {
  return (
    <>
      {years.map(({ year, postCount }) => (
        <Stack as="section" gap={700} key={year}>
          <Heading
            as="h2"
            className={yearHeadingStyle}
            id={yearAnchorId(year)}
            isBold
            tabIndex={-1}
            textSide={
              <Stack align="center" direction="horizontal" gap={100}>
                <span>{postCount} posts</span>
                {/* グリフは PageScroll（ページトップへ）と同じにする。件数の横に置くため、違うグリフだと増減記号と誤読される */}
                <IconButton
                  aria-label="年別アーカイブへ"
                  as="link"
                  href={`#${YEAR_INDEX_ANCHOR_ID}`}
                  size="touch"
                  tooltip="年別アーカイブへ"
                >
                  <CaretLineUpIcon height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
                </IconButton>
              </Stack>
            }
          >
            {year}
          </Heading>
          <PostTimeline posts={archives[year]} />
        </Stack>
      ))}
    </>
  );
}
