---
description: 'コード生成時の技術スタック準拠とコンポーネント分類ルール'
agent: 'agent'
---

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
- **CSS変数使用（必須）**: `var(--colors-blue-500)` のようにCSS変数を使用

## コンポーネント分類ルール

### 配置先の判断

```tsx
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
- **ファイル名（コンポーネント）**: `PascalCase.tsx` (例: `Button.tsx`, `PostDetail.tsx`)
- **ファイル名（ユーティリティ）**: `camelCase.ts` (例: `formatDate.ts`, `parseMarkdown.ts`)
- **テストファイル**: `元ファイル名.test.ts(x)`

### プロジェクト固有

- **ページコンポーネント**: `PageName` (例: `PostPage`, `ArchivePage`)
- **型定義**: `Props` サフィックス (例: `PostProps`, `PageProps`)
- **ユーティリティ関数**: 動詞で開始 (例: `formatDate`, `parseMarkdown`)

## コード構造テンプレート

### Server Component（デフォルト）

```tsx
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
        padding: var(--spacing-4);

        @media (min-width: 768px) {
          padding: var(--spacing-8);
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

```tsx
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
        padding: var(--spacing-2) var(--spacing-4);
        border-radius: var(--radii-2);
        background-color: var(--colors-blue-500);
        color: white;

        &:hover {
          background-color: var(--colors-blue-600);
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

```tsx
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

## コード記述順序

このセクションでは、TSXファイル内の推奨記述順序を定義します。これらは強制ではなく指針ですが、一貫性を保つために新規コード作成時に従うことを推奨します。

### ファイル全体の構造

1. **'use client' ディレクティブ**（Client Componentの場合のみ）
2. **Import文**（`typescript.instructions.md`の順序に従う）
   - 外部ライブラリ
   - 内部ユーティリティ
   - コンポーネント
   - 型定義
   - スタイル/定数（`css`, `styled` はここ）
3. **型定義・インターフェース**（コンポーネント外部）
4. **定数**（コンポーネント外部、SCREAMING_SNAKE_CASE）
5. **メインコンポーネント**
6. **サブコンポーネント**（必要な場合）
7. **styled component**（Panda CSSのstyled関数）
8. **ヘルパー関数**（コンポーネント外部）

### コンポーネント内部の順序

1. **Hooks**
   - useState
   - useRef
   - useContext
   - カスタムhooks（useIsClient, useId, useSearchなど）
2. **計算された値**
   - useMemo
   - useCallback
   - 単純な計算（useIdの結果など）
3. **Effect hooks**
   - useEffect
   - useLayoutEffect
4. **イベントハンドラー関数**
   - handleClick, handleSubmitなど
5. **ヘルパー関数**（コンポーネント内部）
   - formatValue, validateInputなど
6. **Early return**（条件付きレンダリング）
   - if (!data) return null;
7. **メインrender**
   - return文

### スタイリング（css/styled）の配置ルール

#### Import位置

```tsx
// Import文の5番目（スタイル/定数）
import { css, styled, cx } from '@/ui/styled';
import { SITE_NAME } from '@/constants';
```

#### styled componentの配置

ファイル構造の **7番目**（メインコンポーネントの後、ヘルパー関数の前）に配置：

```tsx
// 5. メインコンポーネント
export const SearchDialog = ({ onClose }: DialogProps) => {
  return <Dialog>...</Dialog>;
};

// 6. サブコンポーネント（必要な場合）
const DialogContent = () => <div>...</div>;

// 7. styled component（ここに配置）
const Dialog = styled.dialog`
  position: fixed;
  border-radius: var(--radii-4);
`;

// 8. ヘルパー関数
```

#### inline cssの使用

`css` テンプレートリテラルはコンポーネント内の `className` で直接使用：

```tsx
export const Logo = () => {
  return (
    <Anchor
      className={css`
        padding: var(--spacing-1);
        pointer-events: auto;
      `}
      href="/"
    >
      <img alt={SITE_NAME} />
    </Anchor>
  );
};
```

#### 使い分けガイドライン

**`styled` を使うケース**:

- 再利用可能なスタイルコンポーネント
- 複雑なスタイル定義（疑似要素、メディアクエリ、ネストが多い）
- コンポーネントとして命名したい場合

**`css` を使うケース**:

- 一時的・局所的なスタイル
- シンプルなスタイル調整
- 既存コンポーネントへのスタイル追加

**`cx` の使用**:

- 複数のクラス名を結合する場合
- 条件付きスタイルの適用

### 例外と柔軟性

以下の場合は順序を調整可能：

- **パフォーマンス最適化**が必要な場合
- **特定のライブラリの要求**がある場合
- **可読性が明らかに向上**する場合
- **Reactのルール**（hooksは条件分岐の前に全て呼び出す）を優先

### 記述順序の例

#### Server Component（シンプル）

```tsx
import { Anchor } from '@/components/UI/Anchor';
import { SITE_NAME } from '@/constants';
import { css, cx } from '@/ui/styled';

// 型定義（propsがある場合）
type LogoProps = {
  size?: 'small' | 'large';
};

// メインコンポーネント
export const Logo = ({ size = 'small' }: LogoProps) => {
  return (
    <Anchor
      className={cx(
        'link-style',
        css`
          padding: var(--spacing-1);
        `,
      )}
      href="/"
    >
      <img alt={SITE_NAME} height="25" src="/logo.svg" width="80" />
    </Anchor>
  );
};
```

#### Client Component（複雑）

```tsx
'use client';

import { useDialog } from '@react-aria/dialog';
import { type RefObject, useId, useState } from 'react';

import useIsClient from '@/hooks/useIsClient';
import { styled } from '@/ui/styled';
import { SearchHeader } from './SearchHeader';

// 型定義
type DialogProps = {
  onClose: () => void;
  dialogRef: RefObject<HTMLDialogElement>;
};

// メインコンポーネント
export const SearchDialog = ({ onClose, dialogRef }: DialogProps) => {
  // 1. State hooks
  const [isClosing, setIsClosing] = useState(false);

  // 2. その他のhooks
  const isClient = useIsClient();
  const id = useId();

  // 3. カスタムhooks
  const { dialogProps } = useDialog({ 'aria-labelledby': id }, dialogRef);

  // 4. 計算された値
  const labelledId = `${id}-labelled`;

  // 5. イベントハンドラー
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      setIsClosing(true);
      onClose();
    }
  };

  // 6. Early return
  if (!isClient) {
    return null;
  }

  // 7. メインrender
  return (
    <Dialog {...dialogProps} onClick={handleBackdropClick} ref={dialogRef}>
      <SearchHeader labelledId={labelledId} />
    </Dialog>
  );
};

// styled component
const Dialog = styled.dialog`
  position: fixed;
  border-radius: var(--radii-4);
`;
```

### 既存コードへの適用

- **新規コード**: この順序に従うことを推奨
- **既存コード**: 大規模な変更時にのみ整理を検討
- **リファクタリング**: 段階的に適用（一度に全ファイルを変更しない）

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

```tsx
// 注意: 最適化提案の前に ~/next.config.mjs の reactCompiler を必ず確認する
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
  <button onClick={onClick} aria-label="ボタンの説明" tabIndex={0} role="button">
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
☐ 適切な型注釈が付けられている
☐ 公開APIにはJSDocが付けられている
☐ テスタブルな構造になっている
☐ コンポーネントのレスポンシブ対応がされている
☐ アクセシビリティが考慮されている
```

### 自動チェックコマンド

```bash
# 型チェック
$ tsc --noEmit --skipLibCheck

# コードスタイルチェック
$ npm run lint

# テスト実行
$ npm test
```
