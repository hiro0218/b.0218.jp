import { memo } from 'react';

import { Container, getSize } from '@/components/Functional/Container';
import { Logo } from '@/components/UI/Logo';
import { useSearch } from '@/components/UI/Search';
import { styled } from '@/ui/styled/dynamic';
import { HeaderLayout } from './HeaderLayout';

export default memo(function Header() {
  const { SearchButton, SearchDialog } = useSearch();
  const size = getSize('large');

  return (
    <>
      <HeaderLayout>
        <HeaderContainer size={size}>
          <Logo />
          {SearchButton}
        </HeaderContainer>
      </HeaderLayout>

      {SearchDialog}
    </>
  );
});

const HeaderContainer = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  margin: 0 auto;
`;
