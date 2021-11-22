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

const FooterMenuList = styled.ul`
  display: inline-flex;
  list-style: none;
`;

const FooterMenuListItem = styled.li`
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
        <FooterMenuList>
          <FooterMenuListItem>
            <Link href="/about" prefetch={false}>
              <a>about</a>
            </Link>
          </FooterMenuListItem>
          <FooterMenuListItem>
            <Link href="/archive" prefetch={false}>
              <a>archive</a>
            </Link>
          </FooterMenuListItem>
        </FooterMenuList>

        <FooterCopyright>
          <small>©&nbsp;hiro</small>
        </FooterCopyright>
      </FooterContainer>
    </Footer>
  );
};

export default TheFooter;
