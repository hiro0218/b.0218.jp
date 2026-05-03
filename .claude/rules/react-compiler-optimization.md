---
paths:
  - 'next.config.mjs'
  - 'src/**/*.{ts,tsx}'
---

# パフォーマンス最適化規則

## 🔴 重要ルール (CRITICAL)

- 最適化提案前に必ず `next.config.mjs` の `reactCompiler` を確認

`reactCompiler` の有効状態は memoization 方針の前提である。コンポーネント render の単純な安定化は compiler に任せ、対象外の境界だけ手動最適化を検討する。

## React Compiler の範囲（要点）

- **コンポーネントのレンダリング内**は自動最適化される
- **custom hook 内**のインスタンス生成・関数定義は対象外

## 禁止/推奨

- ✅ custom hook 内の `useMemo` / `useCallback` は削除しない
- ❌ コンポーネント内の単純な `useMemo` / `useCallback` を追加しない（React Compiler が処理）

「単純」とは、props / state から派生値を作るだけ、または JSX に渡す callback を安定化するだけのケースを指す。React Compiler の対象外である module scope、server-only data function、`React.cache` / `cache()`、custom hook 内部の memoization はこの禁止に含めない。
