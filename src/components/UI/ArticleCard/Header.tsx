import type { ReactNode } from 'react';

import type { TagCategoryName } from '@/types/source';
import { styled } from '@/ui/styled';

import { CATEGORY_ICONS, CATEGORY_LABELS } from './constants';

type Props = {
  category?: TagCategoryName;
  children: ReactNode;
};

export function Header({ category, children }: Props) {
  return (
    <Container>
      {children}
      {!!category && (
        <CategoryBadge aria-label={CATEGORY_LABELS[category]} data-category={category} role="img">
          {CATEGORY_ICONS[category]}
        </CategoryBadge>
      )}
    </Container>
  );
}

const Container = styled.div`
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
  border-radius: var(--radii-sm);

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
