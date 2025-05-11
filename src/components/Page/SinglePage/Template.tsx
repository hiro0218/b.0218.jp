/**
 * about/privacyページで使用する共通テンプレート
 */
import type { AboutPage, WebPage, WithContext } from 'schema-dts';
import Content from '@/components/Page/Single/Content';

export type PageConfig = {
  slug: 'about' | 'privacy';
  title: string;
  description: string;
};

type SchemaStructuredData = WithContext<AboutPage | WebPage>;

type TemplateProps = {
  config: PageConfig;
  structuredData: SchemaStructuredData;
};

export default function Template({ config, structuredData }: TemplateProps) {
  const { slug, title, description } = config;

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([structuredData]),
        }}
        type="application/ld+json"
      />
      <Content title={title} description={description} slug={slug} />
    </>
  );
}
