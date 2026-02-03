/**
 * about/privacyページで使用する共通テンプレート
 */
import type { Thing, WithContext } from 'schema-dts';
import { PAGE_CONFIGS } from '@/app/_metadata';
import { StructuredData } from '@/components/Functional/StructuredData';
import { getAboutPageStructured, getProfilePageStructured, getWebPageStructured } from '@/lib/domain/json-ld';
import Content from './Content';
import type { PageSlug } from './types';

/**
 * テンプレートコンポーネントのプロパティ型定義
 */
type TemplateProps = {
  slug: PageSlug;
};

/**
 * シングルページ用の共通テンプレートコンポーネント
 * about/privacyページで使用する
 * @param props - スラグを含むプロパティ
 */
export default function Template({ slug }: TemplateProps) {
  const { title, description } = PAGE_CONFIGS[slug];
  const jsonLd = (() => {
    switch (slug) {
      case 'about':
        return [
          getAboutPageStructured({
            name: 'About',
            description: 'サイトと運営者について',
          }),
          getProfilePageStructured(),
        ];
      case 'privacy':
        return getWebPageStructured({
          name: 'Privacy',
          description: 'プライバシーポリシー',
          includeOrganization: true,
        });
      default:
        return null;
    }
  })() as WithContext<Thing> | WithContext<Thing>[] | null;

  return (
    <>
      {jsonLd && <StructuredData data={jsonLd} />}
      <Content description={description} slug={slug} title={title} />
    </>
  );
}
