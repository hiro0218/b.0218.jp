---
paths:
  - '**/components/**/*.{ts,tsx}'
---

# コンポーネントアーキテクチャ規則

## Priority Markers

> 優先度の定義については [CLAUDE.md](../../CLAUDE.md#priority-markers) を参照。

## 🔴 Zero Margin Principle (CRITICAL)

- UI コンポーネントは外部マージンを持たない
- 余白は親が `gap` などで制御する

## 🔴 レイヤー依存関係 (CRITICAL)

```
App/ (最上位)
  ↓ 依存
Page/
  ↓ 依存
UI/ ← → Functional/ (独立)
```

- `UI/` と `Functional/` は相互に import 不可
- `Page/` は `UI/` と `Functional/` を import 可
- `App/` は全レイヤーを import 可

## 🟡 Props 設計 (IMPORTANT)

- props は明示的な型定義を行う
- 複雑な型のインライン定義を避ける

## 参照

- SSG 原則: [architecture.md](./architecture.md#server-first--ssg-critical)
