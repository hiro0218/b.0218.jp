/** @jsxImportSource hono/jsx */
import { css, Style } from 'hono/css';
import { html } from 'hono/html';
import type { Child, FC } from 'hono/jsx';

import { getOgpTheme, type OgpTheme } from './theme';

type Props = {
  tags?: string[];
  title: string;
};

type BaseProps = {
  children?: Child;
  theme: OgpTheme;
};

const getThemeStyle = (theme: OgpTheme): string =>
  [
    `--ogp-background-color: ${theme.background}`,
    `--ogp-text-color: ${theme.text}`,
    `--ogp-footer-text-color: ${theme.footerText}`,
    `--ogp-decoration-end-color: ${theme.decorationEnd}`,
    `--ogp-decoration-end-opacity: ${theme.decorationEndOpacity}`,
    `--ogp-decoration-start-color: ${theme.decorationStart}`,
    `--ogp-decoration-start-opacity: ${theme.decorationStartOpacity}`,
  ].join('; ');

const cssGlobal = css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    background-color: var(--ogp-background-color);
  }

  body {
    width: 1200px;
    height: 630px;
    margin: 0;
    color: var(--ogp-text-color);

    &::before,
    &::after {
      position: absolute;
      inset: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      pointer-events: none;
      content: '';
      background-color: var(--ogp-decoration-start-color);
      opacity: var(--ogp-decoration-start-opacity);
      clip-path: polygon(0% 0%, 100% 0%, 0 max(10vw, 80px), 0% 100%);
    }

    &::after {
      background-color: var(--ogp-decoration-end-color);
      opacity: var(--ogp-decoration-end-opacity);
      clip-path: polygon(0% 0%, 100% 0%, 100% max(20vw, 300px));
    }
  }
`;

const cssMain = css`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  padding: 40px 60px;
  overflow: hidden;
  font-family: 'Noto Sans JP', 'Noto Color Emoji', sans-serif;
  font-weight: 900;
  font-feature-settings: 'palt';
  text-align: center;
`;

const cssHeader = css`
  z-index: 1;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const cssHeading = css`
  display: -webkit-box;
  margin: 0 auto;
  overflow: hidden;
  -webkit-line-clamp: 3;
  font-size: 56px;
  line-height: 1.7;
  letter-spacing: 0.0025em;
  word-break: auto-phrase;
  -webkit-box-orient: vertical;
`;

const cssFooter = css`
  z-index: 1;
  width: 100%;
  font-size: 24px;
  font-weight: 600;
  color: var(--ogp-footer-text-color);
  text-align: left;
`;

const Base: FC<BaseProps> = ({ children, theme }) => {
  return html`<!doctype html>
    <html lang="ja" style="${getThemeStyle(theme)}">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <title>OGP Image</title>
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&family=Noto+Sans+JP:wght@900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        ${children}
      </body>
    </html>`;
};

export const Template: FC<Props> = ({ tags = [], title }) => {
  const theme = getOgpTheme(tags);
  const domain = 'b.0218.jp';

  return (
    <Base theme={theme}>
      <Style>{cssGlobal}</Style>
      <main className={cssMain}>
        <header className={cssHeader}>
          <h1 className={cssHeading} id="title">
            {title}
          </h1>
        </header>
        <footer className={cssFooter}>{domain}</footer>
      </main>
    </Base>
  );
};
