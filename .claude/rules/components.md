---
description: 'コンポーネントアーキテクチャ、レイヤー依存関係、Zero Margin Principle'
applyTo: '**/components/**/*.{ts,tsx}'
paths:
  - '**/components/**/*.{ts,tsx}'
---

# コンポーネントアーキテクチャ規則

このファイルは、React/Next.js コンポーネントを編集する際に自動的に適用される設計原則を定義する。

## Priority Markers

> See [CLAUDE.md - Priority Levels](../CLAUDE.md#priority-levels) for marker definitions.

> **📌 このファイルについて**: これは CLAUDE.md の詳細ガイドです。優先順位と概要については、[CLAUDE.md - Critical Rules](../CLAUDE.md#critical-rules-must-follow) を参照してください。

## コンポーネント原則

### 🔴 Zero Margin Principle (CRITICAL)

UI コンポーネントは、自身の外部マージン（`margin`、`margin-top` など）を設定してはならない。親コンポーネントが間隔を制御する。

**正しい例**:

```tsx
// Component (no margin)
export const Card = ({ children }: CardProps) => (
  <div
    className={css`
      padding: var(--spacing-4);
    `}
  >
    {children}
  </div>
);

// Parent controls spacing
<div
  className={css`
    display: flex;
    gap: var(--spacing-4);
  `}
>
  <Card />
  <Card />
</div>;
```

**誤った例**:

```tsx
// ❌ コンポーネントが自身のマージンを設定
export const Card = ({ children }: CardProps) => (
  <div
    className={css`
      padding: var(--spacing-4);
      margin-bottom: var(--spacing-4); /* ❌ Zero Margin Principle 違反 */
    `}
  >
    {children}
  </div>
);
```

**レイアウトは親が制御**:

```tsx
// Parent (Page/App layer) controls layout
<Stack space={4}>
  <Card>...</Card>
  <Card>...</Card>
</Stack>

// Or
<div className={css`
  display: grid;
  gap: var(--spacing-4);
`}>
  <Card>...</Card>
  <Card>...</Card>
</div>
```

### 🔴 レイヤー依存関係 (CRITICAL)

> **WHY**: レイヤー化された依存関係により、テスト容易性が向上し、変更の影響範囲が明確になる。Biome の自動チェックがアーキテクチャ違反を防止する。

レイヤー依存関係は **Biome によって強制** される（`~/biome.json`）:

```
App/ (最上位)
  ↓ 依存
Page/
  ↓ 依存
UI/ ← → Functional/ (独立)
```

**ルール**:

- `UI/` と `Functional/` は **独立** レイヤー（相互にインポート不可）
- `Page/` は `UI/` と `Functional/` からインポート可能
- `App/` はすべての下位レイヤーからインポート可能
- **下位レイヤーは上位レイヤーからインポート不可**

**例**:

#### UI Layer (`src/components/UI/**`)

```tsx
// ✅ Allowed: Independent UI components
import { Heading } from '@/components/UI/Heading';
import { css } from '@/ui/styled';

// ❌ Forbidden: Dependencies on other layers
import { PostHeader } from '@/components/Page/Post/Header'; // Biome error
import { Layout } from '@/components/App/Layout'; // Biome error
```

**ルール**: UI レイヤーは完全に独立。App、Page、Functional レイヤーに依存できません。

#### Page レイヤー (`src/components/Page/**`)

```tsx
// ✅ 許可: UI と Functional への依存
import { Button } from '@/components/UI/Button';
import { Stack } from '@/components/UI/Layout';

// ❌ 禁止: App レイヤーへの依存
import { Header } from '@/components/App/Header'; // Biome エラー
```

**ルール**: Page レイヤーは UI/Functional に依存可能。App には依存不可。

#### App レイヤー (`src/components/App/**`)

```tsx
// ✅ 許可: すべての下位レイヤーへの依存
import { Button } from '@/components/UI/Button';
import { PostSection } from '@/components/Page/_shared/PostSection';
```

**ルール**: App レイヤーはすべての下位レイヤーに依存可能。

**検証**:

```bash
# Biome がレイヤー違反を検出
npm run lint
```

### 🟡 Server First Principle (IMPORTANT)

デフォルトで Server Components を使用する。`'use client'` は **必要な場合のみ** 追加:

**デフォルト: Server Component**

```tsx
export function PostList({ posts }: { posts: Post[] }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug}>{post.title}</li>
      ))}
    </ul>
  );
}
```

**必要な場合のみ: Client Component**

```tsx
'use client';

export function InteractiveButton() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
```

**Client Component が必要な場合**:

- React hooks の使用 (`useState`, `useEffect` など)
- イベントハンドラー (`onClick`, `onChange` など)
- ブラウザ API (`window`, `document`)

## レイヤーの責務

### App/ (アプリケーションシェル)

**目的**: アプリケーション全体のレイアウト、ナビゲーション、シングルトン的なコンポーネント

**例**:

- `Header.tsx` - サイト全体のヘッダー
- `Footer.tsx` - サイト全体のフッター
- `Layout.tsx` - ルートレイアウトラッパー
- `GlobalSearch.tsx` - グローバル検索バー

**特性**:

- シングルトンパターンが許容される
- すべての下位レイヤーに依存可能
- 安定している必要がある（変更頻度が低い）

### Page/ (ページ固有)

**目的**: ページ固有のロジックとコンポーネント

**例**:

- `PostDetail.tsx` - 記事ページの詳細ビュー
- `ArchiveList.tsx` - アーカイブページのリスト
- `PostHeader.tsx` - 記事固有のヘッダー

**特性**:

- `UI/` と `Functional/` に依存可能
- `App/` には依存不可
- ページ固有のロジックと構成

**共有セクション**: 複数のページタイプで使用されるコンポーネントは `Page/_shared/` に配置

### UI/ (ビジュアルコンポーネント)

**目的**: 外部依存ゼロの再利用可能なビジュアルコンポーネント

**例**:

- `Button.tsx` - ボタンコンポーネント
- `Card.tsx` - カードコンポーネント
- `Modal.tsx` - モーダルダイアログ
- `Icon.tsx` - アイコンラッパー

**特性**:

- Zero Margin Principle が強制される
- 独立レイヤー（`Page/`、`App/`、`Functional/` からインポート不可）
- 純粋にビジュアル、ビジネスロジックなし
- 高い再利用性が求められる

### Functional/ (非ビジュアルユーティリティ)

**目的**: 非ビジュアルなユーティリティコンポーネント

**例**:

- `PreconnectLinks.tsx` - DNS プリフェッチリンク
- `GoogleAnalytics.tsx` - Analytics 統合
- `StructuredData.tsx` - JSON-LD スキーマ
- `ErrorBoundary.tsx` - エラーハンドリング

**特性**:

- 独立レイヤー（`Page/`、`App/`、`UI/` からインポート不可）
- ビジュアル出力なし（または最小限）
- 副作用またはメタデータに焦点

## SSG 最適化

このプロジェクトは SSG (Static Site Generation) を使用しています。SSG の原則とビルド時のデータ読み込みパターンについては、[architecture.md - SSG](./architecture.md#-ssg-ビルド時データロード優先-critical) を参照してください。

### コンポーネント固有のパターン

```tsx
// ✅ コンポーネント内でビルド時データを使用
import posts from '~/dist/posts.json';

export function RecentPosts() {
  const recent = posts.slice(0, 5);
  return <ul>{recent.map(...)}</ul>;
}
```

**詳細**: [architecture.md - SSG 最適化](./architecture.md#-ssg-ビルド時データロード優先-critical)

## ⚪ コンポーネント命名 (RECOMMENDED)

```tsx
// ✅ 良い例: 明確な命名
export const PostDetail = () => { ... };
export const TagList = () => { ... };
export const SearchPanel = () => { ... };

// ❌ 悪い例: 曖昧な命名
export const Component = () => { ... };
export const Item = () => { ... };
export const Wrapper = () => { ... };
```

## 🟡 Props 設計 (IMPORTANT)

```tsx
// ✅ 推奨: 明示的な型定義
interface PostDetailProps {
  post: Post;
  showRelated?: boolean;
}

export const PostDetail = ({ post, showRelated = true }: PostDetailProps) => {
  // 実装
};

// ❌ 避ける: インライン型定義（複雑な場合）
export const PostDetail = ({ post, showRelated }: {
  post: { slug: string; title: string; content: string; ... };
  showRelated?: boolean;
}) => {
  // 実装
};
```

## 🟡 アクセシビリティ (IMPORTANT)

```tsx
// ✅ 正しい: セマンティックHTML + ARIA
<button
  onClick={handleClick}
  aria-label="記事を共有"
  type="button"
>
  <ShareIcon />
</button>

// ✅ 正しい: リスト構造
<nav aria-label="メインナビゲーション">
  <ul>
    <li><a href="/">ホーム</a></li>
    <li><a href="/archive">アーカイブ</a></li>
  </ul>
</nav>

// ❌ 誤り: 非セマンティック
<div onClick={handleClick}>  // ❌ button を使用すべき
  <ShareIcon />
</div>
```

## レイヤー違反の例

**❌ UI が Page からインポート**:

```tsx
// src/components/UI/Button.tsx
import { PostHeader } from '@/components/Page/PostHeader'; // ❌ 違反
```

**❌ Page が App からインポート**:

```tsx
// src/components/Page/PostDetail.tsx
import { Header } from '@/components/App/Header'; // ❌ 違反
```

**❌ Functional が UI からインポート**:

```tsx
// src/components/Functional/GoogleAnalytics.tsx
import { Button } from '@/components/UI/Button'; // ❌ 違反
```

**✅ 正しい依存関係**:

```tsx
// src/components/Page/PostDetail.tsx
import { Button } from '@/components/UI/Button'; // ✅ OK
import { StructuredData } from '@/components/Functional/StructuredData'; // ✅ OK

// src/components/App/Header.tsx
import { SearchInput } from '@/components/Page/SearchInput'; // ✅ OK
import { Button } from '@/components/UI/Button'; // ✅ OK
```

## 避けるべきアンチパターン

### 不要な Client Component

Client Components はインタラクティブな機能が必要な場合のみ使用します。Server Components を不必要に Client Components に変換しないでください。

**❌ 誤り: 不要な Client Component**

```tsx
'use client';

export function StaticText({ text }: { text: string }) {
  return <p>{text}</p>;
}
```

**✅ 正しい: Server Component のまま**

```tsx
export function StaticText({ text }: { text: string }) {
  return <p>{text}</p>;
}
```

### SSG における不要な useEffect

このプロジェクトは SSG (Static Site Generation) を使用しているため、ランタイムでのデータ取得は一般的に不要です。代わりにビルド時にデータを読み込みます。

**❌ 誤り: useEffect でランタイムデータ取得**

```tsx
'use client';

export function PostCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch('/api/posts/count')
      .then((r) => r.json())
      .then(setCount);
  }, []);

  return <span>{count}</span>;
}
```

**✅ 正しい: ビルド時データ読み込み**

```tsx
import posts from '~/dist/posts.json';

export function PostCount() {
  return <span>{posts.length}</span>;
}
```

**重要な理由**:

- SSG はビルド時にページを事前レンダリング
- ランタイムデータ取得は不要な Client Component オーバーヘッドを追加
- ビルド時データの方が高速で信頼性が高い

## 検証チェックリスト

コンポーネント変更をコミットする前に:

- [ ] コンポーネントが自身のマージンを設定していないこと
- [ ] レイヤー依存関係が正しいこと（`npm run lint` で検証）
- [ ] `'use client'` が必要な場合のみ使用されていること
- [ ] コンポーネントが正しいディレクトリに配置されていること
- [ ] インポートが依存関係ルールに従っていること
- [ ] Props に明示的な型定義があること
- [ ] アクセシビリティのためにセマンティック HTML が使用されていること
- [ ] 不要な Client Components や useEffect フックがないこと
