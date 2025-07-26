import Script from 'next/script';
import type { ReactNode } from 'react';
import type { Thing, WithContext } from 'schema-dts';

type Props = {
  jsonLd: WithContext<Thing> | WithContext<Thing>[] | null;
};

export const JsonLdScript = ({ jsonLd }: Props): ReactNode => {
  if (!jsonLd) {
    return null;
  }

  return (
    <Script
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd),
      }}
      type="application/ld+json"
    />
  );
};
