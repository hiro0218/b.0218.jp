import { JSDOM, VirtualConsole } from 'jsdom';

import { isIgnoreDomain, isValidURL, normalizeURL } from './url';

const FETCH_HEADERS = { 'User-Agent': 'Twitterbot/1.0' };

export const FETCH_TIMEOUT = 1000;

const virtualConsole = new VirtualConsole();
virtualConsole.on('error', () => {
  /* skip console errors */
});
const { DOMParser } = new JSDOM(`<!DOCTYPE html><body></body>`, { virtualConsole }).window;

export const getMeta = (html: string) => {
  const head = html.match(/<head[^>]*>[\s\S]*?<\/head>/i);

  if (head?.length === 0) {
    return null;
  }

  const document = new DOMParser().parseFromString(head[0], 'text/html');
  const meta = document.head.querySelectorAll('meta');

  return meta;
};

export const getHTML = async (url: string) => {
  if (isIgnoreDomain(url)) return '';
  if (!isValidURL(url)) return '';

  const normalizedUrl = normalizeURL(url);

  return await fetch(normalizedUrl, {
    headers: FETCH_HEADERS,
    signal: AbortSignal.timeout(FETCH_TIMEOUT),
  }).then((res) => {
    return res.status === 200 ? res.text() : '';
  });
};
