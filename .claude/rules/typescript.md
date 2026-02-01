---
paths:
  - '**/*.{ts,tsx}'
---

# TypeScript コーディング規約

## Priority Markers

> 優先度の定義については [CLAUDE.md](../../CLAUDE.md#priority-markers) を参照。

## 🔴 必須

- `any` を使用しない
- 型のみの import は `import type`
- 公開APIには JSDoc を付ける
- 絶対パス import を使用（`@/*` は `src/*`、`~/*` はリポジトリルート）

## 🟡 推奨

- Import order: 外部 → 内部 → コンポーネント → 型 → スタイル/定数
- 命名: コンポーネントは PascalCase、ユーティリティは camelCase

## 参照

- Props 設計: [components.md](./components.md#props-設計-important)
