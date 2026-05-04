---
paths:
  - '_article/**/*'
  - 'scripts/prebuild.sh'
  - 'build/**/*'
  - 'dist/**/*'
  - 'public/images/ogp/**'
---

# コンテンツパイプライン規則

## 🔴 重要ルール (CRITICAL)

- `_article/_posts/*.md` は Git submodule のため直接編集禁止

`_article` は外部 source of truth、`dist/` と `public/images/ogp/` は派生物である。手動編集は `prebuild` で上書きされ、記事・検索・OGP の整合性を壊すため、生成元または生成スクリプトを修正する。

## 出力先

- 生成物は `dist/` に出力する
- OGP 画像は `public/images/ogp/` に出力する

## Prebuild

- `npm run prebuild` を必ず実行する
- 実体は `bash scripts/prebuild.sh`

## パイプライン手順（要点）

1. `build:article` → `dist/*.json`（順次）
2. 以下を並列実行:
   - `build:similarity` → `dist/*.json`
   - `build:search` → `dist/*.json`
   - `build:popular` → `dist/*.json`
   - `build:category` → `dist/*.json`
3. `build:ogp` → `public/images/ogp/*.jpg`（`SKIP_OGP=true` でスキップ可）

`SKIP_OGP=true npm run prebuild` は OGP 出力や OGP メタデータに関係しないローカル確認でのみ使う。`build/ogp/**`、OGP URL、OGP 画像生成条件を変更した場合、最終確認ではスキップしない。

正確な手順は `scripts/prebuild.sh` を参照。

## 編集可能/不可

- ✅ `build/**/*`, `scripts/prebuild.sh`, `src/lib/post/`, `src/lib/tag/`, `src/lib/source/`, `src/app/**/page.tsx`
- ❌ `_article/_posts/*.md`, 生成された JSON, `public/images/ogp/*`
