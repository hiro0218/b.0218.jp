# アーキテクチャルール

このドキュメントは、プロジェクトのアーキテクチャ規約を定義します。

## ディレクトリ構造

```
src/
├── app/              # Next.js App Router (routes)
├── components/       # Components
│   ├── App/          # App shell (Header, Footer, Layout)
│   ├── Page/         # Page-specific components
│   │   └── _shared/  # Shared sections
│   ├── UI/           # Reusable UI components (zero-margin)
│   └── Functional/   # Utility components
├── ui/               # Styling
└── types/            # TypeScript types
```

## コンポーネント原則

### ゼロマージン原則

- **No self-margins**: コンポーネントは自己マージンを持たない
- **Parents control spacing**: 親コンポーネントがスペーシングを制御

### レイヤー依存関係

- **Layer Dependencies**: Biome (`biome.json`) で強制
- **UI と Functional は独立したレイヤー**: 相互依存なし

## レイヤーの責務

### App/

- **責務**: アプリケーション構造、レイアウト
- **特性**: シングルトン的
- **依存**: 下位レイヤーのみに依存

**配置例**:

- Header
- Footer
- Layout
- Navigation

### Page/

- **責務**: ページのビジネスロジック・コンポーネント
- **共有セクション**: `Page/_shared/` に配置
- **依存**: UI/Functional に依存可能
- **制約**: App/ に依存不可

**配置例**:

- HomePage
- AboutPage
- BlogPostPage
- \_shared/Hero
- \_shared/ContactForm

### UI/

- **責務**: 視覚的、再利用可能なコンポーネント
- **特性**: ビジネスロジックを含まない、ゼロマージン
- **依存**: 他のコンポーネントレイヤーに依存しない

**配置例**:

- Button
- Card
- Modal
- Input
- Typography

### Functional/

- **責務**: 非視覚的なユーティリティ
- **機能**: メタデータ、最適化
- **依存**: 他のコンポーネントレイヤーに依存しない

**配置例**:

- PreconnectLinks
- MetaTags
- ErrorBoundary
- Analytics

## アーキテクチャの根拠

### Separation of Concerns（関心の分離）

各レイヤーが明確な責務を持つことで：

- コードの理解が容易
- 変更の影響範囲が限定的
- テストが書きやすい

### Maintainability（保守性）

依存関係が明確なため：

- リファクタリングが安全
- 新機能の追加が容易
- バグの原因特定が早い

### Testability（テスト容易性）

独立したレイヤーにより：

- 単体テストが書きやすい
- モックが作りやすい
- テストの実行が高速

### Scalability（拡張性）

明確な構造により：

- チーム開発がスムーズ
- コードベースの成長に対応
- 新メンバーのオンボーディングが容易

## 静的検証

### Biome による依存関係チェック

`biome.json` で以下のルールが強制されています：

```json
{
  "linter": {
    "rules": {
      "nursery": {
        "noRestrictedImports": {
          // レイヤー間の依存関係を制限
        }
      }
    }
  }
}
```

### 違反例

```typescript
// ❌ UI から Page をインポート（違反）
// src/components/UI/Button/Button.tsx
import { HomePage } from '@/components/Page/HomePage';

// ❌ Functional から UI をインポート（違反）
// src/components/Functional/Analytics.tsx
import { Button } from '@/components/UI/Button';

// ❌ Page から App をインポート（違反）
// src/components/Page/HomePage.tsx
import { Header } from '@/components/App/Header';
```

### 正しい例

```typescript
// ✅ App から Page をインポート（許可）
// src/components/App/Layout.tsx
import { HomePage } from '@/components/Page/HomePage';

// ✅ Page から UI をインポート（許可）
// src/components/Page/HomePage.tsx
import { Button } from '@/components/UI/Button';
import { Card } from '@/components/UI/Card';

// ✅ App から UI と Functional をインポート（許可）
// src/components/App/Header.tsx
import { Button } from '@/components/UI/Button';
import { PreconnectLinks } from '@/components/Functional/PreconnectLinks';
```

## ゼロマージン原則の詳細

### 基本ルール

UI コンポーネントは `margin` プロパティを使用しない：

```typescript
// ❌ 違反例
const Button = styled.button`
  margin: 16px; // NG: 自己マージン
`;

// ✅ 正しい例
const Button = styled.button`
  padding: 8px 16px; // OK: 内部スペーシング
`;
```

### 親による制御

親コンポーネントがスペーシングを制御：

```typescript
// 親コンポーネント
const HomePage = () => (
  <div className={css({ display: 'flex', gap: '16px' })}>
    <Button>Click Me</Button>
    <Button>Another Button</Button>
  </div>
);
```

## React ベストプラクティス

### Server Components がデフォルト

```typescript
// ✅ デフォルトは Server Component
export default function HomePage() {
  return <div>Home Page</div>;
}
```

### Client Components は必要時のみ

```typescript
// ✅ インタラクティブな機能が必要な場合のみ
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### インポート順序

```typescript
// 1. 外部ライブラリ
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// 2. 内部ユーティリティ
import { formatDate } from '@/lib/utils';

// 3. コンポーネント
import { Button } from '@/components/UI/Button';
import { Card } from '@/components/UI/Card';

// 4. 型定義
import type { Post } from '@/types/post';

// 5. スタイル・定数
import { css } from '@/ui/styled';
import { COLORS } from '@/constants';
```

## TypeScript 品質基準

### Strict Mode

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true
  }
}
```

### 明示的な型定義

```typescript
// ✅ Public API には明示的な型
export function formatPost(post: Post): FormattedPost {
  // ...
}

// ✅ Props に型定義
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({ children, onClick }: ButtonProps) {
  // ...
}
```

### Type-only imports

```typescript
// ✅ 型のみのインポート
import type { Post } from '@/types/post';
import type { User } from '@/types/user';

// ✅ 値と型の混在時
import { getPosts, type Post } from '@/lib/posts';
```

## パフォーマンス考慮事項

### SSG（Static Site Generation）

このプロジェクトは SSG を使用：

```typescript
// ビルド時にデータ取得
async function getData() {
  const posts = await import('@/posts.json');
  return posts.default;
}
```

### Client Component の最小化

不要な Client Component を避ける：

```typescript
// ❌ 不要な Client Component
'use client';

export function StaticContent() {
  return <div>Static Content</div>; // インタラクティブ機能なし
}

// ✅ Server Component で十分
export function StaticContent() {
  return <div>Static Content</div>;
}
```

## ファイル命名規則

- **Components**: PascalCase (`Button.tsx`, `HomePage.tsx`)
- **Utilities**: camelCase (`formatDate.ts`, `parseMarkdown.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINT.ts`, `COLOR_PALETTE.ts`)
- **Types**: PascalCase (`Post.ts`, `User.ts`)

## まとめ

アーキテクチャレビューでは、以下を重点的にチェックします：

1. ✅ レイヤー依存関係の遵守
2. ✅ コンポーネントの適切な配置
3. ✅ ゼロマージン原則の適用
4. ✅ Server/Client Components の適切な使い分け
5. ✅ TypeScript strict mode の遵守
6. ✅ インポート順序の統一
7. ✅ ファイル命名規則の遵守
