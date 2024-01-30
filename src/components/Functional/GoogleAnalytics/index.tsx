import { Partytown } from '@builder.io/partytown/react';

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const GoogleAnalytics = () => {
  return (
    <>
      <Partytown forward={['dataLayer.push']} />
      <script defer src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} type="text/partytown" />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag() {
              dataLayer.push(arguments);
            }
            gtag("js", new Date());
            gtag("config", '${GA_ID}');
          `,
        }}
        defer
        type="text/partytown"
      />
    </>
  );
};
