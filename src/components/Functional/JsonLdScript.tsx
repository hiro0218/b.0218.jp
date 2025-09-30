import Script from 'next/script';
import { type ReactNode, useMemo } from 'react';
import type { Thing, WithContext } from 'schema-dts';

type Props = {
  jsonLd: WithContext<Thing> | WithContext<Thing>[] | null;
};

export const JsonLdScript = ({ jsonLd }: Props): ReactNode => {
  const jsonLdString = useMemo(() => {
    if (!jsonLd) return null;
    return JSON.stringify(jsonLd);
  }, [jsonLd]);

  if (!jsonLdString) {
    return null;
  }

  return (
    <Script
      dangerouslySetInnerHTML={{
        __html: jsonLdString,
      }}
      type="application/ld+json"
    />
  );
};
