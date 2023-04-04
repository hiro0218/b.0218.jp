import { Window } from 'happy-dom';

import { isValidURL, normalizeURL } from './url';

const window = new Window();
const document = window.document;

const FETCH_HEADERS = { 'User-Agent': 'Twitterbot/1.0' };
export const FETCH_TIMEOUT = 1000;

export const getMeta = (html: string) => {
  document.head.innerHTML = html.match(/<head[^>]*>[\s\S]*?<\/head>/i)[0];
  const meta = document.head.querySelectorAll('meta');

  return meta;
};

export const getHTML = async (url: string) => {
  if (!isValidURL(url)) return '';

  const normalizedUrl = normalizeURL(url);

  return await fetch(normalizedUrl, {
    headers: FETCH_HEADERS,
    signal: AbortSignal.timeout(FETCH_TIMEOUT),
  }).then((res) => {
    return res.status === 200 ? res.text() : '';
  });
};
