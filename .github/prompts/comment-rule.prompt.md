# コードコメント記述ルール

## 基本方針

本プロジェクトのJS/TS/JSX/TSXファイルにおける、必要十分なコメント記述ルールを定義します。コードの自己説明性を高めつつ、必要な箇所にのみ価値のあるコメントを追加することで、コード品質向上と開発者間の理解促進を目指します。

## 実効性のあるコメント原則

- コードが自己説明的な場合はコメントを省略する
- 複雑なロジックや非自明な意図がある場合のみコメントを追加する
- TypeScriptの型情報と重複する説明は避ける
- JSDocを使用し、コードから読み取れない付加情報を提供する
- コメントは「WHAT（何をしているか）」よりも「WHY（なぜそうしているか）」を重視する
- 具体的で明確な記述を心がける。曖昧な表現やコメントの必要がないほど明確なコードを目指す

### コメント記述の基本ルール

1. 関数・メソッド・クラスに簡潔なJSDocコメントを付与する

   ```typescript
   /**
    * HTML文字列から説明文を生成する
    * @param postContent - コンテンツ文字列
    * @returns 整形された140文字以内の説明文
    */
   export const getDescriptionText = (postContent: string): string => {
     // 実装...
   };
   ```

2. 外部情報や仕様への参照はJSDocの`@see`タグで示す

   ```typescript
   /**
    * 構造化データを生成する
    * @see https://developers.google.com/search/docs/appearance/structured-data/logo
    * @returns Organization型の構造化データ
    */
   ```

3. 「WHY」を説明するコメントを優先する

   ```typescript
   // 悪い例: WHATのみ
   // HTMLタグを削除する

   // 良い例: WHYを含む
   // HTMLタグはプレーンテキストの説明文には不要なため削除
   ```

4. プロジェクト固有の注意点や制約を記述する

   ```typescript
   /**
    * 記事データを取得する
    * @note プリビルド時に生成されたJSONから読み込みを行うため、ランタイムでは変更されない
    */
   ```

## JSDocの使用と粒度

コードの複雑さに応じてコメントの詳細度を調整し、冗長性を避ける。

### JSDocを使用する対象

- 関数・メソッド・クラス（特に公開APIや複雑なロジックを含む場合）
- インターフェース・型定義（制約条件や使用方法が明確でない場合）
- 定数・変数（複雑なオブジェクト構造や特殊な値の場合）

## コメントの粒度と冗長性の回避

コメントは最小限の情報提供を目指し、コードの複雑さに応じて詳細度を調整する。

### コメント粒度の選定基準

- **高粒度**：ドメイン固有のロジック、複雑なアルゴリズム、特殊な実装
- **中粒度**：ユーティリティ関数、共通コンポーネント
- **低粒度**：自己説明的な関数、シンプルなメソッド

## TypeScriptとJSDocの使い分け

TypeScriptの型システムとJSDocを適切に組み合わせ、冗長性を避けます。

### 情報の重複を避ける原則

1. **型情報の重複を避ける**

   ```typescript
   // 悪い例：型情報を重複して記述
   /**
    * @param user - User型のユーザーオブジェクト
    * @returns boolean型の結果
    */
   function hasAccess(user: User): boolean { /* 実装 */ }

   // 良い例：型と重複しない意味のコメント
   /**
    * ユーザーが指定リソースへのアクセス権を持つか確認する
    * @param user - 検証対象のユーザー
    * @returns アクセス権がある場合はtrue
    */
   function hasAccess(user: User): boolean { /* 実装 */ }
   ```

2. **TypeScriptが表現している情報を繰り返さない**

   ```typescript
   // 悪い例：型情報の反復
   /**
    * ユーザーのリスト配列を取得する関数
    * @returns User型の配列
    */
   function getUsers(): User[] { /* 実装 */ }

   // 良い例：コンテキストと意味を追加
   /**
    * システムに登録された全アクティブユーザーを取得する（管理者除く）
    * @returns アクティブな一般ユーザーのリスト
    */
   function getUsers(): User[] { /* 実装 */ }
   ```

### TypeScriptでは表現できない情報をJSDocで補う

1. **値の制約条件や有効範囲**
2. **副作用や挙動の説明**
3. **実装の判断理由や背景**
4. **パフォーマンスや副作用に関する注意点**

例：

```typescript
/**
 * ページネーションデータを取得する
 * @param page - ページ番号（1以上の整数）
 * @param limit - 1ページあたりの件数（最大100）
 */
function getPaginatedData(page: number, limit: number): Promise<PaginatedResult> { /* 実装 */ }

/**
 * 商品の在庫数を計算する
 * @note 予約在庫も含めて計算するため、実際に出荷可能な数より大きくなる場合がある
 * @param productId - 商品ID
 * @returns 在庫数（予約分を含む）
 */
function calculateInventory(productId: string): number { /* 実装 */ }

/**
 * ユーザーセッションを無効化する
 * @warning この操作は元に戻せません。ユーザーは再ログインが必要になります。
 */
function invalidateSession(userId: string): void { /* 実装 */ }
```

## TODOコメント

期限と具体的情報を含めたTODOコメントを使用します。

```typescript
/** 
 * @todo 2025-06-10: パフォーマンス最適化。useCallbackの導入を検討
 * @assignee yourname
 */
function expensiveCalculation() { /* 実装 */ }
```

## 拘案事項と影響を記述する

```typescript
/**
 * @workaround 現在のNext.jsの仕様により、クライアント側でのメタデータ取得ができないため、静的プロパティとして渡しています
 */

/**
 * @performance キャッシュを使用してAPI呼び出し回数を削減
 */
```

## まとめ

本プロジェクトでは以下の原則に従ってコメントを記述します：

- コードが自己説明的な場合はコメントを省略する
- 公開関数・クラス・インターフェースにはJSDocを付与する
- 複雑なロジックを含む内部関数にもJSDocを付与する
- TypeScriptの型情報と重複する説明は避ける
- コードの複雑さに応じて適切なコメント粒度を選択する
- 必要最小限の説明にとどめ、冗長性を避ける
- コメントでは「何をしているか」より「なぜそうしているか」を重視する
- 特殊な仕様や注意点は明確にタグ付けして記述する

## 推奨されるJSDocタグ

- `@param` - パラメータの説明
- `@returns` - 戻り値の説明
- `@throws` - スローする可能性のある例外
- `@see` - 関連情報への参照
- `@example` - 使用例
- `@note` - 付加情報や解説
- `@todo` - 今後の課題
- `@deprecated` - 非推奨/廃止予定のコード
- `@private` - 非公開メソッド/プロパティ
- `@warning` - 警告事項
