/**
 * about/privacyページで使用する共通テンプレート
 */
import type { AboutPage, WebPage, WithContext } from 'schema-dts';
import Content from './Content';
import { PAGE_CONFIGS } from './metadata';
import { AUTHOR } from './schema';
import type { PageSlug } from './types';

/**
 * テンプレートコンポーネントのプロパティ型定義
 */
type TemplateProps = {
  slug: PageSlug;
};

/**
 * 構造化データを生成する関数の型
 */
type StructuredDataGenerator = () => WithContext<AboutPage | WebPage>;

/**
 * スキーマ付きページ設定情報の型
 */
type PageConfigWithSchema = {
  title: string;
  description: string;
  createStructuredData: StructuredDataGenerator;
};

/**
 * ページの設定情報
 */
const PAGE_CONFIGS_WITH_SCHEMA: Record<PageSlug, PageConfigWithSchema> = {
  about: {
    ...PAGE_CONFIGS.about,
    createStructuredData: (): WithContext<AboutPage> => ({
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'About',
      description: 'サイトと運営者について',
      author: AUTHOR,
    }),
  },
  privacy: {
    ...PAGE_CONFIGS.privacy,
    createStructuredData: (): WithContext<WebPage> => ({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Privacy',
      description: 'プライバシーポリシー',
      author: AUTHOR,
    }),
  },
};

/**
 * シングルページ用の共通テンプレートコンポーネント
 * about/privacyページで使用する
 * @param props - スラグを含むプロパティ
 */
export default function Template({ slug }: TemplateProps) {
  const config = PAGE_CONFIGS_WITH_SCHEMA[slug];
  const { title, description } = config;
  const structuredData = config.createStructuredData();

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
