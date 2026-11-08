import type { CSSProperties, ReactNode } from 'react';

import type { TagCategoryName } from '@/types/source';
import { styled } from '@/ui/styled';

import { CATEGORIES } from './constants';

type Props = {
  category?: TagCategoryName;
  children: ReactNode;
};

export function Header({ category, children }: Props) {
  const badge = category ? CATEGORIES[category] : undefined;

  return (
    <Container>
      {children}
      {!!badge && (
        <CategoryBadge
          aria-label={badge.label}
          role="img"
          style={
            {
              '--category-color': badge.color,
              '--category-background-color': badge.backgroundColor,
            } as CSSProperties
          }
        >
          {badge.icon}
        </CategoryBadge>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  gap: var(--spacing-300);
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
  padding: var(--spacing-75);
  color: var(--category-color);
  background-color: var(--category-background-color);
  border-radius: var(--radii-sm);

  @container (max-width: 320px) {
    display: grid;
    place-items: center;
    order: -1;
    width: 100%;
    height: var(--spacing-800);

    & > svg {
      width: var(--sizes-icon-md);
      height: var(--sizes-icon-md);
    }
  }
`;
