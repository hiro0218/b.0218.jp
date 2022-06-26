import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { Logo } from '@/components/UI/Logo';
import { SearchButton, SearchDialog } from '@/components/UI/Search';
import { useModal } from '@/components/UI/Search/useDialog';
import { mobile } from '@/lib/mediaQuery';
import { styled } from '@/ui/styled';

import { HeaderLayout } from './HeaderLayout';

export const TheHeader = () => {
  const { ref, openDialog, closeDialog } = useModal();
  const { asPath } = useRouter();

  useEffect(() => {
    closeDialog();
  }, [asPath, closeDialog]);

  return (
    <>
      <HeaderLayout>
        <Container>
          <Link href="/" prefetch={false} passHref>
            <LogoAnchor>
              <Logo width="80" height="25" />
            </LogoAnchor>
          </Link>
          <SearchButton openDialog={openDialog} />
        </Container>
      </HeaderLayout>

      <SearchDialog ref={ref} closeDialog={closeDialog} />
    </>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: var(--container-width);
  height: 100%;
  margin: 0 auto;

  ${mobile} {
    padding: 0 5vw;
  }
`;

const LogoAnchor = styled.a`
  display: flex;
  align-items: center;
  height: 100%;
  pointer-events: auto;
`;
