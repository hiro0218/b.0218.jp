# AI Agent コメント実行ルール

## 🔴 絶対遵守事項

**コメント記述は以下の3条件のみ許可**（例外なし）：

1. **法規制・ビジネスルール**: コードで表現不可能な外部制約（税率20.315%等）
2. **公開API必須JSDoc**: exportされた関数/クラス（100%カバレッジ必須）
3. **複雑な数式・アルゴリズム**: 学術的根拠が必要な計算ロジック

**違反検出時の対応**：即座に実行停止 → リファクタリングで解決

## 実行チェックリスト

必ず以下の順序で実行：

□ 1. **コメント分析実行**: `npm run analyze:comments || npx eslint . --rule 'no-warning-comments:error'`
□ 2. **ratio確認**: 5%超過なら必ずリファクタリング実施
□ 3. **JSDoc検証**: `npm run check:jsdoc || grep -r "export.*function\|export.*class" --include="*.ts" | wc -l`
□ 4. **禁止パターン検出**: 0個確認（1個でも検出したら実行停止）
□ 5. **結果報告**: 改善前後の数値を必ず含める

### 🟡 JSDoc必須対象（例外なし）

```typescript
/**
 * SEOメタ記述用にHTMLから平文を抽出
 * ビジネス要件：SEO最適化のため140文字制限（Google推奨）
 * @param postContent markdownパーサーからのHTML
 * @returns 140文字以内の平文抜粋
 */
export const getDescriptionText = (postContent: string): string => {
  const MAX_LENGTH = 140; // SEO推奨値を定数化
  return postContent.replace(/<[^>]*>/g, '').substring(0, MAX_LENGTH);
};
```

## 🔴 絶対禁止コメント（検出時は即座に削除）

| 禁止パターン             | 検出例                              | 必須対応                |
| ------------------------ | ----------------------------------- | ----------------------- |
| **自明なコメント**       | `// カウンタをインクリメント`       | 即削除                  |
| **型の重複**             | `@param user - Userオブジェクト`    | 即削除                  |
| **What説明**             | `getUserDataはユーザーデータを取得` | リネーム実施            |
| **ノイズコメント**       | `// 関数終了`、`// TODO: 後で修正`  | 即削除                  |
| **コメントアウトコード** | `// const old = 123;`               | 即削除（git履歴で管理） |

## 🟢 リファクタリング必須対応

コメントが必要と感じたら、必ず以下の順序で対処：

1. **変数名改善**: `flag` → `isUserLoggedIn`（5文字以上の説明的名称）
2. **関数分割**: 10行超の関数は必ず分割
3. **定数化**: マジックナンバーは必ず `const MAX_LENGTH = 140;` 形式

## JSDocタグ使用規則（厳格制限）

### 使用可能タグ（これ以外は禁止）

| タグ          | 使用条件                            | 必須度 |
| ------------- | ----------------------------------- | ------ |
| `@param`      | ビジネスルール説明が必要な場合のみ  | 🟡     |
| `@returns`    | 戻り値に制約がある場合のみ          | 🟡     |
| `@throws`     | エラー発生条件が3つ以上ある場合のみ | 🟢     |
| `@example`    | 公開APIで使用方法が複雑な場合のみ   | 🟢     |
| `@deprecated` | 代替メソッドが存在する場合必須      | 🔴     |

### 実装例（最小限）

```typescript
/**
 * 日本の税制（20.315%）適用の複利計算
 * @param principal 初期投資額（円）
 * @param years 投資期間（1-30年制限）
 * @throws {RangeError} 期間が法定上限超過時
 */
export const calculateInvestmentReturn = (principal: number, years: number): number => {
  const TAX_RATE = 0.20315; // 日本の金融所得税率
  const MAX_YEARS = 30; // NISA上限
  if (years > MAX_YEARS) throw new RangeError(`期間は${MAX_YEARS}年以内`);
  // 実装...
};
```

## 📊 品質メトリクス（必須達成値）

| メトリクス            | 目標値 | 測定コマンド                                                   | 違反時対応           |
| --------------------- | ------ | -------------------------------------------------------------- | -------------------- |
| **コメント比率**      | < 5%   | `cloc . --json \| jq '.TypeScript.comment / .TypeScript.code'` | リファクタリング必須 |
| **公開APIカバレッジ** | 100%   | `grep -r "export" --include="*.ts" \| wc -l`                   | JSDoc追加必須        |
| **内部コメント**      | < 10行 | `grep -c "^\\s*//" --include="*.ts"`                           | 即削除               |

## 実行前判定フローチャート

```
コメントを書きたい？
    ↓
[1] コード改善で解決可能？ → YES → リネーム/分割/定数化
    ↓ NO
[2] 3つの許可条件に該当？ → NO → コメント禁止
    ↓ YES
[3] JSDoc形式で記述 → 完了
```

## 追跡・報告フォーマット

実行完了時は必ず以下の形式で報告：

```markdown
## コメント改善結果

- 削除コメント数: X個
- 追加JSDoc数: Y個
- コメント比率: 改善前 A% → 改善後 B%
- リファクタリング: 関数Z個分割、定数W個追加
```
