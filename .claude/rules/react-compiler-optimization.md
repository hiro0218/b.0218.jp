---
description: 'React Compiler 最適化規則とパフォーマンスガイドライン'
applyTo: '{next.config.mjs,src/**/*.{ts,tsx}}'
paths:
  - 'next.config.mjs'
  - 'src/**/*.{ts,tsx}'
---

# パフォーマンス最適化規則

**適用対象**: `~/next.config.mjs`, custom hooks (`use*.ts{,x}`), 最適化の提案

**目的**: 誤った最適化提案を防止し、React Compiler の適切な使用を徹底する。

## Priority Markers

> See [CLAUDE.md - Priority Levels](../CLAUDE.md#priority-levels) for marker definitions.

> **📌 このファイルについて**: これは CLAUDE.md の詳細ガイドです。優先順位と概要については、[CLAUDE.md - Critical Rules](../CLAUDE.md#critical-rules-must-follow) を参照してください。

## 🔴 重要ルール (CRITICAL)

> **WHY**: React Compiler のスコープを誤解すると、必要な最適化を削除してパフォーマンスが低下する可能性がある。本番環境で、custom hook から `useMemo` を削除したことでキャッシュが無効化された事例がある（[Pitfall 1](#pitfall-1-custom-hookからusememoを削除) を参照）。

⚠️ **最適化を提案する前に必ず `~/next.config.mjs` を確認すること**

以下を確認:

```js
reactCompiler: true;
```

有効化されている場合は、以下の React Compiler 規則に従うこと。

## 🔴 React Compiler (React 19)

### 概要

React Compiler (`reactCompiler: true`) は、**コンポーネントのレンダリング内**でのメモ化と再レンダリング最適化を自動的に処理する。

### 自動的に最適化されるもの

✅ **React Compiler が処理**:

- コンポーネントのレンダリング結果
- JSX 要素の生成
- コンポーネント内でのインライン計算
- props と state の比較

**例** (手動のメモ化は不要):

```tsx
// ✅ React Compiler が自動的に最適化
export const PostList = ({ posts }: Props) => {
  // この計算は自動的にメモ化される
  const sortedPosts = [...posts].sort((a, b) => b.date - a.date);

  return (
    <ul>
      {sortedPosts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
};
```

### 自動的に最適化されないもの

❌ **手動のメモ化が必要**:

1. **Custom hooks 内でのクラスインスタンス生成**
2. **Custom hooks 内での関数定義**
3. **外部ライブラリの初期化**
4. **副作用が大きい操作**

### Custom Hooks: useMemo/useCallback を使用すべき場合

#### ❌ useMemo なし (レンダリング毎にキャッシュが再生成される)

```tsx
export const useSearchWithCache = () => {
  // ❌ レンダリング毎に新しいキャッシュインスタンスが作成される
  const cache = new SearchCache();

  return (data: Data[], query: string) => {
    // キャッシュが無意味 - 毎回再作成される
    return cache.search(data, query);
  };
};
```

**問題**: `SearchCache` インスタンスがコンポーネントの再レンダリング毎に再作成され、キャッシュが機能しない。

#### ✅ useMemo あり (レンダリング間でキャッシュが永続化)

```tsx
import { useMemo } from 'react';

export const useSearchWithCache = () => {
  // ✅ キャッシュが再レンダリング間で永続化
  const cache = useMemo(() => new SearchCache(), []);

  // ✅ 検索関数が永続化され、同じキャッシュを使用
  return useMemo(
    () => (data: Data[], query: string) => {
      return cache.search(data, query);
    },
    [cache],
  );
};
```

**解決策**: `useMemo` により、キャッシュインスタンスが再レンダリング間で永続化されます。

### 追加の例

#### Hooks 内での関数定義

```tsx
// ❌ useCallback なし - レンダリング毎に新しい関数
export const useEventHandler = (callback: () => void) => {
  const handler = () => {
    // 何らかのロジック
    callback();
  };

  return handler;
};

// ✅ useCallback あり - 安定した関数参照
export const useEventHandler = (callback: () => void) => {
  const handler = useCallback(() => {
    // 何らかのロジック
    callback();
  }, [callback]);

  return handler;
};
```

#### 外部ライブラリの初期化

```tsx
// ❌ レンダリング毎にライブラリが再初期化される
export const useMarkdownParser = () => {
  const parser = new MarkdownParser({
    /* 重い設定 */
  });
  return parser;
};

// ✅ ライブラリが一度だけ初期化される
export const useMarkdownParser = () => {
  const parser = useMemo(
    () =>
      new MarkdownParser({
        /* 重い設定 */
      }),
    [],
  );
  return parser;
};
```

## 判断マトリクス

| コード配置                        | 最適化タイプ      | React Compiler が処理? | 手動メモ化?             |
| --------------------------------- | ----------------- | ---------------------- | ----------------------- |
| コンポーネント本体 (レンダリング) | JSX、計算         | ✅ はい                | ❌ 不要                 |
| Custom hook (クラスインスタンス)  | `new ClassName()` | ❌ いいえ              | ✅ `useMemo` を使用     |
| Custom hook (関数)                | 関数定義          | ❌ いいえ              | ✅ `useCallback` を使用 |
| コンポーネントの props            | コールバック渡し  | ✅ はい                | ❌ 不要                 |
| コンポーネントの state            | state 更新        | ✅ はい                | ❌ 不要                 |

## 🔴 提案してはいけないこと

❌ **React Compiler では不要**:

```tsx
// ❌ 不要 - React Compiler が処理する
const MemoizedComponent = memo(function Component() {
  return <div>Content</div>;
});

// ❌ 不要 - React Compiler が処理する
const MemoizedValue = useMemo(() => {
  return props.items.length;
}, [props.items]);

// ❌ 不要 - React Compiler が処理する
const MemoizedCallback = useCallback(() => {
  console.log('clicked');
}, []);
```

## 🟡 提案すべきこと (適切な場合)

✅ **有効な最適化**:

1. **アルゴリズムの改善**:
   - O(n²) → O(n)
   - 不要なループ
   - 非効率なデータ構造

2. **データ構造の最適化**:
   - 検索には配列の代わりに Map
   - 重複除去には Set
   - 適切なインデックス

3. **ビルド時の最適化**:
   - コード分割
   - 画像最適化
   - バンドル分析

4. **Custom hook 内部** (上記の例を参照)

## 検証プロセス

最適化を提案または削除する前に:

1. **`~/next.config.mjs` を読む** - `reactCompiler` 設定を確認

2. **最適化対象を特定**:
   - コンポーネントのレンダリング? → React Compiler が処理
   - Custom hook 内部? → 手動メモ化が必要な場合あり

3. **状態を持つインスタンスまたは関数がある Custom hooks の場合**:
   - 値が再レンダリング間で永続化される必要があるか?
   - クラスインスタンス、関数、または高コストなオブジェクトか?

- `useMemo`/`useCallback` の依存配列が正しくリストされているか (受け取る props/関数も含む)?
- はいの場合 → `useMemo` または `useCallback` を使用

4. **最適化をテスト**:
   - キャッシュが実際に機能しているか?
   - 関数参照が安定しているか?
   - 測定可能なパフォーマンス改善があるか?

## よくある落とし穴

### Pitfall 1: Custom HookからuseMemoを削除

```tsx
// ❌ 危険なリファクタリング
// 変更前 (動作する):
const cache = useMemo(() => new SearchCache(), []);

// 変更後 (壊れる):
const cache = new SearchCache(); // レンダリング毎にキャッシュが再生成される
```

**教訓**: `useMemo` を削除する前に、値が永続化される必要があるか必ず確認してください。

### Pitfall 2: React Compiler がすべてを最適化すると仮定

```tsx
// ❌ 誤った仮定
export const useHeavyComputation = () => {
  // "React Compiler がこれを最適化する"
  const result = new ExpensiveClass(); // ❌ 誤り - レンダリング毎に再作成される
  return result;
};
```

**教訓**: React Compiler は**コンポーネントのレンダリング**を最適化しますが、custom hook 内部は最適化しません。

### Pitfall 3: 過度な最適化

```tsx
// ❌ React Compiler では不要
const Component = memo(() => {
  const value = useMemo(() => props.count * 2, [props.count]);
  const handler = useCallback(() => console.log(value), [value]);

  return <button onClick={handler}>{value}</button>;
});
```

**教訓**: React Compiler により、ほとんどの手動メモ化は不要になります。

## 関連ガイドライン

以下も参照: **Technology Adoption Guidelines** (メインの CLAUDE.md 内)

- 仮定する前にスコープを確認
- 動作の変更をテスト
- 一般化に疑問を持つ
- アンチパターンを避ける

## クイックリファレンス

**最適化を提案する前に**:

1. `~/next.config.mjs` を読む
2. React Compiler が有効か確認
3. コンポーネントのレンダリングか custom hook 内部かを特定
4. 適切な最適化戦略を適用
5. 最適化が実際に機能することをテスト
