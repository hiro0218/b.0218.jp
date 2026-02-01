---
paths:
  - 'next.config.mjs'
  - 'src/**/*.{ts,tsx}'
---

# パフォーマンス最適化規則

## Priority Markers

> 優先度の定義については [CLAUDE.md](../../CLAUDE.md#priority-markers) を参照。

## 🔴 重要ルール (CRITICAL)

- 最適化提案前に必ず `next.config.mjs` の `reactCompiler` を確認

## React Compiler の範囲（要点）

- **コンポーネントのレンダリング内**は自動最適化される
- **custom hook 内**のインスタンス生成・関数定義は対象外

## 禁止/推奨

- ✅ custom hook 内の `useMemo` / `useCallback` は削除しない
- ❌ コンポーネント内の単純な `useMemo` / `useCallback` を追加しない（React Compiler が処理）
