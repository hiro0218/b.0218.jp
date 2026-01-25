---
description: 'コードレビューチェックポイントとアーキテクチャ準拠確認'
agent: 'agent'
applyTo: '**/*.{ts,tsx,js,jsx}'
paths:
  - '**/*.{ts,tsx,js,jsx}'
---

# コードレビューの指示

コードレビューを行う際には、以下のチェックポイントに従って評価・改善提案を行ってください。このガイドラインは、プロジェクトの品質維持と向上に役立つ具体的なレビュー方法を提供します。

## Priority Markers

> See [CLAUDE.md - Priority Levels](../CLAUDE.md#priority-levels) for marker definitions.

## プロジェクト固有の観点

詳細ルールは各ガイドに集約しています。レビュー時は以下を参照してください。

- アーキテクチャ横断: [architecture.md](./architecture.md)
- コンポーネント/レイヤー: [components.md](./components.md)
- スタイリング: [styling.md](./styling.md)
- TypeScript規約: [typescript.md](./typescript.md)
- コンテンツパイプライン: [content-pipeline.md](./content-pipeline.md)

## 技術スタック固有のチェック

具体的なルールやサンプルは以下を参照し、レビューでは「違反がないか」を確認してください。

- TypeScript: [typescript.md](./typescript.md)
- Next.js / App Router: [architecture.md](./architecture.md)
- 日本語コンテンツ処理: [content-pipeline.md](./content-pipeline.md)

## レビュー手順

### 1. 必須チェック項目

#### 自動チェック（コマンドで検証）

```bash
tsc --noEmit --skipLibCheck  # 型エラー検出
npm run lint                 # Biome: コードスタイル、未使用変数、Layer Dependencies
npm test                     # テスト実行
```

#### 手動レビュー

```
□ 適切なJSDocとコメントが付けられている
□ アーキテクチャ準拠（Layer Dependencies、Server First、SSG）
□ スタイリング規約準拠（Panda CSS、CSS Variables、Zero Margin）
```

### 2. 品質評価（優先度順）

1. **機能性**: 要件を満たしているか
   - 仕様書や要求書との一致性
   - エッジケースの処理
   - エラーハンドリングの完全性

2. **可読性**: 命名・構造・コメントの適切性
   - 理解しやすい命名規則
   - 適切な関数の分割とコンポーネント設計
   - コメントの品質と量

3. **保守性**: 変更に対する影響範囲の最小化
   - テストカバレッジ
   - コードのモジュール性
   - 依存関係の明確性

4. **パフォーマンス**: 実行速度・メモリ使用量
   - 不要な再レンダリングの回避
   - リソースの適切な利用
   - ボトルネックの有無

5. **セキュリティ**: XSS、CSRF等の脆弱性
   - 入力データの検証
   - 権限チェック
   - 機密情報の適切な取り扱い

### 3. 改善提案の形式

````markdown
## **REVIEW**: 指摘事項

### **PROBLEM**

具体的な問題の説明

### **SOLUTION**

```typescript
// 修正前
const badCode = ...

// 修正後
const goodCode = ...
```

### **REASON**

改善が必要な理由とメリット

### **REFERENCE**

- [関連ドキュメントやベストプラクティスへのリンク]
- [パターンや手法の説明]
````

### 4. 具体的なレビュー例

````markdown
## **REVIEW**: 型安全性の改善

### **PROBLEM**

`any` 型が使用されており、型安全性が確保されていません。

### **SOLUTION**

```typescript
// 修正前
function processData(data: any) {
  return data.value;
}

// 修正後
interface DataWithValue {
  value: string;
}

function processData(data: DataWithValue) {
  return data.value;
}
```

### **REASON**

明確な型定義を行うことで、実行時エラーを防止し、コードの自己文書化にも役立ちます。また、IDEのサポートも得られます。
````

## プロジェクト特有の注意点

以下はレビュー観点の要約です。詳細は各ガイドに従って判断してください。

- **ビルドプロセス**: `npm run prebuild` への影響、JSON/OGP生成の整合性
- **コンテンツ処理**: Markdown解析、類似度計算、静的生成の効率
- **開発体験**: Devサーバー動作、ホットリロード、デバッグ情報
- **セキュリティ/アクセシビリティ**: `dangerouslySetInnerHTML`、画像最適化、SR対応
