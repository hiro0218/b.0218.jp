type GoogleAdSenseProps = {
  publisherId: string;
};

export function GoogleAdSense({ publisherId }: GoogleAdSenseProps) {
  return (
    <script
      async
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
    ></script>
  );
}
