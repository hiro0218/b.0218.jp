import { handleError } from './handleError';

const IGNORE_DOMAINS = ['jira.atlassian.com', 'www.ups.com', 'web.archive.org'] as const;

export const isValidURL = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'https:';
  } catch (e) {
    handleError(e, url);
    return false;
  }
};

/**
 * URLを正規化する
 * @param url - 正規化対象のURL文字列
 * @returns 正規化されたURL
 */
export const normalizeURL = (url: string) => {
  const parseURL = new URL(url);
  return `${parseURL.protocol}//${parseURL.hostname}${parseURL.pathname}${parseURL.search}`;
};

/**
 * OGPが取得しづらいドメインを除外する
 */
export const isIgnoreDomain = (url: string) => {
  const parseURL = new URL(url);
  return IGNORE_DOMAINS.includes(parseURL.hostname);
};
