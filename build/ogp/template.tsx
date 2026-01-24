import { css, Style } from 'hono/css';
import { html } from 'hono/html';
import type { FC } from 'hono/jsx';

type Props = {
  title: string;
};

const cssGlobal = css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    background-color: #e4e4e4;
  }

  body {
    width: 1200px;
    height: 630px;
    margin: 0;
    color: #333;

    &::before,
    &::after {
      position: absolute;
      inset: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      pointer-events: none;
      content: '';
      background-color: #0000000f;
      clip-path: polygon(0% 0%, 100% 0%, 0 max(10vw, 80px), 0% 100%);
    }

    &::after {
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
  text-align: left;
`;

const Base: FC = (props) => {
  return html`<!doctype html>
    <html lang="ja">
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
        ${props.children}
      </body>
    </html>`;
};

export const Template: FC = (props: Props) => {
  return (
    <Base>
      <Style>{cssGlobal}</Style>
      <main className={cssMain}>
        <header className={cssHeader}>
          <h1 className={cssHeading} id="title">
            {props.title}
          </h1>
        </header>
        <footer className={cssFooter}>b.0218.jp</footer>
      </main>
    </Base>
  );
};
