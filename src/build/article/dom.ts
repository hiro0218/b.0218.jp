import { JSDOM, VirtualConsole } from 'jsdom';

const FETCH_HEADERS = { 'User-Agent': 'Twitterbot/1.0' };
export const FETCH_TIMEOUT = 1000;

/**
 * 不正な CSS を読み込んだ際のパースエラーを握りつぶす
 * @see https://github.com/jsdom/jsdom/issues/2230
 */
const virtualConsole = new VirtualConsole();
virtualConsole.on('error', () => {
  // No-op to skip console errors.
});

export const getMeta = (html: string) => {
  const { document } = new JSDOM(html.match(/<head[^>]*>[\s\S]*?<\/head>/i)[0], { virtualConsole }).window;
  const meta = document.head.querySelectorAll('meta');

  return meta;
};

export const getHTML = async (url: string) => {
  return await fetch(url, {
    headers: FETCH_HEADERS,
    signal: AbortSignal.timeout(FETCH_TIMEOUT),
  }).then((res) => {
    return res.status === 200 ? res.text() : '';
  });
};
