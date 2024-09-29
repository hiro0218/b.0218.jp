import { handleError } from './handleError';

export const isValidURL = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'https:';
  } catch (e) {
    handleError(e, url);
    return false;
  }
};

export const normalizeURL = (url: string) => {
  const parseURL = new URL(url);
  return `${parseURL.protocol}//${parseURL.hostname}${parseURL.pathname}`;
};

/**
 * OGPが取得しづらいドメインを除外する
 */
export const isIgnoreDomain = (url: string) => {
  const parseURL = new URL(url);
  const ignoreDomains = ['jira.atlassian.com', 'www.ups.com', 'web.archive.org'];

  return ignoreDomains.includes(parseURL.hostname);
};
