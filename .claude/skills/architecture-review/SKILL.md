---
name: architecture-review
description: Review Next.js project architecture compliance. Checks layer dependencies, component placement, and zero-margin principle. Use during code reviews or when creating new components.
allowed-tools: Read, Grep, Glob
---

# Architecture Review Skill

このスキルは、Next.js プロジェクトのアーキテクチャ規約への準拠を自動的にレビューします。

## 目的

Next.js プロジェクトのアーキテクチャ規約への準拠を検証し、保守性の高いコードベースを維持します。

## チェック項目

このスキルは以下の 5 つの観点からレビューを実行します：

### 1. レイヤー依存関係

App → Page → UI/Functional の依存関係ルールへの準拠

```typescript
// ✅ 正しい依存関係
// src/components/Page/Home/HomePage.tsx
import { Button } from '@/components/UI/Button';
import { formatDate } from '@/components/Functional/utils';

// ❌ 違反: Page が App に依存
import { Header } from '@/components/App/Header';
```

### 2. コンポーネント配置

各レイヤーの責務に応じた適切なファイル配置

- **App/**: アプリケーション全体のレイアウト、ヘッダー、フッター
- **Page/**: ページ固有のロジックとコンポーネント
- **UI/**: 再利用可能な視覚的コンポーネント
- **Functional/**: 非視覚的なユーティリティ

### 3. ゼロマージン原則

UI コンポーネントは自己マージンを持たない

```typescript
// ✅ 正しい実装
const Button = styled.button`
  padding: 8px 16px;
  /* margin なし */
`;

// ❌ 違反
const Button = styled.button`
  margin: 16px 0; /* UI コンポーネントに margin */
`;
```

### 4. React ベストプラクティス

Server/Client Components の適切な使用、インポート順序

### 5. TypeScript 品質

Strict mode、型定義、type-only imports

詳細なルールと判断基準は `references/` を参照してください。

## レビュー手順

レビューは以下の順序で実行します：

### Step 1: 対象ファイルの特定と読み込み

- レビュー対象のファイルパスを確認
- ファイルの内容を読み込み

### Step 2: 5つのチェック項目を検証

各チェック項目について順次検証：

1. **レイヤー依存関係**: import 文からレイヤー間の依存を抽出し、ルールに照合
2. **コンポーネント配置**: ファイルパスとレイヤーの責務が一致しているか確認
3. **ゼロマージン原則**: UI コンポーネントで `margin` プロパティの使用を検索
4. **React ベストプラクティス**: `'use client'` の使用、インポート順序をチェック
5. **TypeScript 品質**: `any` 型、型定義、type-only imports を検証

### Step 3: 問題の優先度判定

検出された問題を以下の優先度で分類：

- **高**: レイヤー依存関係違反（アーキテクチャの根幹）
- **中**: ゼロマージン原則違反、不適切な Client Component 使用
- **低**: インポート順序、型定義の改善余地

### Step 4: レビュー結果の生成

問題点と改善提案を含むレビュー結果を報告

## 出力形式

レビュー結果は以下の構成で報告します：

- **✅ 準拠している項目**: 問題がないチェック項目
- **⚠️ 改善が必要な項目**: 優先度「中」「低」の問題
- **❌ 違反している項目**: 優先度「高」の問題（即座に修正が必要）

各問題には `[ファイル名:行番号]` と具体的な修正方法を含めます。

## 使用例

スキルは以下のような質問で自動的に起動されます：

- 「このコンポーネントをレビューして」
- 「src/components/UI/Button/Button.tsx のアーキテクチャをチェック」
- 「レイヤー依存関係が正しいか確認して」
- 「ゼロマージン原則に準拠しているか見て」

## 参照ドキュメント

プロジェクトの詳細なアーキテクチャルールは以下を参照してください：

- `references/architecture-rules.md` - レイヤーアーキテクチャの詳細
- `references/component-guidelines.md` - コンポーネント設計ガイドライン

## 注意事項

- このスキルは **read-only** です（allowed-tools: Read, Grep, Glob）
- コードの自動修正は行いません
- レビュー結果に基づき、ユーザーが手動で修正します
- Biome の設定ファイル（`biome.json`）で静的な依存関係チェックが強制されています
