---
description: 'TypeScript コーディング規約と品質基準'
applyTo: '**/*.{ts,tsx}'
---

# TypeScript コーディング規約

このファイルは、TypeScriptファイル編集時に自動的に適用されるコーディング規約を定義します。

## 型定義の原則

### any の使用禁止

```typescript
// **FORBIDDEN**
function process(data: any) {
  return data.value;
}

// **RECOMMENDED**
interface DataWithValue {
  value: string;
}
function process(data: DataWithValue) {
  return data.value;
}
```

**理由**: Biomeの`noExplicitAny`ルールで自動検出されます。

### 型のみimportの使用

```typescript
// **AVOID**
import { Post } from '@/types/source';

// **RECOMMENDED**
import type { Post } from '@/types/source';
```

**理由**: Biomeの`useImportType`ルールで推奨されます。

### 公開APIのJSDoc必須

````typescript
/**
 * 記事データをslugから取得
 *
 * @param slug - 記事のスラッグ（例: "20241220-example"）
 * @returns 記事データまたはundefined
 *
 * @example
 * ```typescript
 * const post = getPost("20241220-example");
 * if (post) {
 *   console.log(post.title);
 * }
 * ```
 */
export function getPost(slug: string): Post | undefined {
  // 実装
}
````

**必須対象**:

- `export`された関数
- `export`されたクラス
- `export`された定数（複雑なものに限る）

## パスマッピング

常に絶対パスimportを使用：

```typescript
// **RECOMMENDED**
import { getPost } from '@/lib/data/posts';
import { css } from '@/ui/styled';

// **AVOID**
import { getPost } from '../../lib/data/posts';
import { css } from '../../../ui/styled';
```

## エラーハンドリング

このプロジェクトはSSGのため、ビルド時エラーを優先：

```typescript
// **RECOMMENDED**: ビルド時エラー
const posts = getPosts(); // 存在しない場合はビルドエラー

// **AVOID**: ランタイムエラー
try {
  const posts = await fetch('/api/posts');
} catch (error) {
  // SSGではランタイムfetchは基本的に不要
}
```

## 命名規則

| 種類                       | 形式                 | 例                     |
| -------------------------- | -------------------- | ---------------------- |
| コンポーネント             | PascalCase           | `PostDetail`, `Button` |
| 関数/変数                  | camelCase            | `getPost`, `userData`  |
| 定数                       | SCREAMING_SNAKE_CASE | `MAX_POSTS_PER_PAGE`   |
| 型/インターフェース        | PascalCase           | `PostProps`, `User`    |
| ファイル（コンポーネント） | PascalCase.tsx       | `PostDetail.tsx`       |
| ファイル（ユーティリティ） | camelCase.ts         | `formatDate.ts`        |

## Import順序

```typescript
// 1. 外部ライブラリ
import { useState } from 'react';
import type { Metadata } from 'next';

// 2. 内部ユーティリティ
import { getPost } from '@/lib/data/posts';
import { formatDate } from '@/lib/utils/date';

// 3. コンポーネント
import { Button } from '@/components/UI/Button';
import { Stack } from '@/components/UI/Layout';

// 4. 型定義
import type { Post } from '@/types/source';

// 5. スタイル/定数
import { css } from '@/ui/styled';
import { SITE_NAME } from '@/constants';
```

Biomeの`organizeImports`で自動整理されますが、この順序を意識してください。

## 避けるべきパターン

### Client Componentの乱用

```typescript
// **INCORRECT**: 不要なClient Component
'use client';
export function StaticText({ text }: { text: string }) {
  return <p>{text}</p>;
}

// **CORRECT**: Server Componentのまま
export function StaticText({ text }: { text: string }) {
  return <p>{text}</p>;
}
```

### 不要なuseEffect

```typescript
// **INCORRECT**: SSGで不要
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

// **CORRECT**: ビルド時にカウント
import posts from '@/posts.json';
export function PostCount() {
  return <span>{posts.length}</span>;
}
```
