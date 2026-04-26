# IMPLEMENTATION_PLAN

`/improve-codebase-architecture` で確定した 5 つの深化候補の実装計画。各 Stage は独立 PR として進められる。

ドメイン語彙は [CONTEXT.md](./CONTEXT.md) を参照。

## 横断方針

- **配置規約**: 共有モジュールは `src/lib/` 配下に置き、build からは相対 import する（workspace 化はしない）
- **マイグレーション**: 各 Stage 内では「振る舞い変更ゼロ」を保つ commit と、テスト追加 commit を分ける
- **検証**: 各 commit 後に `npm run prebuild` と `tsc --noEmit` を通す

## 依存関係

```
Stage 1 (環境設定)
   ↓ isDevelopment を提供
Stage 2 (post/tag/page 分離)
   ↓ src/lib/post/, src/lib/tag/ を提供
Stage 3 (tag 正規化) ─┐
                     ├ Stage 2 の上に乗る
Stage 4 (RawPost→Post)┘ Stage 1 の IS_DEVELOPMENT を拡張

Stage 5 (HTML handler) ← 独立。任意タイミングで並列可
```

推奨実装順: 1 → 2 → 3 → 4 → 5 (5 はいつでも)

---

## Stage 1: 環境設定モジュール

**Goal**: `process.env` の散在を解消し、型のある config モジュールに集約する

**Success Criteria**:

- `src/lib/config/environment.ts` が `isDevelopment` / `isProduction` / `buildId` を export
- `buildId` は production && 不在で throw（fail-fast）
- 全 5 callsite が新モジュール参照に置換済み（`src/lib/data/posts.ts:29,75`、`src/app/(PostPage)/[slug]/page.tsx:46`、`src/app/(ArchivePage)/tags/[slug]/page.tsx:97`、`src/app/layout.tsx:71-73`、`src/components/UI/Adsense/Adsense.tsx:24`）
- public-safe な値のみを置く規約をモジュール先頭にコメントで明記

**Commits** (2):

1. `77676be2` `feat: add application environment constants`
2. `f155f7bf` `fix: replace process.env.NODE_ENV with isProduction for environment checks`

**Status**: Complete

---

## Stage 2: post / tag / page モジュール分離

**Goal**: `src/lib/data/posts.ts` を解体し、ドメイン別にモジュール化する。キャッシュ戦略を統一する

**Success Criteria**:

- 新モジュール 3 つが存在
  - `src/lib/post/data.ts` — `getPostBySlug`, `getPostsJson`, `getPostsListJson`, `getSimilarPosts`, `getPostsPopular`
  - `src/lib/tag/data.ts` — `getTagsJson`, `getTagsWithCount`, `getSimilarTag`, `getTagCategoriesJson`
  - `src/lib/page/data.ts` — `getPagesJson`
- 全 accessor が lazy + memoize
- `getPostBySlug` は `Map<slug, Post>` で memoize
- `VALID_SLUG_PATTERN` は `src/lib/post/` 配下に維持
- dev-only validate は Stage 1 の `isDevelopment` を使用
- 旧 `src/lib/data/posts.ts` 削除済み
- ~20 callsite が新パスに移行済み

**Commits** (実装済み、auto-commit 待ち):

1. 新モジュール `src/lib/post/data.ts` / `src/lib/tag/data.ts` / `src/lib/page/data.ts` 追加。`src/lib/data/posts.ts` を再エクスポートのみに
2. 全 21 callsite (src 19 + build 2) を新モジュール直接参照に置換
3. `src/lib/data/` 削除、`.claude/rules/content-pipeline.md` を新パスに更新

**Test**: 既存 272 件 pass（モジュール単位 fixture テストは未追加）

**Status**: Complete

---

## Stage 3: タグ正規化の共有

**Goal**: build と runtime に重複する tag normalization ロジックを単一ソース化する

**Success Criteria**:

- `src/lib/tag/key.ts` — `tagKey(name)`, `tagsEqual(a, b)`
- `src/lib/tag/url.ts` — `tagUrlPath(name)`, `tagFromUrlPath(slug)`
- `src/lib/tag/category.ts` — `getPrimaryCategory` (旧 `src/lib/utils/tagCategory.ts` から移動)
- `build/article/post/generate/normalizeTag.ts` の `toLowerCase` が `tagKey()` 経由
- `src/components/App/Search/engine/indexedSearch.ts:55` の `toLowerCase` が `tagKey()` 経由
- `src/app/(ArchivePage)/tags/[slug]/page.tsx` の `encodeURIComponent` が `tagUrlPath()` 経由
- 既存 `build/article/post/generate/normalizeTag.test.ts` は build 側に維持

**Commits** (4):

1. `cd0ff98d` `feat(tag): add canonical key and URL helpers`
2. `c8313f33` `refactor(tag): route equality keys through tagKey` (build/normalizeTag, build/term, indexedSearch)
3. `bc74002b` `refactor(tag): move category helper into tag domain`
4. `049fef7c` `refactor(tag): route URL paths through tagUrlPath`

**Status**: Complete

---

## Stage 4: RawPost ↔ Post 変換 seam

**Goal**: 変換の段階を型と関数として明示し、テスト可能にする

**Success Criteria**:

- `src/lib/post/raw.ts` — `RawPostFrontmatter`, `RawPost`, `parseFrontmatter`, `isValidFrontmatter`
- `src/lib/post/convert.ts` — `convertRawPost(raw, { markdownToHtml }): Post`（依存注入）
- `src/lib/post/visibility.ts` — `isPubliclyVisible(raw, { now, isDevelopment })`
- `src/lib/config/environment.ts` に `IS_DEVELOPMENT` を追加（Stage 1 拡張）
- `build/article/post/generate/post.ts` は orchestration (file 走査・並列実行・disk 書き込み) のみに
- `convertRawPost`, `isPubliclyVisible`, `parseFrontmatter` の単体テスト

**Commits** (4):

1. 型定義 (RawPostFrontmatter / RawPost) を `src/lib/post/raw.ts` に
2. `isPubliclyVisible` 抽出 + `IS_DEVELOPMENT` を config に統合
3. `convertRawPost` を `src/lib/post/convert.ts` に抽出
4. `buildPost` を新モジュール群を呼ぶ形に整理

**Status**: Not Started

---

## Stage 5: HTML ハンドラ・パイプライン

**Goal**: ノード変異と置換の責務を分離し、ハンドラ順序を declarative にする

**Success Criteria**:

- ハンドラが mutators / replacers の 2 種に分類されている
  - mutators: CodePen
  - replacers: Anchor, Alert, LinkPreview, Table, ZoomImage
- 順序は `src/components/Page/Post/Content/parser/` 配下の declarative array で表現
- `HandlerReturn` 型は廃止（`Mutator = (node) => void` / `Replacer = (node, options) => ReactElement | undefined`）
- `parser(content)` 単一エントリで自己参照オプションを内部に閉じ込め
- end-to-end スナップショット + Alert / LinkPreview 単体テスト

**Commits** (3):

1. handlers を mutators / replacers に分類（振る舞い変更ゼロ、配列は未導入）
2. 順序を declarative array に昇格（振る舞い変更ゼロ）
3. テスト追加

**Status**: Not Started

---

## 完了条件

- 全 Stage が完了し、`Status: Complete` になったら本ファイルを削除する
