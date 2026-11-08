import { Container } from '@/components/UI/Layout/Container';
import { Stack } from '@/components/UI/Layout/Stack';
import { Logo } from '@/components/UI/Logo';
import { AUTHOR_NAME, SITE_FEED_PATH } from '@/constants';
import { css, cx, styled } from '@/ui/styled';
import { postLayoutFooter } from '@/ui/styled/components/postLayout';
import { stateLayerControl } from '@/ui/styled/components/stateLayerControl';
import { NavigationLink } from './NavigationLink';
import { NAVIGATION_LINKS } from './navigationLinks';

export function Footer() {
  return (
    <Root>
      <Container className={cx(ContainerStyle, postLayoutFooter)} size="default">
        <LogoContainer>
          <Logo />
        </LogoContainer>
        <Nav aria-label="フッターナビゲーション">
          {NAVIGATION_LINKS.map(({ title, href }) => (
            <NavigationLink href={href} key={href}>
              {title}
            </NavigationLink>
          ))}
        </Nav>
        {/* RSS はナビの列に並べず、© の行の右端に置く。ページへの導線でなく購読の入口であり、列に並べると、狭い幅で RSS だけが折り返して取り残される */}
        <Stack align="center" direction="horizontal" gap={300} justify="space-between">
          <small className={copyrightStyle}>{`© ${AUTHOR_NAME}`}</small>
          <a
            className={cx(stateLayerControl, rssStyle)}
            href={SITE_FEED_PATH}
            rel="noopener alternate"
            target="_blank"
            type="application/rss+xml"
          >
            RSS
          </a>
        </Stack>
      </Container>
    </Root>
  );
}

// 上の本文とは、線ではなく面（gray-75）で区切る
const Root = styled.footer`
  padding-block: var(--spacing-page);
  background-color: var(--colors-gray-75);
`;

const ContainerStyle = css`
  display: grid;
  gap: var(--spacing-400);
  margin: auto;
  container-type: inline-size;
`;

const LogoContainer = styled.div`
  display: flex;
  margin-left: calc(var(--control-padding-inline) * -1);
`;

// @media (--isWide)（viewport 640px）は使わない。項目の余白は、viewport でなく配置先（本文幅）の幅に追従させるため
const Nav = styled.nav`
  --navigation-link-padding: var(--spacing-100);
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-75);
  align-items: center;
  margin-left: calc(var(--navigation-link-padding) * -1);

  @container (min-width: 36rem) {
    --navigation-link-padding: var(--control-padding-inline);
  }
`;

// 行の高さは、継承の 1.875 のままにしない。12px × 1.875 = 22.5px になり、4px の格子から外れるため
const copyrightStyle = css`
  font-family: var(--fonts-family-monospace);
  font-size: var(--font-sizes-xs);
  line-height: var(--grid-line-height-sm);
  color: var(--colors-gray-700);
`;

// 外部リンクの矢印（ベース CSS が target="_blank" の a の後ろへ付ける ↗）は、既定の間（0.15em）と文字 1 つ分の幅のままにしない。
// RSS の文字が右へ約 13px ずれるため、間 8・幅 16 の箱に入れる。
// ベース CSS は編集しない。共有なので、このリンクの ::after だけ上書きする
const rssStyle = css`
  padding-inline: var(--control-padding-inline);
  margin-right: calc(var(--control-padding-inline) * -1);
  font-family: var(--fonts-family-monospace);
  font-size: var(--font-sizes-sm);

  &::after {
    width: var(--sizes-icon-xs);
    margin-left: var(--spacing-100);
    text-align: center;
  }
`;
