---
paths:
  - '**/*.{ts,tsx}'
---

# TypeScript コーディング規約

## 🔴 必須

- `any` を使用しない
- 型のみの import は `import type`
- 絶対パス import を使用（`@/*` は `src/*`、`~/*` はリポジトリルート）

## 🟡 推奨

- Import order: 外部 → 内部 → コンポーネント → 型 → スタイル/定数
- 命名: コンポーネントは PascalCase、ユーティリティは camelCase

## JSDoc

UI コンポーネントの公開入口の export 関数には JSDoc + `@summary` を付ける（Storybook AI manifest が消費）。
詳細な Props JSDoc 判断基準は [components.md](./components.md#jsdoc--storybook-説明) を参照。

## 参照

- Props 設計: [components.md](./components.md#-props-設計-important)
- JSDoc: [components.md](./components.md#jsdoc--storybook-説明)
- Storybook 規約: [storybook.md](./storybook.md)
