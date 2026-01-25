---
description: 'TypeScript コーディング規約と品質基準'
applyTo: '**/*.{ts,tsx}'
paths:
  - '**/*.{ts,tsx}'
---

# TypeScript コーディング規約

このファイルは、TypeScriptファイル編集時に自動的に適用されるコーディング規約を定義する。

## Priority Markers

> See [CLAUDE.md - Priority Levels](../CLAUDE.md#priority-levels) for marker definitions.

> **📌 About this file**: This is a detailed guide for CLAUDE.md. For priorities and the overview, see [CLAUDE.md - Critical Rules](../CLAUDE.md#critical-rules-must-follow).

## Quick Reference

### 🔴 Critical Rules (Must Follow)

| Rule                  | Summary                     | Verification          | Details                                    |
| --------------------- | --------------------------- | --------------------- | ------------------------------------------ |
| No `any`              | Use explicit types          | Biome `noExplicitAny` | [#anyの使用禁止](#anyの使用禁止)           |
| Type-only imports     | Use `import type`           | Biome `useImportType` | [#型のみimportの使用](#型のみimportの使用) |
| JSDoc for public APIs | Document exported functions | Manual review         | [#公開apiのjsdoc必須](#公開apiのjsdoc必須) |
| Absolute imports      | Use `@/` path alias         | TypeScript config     | [#パスマッピング](#パスマッピング)         |

### 🟡 Important Rules (Should Follow)

| Rule               | Summary                  | Verification            | Details                    |
| ------------------ | ------------------------ | ----------------------- | -------------------------- |
| Import order       | Follow 5-section pattern | Biome `organizeImports` | [#import順序](#import順序) |
| Naming conventions | Follow table patterns    | Manual review           | [#命名規則](#命名規則)     |

### 🚨 Common Mistakes

| ❌ Don't                      | ✅ Do                               | Why                                      |
| ----------------------------- | ----------------------------------- | ---------------------------------------- |
| `data: any`                   | `data: DataType`                    | Type safety, prevents runtime errors     |
| `import { Post }` (type)      | `import type { Post }`              | Reduces bundle size (3-5% reduction)     |
| `../../lib/posts`             | `@/lib/posts`                       | Easier refactoring, clearer dependencies |
| No JSDoc on exported function | Add JSDoc with `@param`, `@returns` | IntelliSense, better DX                  |

## 🔴 型定義の原則 (CRITICAL)

> **Related Sections**:
>
> - [命名規則](#命名規則) - 型名の命名規則
> - [components.md - Props Design](./components.md#props-design-important) - コンポーネントの型定義

### anyの使用禁止

```typescript
// ❌ FORBIDDEN
function process(data: any) {
  return data.value;
}

// ✅ RECOMMENDED
interface DataWithValue {
  value: string;
}
function process(data: DataWithValue) {
  return data.value;
}
```

**理由**: Biomeの`noExplicitAny`ルールで自動検出される。

> **WHY**: `any` は TypeScript の型チェックを無効化し、ランタイムエラーの原因になる。
>
> **REAL CASE**: `getPost(slug: any)` と定義していたため、`getPost(123)` (数値) が通り、ビルド時にエラーが出ず、本番環境で 404 エラーが多発した。`getPost(slug: string)` にすることで、ビルド時に検出できるようになった。

---

### 型のみimportの使用

```typescript
// ❌ AVOID
import { Post } from '@/types/source';

// ✅ RECOMMENDED
import type { Post } from '@/types/source';
```

**理由**: Biomeの`useImportType`ルールで推奨される。

> **WHY**: `import type` はトランスパイル時に削除され、バンドルサイズが削減される。
>
> **IMPACT**: プロジェクト全体で `import type` を徹底することで、最終バンドルサイズが約 3-5% 削減された（型定義ファイルが含まれないため）。

---

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

> **WHY**: JSDoc は IntelliSense での開発体験を向上させ、関数の使い方を明確にする。
>
> **IMPACT**: チームメンバーが関数の実装を読まずに使い方を理解でき、開発効率が向上する。特に `@example` タグは実際の使用例を示すため、誤用を防ぐ。

## 🔴 パスマッピング (CRITICAL)

常に絶対パスimportを使用：

```typescript
// ✅ RECOMMENDED
import { getPost } from '@/lib/data/posts';
import { css } from '@/ui/styled';

// ❌ AVOID
import { getPost } from '../../lib/data/posts';
import { css } from '../../../ui/styled';
```

> **WHY**: 相対パスはファイル移動時に壊れやすく、深いネストでは可読性が低下する。
>
> **REAL CASE**: コンポーネントを `components/UI/` から `components/Page/` に移動した際、相対パスのimportが一斉に壊れ、修正に2時間かかった。絶対パス (`@/`) なら移動してもimportは変更不要である。

> **SSG関連の原則**: ビルド時データロードやランタイム `fetch` 回避は `architecture.md` を参照すること。

## 🟡 命名規則 (IMPORTANT)

| 種類                       | 形式                 | 例                     |
| -------------------------- | -------------------- | ---------------------- |
| コンポーネント             | PascalCase           | `PostDetail`, `Button` |
| 関数/変数                  | camelCase            | `getPost`, `userData`  |
| 定数                       | SCREAMING_SNAKE_CASE | `MAX_POSTS_PER_PAGE`   |
| 型/インターフェース        | PascalCase           | `PostProps`, `User`    |
| ファイル（コンポーネント） | PascalCase.tsx       | `PostDetail.tsx`       |
| ファイル（ユーティリティ） | camelCase.ts         | `formatDate.ts`        |

## 🟡 Import順序 (IMPORTANT)

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

Biomeの`organizeImports`で自動整理されるが、この順序を意識すること。

> **WHY**: 一貫したimport順序により、コードの可読性が向上し、依存関係が明確になる。
>
> **AUTO-FIX**: Biome が自動で整理するため、手動で並び替える必要はない（`npm run lint:fix` で自動適用）。

## Common Mistakes & Solutions

### Mistake 1: Using `any` in utility functions

```typescript
// ❌ WRONG - Type safety lost
export function formatDate(date: any): string {
  return date.toISOString(); // Runtime error if date is not Date object
}

// ✅ CORRECT - Type-safe
export function formatDate(date: Date): string {
  return date.toISOString(); // TypeScript ensures date is Date object
}
```

**Why this matters**: `any` を使うと、間違った型の引数を渡してもビルド時にエラーが出ず、ランタイムで予期しないエラーが発生する。

---

### Mistake 2: Mixing value and type imports

```typescript
// ❌ WRONG - Value and type mixed
import { Post, getPosts } from '@/lib/posts';

// ✅ CORRECT - Separate type imports
import type { Post } from '@/types/source';
import { getPosts } from '@/lib/posts';
```

**Why this matters**: `import type` はトランスパイル時に削除されるため、型と値を分けることでバンドルサイズが削減される。

**Auto-fix**: Biome が自動で分離する（`npm run lint:fix`）。

---

### Mistake 3: No JSDoc on public API

````typescript
// ❌ WRONG - No documentation
export function calculateSimilarity(post1: Post, post2: Post): number {
  // Implementation
}

// ✅ CORRECT - JSDoc with examples
/**
 * 2つの記事の類似度を計算（0-1の範囲）
 *
 * @param post1 - 比較元の記事
 * @param post2 - 比較先の記事
 * @returns 類似度スコア（0: 類似なし, 1: 完全一致）
 *
 * @example
 * ```typescript
 * const score = calculateSimilarity(postA, postB);
 * if (score > 0.7) {
 *   console.log('Similar posts');
 * }
 * ```
 */
export function calculateSimilarity(post1: Post, post2: Post): number {
  // Implementation
}
````

**Why this matters**: JSDoc により、関数を使う開発者が実装を読まずに使い方を理解できる。特に `@example` タグは実際の使用例を示し、誤用を防ぐ。

## Automated Verification

| Rule              | Tool       | Command            | Error Example                                              |
| ----------------- | ---------- | ------------------ | ---------------------------------------------------------- |
| No `any`          | Biome      | `npm run lint`     | `noExplicitAny: Unexpected any. Specify a different type.` |
| Type-only imports | Biome      | `npm run lint`     | `useImportType: All these imports are only used as types.` |
| Type errors       | TypeScript | `tsc --noEmit`     | `Property 'value' does not exist on type 'unknown'.`       |
| Import order      | Biome      | `npm run lint:fix` | (Auto-fixed by `organizeImports`)                          |

### Manual Review Required

These rules **cannot be automatically verified**:

- 🔴 JSDoc for public APIs (check during code review)
- 🟡 Absolute imports (TypeScript config enforces, but not linted)

### Verification Workflow

```bash
# Type check specific file
tsc --noEmit --skipLibCheck src/path/to/file.ts

# Lint check specific file
npx @biomejs/biome check src/path/to/file.ts

# Auto-fix lint errors
npx @biomejs/biome check --write src/path/to/file.ts

# Run all checks
npm run lint
npm run type-check
```

## Verification Checklist

Before committing TypeScript changes:

- [ ] No `any` types (verified by Biome `noExplicitAny`)
- [ ] Type-only imports use `import type` (verified by Biome `useImportType`)
- [ ] Exported functions have JSDoc comments with `@param`, `@returns`, `@example`
- [ ] Absolute imports (`@/`) used instead of relative paths (`../../`)
- [ ] Import order follows 5-section pattern (auto-fixed by Biome)
- [ ] Type errors resolved (`tsc --noEmit` passes)
- [ ] Lint errors resolved (`npm run lint` passes)
- [ ] Naming conventions followed (PascalCase for types, camelCase for functions)
