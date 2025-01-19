import { URL } from '@/constant';

export function MetaLinkFeed({
  feeds,
}: {
  feeds: {
    href: string;
    type: string;
  }[];
}) {
  return (
    <>
      {feeds.map(({ href, type }) => (
        <link href={href} key={href} rel="alternate" title="RSSフィード" type={type} />
      ))}
    </>
  );
}

/**
 * @see https://developer.mozilla.org/ja/docs/Web/HTML/Attributes/rel/me
 */
export function MetaLinkRelMe() {
  return (
    <>
      {Object.entries(URL).map(([key, url]) => (
        <link href={url} key={key} rel="me" />
      ))}
    </>
  );
}
