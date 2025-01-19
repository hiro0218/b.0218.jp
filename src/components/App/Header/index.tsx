import { memo } from 'react';

import { Container, getSize } from '@/components/Functional/Container';
import { Logo } from '@/components/UI/Logo';
import { useSearch } from '@/components/UI/Search';
import { css } from '@/ui/styled/static';
import { HeaderLayout } from './HeaderLayout';

export default memo(function Header() {
  const { SearchButton, SearchDialog } = useSearch();
  const size = getSize('large');

  return (
    <>
      <HeaderLayout>
        <Container className={HeaderContainerStyle} size={size}>
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
  margin: 0 auto;
`;
