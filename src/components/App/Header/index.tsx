'use client';

import { memo } from 'react';

import { Container } from '@/components/Functional/Container';
import { Logo } from '@/components/UI/Logo';
import { useSearch } from '@/components/UI/Search';
import { css } from '@/ui/styled';
import { HeaderLayout } from './HeaderLayout';

export default memo(function Header() {
  const { SearchButton, SearchDialog } = useSearch();

  return (
    <>
      <HeaderLayout>
        <Container className={HeaderContainerStyle} size={'large'} space={false}>
          <Logo />
          {SearchButton}
        </Container>
      </HeaderLayout>

      {SearchDialog}
    </>
  );
});

const HeaderContainerStyle = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: var(--spacing-4);
  margin: 0 auto;

  @media (--isMobile) {
    padding: 0 var(--spacing-3);
  }
`;
