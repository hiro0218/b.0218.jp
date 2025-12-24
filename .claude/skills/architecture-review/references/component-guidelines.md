# コンポーネント設計ガイドライン

このドキュメントは、アーキテクチャレビューで使用する具体的なチェックポイントと判断基準を定義します。

## レビューチェックリスト

### Phase 1: ファイル配置の検証

#### 1.1 ファイルパスの確認

```
✅ チェック項目:
- ファイルが適切なレイヤーに配置されているか
- ファイル名が命名規則に従っているか
- ディレクトリ構造が規約に準拠しているか

❌ よくある違反:
- UI コンポーネントが Page/ に配置されている
- ビジネスロジックが UI/ に配置されている
- 共有コンポーネントが _shared/ 以外に配置されている
```

**判断基準**:

| レイヤー     | 配置すべきファイル                           |
| ------------ | -------------------------------------------- |
| App/         | Header, Footer, Layout, Navigation           |
| Page/        | HomePage, AboutPage, BlogPostPage            |
| Page/_shared | Hero, ContactForm, NewsletterSignup          |
| UI/          | Button, Card, Modal, Input, Typography       |
| Functional/  | PreconnectLinks, MetaTags, ErrorBoundary     |

#### 1.2 ファイル命名規則

```typescript
// ✅ 正しい命名
// Components: PascalCase
src/components/UI/Button/Button.tsx
src/components/Page/HomePage.tsx

// Utilities: camelCase
src/lib/formatDate.ts
src/lib/parseMarkdown.ts

// Constants: UPPER_SNAKE_CASE
src/constants/API_ENDPOINT.ts
src/constants/COLOR_PALETTE.ts

// Types: PascalCase
src/types/Post.ts
src/types/User.ts

// ❌ 誤った命名
src/components/UI/button/button.tsx  // 小文字
src/lib/FormatDate.ts                 // PascalCase（ユーティリティ）
src/constants/apiEndpoint.ts          // camelCase（定数）
```

### Phase 2: インポート依存関係の検証

#### 2.1 レイヤー依存関係チェック

```typescript
// 検証方法:
// 1. import 文を抽出
// 2. @/components/ からのインポートを特定
// 3. 依存関係ルールと照合
```

**App/ のインポート検証**:

```typescript
// ✅ 許可されるインポート
import { HomePage } from '@/components/Page/HomePage';
import { Button } from '@/components/UI/Button';
import { PreconnectLinks } from '@/components/Functional/PreconnectLinks';

// ❌ 禁止されるインポート
// （なし - App は最上位レイヤー）
```

**Page/ のインポート検証**:

```typescript
// ✅ 許可されるインポート
import { Button } from '@/components/UI/Button';
import { Card } from '@/components/UI/Card';
import { PreconnectLinks } from '@/components/Functional/PreconnectLinks';

// ❌ 禁止されるインポート
import { Header } from '@/components/App/Header';  // App への依存は禁止
```

**UI/ のインポート検証**:

```typescript
// ✅ 許可されるインポート
import { css } from '@/ui/styled';
import type { ButtonProps } from './types';

// ❌ 禁止されるインポート
import { HomePage } from '@/components/Page/HomePage';          // Page への依存
import { Header } from '@/components/App/Header';               // App への依存
import { PreconnectLinks } from '@/components/Functional/PreconnectLinks';  // Functional への依存
```

**Functional/ のインポート検証**:

```typescript
// ✅ 許可されるインポート
import type { MetaData } from '@/types/meta';

// ❌ 禁止されるインポート
import { Button } from '@/components/UI/Button';       // UI への依存
import { HomePage } from '@/components/Page/HomePage'; // Page への依存
import { Header } from '@/components/App/Header';      // App への依存
```

#### 2.2 インポート順序の検証

```typescript
// ✅ 正しい順序
// 1. 外部ライブラリ
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 2. 内部ユーティリティ
import { formatDate } from '@/lib/utils';
import { parseMarkdown } from '@/lib/markdown';

// 3. コンポーネント
import { Button } from '@/components/UI/Button';
import { Card } from '@/components/UI/Card';

// 4. 型定義
import type { Post } from '@/types/post';
import type { User } from '@/types/user';

// 5. スタイル・定数
import { css } from '@/ui/styled';
import { COLORS } from '@/constants/colors';

// ❌ 誤った順序
import { Button } from '@/components/UI/Button';  // コンポーネントが先
import { useState } from 'react';                 // 外部ライブラリが後
```

### Phase 3: コンポーネント実装の検証

#### 3.1 Server/Client Components の検証

```typescript
// ✅ 正しい使用例

// Server Component（デフォルト）
export default function StaticPage() {
  return <div>Static Content</div>;
}

// Client Component（必要時のみ）
'use client';

import { useState } from 'react';

export default function InteractiveComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}

// ❌ 不適切な使用例

// 'use client' が不要（インタラクティブ機能なし）
'use client';

export default function StaticComponent() {
  return <div>Static Content</div>;
}
```

**判断基準**:

| 機能                   | Server Component | Client Component |
| ---------------------- | :--------------: | :--------------: |
| 静的コンテンツ表示     |        ✅        |        ❌        |
| データフェッチ（SSG）  |        ✅        |        ❌        |
| useState/useEffect     |        ❌        |        ✅        |
| イベントハンドラ       |        ❌        |        ✅        |
| ブラウザ API           |        ❌        |        ✅        |

#### 3.2 ゼロマージン原則の検証

**UI コンポーネントの検証**:

```typescript
// ✅ 正しい実装（ゼロマージン）
const Button = styled.button`
  padding: 8px 16px;        // OK: 内部スペーシング
  border-radius: 4px;       // OK: スタイリング
  background-color: blue;   // OK: スタイリング
`;

// ❌ 違反（自己マージン）
const Button = styled.button`
  margin: 16px;             // NG: 自己マージン
  margin-top: 8px;          // NG: 自己マージン
  margin-bottom: 8px;       // NG: 自己マージン
`;

// ✅ 親でスペーシング制御
const HomePage = () => (
  <div className={css({ display: 'flex', gap: '16px' })}>
    <Button>Click Me</Button>
    <Button>Another</Button>
  </div>
);
```

**検証コマンド**:

```bash
# UI コンポーネント内の margin 使用を検索
grep -r "margin:" src/components/UI/

# 検出された場合、違反として報告
```

### Phase 4: TypeScript 品質の検証

#### 4.1 any 型の使用チェック

```typescript
// ❌ any 型の使用（違反）
function processData(data: any) {
  return data.value;
}

// ✅ 適切な型定義
interface Data {
  value: string;
}

function processData(data: Data) {
  return data.value;
}

// ✅ ジェネリクスの使用
function processData<T>(data: T): T {
  return data;
}
```

**検証コマンド**:

```bash
# any 型の使用を検索
grep -r ": any" src/

# 検出された場合、改善提案を報告
```

#### 4.2 Public API の型定義チェック

```typescript
// ✅ 明示的な型定義
export function formatPost(post: Post): FormattedPost {
  // ...
}

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

// ❌ 型推論に依存（Public API）
export function formatPost(post) {  // 型がない
  // ...
}

export const Button = ({ children, onClick }) => {  // 型がない
  // ...
};
```

#### 4.3 Type-only imports の検証

```typescript
// ✅ Type-only imports
import type { Post } from '@/types/post';
import type { User } from '@/types/user';

// ✅ 値と型の混在
import { getPosts, type Post } from '@/lib/posts';

// ❌ 型を通常のインポートで取得
import { Post } from '@/types/post';  // type キーワードがない
```

### Phase 5: レビュー結果の生成

#### 5.1 結果フォーマット

```markdown
## アーキテクチャレビュー結果

### 📊 レビューサマリー

- ファイル: `src/components/UI/Button/Button.tsx`
- レイヤー: UI
- 総チェック項目: 15
- 合格: 12
- 警告: 2
- 違反: 1

### ✅ 準拠している項目

- [✓] レイヤー依存関係: 適切
- [✓] ファイル配置: 適切
- [✓] ファイル命名: PascalCase を使用
- [✓] インポート順序: 規約に準拠
- [✓] TypeScript strict mode: 有効
- [✓] Type-only imports: 適切に使用

### ⚠️ 改善が必要な項目

- [src/components/UI/Button/Button.tsx:12] any 型を使用
  **提案**: 明示的な型定義を追加してください

### ❌ 違反している項目

- [src/components/UI/Button/Button.tsx:23] ゼロマージン原則違反
  **詳細**: `margin: 16px` が検出されました
  **修正方法**: margin を削除し、親コンポーネントで gap または margin を使用してください

  ```diff
  - const Button = styled.button`
  -   margin: 16px;
  - `;
  + const Button = styled.button`
  +   padding: 8px 16px;
  + `;
  ```

### 📝 総合評価

- **評価**: ⚠️ 改善推奨
- **優先度**: 中
- **推奨アクション**:
  1. ゼロマージン原則違反を修正（必須）
  2. any 型を明示的な型定義に置き換え（推奨）
```

#### 5.2 優先度の判定基準

| 違反内容                     | 優先度 | 必須/推奨 |
| ---------------------------- | ------ | --------- |
| レイヤー依存関係違反         | 高     | 必須      |
| ゼロマージン原則違反         | 中     | 必須      |
| 'use client' の不適切な使用  | 中     | 推奨      |
| any 型の使用                 | 中     | 推奨      |
| インポート順序の違反         | 低     | 推奨      |

## 自動検証ツール

### Biome による静的チェック

```bash
# Biome で静的チェック実行
npx @biomejs/biome check <file>

# 自動修正
npx @biomejs/biome check --write <file>
```

### TypeScript コンパイラチェック

```bash
# 型チェック実行
tsc --noEmit --skipLibCheck <file>
```

## よくある違反パターン

### パターン 1: UI コンポーネントからの不適切な依存

```typescript
// ❌ 違反例
// src/components/UI/Card/Card.tsx
import { HomePage } from '@/components/Page/HomePage';

// ✅ 修正方法
// UI コンポーネントは他のコンポーネントレイヤーに依存しない
// ビジネスロジックは Page レイヤーに配置
```

### パターン 2: ゼロマージン原則の違反

```typescript
// ❌ 違反例
const Card = styled.div`
  margin: 16px;
`;

// ✅ 修正方法
const Card = styled.div`
  padding: 16px;
`;

// 親コンポーネント
const Layout = () => (
  <div className={css({ display: 'grid', gap: '16px' })}>
    <Card />
    <Card />
  </div>
);
```

### パターン 3: 不要な Client Component

```typescript
// ❌ 違反例
'use client';

export default function StaticList({ items }) {
  return (
    <ul>
      {items.map(item => <li key={item.id}>{item.name}</li>)}
    </ul>
  );
}

// ✅ 修正方法（'use client' を削除）
export default function StaticList({ items }) {
  return (
    <ul>
      {items.map(item => <li key={item.id}>{item.name}</li>)}
    </ul>
  );
}
```

### パターン 4: any 型の使用

```typescript
// ❌ 違反例
function processData(data: any) {
  return data.map((item: any) => item.value);
}

// ✅ 修正方法
interface DataItem {
  value: string;
}

function processData(data: DataItem[]) {
  return data.map(item => item.value);
}
```

## レビュー実行例

### 例 1: シンプルな UI コンポーネント

```bash
Input: "src/components/UI/Button/Button.tsx をレビューして"

Output:
✅ 準拠している項目
- レイヤー依存関係: 適切
- ファイル配置: 適切
- ゼロマージン原則: 準拠

⚠️ 改善が必要な項目
- [Button.tsx:12] ButtonProps に variant の型定義がない
```

### 例 2: Page コンポーネント

```bash
Input: "src/components/Page/HomePage.tsx のアーキテクチャをチェック"

Output:
✅ 準拠している項目
- インポート順序: 規約に準拠
- TypeScript 型定義: 適切

❌ 違反している項目
- [HomePage.tsx:8] App レイヤーへの依存を検出
  import { Header } from '@/components/App/Header';

修正方法: Page は App に依存できません。
App レイヤーで Header を配置してください。
```

### 例 3: 複数ファイルのレビュー

```bash
Input: "src/components/UI/ 配下のコンポーネントを一括レビュー"

Output:
📊 一括レビュー結果
- 総ファイル数: 15
- 合格: 12
- 警告: 2
- 違反: 1

⚠️ 警告ファイル
- Modal.tsx: any 型を使用

❌ 違反ファイル
- Input.tsx: ゼロマージン原則違反
```

## まとめ

アーキテクチャレビューは以下の順序で実行します：

1. **Phase 1**: ファイル配置の検証
2. **Phase 2**: インポート依存関係の検証
3. **Phase 3**: コンポーネント実装の検証
4. **Phase 4**: TypeScript 品質の検証
5. **Phase 5**: レビュー結果の生成

各フェーズで検出された問題は、優先度に応じて「必須」または「推奨」として分類し、具体的な修正方法を提示します。
