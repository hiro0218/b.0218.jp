# ドメイン語彙

このリポジトリのドメインの語（Post、Tag、Source など）が指す意味を定める。

## 記事

- **Post** — 公開された記事。HTML 本体・メタデータ・タグを持つ。`dist/posts/<slug>.json` に永続化される。公開の条件は、ビルドした時点で `date` が現在以前であること。環境変数 `IS_DEVELOPMENT` が `true` の preview ビルドでは、未来の日付の記事も含める（`build/article/visibility.ts`）。
- **Article** — Post と Page に共通の基底型（`src/types/source.d.ts`）。`title`・`slug`・`date`・`updated`・本文 `content`（HTML）を持つ。Post は Article にタグ・`note`・`noindex` を足した型で、Page は Article そのものである。この文書で「記事」と書くときは Post を指し、Page を含めない（Page を含めるときは Article と書く）。
- **ArticleSummary** — Article から `content` を除き、省略可の `tags` を足した一覧用の型。PostSummary は、これに必須の `tags` と、省略可の `noindex` を足した型である。
- **RawPost** — Post の素。markdown 本文と検証済み frontmatter から組み立てる中間表現。slug 確定済・日付 ISO 化済・HTML 化はまだ。本文フィールドは意図的に `markdown` と命名しており、`Post.content` との相互代入をコンパイル時に弾くための非対称である。`content` に揃えてはならない。
- **RawPostFrontmatter** — gray-matter で parse した直後の frontmatter。`title` と `date` が必須。
- **PostSummary** — Post から `content` と `note` を除いた一覧用の軽量型。`dist/posts-list.json` に永続化される。
- **PostList** — PostSummary の date 降順配列。`getPostsListJson()` が返す。
- **Slug** — Post の URL-safe 識別子。フォーマット: `[A-Za-z0-9_-]+`。型は持たず、書式は `src/lib/source/post.ts` の `VALID_SLUG_PATTERN` が定める。Page の識別子も `slug` と呼ぶ（`PageSlug`、`src/lib/page/config.ts`）。記事ルートの `[slug]`（`params.slug`）の値は、Slug ではなく、`.html` を付けた形（`<Slug>.html`）である。Tag の表示名は `slug` と呼ばず、`name` と呼ぶ。タグ別ルートの `[slug]`（`params.slug`、`routeSlug`）は、Next の動的セグメントの名前である。値はその URL の区間で、エンコード済みのことも、未エンコードの表示名のこともあり、`tagFromUrlPath()` で表示名へ戻す。
- **note** — Post の注釈（任意）。RawPost では markdown で持ち、Post では HTML に変換した文字列で持つ。変換結果が空なら Post に含まれない（`build/article/convert.ts`）。
- **noindex** — frontmatter に書く真偽値。`true` の Post は、記事ページで検索エンジンのインデックスを拒否し、トップと最近の記事・アーカイブ・タグ別一覧・関連記事の候補・検索インデックス・サイトマップ・フィードから除かれる。サンプル記事のように、公開しても一覧に載せない投稿に使う。

## タグ

- **Tag** — Post をグループ化するキーワード。`string` 型で扱う。表示名（display name）が canonical 形。
- **TagKey** — Tag の同一性比較用の派生キー。`tagKey()` が表示名を `toLowerCase()` した値を返し、build と runtime で同じ関数を共有する。build は、同じ TagKey を持つ表記を、最も多く出る 1 つ（同数なら、日付の新しい記事から数えて先に出た 1 つ）に統一し、全記事で同じ表示名にする（`build/article/normalizeTag.ts`）。runtime でルートのタグを引くとき（`getRoutableTagByRouteSlug()`）は、表示名を `===` で照合する（`src/lib/tag/routing.ts`）。runtime で `tagKey()` を呼ぶのは、検索語の正規化（`src/lib/search.ts`）だけである。
- **TagUrlPath** — Tag の URL-safe 形。`tagUrlPath()` が表示名を `encodeURIComponent` した値を返し、`/tags/<TagUrlPath>` の URL を作るときに使う（`src/lib/tag/navigation.ts`）。`tagFromUrlPath()` が表示名へ戻す。
- **TagIndex** — Tag の表示名から、その Tag を持つ Post の Slug の配列への対応。`dist/tags.json` に永続化される。
- **TagCounts** — Tag の表示名 `name` と、その Tag を持つ Post の件数 `count` の組（`{ name, count }`）。件数の多い順に `dist/tags-with-count.json` へ永続化される。
- **閲覧可能なタグ** — 件数 `count` が `TAG_VIEW_LIMIT`（3。`src/constants.ts`）以上の Tag。タグ一覧（`/tags`）に載り、タグ別ページとタグ別フィードを持つ。コード上は routable（`src/lib/tag/routing.ts`）、navigable（`src/app/(ArchivePage)/tags/page.tsx`）と呼ばれる。

## ページ

- **Page** — 非記事の固定ページ（about、privacy など）。Post とは区別する。型は Article と同じである（`Page = Article`）。UI 側では、`Page/Single/`（[app-router.md](./app-router.md)）と route group `(SinglePage)` が対応する。`Page/` 層（[layers.md](./layers.md)）とは別のものである。

## Source

- **Source** — runtime が dist の永続化データを取得するときの境界。Post Source / Tag Source / Page Source / Activities Source（登壇・執筆などの活動実績）の 4 つにドメインごとに分かれる。各 Source は dist の読み込み・キャッシュ・型 shape 検証を内部で完結させ（Post Source は slug の書式の検証も含む）、呼び出し側にはドメイン型（Post / PostSummary / TagIndex / TagCounts / Page / Activities）だけを返す。
- 派生データ（PostPopularityScores、PostSimilarityIndex、TagSimilarityScores、TagCategoryMap、検索インデックス）は Source の対象外。これらは追加ドメイン規則を持たない単なる dist 成果物として、必要な箇所で個別に load する。ただし、検索インデックスを除く 4 つは、壊れた dist を検出する fail-fast の仕組み（読み込み・キャッシュ・shape 検証・失敗時 throw）に、`src/lib/distLoader/` の共有機構（Source・派生データ双方が対等に使うドメイン非依存の実装）を利用する。共有するのは機構のみで、派生データが Source に昇格するわけではない。

## 埋め込みコンテンツ

- **埋め込みコンテンツ** — build が Post / Page の HTML 本文中に `<script type="application/json" class="...">` として埋め込み、runtime が同じ class 名と JSON 形状を検証して React コンポーネントへ復元するデータ（link-preview、gfm-alert）。契約（class 名定数・payload 型・型 guard）は `src/lib/domain/embeddedContent.ts` に集約し、build の変換と runtime の Handler の双方がこれを import する。

## 参照

- データの生成手順と出力先: [content-pipeline.md](./content-pipeline.md)
