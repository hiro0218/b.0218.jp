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

UI コンポーネントの export 関数には JSDoc + `@summary` を付ける（Storybook AI manifest が消費）。

Props JSDoc は **名前+型で自明なら付けない**（`isVisible: boolean`, `onClose: () => void`）。
付けるのは名前+型だけでは判断できないケース:

- ドメイン固有の意味: `type: AlertType` → `/** 重要度と視覚表現が変わる */`
- 動作が不明: `intrinsic?: boolean` → `/** flex column + align center による内在的な中央揃え */`
- 単位情報: `delay?: number` → `/** ホバーから表示までの遅延（ms） */`
- 使い分けガイド: `titleTagName` → `/** 一覧ページでは h2、単体では h3 が典型 */`

Story は `parameters.docs.description.story` で WHY を付ける。テスト専用は `tags: ['!manifest']`。

## 参照

- Props 設計: [components.md](./components.md#-props-設計-important)
- [Storybook AI Best Practices](https://storybook.js.org/docs/ai/best-practices)
