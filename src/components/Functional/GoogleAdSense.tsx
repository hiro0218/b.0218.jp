import Script from 'next/script';

type GoogleAdSenseProps = {
  publisherId: string;
};

const GOOGLE_FC_PRESENT_SCRIPT_ID = 'googlefc-present';

export function GoogleAdSense({ publisherId }: GoogleAdSenseProps) {
  return (
    <>
      <link crossOrigin="anonymous" href="https://pagead2.googlesyndication.com" rel="preconnect" />
      <Script
        async
        crossOrigin="anonymous"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
        strategy="afterInteractive"
      />
      <link crossOrigin="anonymous" href="https://fundingchoicesmessages.google.com" rel="preconnect" />
      <Script
        src={`https://fundingchoicesmessages.google.com/i/${publisherId.replace('ca-', '')}?ers=1`}
        strategy="afterInteractive"
      />
      <Script id={GOOGLE_FC_PRESENT_SCRIPT_ID} strategy="afterInteractive">{`(function() {
        function signalGooglefcPresent() {
          if (!window.frames['googlefcPresent']) {
            if (document.body) {
              const iframe = document.createElement('iframe');
              iframe.style = 'width: 0; height: 0; border: none; z-index: -1000; left: -1000px; top: -1000px;';
              iframe.style.display = 'none';
              iframe.name = 'googlefcPresent';
              document.body.appendChild(iframe);
            } else {
              setTimeout(signalGooglefcPresent, 0);
            }
          }
        }
        signalGooglefcPresent();
      })()`}</Script>
    </>
  );
}
