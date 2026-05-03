---
paths:
  - '**/*.stories.{ts,tsx}'
  - '.storybook/**/*'
---

# Storybook 規約

[Storybook AI Best Practices](https://storybook.js.org/docs/ai/best-practices) に準拠。AI manifest と開発者の両方にとって再現性の高いストーリーを維持する。

## 🔴 Story 単一責任 (CRITICAL)

1 ストーリーは **1 つの概念・ユースケース** のみを示す。

- ✅ `Primary`, `WithIcon`, `Disabled` のように変更点が 1 つ
- ❌ `SizesAndVariants` のように複数軸を同時表示する
- ❌ `FullContent` / `全属性` のように全 props を同時指定する

### 複合ストーリーが必要な場合

レイアウトリファレンスとして最大構成を残したい場合は許可する。ただし **必ず** `tags: ['!manifest']` を付与し、AI manifest から除外する。

```tsx
export const FullContent: Story = {
  tags: ['!manifest'],
  name: '全属性',
  // ...
};
```

## 🔴 Descriptive WHY (CRITICAL)

全ストーリーに `parameters.docs.description.story` を記述する。「**いつ・なぜ使うか**」を書き、「何を表示するか」は書かない。詳細は [components.md](./components.md#jsdoc--storybook-説明) を参照する。

```tsx
// ✅ WHY を記述
parameters: {
  docs: {
    description: {
      story: '取り消し不能な操作やデータ損失の可能性がある場合に使用する。',
    },
  },
},

// ❌ WHAT しか書いていない
parameters: {
  docs: {
    description: {
      story: '警告アイコンと背景色が表示される。',
    },
  },
},
```

## 🟡 manifest curation (IMPORTANT)

以下のストーリーには `tags: ['!manifest']` を付与して AI manifest から除外する:

- インタラクションテスト専用（`play` 関数を持つ）
- 複合ストーリー（全属性・最大構成のレイアウト確認用）
- Design Tokens のように動的評価が必要なページ
- アンチパターンや非推奨 API のデモ

## 🟡 設定 (IMPORTANT)

`.storybook/main.ts`:

```ts
const config: StorybookConfig = {
  framework: '@storybook/nextjs-vite',
  stories: [...],
  addons: ['@storybook/addon-a11y'],
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
};
```

- `react-docgen-typescript`: props の JSDoc と型情報を AI manifest に渡す。パフォーマンスが問題になったら `react-docgen` に切り替え可能
- `autodocs`: `preview.tsx` の `tags: ['autodocs']` で全ストーリー自動有効

## ストーリー命名

- `export const` 名: PascalCase の英語（`Default`, `WithIcon`, `Disabled`）
- `name` プロパティ: 日本語（Sidebar 表示用）
- 名前は **1 概念の変更点** を表現する（`Primary` ◯ / `SizesAndVariants` ✗）

## チェックリスト（新規ストーリー作成時）

- [ ] 1 ストーリー 1 概念
- [ ] `parameters.docs.description.story` に WHY を記述
- [ ] コンポーネント本体に `@summary` 付き JSDoc
- [ ] テスト/複合ストーリーには `tags: ['!manifest']`
- [ ] `parameters.layout` の指定が適切（`centered` / `padded` / `fullscreen`）

## 参照

- Props 設計: [components.md](./components.md#-props-設計-important)
- JSDoc: [components.md](./components.md#jsdoc--storybook-説明)
- TypeScript JSDoc: [typescript.md](./typescript.md#jsdoc)
- [Storybook AI Best Practices](https://storybook.js.org/docs/ai/best-practices)
