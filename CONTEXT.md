# CONTEXT

このリポジトリは `_article` git submodule から記事を取り込み、ビルド時に markdown→HTML 変換・タグ正規化・類似度算出を行い、`dist/` に静的 JSON として出力する。Next.js は SSG でこの dist を消費する。

## ドメイン語彙

### 記事

- **Post** — 公開された記事。HTML 本体・メタデータ・タグを持つ。`dist/posts/<slug>.json` に永続化される。
- **RawPost** — Post の素。markdown 本文と検証済み frontmatter から組み立てる中間表現。slug 確定済・日付 ISO 化済・HTML 化はまだ。
- **RawPostFrontmatter** — gray-matter で parse した直後の frontmatter。`title` と `date` が必須。
- **PostSummary** — Post から `content` を除いた一覧用の軽量型。`dist/posts-list.json` に永続化される。
- **PostList** — PostSummary の date 降順配列。
- **Slug** — Post の URL-safe 識別子。フォーマット: `[A-Za-z0-9_-]+`。

### タグ

- **Tag** — Post をグループ化するキーワード。`string` 型で扱う。表示名（display name）が canonical 形。
- **TagKey** — Tag の同一性比較用派生値。実装は `tag.toLowerCase()`。build と runtime で同じ関数を共有する。
- **TagUrlPath** — Tag の URL-safe 形。表示名を `encodeURIComponent` した値。route 層と data 層をまたいで使う。
- **TagCounts.slug** — 歴史的に `slug` と命名されているが、実体は Tag の表示名そのもの。URL-safe slug ではない。命名整理は別議題。

### ページ

- **Page** — 非記事の固定ページ（about、privacy、search など）。Post とは区別する。

### Source

- **Source** — runtime が dist の永続化データを取得する seam。Post Source / Tag Source / Page Source の 3 つにドメインごとに分かれる。各 Source は dist の読み込み・キャッシュ・検証（slug pattern、ISO 日付、RawPost と Post の型区別など）を内部で完結させ、呼び出し側にはドメイン型（Post / PostSummary / Tag / TagCounts / Page）だけを返す。
- 派生データ（PostPopularityScores、PostSimilarityMatrix、TagSimilarityScores、TagCategoryMap、検索インデックス）は Source の対象外。これらは追加ドメイン規則を持たない単なる dist 成果物として、必要な箇所で個別に load する。

## パイプライン

```
_article/_posts/*.md           (RawPost ソース、git submodule、編集禁止)
        ↓ npm run prebuild
        ↓ build/article/       (RawPost → Post 変換、HTML 化、Tag 正規化)
dist/posts/<slug>.json         (Post)
dist/posts-list.json           (PostList)
dist/tags.json                 (TagIndex)
dist/pages.json                (Page[])
        ↓ runtime (SSG build time)
src/lib/post/, src/lib/tag/, src/lib/page/, src/lib/config/
        ↓
src/app/**/page.tsx            (静的レンダリング)
```
