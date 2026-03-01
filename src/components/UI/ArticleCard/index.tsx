import type { ComponentProps, ReactNode } from 'react';

import { Anchor } from '@/components/UI/Anchor';
import PostDate from '@/components/UI/Date';
import { Stack } from '@/components/UI/Layout';
import type { TagCategoryName } from '@/types/source';
import { CodeBracketIcon, ComputerDesktopIcon, DocumentTextIcon, ICON_SIZE_XS } from '@/ui/icons';
import { css, cx, styled } from '@/ui/styled';
import { postTagAnchor } from '@/ui/styled/components';
import { textEllipsis } from '@/ui/styled/utilities';

type PostDateProps = ComponentProps<typeof PostDate>;

type Props = {
  link: string;
  title: string;
  titleTagName?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  excerpt?: ReactNode | string;
  date: PostDateProps['date'];
  updated?: PostDateProps['updated'];
  tags?: string[];
  category?: TagCategoryName;
  prefetch?: boolean;
};

function ArticleCard({
  link,
  title,
  date,
  updated,
  excerpt,
  tags,
  category,
  titleTagName = 'h3',
  prefetch = false,
}: Props) {
  const Title = titleTagName;

  return (
    <Stack className={containerStyle} gap={1}>
      <Header>
        <PostDate date={date} updated={updated} />
        {!!category && (
          <CategoryBadge aria-label={CATEGORY_LABELS[category]} data-category={category}>
            {CATEGORY_ICONS[category]}
          </CategoryBadge>
        )}
      </Header>
      <Anchor className={anchorStyle} href={link} prefetch={prefetch}>
        <Title className={cx('line-clamp-2', titleStyle)}>{title}</Title>
      </Anchor>
      {!!excerpt && (
        <Paragraph className={textEllipsis} {...(typeof excerpt !== 'string' && { as: 'div' })}>
          {excerpt}
        </Paragraph>
      )}
      {!!tags && (
        <Tags>
          {tags.map((tag) => (
            <TagItem className={postTagAnchor} key={tag}>
              {tag}
            </TagItem>
          ))}
        </Tags>
      )}
    </Stack>
  );
}

export default ArticleCard;

const CATEGORY_LABELS: Record<TagCategoryName, string> = {
  development: '開発',
  technology: 'テクノロジー',
  other: 'その他',
};

const CATEGORY_ICONS: Record<TagCategoryName, ReactNode> = {
  development: <CodeBracketIcon height={ICON_SIZE_XS} width={ICON_SIZE_XS} />,
  technology: <ComputerDesktopIcon height={ICON_SIZE_XS} width={ICON_SIZE_XS} />,
  other: <DocumentTextIcon height={ICON_SIZE_XS} width={ICON_SIZE_XS} />,
};

const containerStyle = css`
  --container-space: var(--spacing-3);
  --hover-color: var(--colors-accent-1100);

  contain-intrinsic-size: 0 200px;
  padding: var(--container-space);
  contain: layout style;
  container-type: inline-size;
  content-visibility: auto;
  word-break: break-all;
  background-color: var(--colors-white);
  border-radius: var(--radii-4);
  box-shadow: 0 0 0 1px var(--colors-gray-200);
  transition: box-shadow 0.2s var(--easings-ease-out-expo);

  &:hover,
  &:focus,
  &:focus-within {
    box-shadow: 0 0 0 1px var(--hover-color);
  }

  &:active {
    box-shadow: 0 0 0 2px var(--hover-color);
  }

  time {
    font-size: var(--font-sizes-sm);
    line-height: var(--line-heights-xs);
  }
`;

const anchorStyle = css`
  &::before {
    position: absolute;
    inset: 0;
    z-index: var(--z-index-base);
    width: 100%;
    height: 100%;
    cursor: pointer;
    content: '';
  }

  &:hover,
  &:focus,
  &:focus-within {
    & > * {
      color: var(--hover-color);
    }
  }

  &:focus-within {
    box-shadow: none;
  }
`;

const titleStyle = css`
  font-size: var(--font-sizes-sm);
  font-weight: var(--font-weights-bold);
  line-height: var(--line-heights-md);
  color: var(--colors-gray-1000);
  transition: color 0.2s var(--easings-ease-out-expo);
`;

const Paragraph = styled.p`
  color: var(--colors-gray-900);
  letter-spacing: var(--letter-spacings-sm);
`;

const Tags = styled.div`
  display: flex;
  gap: var(--spacing-1);
  margin-top: auto;
  overflow: clip;
  mask-image: linear-gradient(to right, transparent, #000 0, #000 calc(100% - 2em), transparent);

  @container (max-width: 480px) {
    display: none;
  }
`;

const TagItem = styled.span`
  padding: var(--spacing-½) var(--spacing-1);
  font-size: var(--font-sizes-xs);
  border-radius: var(--radii-4);
`;

const Header = styled.div`
  display: flex;
  gap: var(--spacing-2);
  align-items: center;
  justify-content: space-between;

  @container (max-width: 320px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const CategoryBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-½);
  border-radius: var(--radii-4);

  @container (max-width: 320px) {
    display: grid;
    place-items: center;
    order: -1;
    width: 100%;
    height: var(--spacing-5);

    & > svg {
      width: var(--sizes-icon-md);
      height: var(--sizes-icon-md);
    }
  }

  &[data-category='development'] {
    color: var(--colors-blue-900);
    background-color: var(--colors-blue-100);
  }

  &[data-category='technology'] {
    color: var(--colors-green-900);
    background-color: var(--colors-green-100);
  }

  &[data-category='other'] {
    color: var(--colors-gray-800);
    background-color: var(--colors-gray-75);
  }
`;
