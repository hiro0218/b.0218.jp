import { URL } from '@/constant';

export const MetaLinkDnsPrefetch = ({ domains }: { domains: string[] }) => {
  return (
    <>
      {domains.map((href, index) => {
        return <link href={href} key={href + index} rel="dns-prefetch" />;
      })}
    </>
  );
};

export const MetaLinkFeed = ({
  feeds,
}: {
  feeds: {
    href: string;
    type: string;
  }[];
}) => {
  return (
    <>
      {feeds.map(({ href, type }, index) => {
        return <link href={href} key={href + index} rel="alternate" title="RSSフィード" type={type} />;
      })}
    </>
  );
};

export const MetaLinkRelMe = () => {
  return (
    <>
      {Object.entries(URL).map(([key, url]) => {
        return <link href={url} key={key} rel="me" />;
      })}
    </>
  );
};
