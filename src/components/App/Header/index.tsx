import { memo } from 'react';

import { Anchor as _Anchor } from '@/components/UI/Anchor';
import { LinkStyle } from '@/components/UI/LinkMenu';
import { Logo } from '@/components/UI/Logo';
import { useSearch } from '@/components/UI/Search';
import { isMobile } from '@/ui/lib/mediaQuery';
import { styled } from '@/ui/styled';

import { HeaderLayout } from './HeaderLayout';

export default memo(function Header() {
  const { SearchButton, SearchDialog } = useSearch();

  return (
    <>
      <HeaderLayout>
        <HeaderContainer>
          <Anchor href="/" passHref prefetch={false}>
            <Logo height="25" width="80" />
          </Anchor>
          {SearchButton}
        </HeaderContainer>
      </HeaderLayout>

      {SearchDialog}
    </>
  );
});

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 var(--space-6);
  margin: 0 auto;

  ${isMobile} {
    padding: 0 var(--space-2);
  }
`;

const Anchor = styled(_Anchor)`
  display: flex;
  align-items: center;
  height: 70%;
  pointer-events: auto;

  ${LinkStyle}
`;
