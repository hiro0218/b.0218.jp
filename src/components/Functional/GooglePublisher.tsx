import Script from 'next/script';

export const GooglePublisherScript = () => {
  return (
    <>
      <Script async src="https://news.google.com/swg/js/v1/publisher.js" />
    </>
  );
};

export const GooglePublisherButton = () => {
  return <div {...{ 'google-add-preferred-source-btn': '' }} data-lang="ja"></div>;
};
