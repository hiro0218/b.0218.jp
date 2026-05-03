---
paths:
  - '**/*.{ts,tsx,js,jsx}'
---

# コードレビューの指示

## レビュー手順

### 1. 自動チェック

```bash
tsc --noEmit --skipLibCheck  # 型エラー検出
npm run lint                 # Biome: [linting.md](./linting.md)
npm test                     # テスト実行
```

### 2. 手動レビュー（チェックリスト）

- [ ] JSDoc とコメントが適切（[typescript.md](./typescript.md), [storybook.md](./storybook.md)）
- [ ] アーキテクチャ準拠（[architecture.md](./architecture.md), [components.md](./components.md#-レイヤー依存関係-critical)）
- [ ] スタイリング規約準拠（[styling.md](./styling.md), [components.md](./components.md#-zero-margin-principle-critical) の Zero Margin）
- [ ] セキュリティ: ハードコードされた秘密情報がない
- [ ] セキュリティ: ユーザー入力のバリデーション

## プロジェクト特有の注意点

- **ビルドプロセス**: `npm run prebuild` への影響、JSON/OGP 生成の整合性（[content-pipeline.md](./content-pipeline.md)）
- **SSG 原則違反**: ランタイム `fetch` を追加していないか（[architecture.md](./architecture.md)）
