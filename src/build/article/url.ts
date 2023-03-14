export const isValidURL = (url: string) => {
  const regex =
    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-zA-Z0-9]+([-.]{1}[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}(\/.*)?$/;
  return regex.test(url);
};

export const normalizeURL = (url: string) => {
  const parseURL = new URL(url);
  return `${parseURL.protocol}//${parseURL.hostname}${parseURL.pathname}`;
};
