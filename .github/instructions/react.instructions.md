---
description: 'React/Next.js コンポーネント設計ガイドライン'
applyTo: '**/components/**/*.{ts,tsx}'
---

# React/Next.js コンポーネント設計

このファイルは、React/Next.jsコンポーネント編集時に自動的に適用される設計原則を定義します。

## レイヤー分離（厳格）

Biomeが`biome.json`で以下の依存関係を強制します：

### UI層（`src/components/UI/**`）

```typescript
// **ALLOWED**: 独立したUIコンポーネント
import { Heading } from '@/components/UI/Heading';
import { css } from '@/ui/styled';

// **FORBIDDEN**: 他の層への依存
import { PostHeader } from '@/components/Page/Post/Header'; // Biomeエラー
import { Layout } from '@/components/App/Layout'; // Biomeエラー
```

**ルール**: UI層は完全に独立。App、Page、Functional層に依存禁止。

### Page層（`src/components/Page/**`）

```typescript
// **ALLOWED**: UIとFunctional層への依存
import { Button } from '@/components/UI/Button';
import { Stack } from '@/components/UI/Layout';

// **FORBIDDEN**: App層への依存
import { Header } from '@/components/App/Header'; // Biomeエラー
```

**ルール**: Page層はUI/Functionalに依存可。Appには依存禁止。

### App層（`src/components/App/**`）

```typescript
// **ALLOWED**: 全ての下位層に依存可能
import { Button } from '@/components/UI/Button';
import { PostSection } from '@/components/Page/_shared/PostSection';
```

**ルール**: App層は全ての下位層に依存可能。

## ゼロマージン原則（UI層必須）

UIコンポーネントは外部マージンを持たない：

```tsx
// **CORRECT**: 内部パディングのみ
export const Card = ({ children }: Props) => (
  <div
    className={css`
      padding: var(--spacing-4);
      border-radius: var(--radii-8);
    `}
  >
    {children}
  </div>
);

// **FORBIDDEN**: 外部マージン
export const Card = ({ children }: Props) => (
  <div
    className={css`
      margin: 1rem; // **FORBIDDEN**
      margin: 0 auto; // **FORBIDDEN** センタリングも禁止
      padding: var(--spacing-4);
    `}
  >
    {children}
  </div>
);
```

**レイアウトは親が制御**:

```tsx
// 親（Page層やApp層）でレイアウト
<Stack space={4}>
  <Card>...</Card>
  <Card>...</Card>
</Stack>

// または
<div className={css`
  display: grid;
  gap: var(--spacing-4);
`}>
  <Card>...</Card>
  <Card>...</Card>
</div>
```

## Server Component優先

```tsx
// **DEFAULT**: Server Component
export function PostList({ posts }: { posts: Post[] }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug}>{post.title}</li>
      ))}
    </ul>
  );
}

// **ONLY WHEN NEEDED**: Client Component
('use client');
export function InteractiveButton() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
```

**Client Component が必要な場合**:

- `useState`, `useEffect`等のフックを使用
- イベントハンドラー（`onClick`, `onChange`等）
- ブラウザAPI使用（`window`, `document`）

## SSG最適化パターン

### ビルド時データ読み込み

```tsx
// **RECOMMENDED (SSG)**: ビルド時JSON
import posts from '@/posts.json';

export function RecentPosts() {
  const recent = posts.slice(0, 5);
  return <ul>{recent.map(...)}</ul>;
}

// **AVOID**: ランタイムfetch
'use client';
export function RecentPosts() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch('/api/posts').then(r => r.json()).then(setPosts);
  }, []);
  return <ul>{posts.map(...)}</ul>;
}
```

### 静的パラメータ生成

```tsx
// app/(PostPage)/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  return <PostDetail post={post} />;
}
```

## コンポーネント命名

```typescript
// **GOOD**: 明確な命名
export const PostDetail = () => { ... };
export const TagList = () => { ... };
export const SearchPanel = () => { ... };

// **BAD**: 曖昧な命名
export const Component = () => { ... };
export const Item = () => { ... };
export const Wrapper = () => { ... };
```

## Props設計

```tsx
// **RECOMMENDED**: 明示的な型定義
interface PostDetailProps {
  post: Post;
  showRelated?: boolean;
}

export const PostDetail = ({ post, showRelated = true }: PostDetailProps) => {
  // 実装
};

// **AVOID**: インライン型定義（複雑な場合）
export const PostDetail = ({ post, showRelated }: {
  post: { slug: string; title: string; content: string; ... };
  showRelated?: boolean;
}) => {
  // 実装
};
```

## アクセシビリティ

```tsx
// **CORRECT**: セマンティックHTML + ARIA
<button
  onClick={handleClick}
  aria-label="記事を共有"
  type="button"
>
  <ShareIcon />
</button>

// **CORRECT**: リスト構造
<nav aria-label="メインナビゲーション">
  <ul>
    <li><a href="/">ホーム</a></li>
    <li><a href="/archive">アーカイブ</a></li>
  </ul>
</nav>

// **INCORRECT**: 非セマンティック
<div onClick={handleClick}>  // **INCORRECT** buttonを使用すべき
  <ShareIcon />
</div>
```
