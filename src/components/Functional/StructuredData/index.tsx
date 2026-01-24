import type {
  AboutPage,
  BlogPosting,
  BreadcrumbList,
  CollectionPage,
  Organization,
  Thing,
  WebPage,
  WebSite,
  WithContext,
} from 'schema-dts';

type StructuredDataProps = {
  data:
    | WithContext<CollectionPage | WebPage | AboutPage | BlogPosting | BreadcrumbList | Organization | WebSite | Thing>
    | WithContext<Thing>[];
};

/**
 * JSON-LD 構造化データをスクリプトタグとして出力
 *
 * @param data - Schema.org の構造化データオブジェクト（単一または配列）
 * @returns JSON-LD スクリプトタグ
 *
 * @example
 * 単一の構造化データ
 * ```tsx
 * <StructuredData
 *   data={getCollectionPageStructured({
 *     name: 'Archive',
 *     description: '記事一覧'
 *   })}
 * />
 * ```
 *
 * @example
 * 複数の構造化データ（配列）
 * ```tsx
 * <StructuredData
 *   data={[
 *     getBlogPostingStructured(post),
 *     getBreadcrumbStructured(post)
 *   ]}
 * />
 * ```
 */
export const StructuredData = ({ data }: StructuredDataProps) => (
  <script
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(data),
    }}
    type="application/ld+json"
  />
);
