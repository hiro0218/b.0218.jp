# コードコメントの記述ルール

## 基本方針

本プロジェクトにおけるJS/TS/JSX/TSXファイルのコメント記述に関するルールを定義する。コード品質の向上と開発者間での理解促進を目的としている。今後はJSDocを積極的に活用し、コードの自己文書化を推進する。

## 実用的なコメント方式の採用

コードは可能な限り自己説明的であるべきだが、複雑なロジックや意図が明確でない場合はコメントで補足する。JSDocコメントを優先的に使用し、関数やクラスの目的・使用方法・パラメータなどを明確に文書化する。

### コメント記述の基本ルール

1. 関数・メソッド・クラスはJSDocコメントで文書化する

   ```typescript
   /**
    * HTML文字列から140文字の説明文を生成する
    * @param postContent - HTML形式のコンテンツ文字列
    * @returns 整形された140文字以内の説明文
    * @example
    * const description = getDescriptionText("<p>長いHTML文字列</p>");
    */
   export const getDescriptionText = (postContent: string): string => {
     return postContent
       .replace(/(?:\r\n|\r|\n)/g, ' ') // 改行をスペースに置換
       .replace(/<\/?[^>]+(>|$)/g, '') // HTMLタグを削除
       .replace(/\s+/g, ' ') // 連続するスペースを1つに置換
       .trim() // 先頭と末尾のスペースを削除
       .substring(0, 140); // 140文字に切り詰め
   };
   ```

2. 外部情報や仕様への参照を明示する場合はJSDocの`@see`タグを使用する

   ```typescript
   /**
    * Organization型の構造化データを生成する
    * @see https://developers.google.com/search/docs/appearance/structured-data/logo?hl=ja
    * @returns Organization型の構造化データ
    */
   export const getOrganizationStructured = (): WithContext<Organization> => {
     return {
       '@context': 'https://schema.org',
       '@type': 'Organization',
       name: 'My Organization',
       url: 'https://example.com',
       logo: 'https://example.com/logo.png',
     };
   };
   ```

3. 複雑な正規表現やロジックには何をしているのかを説明するコメントを追加する

   ```typescript
   // 改行をスペースに置換
   .replace(/(?:\r\n|\r|\n)/g, ' ')
   // HTMLタグを削除
   .replace(/<\/?[^>]+(>|$)/g, '')
   ```

## JSDocの積極的な活用とコメント粒度

すべての要素に対してJSDocを使用することを基本としつつ、コードの複雑さや重要度に応じてコメントの詳細度（粒度）を調整する。これにより、冗長性を避けながらも必要な情報を提供できる。

### JSDocを使用する対象

1. 関数・メソッド・クラス（エクスポートの有無に関わらず）
2. インターフェース・型定義
3. 定数・変数（特に複雑なオブジェクト構造の場合）

### JSDocの基本的な使用パターン

#### 関数・メソッド向けJSDoc

```typescript
/**
 * 関数の簡潔な説明（一行）
 * 必要に応じて詳細な説明を追加（複数行可）
 *
 * @param paramName - パラメータの説明
 * @param [optionalParam] - 省略可能なパラメータの説明
 * @returns 戻り値の説明
 * @throws エラーが発生する条件の説明
 * @example
 * // 使用例
 * const result = myFunction('input');
 */
```

#### クラス・インターフェース向けJSDoc

```typescript
/**
 * クラスの簡潔な説明
 * 必要に応じて詳細な説明を追加
 *
 * @implements インターフェース名
 * @example
 * const instance = new MyClass();
 * instance.method();
 */
```

#### 変数・定数向けJSDoc

```typescript
/**
 * 定数の説明（TypeScriptの型情報と重複しない内容）
 */
const MY_CONSTANT = 'value';

// 複雑な型や特別な制約がある場合のみ型情報を追加
/**
 * 環境設定に関する定数
 * @type {Record<string, string>} - 環境変数の名前と値のマッピング
 */
const ENV_CONFIG = { ... };
```

### 主要なJSDocタグの使用ガイドライン

| タグ          | 使用目的                                               | 例                                                  |
| ------------- | ------------------------------------------------------ | --------------------------------------------------- |
| `@param`      | パラメータの説明                                       | `@param name - ユーザー名`                          |
| `@returns`    | 戻り値の説明                                           | `@returns 整形されたURL文字列`                      |
| `@example`    | 使用例の提示                                           | `@example const url = getPermalink('slug');`        |
| `@see`        | 参考情報へのリンク                                     | `@see https://example.com/spec`                     |
| `@throws`     | 例外が発生する条件                                     | `@throws 引数が無効な場合にエラーを投げる`          |
| `@deprecated` | 非推奨機能の明示                                       | `@deprecated v2.0.0以降は代わりにnewFunctionを使用` |
| `@private`    | 内部使用目的の関数                                     | `@private`                                          |
| `@type`       | 型情報の指定（TypeScriptの型注釈と重複しない場合のみ） | `@type {string[]}`                                  |

## コメントの粒度と冗長性の回避

コメントは情報価値のバランスを重視し、適切な粒度で記述する。目的は「コードを理解するための最小限の情報提供」であり、冗長なコメントはかえって可読性を下げる可能性がある。

### 適切なコメント粒度の選定基準

1. **高粒度（詳細）コメントが必要な場合**：

   - ドメイン固有のビジネスロジック
   - 複雑なアルゴリズムや計算式
   - 非直感的なワークアラウンドやハック
   - セキュリティに関わる処理
   - パフォーマンス最適化のための特殊な実装

   ```typescript
   /**
    * ブログ記事から構造化データを生成する
    * 以下の処理を行う：
    * 1. メタデータの正規化
    * 2. 記事コンテンツから説明文の抽出（最大140文字）
    * 3. 著者情報の付与
    * 4. 画像URLの正規化
    *
    * @param post - 記事データ
    * @returns BlogPosting型の構造化データ
    * @see https://developers.google.com/search/docs/data-types/article
    */
   ```

2. **中粒度コメントが適切な場合**：

   - ライブラリやフレームワークの拡張
   - 汎用的なユーティリティ関数
   - 複数の場所から参照される共通コンポーネント

   ```typescript
   /**
    * 日付を「YYYY-MM-DD」形式に変換する
    * @param date - 変換対象の日付
    * @returns 整形された日付文字列
    */
   ```

3. **低粒度（最小限）コメントで十分な場合**：

   - ゲッター/セッター
   - 単純なラッパー関数
   - 自己説明的な名前を持つシンプルな関数

   ```typescript
   /**
    * 日付が同じ日かどうかを判定する
    * @param dateA - 比較対象の日付
    * @param dateB - 比較対象の日付
    */
   function isSameDay(dateA: Date, dateB: Date): boolean {
     // 実装
   }
   ```

## TypeScriptとJSDocの適切な使い分け

TypeScriptは強力な型システムを提供し、コードの安全性と自己文書化に貢献する。JSDocはTypeScriptを補完し、型だけでは表現できない意図や使用方法を説明する。両者の特性を理解して適切に使い分けることで、冗長性を避けつつ高品質なドキュメントが実現できる。

### 情報の重複を避ける原則

1. **型情報の重複を避ける**

   ```typescript
   // 避けるべき冗長な例
   /**
    * @param user - User型のユーザーオブジェクト
    * @param id - number型のID
    * @returns boolean型の結果
    */
   function isAuthorized(user: User, id: number): boolean {
     // 実装
   }

   // 望ましい例
   /**
    * ユーザーが指定されたリソースにアクセス権を持っているか確認する
    * @param user - 検証対象のユーザー
    * @param id - アクセス対象のリソースID
    * @returns アクセス権がある場合はtrue
    */
   function isAuthorized(user: User, id: number): boolean {
     // 実装
   }
   ```

2. **TypeScriptが既に表現している情報を繰り返さない**

   ```typescript
   // 避けるべき冗長な例
   /**
    * ユーザーのリスト配列を取得する関数
    * @returns User型の配列
    */
   function getUsers(): User[] {
     // 実装
   }

   // 望ましい例
   /**
    * システムに登録された全アクティブユーザーを取得する
    * 管理者ユーザーは含まれない
    * @returns アクティブな一般ユーザーのリスト
    */
   function getUsers(): User[] {
     // 実装
   }
   ```

3. **複雑な型に対しては、型の構造ではなく意味を説明する**

   ```typescript
   // 避けるべき冗長な例
   /**
    * @param config - {apiKey: string, timeout: number, retries: number}の形式のオブジェクト
    */
   function initializeAPI(config: APIConfig): void {
     // 実装
   }

   // 望ましい例
   /**
    * API接続を初期化する
    * @param config - API設定。timeoutは秒単位、retriesは再試行回数
    */
   function initializeAPI(config: APIConfig): void {
     // 実装
   }
   ```

### TypeScriptでは表現しきれない情報をJSDocで補う

1. **値の制約条件や有効範囲**

   ```typescript
   /**
    * ページネーションのためのデータを取得する
    * @param page - ページ番号（1以上の整数）
    * @param limit - 1ページあたりの件数（最大100）
    * @throws pageが1未満の場合はエラーを投げる
    */
   function fetchPage(page: number, limit: number): Promise<PageData> {
     // 実装
   }
   ```

2. **非同期処理の副作用や挙動の説明**

   ```typescript
   /**
    * ユーザー情報を取得し、最終アクセス日時を更新する
    * 副作用: ユーザーの最終アクセス日時がDBで更新される
    * @param userId - ユーザーID
    */
   async function getUserAndUpdateLastAccess(userId: string): Promise<User> {
     // 実装
   }
   ```

3. **ビジネスロジックや計算の意味**

   ```typescript
   /**
    * 商品の税込価格を計算する
    * 計算式: 本体価格 + (本体価格 × 税率)
    * 端数は切り捨てられる
    * @param price - 本体価格
    * @param taxRate - 税率（例: 0.1 = 10%）
    */
   function calculatePriceWithTax(price: number, taxRate: number): number {
     // 実装
   }
   ```

### ドキュメントジェネレータとの連携を考慮する

1. **公開APIには完全なJSDocを記述する**

   ```typescript
   /**
    * ブログ記事のメタデータから構造化データを生成する
    * 構造化データはJSON-LDフォーマットで返される
    *
    * @param post - 記事データ
    * @returns JSON-LD形式の構造化データ
    * @example
    * const post = { title: 'タイトル', date: '2023-01-01', ... };
    * const jsonLd = getBlogPostingStructured(post);
    * // <script type="application/ld+json">{ ... }</script>
    */
   export function getBlogPostingStructured(post: PostProps): WithContext<BlogPosting> {
     // 実装
   }
   ```

2. **内部実装の詳細はコード内での理解を優先する**

   ```typescript
   /**
    * 記事リストをフィルタリングして返す内部ヘルパー関数
    * @private
    */
   function filterPostsByTag(posts: PostProps[], tag: string): PostProps[] {
     // 実装
   }
   ```

### まとめ: TypeScriptとJSDocの役割分担

| 情報の種類       | TypeScript                  | JSDoc                   | 推奨アプローチ                             |
| ---------------- | --------------------------- | ----------------------- | ------------------------------------------ |
| 型情報           | ✅ 型注釈で表現             | ❌ 重複させない         | `function process(data: UserData): Result` |
| 関数の目的       | ❌ 表現できない             | ✅ 説明に記述           | `/** ユーザーデータを処理する */`          |
| パラメータ名と型 | ✅ 型注釈で表現             | ❌ 型情報は重複させない | `@param data - 処理対象のデータ`           |
| 制約条件         | ❌ 限定的にしか表現できない | ✅ 詳細に記述           | `@param id - 正の整数のみ許容`             |
| 副作用           | ❌ 表現できない             | ✅ 説明に記述           | `副作用: DBが更新される`                   |
| 使用例           | ❌ 表現できない             | ✅ @exampleで示す       | `@example const result = process(data);`   |

## TODOコメント

TODOコメントは一時的な性質を持つ特殊なコメントであり、後で対応が必要な項目を記録するために使用する。具体的な情報を含め、対応期限がある場合は明記する。

```typescript
/**
 * @todo 2025-06-10: パフォーマンス最適化が必要。useCallback+useMemoの導入を検討する
 * 現在、大量のリストをレンダリングする際に遅延が発生している
 */
```

## インラインコメントの使用

シンプルな説明や、コードの特定部分の意図を示す場合はインラインコメントを使用する：

```typescript
// 無効なDateオブジェクトかどうかを確認
const isInvalidDate = (date: Date): boolean => {
  return Number.isNaN(date.getTime());
};
```

## コメントの更新

コードを変更する際は、関連するJSDocコメントも必ず更新する。古いコメントは誤解を招く可能性があるため、コードと一致していることを確認する。特にパラメータや戻り値の型が変更された場合は、JSDocの説明も更新する。

## まとめ

本プロジェクトでは実用性を重視しつつ、JSDocを積極的に活用し、以下の原則に従ってコメントを記述する：

- すべての公開関数・クラス・インターフェースにはJSDocを付与する
- 内部関数でも複雑なロジックを含む場合はJSDocを付与する
- JSDocでは最低限、機能の概要・パラメータ・戻り値を説明する
- 外部仕様や参考情報への参照は`@see`タグを使用する
- 使用例があると有用な場合は`@example`タグを活用する
- 型情報はTypeScriptの型注釈で表現し、JSDocでは型の意味や制約を説明する
- コメント粒度はコードの複雑さや重要度に応じて調整し、冗長性を避ける
