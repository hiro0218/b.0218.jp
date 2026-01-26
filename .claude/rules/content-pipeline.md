---
description: 'コンテンツパイプラインと Git submodule 管理規則'
applyTo: '{_article/**/*,scripts/prebuild/**/*,build/**/*}'
paths:
  - '_article/**/*'
  - 'scripts/prebuild/**/*'
  - 'build/**/*'
---

# コンテンツパイプライン規則

**適用対象**: `_article/**/*`, `scripts/prebuild/**/*`, `build/**/*`

**目的**: コンテンツソースの直接編集を防止し、適切なビルドパイプラインの使用を徹底する。

## Priority Markers

> See [CLAUDE.md - Priority Levels](../CLAUDE.md#priority-levels) for marker definitions.

## 🔴 重要ルール (CRITICAL)

⚠️ **`_article/_posts/*.md` のファイルを直接編集しないこと**

これらのファイルは **Git submodule**（読み取り専用）です。

## コンテンツソース

### Git Submodule 構造

```
_article/                    ← Git submodule (separate repository)
└── _posts/                  ← Markdown source files
    ├── 2024-01-01-post.md
    ├── 2024-01-02-post.md
    └── ...
```

**特性**:

- 外部リポジトリ
- メインプロジェクトとは独立して管理
- コンテンツチームが所有・メンテナンス
- 開発チームは読み取り専用として使用

### なぜ読み取り専用か

1. **関心の分離**: コンテンツチームがコンテンツリポジトリを独立して管理
2. **バージョン管理**: コンテンツの変更が別リポジトリで追跡される
3. **ビルドプロセス**: メインプロジェクトは prebuild 時に最新コンテンツを取得

## コンテンツパイプラインフロー

### 1. ソース更新

```bash
# submodule を最新コミットに更新
git submodule update --remote
```

`npm run prebuild` により自動実行される。

### 2. 処理 (`build/article/`)

**入力**: `_article/_posts/*.md` (Markdown ファイル)

**処理内容**:

- Front matter 付き Markdown のパース (gray-matter)
- メタデータの抽出 (タイトル、日付、タグなど)
- Markdown から HTML への変換 (unified, remark, rehype)
- 日本語テキストの形態素解析 (kuromoji)
- コンテンツ類似度のための TF-IDF 計算
- 目次の生成 (mokuji.js)

**出力**: `.next/cache/article/` または類似ディレクトリ内の JSON ファイル

**スクリプト**:

- `build/article/index.ts` - メイン処理
- `build/article/parser.ts` - Markdown パース
- `build/article/analyzer.ts` - テキスト分析

### 3. 類似度計算 (`build/similarity/`)

**入力**: 処理済み記事 JSON

**処理内容**:

- 記事間のコサイン類似度を計算
- 類似度行列の生成
- 関連記事のランク付け

**出力**: 記事関係性を含む JSON

**スクリプト**:

- `build/similarity/index.ts` - 類似度計算
- `build/similarity/vectorizer.ts` - テキストのベクトル化

### 4. 人気記事 (`build/popular/`)

**入力**: Google Analytics データ (API 経由)

**処理内容**:

- ページビューデータの取得
- 人気度による記事のランク付け
- 人気記事リストの生成

**出力**: 人気度ランキングを含む JSON

**スクリプト**:

- `build/popular/index.ts` - GA データ取得

### 5. OGP 画像生成 (`build/ogp/`)

**入力**: 記事メタデータ (タイトル、抜粋)

**処理内容**:

- Playwright を使用した記事プレビューのレンダリング
- スクリーンショットの撮影
- 画像の最適化
- PNG として保存

**出力**: `public/ogp/{slug}.png`

**スクリプト**:

- `build/ogp/index.ts` - 画像生成
- `build/ogp/server.tsx` - プレビューレンダリング

### 6. 利用 (SSG)

**入力**: 生成された JSON ファイル

**処理内容**:

- Next.js がビルド時に JSON を読み込み
- `generateStaticParams` で静的ページを生成
- `getStaticProps` 相当 (App Router)

**出力**: 静的 HTML ページ

## Prebuild コマンド

**開発またはビルド前に必ず実行**:

```bash
npm run prebuild
```

**実行内容**:

```json
{
  "scripts": {
    "prebuild": "git submodule update --remote && npm run build:article && npm run build:similarity && npm run build:popular && npm run build:ogp"
  }
}
```

**実行順序**:

1. Git submodule の更新 (`_article/`)
2. 記事の処理 → JSON
3. 類似度の計算 → JSON
4. 人気記事の取得 → JSON
5. OGP 画像の生成 → PNG

**重要な理由**:

- 最新コンテンツの利用を保証
- すべての派生データの再生成
- 類似度計算の更新
- OGP 画像のリフレッシュ

## ファイル編集ルール

### ✅ 編集可能

- `build/**/*` - ビルドスクリプト（処理ロジック）
- `scripts/**/*` - ヘルパースクリプト
- `src/lib/posts.ts` - JSON 利用ロジック
- `src/app/**/page.tsx` - データを使用するページコンポーネント

### ❌ 編集不可

- `_article/_posts/*.md` - コンテンツソース（Git submodule）
- 生成された JSON ファイル（上書きされる）
- 生成された OGP 画像（上書きされる）

### 🔄 一時的な編集（開発時）

テスト目的のみ:

```bash
# ローカルテスト用に一時的にコンテンツを編集
cd _article
# ファイルを編集
cd ..
npm run build:article

# コミット前に元に戻す
git submodule update --remote
```

## 一般的なタスク

### 新しいコンテンツの追加

❌ **やってはいけないこと**:

```bash
# 誤り - submodule を直接編集
vim _article/_posts/2024-01-01-new-post.md
```

✅ **正しい方法**:

1. 独立したコンテンツリポジトリでコンテンツを作成
2. コンテンツリポジトリでコミット＆プッシュ
3. メインプロジェクトで submodule を更新:
   ```bash
   npm run prebuild
   ```

### コンテンツ処理の変更

✅ **正しいワークフロー**:

1. `build/article/*.ts` を編集（処理ロジック）
2. `npm run build:article` でテスト
3. 出力される JSON 構造を確認
4. メインリポジトリに変更をコミット

### コンテンツ問題のデバッグ

```bash
# 1. submodule ステータスの確認
git submodule status

# 2. 最新コンテンツの確認
ls -la _article/_posts/

# 3. デバッグ出力付きで再処理
DEBUG=true npm run build:article

# 4. 生成された JSON の確認
cat .next/cache/article/*.json | jq

# 5. OGP 生成のローカルテスト
npm run dev:ogp
```

## データフロー図

```
┌─────────────────────┐
│ _article/_posts/*.md│ (Git submodule, read-only)
└──────────┬──────────┘
           │ npm run build:article
           ↓
┌─────────────────────┐
│ JSON (processed)    │
└──────────┬──────────┘
           │ npm run build:similarity
           ↓
┌─────────────────────┐
│ JSON (similarity)   │
└──────────┬──────────┘
           │ npm run build:popular
           ↓
┌─────────────────────┐
│ JSON (popular)      │
└──────────┬──────────┘
           │ npm run build:ogp
           ↓
┌─────────────────────┐
│ PNG (OGP images)    │
└──────────┬──────────┘
           │ npm run build / npm run dev
           ↓
┌─────────────────────┐
│ Static HTML Pages   │
└─────────────────────┘
```

## 環境変数

**ビルド時**:

- `TZ=Asia/Tokyo` - 日付処理用のタイムゾーン
- `DEBUG=true` - デバッグ出力を有効化
- `ANALYZE=true` - バンドル分析モード

**実行時**（人気記事用）:

- `GOOGLE_APPLICATION_CREDENTIALS` - GA API 認証情報のパス
- `GA_PROPERTY_ID` - Google Analytics プロパティ ID

## トラブルシューティング

### 問題: コンテンツが更新されない

```bash
# 解決策: submodule の強制更新
git submodule update --remote --force
npm run prebuild
```

### 問題: OGP 画像が生成されない

```bash
# 解決策: Playwright インストールの確認
playwright install --only-shell
npm run build:ogp
```

### 問題: 類似度計算が失敗する

```bash
# 解決策: キャッシュをクリアして再ビルド
rm -rf .next/cache
npm run prebuild
```

## 検証チェックリスト

コンテンツパイプラインの変更をコミットする前に:

- [ ] `_article/_posts/*.md` ファイルが編集されていないこと
- [ ] ビルドスクリプトの変更が `npm run prebuild` でテストされていること
- [ ] 生成された JSON 構造が検証されていること
- [ ] OGP 画像が正しく再生成されていること
- [ ] 開発サーバーが新しいデータで動作すること
- [ ] 本番ビルドが正常に完了すること
