import styled from '@emotion/styled';
import Link from 'next/link';
import { FC } from 'react';

const Footer = styled.footer`
  margin-top: calc(var(--margin-base) * 4);
  padding: 3rem 0;
  background: var(--bg-color--lighter);
  color: var(--color-text--light);
  line-height: 1;
  text-align: center;

  a {
    color: inherit;

    &:hover {
      text-decoration-line: underline;
    }
  }
`;

const FooterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: var(--container-width);
  margin: 0 auto;
  transition: padding 0.1s ease-in-out;

  @media (max-width: 959px) {
    padding: 0 5vw;
  }
`;

const FooterMeneList = styled.ul`
  display: inline-flex;
  padding: 0;
  list-style: none;
`;

const FooterMeneListItem = styled.li`
  & + & {
    margin-left: 1em;
  }
`;

const FooterCopyright = styled.div`
  small {
    font-size: 1em;
  }
`;

const TheFooter: FC = () => {
  return (
    <Footer>
      <FooterContainer>
        <FooterMeneList>
          <FooterMeneListItem>
            <Link href="/" prefetch={false}>
              <a>home</a>
            </Link>
          </FooterMeneListItem>
          <FooterMeneListItem>
            <Link href="/about" prefetch={false}>
              <a>about</a>
            </Link>
          </FooterMeneListItem>
          <FooterMeneListItem>
            <Link href="/archive" prefetch={false}>
              <a>archive</a>
            </Link>
          </FooterMeneListItem>
        </FooterMeneList>

        <FooterCopyright>
          <small>©&nbsp;hiro</small>
        </FooterCopyright>
      </FooterContainer>
    </Footer>
  );
};

export default TheFooter;
