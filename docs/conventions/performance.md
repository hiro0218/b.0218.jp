# パフォーマンス規則

React Compiler を前提にした最適化の規則と、Web パフォーマンスの目標値・実装規則を定める。

## 🔴 重要ルール (CRITICAL)

- 最適化提案前に必ず `next.config.mjs` の `reactCompiler` を確認

`reactCompiler` の有効状態は memoization 方針の前提である。コンポーネント render の単純な安定化は compiler に任せ、対象外の境界だけ手動最適化を検討する。

## React Compiler の範囲（要点）

- **コンポーネントのレンダリング内**と **custom hook（名前が `use` で始まる関数）の中**は自動最適化される（`reactCompiler: true` の既定の `compilationMode: 'infer'` が両方を対象にする）
- コンパイラの検証に通らない関数（render 中に `ref.current` を読み書きするなど）は、最適化されずにそのまま出力される（既定の `panicThreshold: 'none'`）。その関数の中の手動の memoization は効いている
- 自動最適化は**コンポーネントインスタンス内の再レンダー**に対するもの。SSG のページ生成は毎回新規レンダーのため、render 内の定数生成コスト（`` css`...` `` のテンプレートパース等）は消えない。モジュールスコープへの hoist 規則は [styling.md](./styling.md#-css-テンプレートの呼び出し位置-important) を参照

## 禁止/推奨

- ✅ 最適化されない関数（上記）の中の `useMemo` / `useCallback` は、原因を取り除くまで削除しない
- ❌ コンポーネント内・custom hook 内に単純な `useMemo` / `useCallback` を追加しない（React Compiler が処理）

「単純」とは、props / state から派生値を作るだけ、または JSX に渡す callback を安定化するだけのケースを指す。React Compiler の対象外である module scope、server-only data function、`React.cache` / `cache()` の memoization と、上記の最適化されない関数の中の memoization は、この禁止に含めない。

## Web パフォーマンス

| メトリクス | 目標    |
| ---------- | ------- |
| LCP        | < 2.5s  |
| INP        | < 200ms |
| CLS        | < 0.1   |
| FCP        | < 1.5s  |
| TBT        | < 200ms |

- 画像には `width` と `height` を明示する。
- ヒーロー画像のみ `loading="eager"` + `fetchpriority="high"` を使う。例外は、先読みで閉じたまま描画する dialog の画像（`UI/ZoomImage/Dialog.tsx`）で、`loading="eager"` だけを使う。
- Below-the-fold は `loading="lazy"` を使う。
- AVIF / WebP を優先する。
- フォントは `font-display: swap`、プリロードは最も使用頻度の高いウェイトのみにする。
- 動的コンテンツによるレイアウトシフトを避ける。
- サードパーティスクリプトは async/defer を使う。
