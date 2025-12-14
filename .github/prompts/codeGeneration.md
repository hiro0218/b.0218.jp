# コード生成の指示

コードを生成する際、以下の規則と技術スタックに従って実装してください。このプロジェクト固有の解決方法に基づいた高品質なコードを生成するためのガイドラインです。

## 技術スタック準拠

### Next.js 16.x App Router

- **ページコンポーネント**: `export default function PageName() {}`
- **レイアウト**: `layout.tsx` でルートグループ固有の設定
- **メタデータ**: `generateMetadata` 関数または `export const metadata` を使用
- **静的生成**: `generateStaticParams` で動的ルートの静的化
- **ルートグループ**: `(ArchivePage)`, `(PostPage)`, `(SinglePage)` 構造

### TypeScript

- **厳格な型定義**: `any` を避け、適切な型を明示
- **Result型**: エラーハンドリングに関数型アプローチを使用
- **パスマッピング**: `@/*` (src配下), `~/*` (ルート) を使用

### PandaCSS

- **プロジェクト統一import**: `import { css, styled } from '@/ui/styled'`
- **テンプレートリテラル**: `css\`...\`` 構文を使用（推奨）
- **ゼロマージン**: コンポーネントは外部スペーシングを設定しない
- **レスポンシブ**: `{ base: 'value', md: 'value' }` 形式
- **トークン使用**: `token(colors.blue.500)` のようにデザイントークンを参照

## コンポーネント分類ルール

### 配置先の判断

```typescript
// Page固有のコンポーネント → src/components/Page/
export const PostDetail = () => {
  /* 記事詳細表示 */
};

// 再利用可能なUIコンポーネント → src/components/UI/
export const Button = ({ children, onClick }: ButtonProps) => {
  /* ボタン */
};

// ロジックのみのコンポーネント → src/components/Functional/
export const GoogleAnalytics = () => {
  /* GA設定 */
};

// アプリケーションシェル → src/components/App/
export const Header = () => {
  /* ヘッダー */
};
```

## 命名規則

### 必須パターン

- **コンポーネント/型**: `PascalCase` (例: `PostDetail`, `ButtonProps`)
- **関数/変数**: `camelCase` (例: `calculateSimilarity`, `postData`)
- **定数**: `SCREAMING_SNAKE_CASE` (例: `MAX_POSTS_PER_PAGE`)
- **ファイル名**: `camelCase.tsx` または `kebab-case.tsx`
- **テストファイル**: `元ファイル名.test.ts(x)`

### プロジェクト固有

- **ページコンポーネント**: `PageName` (例: `PostPage`, `ArchivePage`)
- **型定義**: `Props` サフィックス (例: `PostProps`, `PageProps`)
- **ユーティリティ関数**: 動詞で開始 (例: `formatDate`, `parseMarkdown`)

## コード構造テンプレート

### Server Component（デフォルト）

```typescript
// 原則としてServer Componentがデフォルト（'use client'指定なし）
import type { PostProps } from '@/types/source';
import { css } from '@/ui/styled';

interface PostDetailProps {
  post: PostProps;
}

export const PostDetail = ({ post }: PostDetailProps) => {
  return (
    <article
      className={css`
        max-width: 42rem;
        margin: 0 auto;
        padding: 1rem;

        @media (min-width: 768px) {
          padding: 2rem;
        }
      `}
    >
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
};
```

### Client Component（インタラクション有り）

```typescript
'use client';

import { useState } from 'react';
import { css } from '@/ui/styled';

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
}

export const Button = ({ children, onClick }: ButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    await onClick();
    setIsLoading(false);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className={css`
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        background-color: token(colors.blue.500);
        color: white;

        &:hover {
          background-color: token(colors.blue.600);
        }

        &:disabled {
          opacity: 0.5;
        }
      `}
    >
      {isLoading ? '処理中...' : children}
    </button>
  );
};
```

### App Routerページコンポーネント

```typescript
import type { Metadata } from 'next';
import type { PostProps } from '@/types/source';
import { PostDetail } from '@/components/Page/PostDetail';
import { getPost, getAllPosts } from '@/lib/posts';

interface PageProps {
  params: { slug: string };
}

export default function PostPage({ params }: PageProps) {
  // 静的データの取得（ビルド時に生成されたJSONから）
  const post = getPost(params.slug);

  return <PostDetail post={post} />;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = getPost(params.slug);

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [`/ogp/${post.slug}.png`],
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
```

### ユーティリティ関数

```typescript
import type { Result } from '@/types/result';

/**
 * 記事の類似度を計算する
 * 
 * @param text1 - 比較対象のテキスト1
 * @param text2 - 比較対象のテキスト2
 * @returns 類似度を表す数値（0-1）またはエラー
 */
export const calculateSimilarity = (text1: string, text2: string): Result<number, Error> => {
  try {
    // 入力検証
    if (!text1 || !text2) {
      return { success: false, error: new Error('Invalid input') };
    }

    // 計算処理
    const similarity = performCalculation(text1, text2);

    return { success: true, data: similarity };
  } catch (error) {
    return { success: false, error: error as Error };
  }
};
```

## 必須実装パターン

### 1. エラーハンドリング

```typescript
// 良い例: Result型を使った関数型アプローチ
import type { Result } from '@/types/result';

export const fetchUserData = async (userId: string): Promise<Result<User, Error>> => {
  try {
    if (!userId) return { success: false, error: new Error('UserId is required') };
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) return { success: false, error: new Error(`API error: ${response.status}`) };
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error : new Error(String(error)) };
  }
};
```

### 2. パフォーマンス最適化

```typescript
// 良い例: コード分割とメモ化
import { lazy, Suspense, memo, useMemo } from 'react';

// 動的インポートによるコード分割
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// 不要な再レンダリング防止
const MemoizedComponent = memo(function OptimizedComponent({ data }: Props) {
  // 重い計算のメモ化
  const processedData = useMemo(() => {
    return expensiveCalculation(data);
  }, [data]);

  return <div>{processedData}</div>;
});
```

### 3. アクセシビリティ

```tsx
// 良い例: アクセシブルなコンポーネント
export const AccessibleButton = ({ onClick, children }: ButtonProps) => (
  <button
    onClick={onClick}
    aria-label="ボタンの説明"
    tabIndex={0}
    role="button"
  >
    {children}
  </button>
);
```

### 4. SEO対応

```tsx
// 良い例: メタデータと構造化データ
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPost(params.slug);
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [`/ogp/${post.slug}.png`],
      type: 'article',
      publishedTime: post.publishedAt,
    },
  };
}
```

## 品質基準

### 必須チェック項目

```bash
# チェックリスト
☐ TypeScriptコンパイルエラーがない
☐ Biome (Linter/Formatter) の警告がない
☐ 未使用のインポート/変数がない
☐ 適切な型注釈とJSDocが付けられている
☐ テスタブルな構造になっている
☐ コンポーネントのレスポンシブ対応がされている
☐ アクセシビリティが考慮されている
```

### 自動チェックコマンド

```bash
# 型チェック
$ npm run typecheck

# コードスタイルチェック
$ npm run lint

# テスト実行
$ npm test
```
