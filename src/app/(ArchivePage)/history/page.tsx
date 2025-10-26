'use client';

import { useEffect, useState } from 'react';

import { Sidebar, Stack } from '@/components/UI/Layout';
import LinkCard from '@/components/UI/LinkCard';
import { Loading } from '@/components/UI/Loading';
import { Title } from '@/components/UI/Title';
import useIsMounted from '@/hooks/useIsMounted';
import { useReadingHistory } from '@/hooks/useReadingHistory';
import { convertPostSlugToPath } from '@/lib/url';
import type { ReadingHistoryItem } from '@/types/source';

const title = 'History';
const pageTitle = '閲覧履歴';

export default function Page() {
  const { getHistory } = useReadingHistory();
  const isMounted = useIsMounted();
  const [history, setHistory] = useState<ReadingHistoryItem[]>([]);

  useEffect(() => {
    if (isMounted) {
      const historyData = getHistory();
      setHistory(historyData);
    }
  }, [isMounted, getHistory]);

  const description = isMounted ? `${history.length}件の記事（最終閲覧順）` : '読み込み中...';

  return (
    <>
      <Title heading={title} paragraph={description} />
      <Sidebar>
        <Sidebar.Side>
          <Sidebar.Title>{pageTitle}</Sidebar.Title>
        </Sidebar.Side>
        <Sidebar.Main>
          {!isMounted ? (
            <Loading />
          ) : (
            <Stack>
              {history.length === 0 ? (
                <>閲覧履歴がありません</>
              ) : (
                <>
                  {history.map(({ date, slug: postSlug, tags, title: postTitle }) => {
                    const link = convertPostSlugToPath(postSlug);
                    return <LinkCard date={date} key={postSlug} link={link} tags={tags} title={postTitle} />;
                  })}
                </>
              )}
            </Stack>
          )}
        </Sidebar.Main>
      </Sidebar>
    </>
  );
}
