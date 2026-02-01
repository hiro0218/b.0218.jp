---
paths:
  - '_article/**/*'
  - 'scripts/prebuild.sh'
  - 'build/**/*'
  - 'public/ogp/**'
---

# コンテンツパイプライン規則

## Priority Markers

> 優先度の定義については [CLAUDE.md](../../CLAUDE.md#priority-markers) を参照。

## 🔴 重要ルール (CRITICAL)

- `_article/_posts/*.md` は Git submodule のため直接編集禁止

## 出力先

- 生成物は `dist/` に出力する
- OGP 画像は `public/ogp/` に出力する

## Prebuild

- `npm run prebuild` を必ず実行する
- 実体は `bash scripts/prebuild.sh`

## パイプライン手順（要点）

1. `build/article` → `dist/*.json`
2. `build/similarity` → `dist/*.json`
3. `build/search` → `dist/*.json`
4. `build/popular` → `dist/*.json`
5. `build/ogp` → `public/ogp/*.png`

## 編集可能/不可

- ✅ `build/**/*`, `scripts/prebuild.sh`, `src/lib/data/posts.ts`, `src/app/**/page.tsx`
- ❌ `_article/_posts/*.md`, 生成された JSON, 生成された OGP 画像
