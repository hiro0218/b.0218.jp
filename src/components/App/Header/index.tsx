import { memo } from 'react';

import { Container, getSize } from '@/components/Functional/Container';
import { Anchor as _Anchor } from '@/components/UI/Anchor';
import { LinkStyle } from '@/components/UI/LinkMenu';
import { useSearch } from '@/components/UI/Search';
import { SITE_NAME } from '@/constant';
import { styled } from '@/ui/styled';
import { HeaderLayout } from './HeaderLayout';

export default memo(function Header() {
  const { SearchButton, SearchDialog } = useSearch();
  const size = getSize('large');

  return (
    <>
      <HeaderLayout>
        <HeaderContainer size={size}>
          <Anchor href="/" prefetch={false}>
            <img src="/logo.v2.svg" alt={SITE_NAME} height="25" width="80" />
          </Anchor>
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

const Anchor = styled(_Anchor)`
  display: flex;
  align-items: center;
  height: 70%;
  pointer-events: auto;

  ${LinkStyle}
`;
