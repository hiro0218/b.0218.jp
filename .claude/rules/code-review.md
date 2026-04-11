---
paths:
  - '**/*.{ts,tsx,js,jsx}'
---

# コードレビューの指示

## レビュー手順

### 1. 必須チェック項目

#### 自動チェック（コマンドで検証）

```bash
tsc --noEmit --skipLibCheck  # 型エラー検出
npm run lint                 # Biome: 規則詳細は linting.md を参照
npm test                     # テスト実行
```

#### 手動レビュー

```
□ 適切なJSDocとコメントが付けられている
□ アーキテクチャ準拠（Layer Dependencies、Server First、SSG）
□ スタイリング規約準拠（Panda CSS、CSS Variables、Zero Margin）
□ セキュリティ: ハードコードされた秘密情報（API キー、トークン）がないか
□ セキュリティ: ユーザー入力の適切なバリデーション
```

### 2. 品質評価（プロジェクト固有）

- SSG 前提に反するランタイム fetch を追加していないか
- レイヤー依存・Zero Margin・Server First に違反していないか
- Panda CSS のルール（CSS 変数・hover 自動ラップ）に違反していないか

## プロジェクト特有の注意点

- **ビルドプロセス**: `npm run prebuild` への影響、JSON/OGP生成の整合性
- **コンテンツ処理**: Markdown 解析、類似度計算、検索インデックス生成の整合性
