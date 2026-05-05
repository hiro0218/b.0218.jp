/**
 * about/privacyページで使用する共通テンプレート
 */
import type { Thing, WithContext } from 'schema-dts';
import { StructuredData } from '@/components/Functional/StructuredData';
import { getAboutPageStructured, getProfilePageStructured, getWebPageStructured } from '@/lib/domain/json-ld';
import type { PageSlug } from '@/lib/page/config';
import { Content } from './Content';

/**
 * テンプレートコンポーネントのプロパティ型定義
 */
type TemplateProps = {
  slug: PageSlug;
  title: string;
  description: string;
};

/**
 * シングルページ用の共通テンプレートコンポーネント
 * about/privacyページで使用する
 * @param props - スラグ、タイトル、説明を含むプロパティ
 */
export function Template({ slug, title, description }: TemplateProps) {
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
      {jsonLd ? <StructuredData data={jsonLd} /> : null}
      <Content description={description} slug={slug} title={title} />
    </>
  );
}
