---
paths:
  - 'next.config.mjs'
  - 'biome.json'
  - 'panda.config.mts'
  - 'tsconfig.json'
  - 'postcss.config.cjs'
  - 'package.json'
---

# Config Files Verification

## Rule: Read Before Suggest

変更提案の前に、関連する設定ファイルを必ず読むこと。

## 必須チェック（最小）

- `next.config.mjs`: `reactCompiler` の有効/無効
- `biome.json`: `noRestrictedImports`（レイヤー依存）
- `panda.config.mts`: `theme.tokens` の定義
- `postcss.config.cjs`: hover 自動ラップ設定
- `tsconfig.json`: `strict` と `paths`（`@/*`, `~/*`）
- `package.json`: `prebuild` と関連スクリプト

**詳細**:

- React Compiler: [react-compiler-optimization.md](./react-compiler-optimization.md)
- レイヤー依存: [components.md](./components.md#レイヤー依存関係-critical)
- スタイリング: [styling.md](./styling.md)
- TypeScript: [typescript.md](./typescript.md)
