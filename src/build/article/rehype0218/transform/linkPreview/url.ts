export const isValidURL = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'https:';
  } catch (e) {
    return false;
  }
};

export const normalizeURL = (url: string) => {
  const parseURL = new URL(url);
  return `${parseURL.protocol}//${parseURL.hostname}${parseURL.pathname}`;
};
