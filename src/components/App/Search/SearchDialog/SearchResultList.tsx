import { type KeyboardEvent, type RefObject, useEffect, useRef } from 'react';
import { styled } from '@/ui/styled';
import { SEARCH_LABELS } from '../constants';
import { tokenizeQuery } from '../engine';
import type { SearchMode, SearchOption } from '../types';
import { PostOption } from './PostOption';
import { RecentOption } from './RecentOption';

const REGEXP_SPECIAL_CHARS = /[.*+?^${}()|[\]\\]/g;
const escapeRegExp = (text: string) => text.replace(REGEXP_SPECIAL_CHARS, '\\$&');

type SearchResultListProps = {
  listId: string;
  listRef: RefObject<HTMLDivElement | null>;
  mode: SearchMode;
  /** 実行済みの検索語 */
  query: string;
  rows: SearchOption[];
  focusedIndex: number;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  onRowMouseMove: (index: number) => void;
  setRowRef: (index: number, element: HTMLElement | null) => void;
  onRecentSelect: (query: string) => void;
  onPostSelect: () => void;
};

/**
 * @summary 一覧（listbox）。未入力のときは最近の検索とよく読まれている記事を、入力があるときは検索結果を並べる。
 */
export function SearchResultList({
  listId,
  listRef,
  mode,
  query,
  rows,
  focusedIndex,
  onKeyDown,
  onRowMouseMove,
  setRowRef,
  onRecentSelect,
  onPostSelect,
}: SearchResultListProps) {
  const sizerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = listRef.current;
    const sizer = sizerRef.current;
    if (!container || !sizer) return;

    let frameId: number | undefined;
    const updateHeight = () => {
      if (frameId !== undefined) {
        cancelAnimationFrame(frameId);
      }

      frameId = requestAnimationFrame(() => {
        container.style.setProperty('--search-list-height', `${sizer.offsetHeight.toFixed(1)}px`);
      });
    };

    const observer = new ResizeObserver(updateHeight);
    observer.observe(sizer);
    updateHeight();

    return () => {
      if (frameId !== undefined) {
        cancelAnimationFrame(frameId);
      }
      observer.disconnect();
    };
  }, [listRef]);

  const isSuggestions = mode === 'suggestions';
  const tokens = isSuggestions ? [] : tokenizeQuery(query);
  const highlight = tokens.length > 0 ? new RegExp(`(${tokens.map(escapeRegExp).join('|')})`, 'i') : null;

  const renderRow = (option: SearchOption, index: number) =>
    option.kind === 'recent' ? (
      <RecentOption
        id={option.id}
        index={index}
        isSelected={focusedIndex === index}
        key={option.id}
        onMouseMove={onRowMouseMove}
        onSelect={onRecentSelect}
        query={option.query}
        setRef={setRowRef}
      />
    ) : (
      <PostOption
        highlight={highlight}
        id={option.id}
        index={index}
        isSelected={focusedIndex === index}
        key={option.id}
        matchedTag={option.matchedTag}
        onClick={onPostSelect}
        onMouseMove={onRowMouseMove}
        setRef={setRowRef}
        slug={option.slug}
        title={option.title}
      />
    );

  const recentRows = rows.flatMap((option, index) => (option.kind === 'recent' ? [renderRow(option, index)] : []));
  const postRows = rows.flatMap((option, index) => (option.kind === 'post' ? [renderRow(option, index)] : []));
  const popularHeadingId = `${listId}-popular`;

  return (
    <Container
      aria-label={isSuggestions ? SEARCH_LABELS.searchSuggestions : SEARCH_LABELS.searchResults}
      id={listId}
      onKeyDown={onKeyDown}
      ref={listRef}
      role="listbox"
    >
      <Sizer ref={sizerRef}>
        {/* 最近の検索には見出しを出さず、名前だけ付ける。語の面の時計のアイコンで、最近の検索と分かるため */}
        {recentRows.length > 0 ? (
          <RecentGroup aria-label={SEARCH_LABELS.recentSearches} role="group">
            {recentRows}
          </RecentGroup>
        ) : null}
        {/* 「よく読まれている記事」を見出しなしで並べない。未入力で記事が並ぶと、画面から並ぶ理由が分からず、検索結果と取り違えるため */}
        {postRows.length > 0 && isSuggestions ? (
          <PostGroup aria-labelledby={popularHeadingId} role="group">
            <GroupHeading aria-hidden="true" id={popularHeadingId}>
              {SEARCH_LABELS.popularPosts}
            </GroupHeading>
            {postRows}
          </PostGroup>
        ) : null}
        {postRows.length > 0 && !isSuggestions ? <PostGroup>{postRows}</PostGroup> : null}
      </Sizer>
    </Container>
  );
}

const Container = styled.div`
  height: var(--search-list-height, auto);
  max-height: var(--search-content-max-height);
  overflow-x: clip;
  overflow-y: auto;
  scroll-padding-block: var(--spacing-100);
  transition: height var(--transition-slow);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

// 外側の余白を Container の padding にしない。height に入れる Sizer の高さは余白を含まず、
// border-box では余白の分だけ内容が溢れて、件数が少ないときに最後の行の下が切れる
const Sizer = styled.div`
  display: flex;
  flex-direction: column;
  padding: var(--spacing-100);
`;

const RecentGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-100);
  padding-inline: var(--spacing-75);
  padding-bottom: var(--spacing-300);
`;

const PostGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-75);
`;

const GroupHeading = styled.div`
  padding: var(--spacing-100) var(--spacing-300) var(--spacing-75);
  font-size: var(--font-sizes-xs);
  line-height: var(--grid-line-height-sm);
  color: var(--colors-gray-700);
`;
