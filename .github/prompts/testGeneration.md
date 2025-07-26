# テスト生成の指示

テストコードを生成する際、以下の規則と構造に従ってください。テストコードの品質と包括性はコードの信頼性と保守性に直結します。

## 技術スタック

- **テストフレームワーク**: Vitest
- **アサーション**: Vitest標準のexpect
- **モック**: `vi.mock()` および `vi.fn()`
- **環境**: jsdom（DOM操作のテスト用）

## 生成対象

### 必須テスト

- すべての`export`された関数・クラス・メソッド
- 公開APIとして使用される機能
- 複雑なビジネスロジックを含む処理

### テストケースの分類

1. **正常系**: 期待される入力での動作確認
   - 一般的な入力に対する期待通りの結果
   - 様々な有効な入力パターン
   - 例：`calculateTotal([100, 200, 300])`が`600`を返す

2. **異常系**: 不正な入力での例外処理確認
   - エラーメッセージの正確性
   - 例外の適切な捕捉
   - 例：`divide(10, 0)`が適切なエラーメッセージで例外をスロー

3. **境界値**: 最小・最大・空・null・undefinedでの動作
   - 空文字、空配列、ゼロなどの境界値
   - 最大値や最小値の受け入れ
   - 例：`parseQueryParams("")`が空のオブジェクトを返す

4. **エッジケース**: 特殊な条件下での動作
   - 予期しないデータ形式
   - タイミングに依存する動作
   - 競合状態の処理
   - 例：`fetchWithRetry()`がネットワークエラー後に再試行する

## コード構造ルール

### 1. ファイル命名

- テスト対象ファイル: `src/utils/helper.ts`
- テストファイル: `src/utils/helper.test.ts`

### 2. 必須パターン（AAA）

```typescript
// Arrange: テストデータの準備
const input = 'test data';
const expected = 'expected result';

// Act: テスト対象の実行
const result = targetFunction(input);

// Assert: 結果の検証
expect(result).toBe(expected);
```

### テスト技法とパターン

- **パラメータ化テスト**: 同じロジックで複数の入力値をテスト

```typescript
// パラメータ化テストの例
it.each([
  ['123', 123],
  ['0', 0],
  ['-10', -10],
  ['abc', NaN],  // 無効な入力のケース
])('parseNumber("%s")は%iを返す', (input, expected) => {
  expect(parseNumber(input)).toBe(expected);
});

// 別の例: 関数の挙動を様々な条件でテスト
describe('isValidEmail', () => {
  it.each([
    ['user@example.com', true],
    ['user.name+tag@example.co.jp', true],
    ['user@localhost', true],
    ['', false],
    ['user@', false],
    ['user@.com', false],
    [null, false],
    [undefined, false]
  ])('isValidEmail(%s)は%sを返す', (input, expected) => {
    expect(isValidEmail(input)).toBe(expected);
  });
});
```

- **アサーションの組み合わせ**: 複数の検証を行うケース

```typescript
it('新規ユーザー作成時、適切な初期値が設定される', () => {
  const user = createUser('test@example.com', 'Test User');
  
  expect(user.email).toBe('test@example.com');
  expect(user.name).toBe('Test User');
  expect(user.createdAt).toBeInstanceOf(Date);
  expect(user.isActive).toBe(true);
  expect(user.roles).toEqual(['user']);
});
```

### 3. テスト名の書き方

- 日本語で記述
- 「〜の場合、〜を返す」「〜のとき、〜になる」形式
- 具体的な条件と期待結果を明記
- テスト対象の機能・関数とテスト条件を含める

```typescript
// 良い例
it('parseJson: 有効なJSON形式の場合、パースされたオブジェクトを返す', () => { /* ... */ });
it('parseJson: 空文字列の場合、nullを返す', () => { /* ... */ });
it('parseJson: 無効なJSON形式の場合、例外をスローする', () => { /* ... */ });

// 避けるべき例
it('正常に動作する', () => { /* ... */ }); // 具体性が足りない
it('parseJsonのテスト', () => { /* ... */ }); // 何をテストしているか不明確
it('パースする', () => { /* ... */ }); // 条件と期待結果が不明確
```

### 4. モック化対象

- **外部API呼び出し**: fetch, axiosなどのネットワーク要求
  ```typescript
  // fetch のモック例
  vi.mock('node-fetch');
  import fetch from 'node-fetch';
  const mockFetch = fetch as unknown as jest.Mock;
  
  beforeEach(() => {
    mockFetch.mockClear();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: 'test' })
    });
  });
  ```

- **ファイルシステムアクセス**: fsモジュールなど
  ```typescript
  // fs のモック例
  vi.mock('fs/promises');
  import { readFile } from 'fs/promises';
  const mockReadFile = readFile as jest.Mock;
  
  beforeEach(() => {
    mockReadFile.mockResolvedValue(JSON.stringify({ key: 'value' }));
  });
  ```

- **データベース操作**: 実際のDBアクセスをモック化
  ```typescript
  // DB クライアントのモック例
  vi.mock('../database/client');
  import { dbClient } from '../database/client';
  
  beforeEach(() => {
    dbClient.query.mockResolvedValue({ rows: [{ id: 1, name: 'Test' }] });
  });
  ```

- **時刻依存の処理**: Date.now, new Date()など
  ```typescript
  // Date のモック例
  beforeEach(() => {
    const mockDate = new Date('2024-01-01T12:00:00Z');
    vi.spyOn(global, 'Date').mockImplementation(() => mockDate);
  });
  ```

- **ランダム値生成**: Math.random, crypto.randomUUIDなど
  ```typescript
  // Math.random のモック例
  const originalRandom = Math.random;
  beforeEach(() => {
    Math.random = vi.fn(() => 0.5);
  });
  afterEach(() => {
    Math.random = originalRandom;
  });
  ```

## 生成例

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { calculateSimilarity } from './similarity';

describe('calculateSimilarity', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('同じテキストの場合、1.0を返す', () => {
    // Arrange
    const text1 = 'テストテキスト';
    const text2 = 'テストテキスト';

    // Act
    const result = calculateSimilarity(text1, text2);

    // Assert
    expect(result).toBe(1.0);
  });

  it('空文字列の場合、0を返す', () => {
    // Arrange
    const text1 = '';
    const text2 = 'テスト';

    // Act
    const result = calculateSimilarity(text1, text2);

    // Assert
    expect(result).toBe(0);
  });

  it('nullが渡された場合、エラーをスローする', () => {
    // Arrange & Act & Assert
    expect(() => {
      calculateSimilarity(null, 'テスト');
    }).toThrow('Invalid input');
  });
});
```

### モックの例

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchArticleData } from './articleService';

// 外部API呼び出しのモック
vi.mock('node-fetch', () => ({
  default: vi.fn(),
}));

import fetch from 'node-fetch';
const mockFetch = fetch as jest.Mock;

describe('fetchArticleData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('APIリクエストが成功した場合、記事データを返す', async () => {
    // Arrange
    const mockResponse = {
      json: vi.fn().mockResolvedValue({ id: '123', title: 'テスト記事' }),
      ok: true,
    };
    mockFetch.mockResolvedValue(mockResponse);

    // Act
    const result = await fetchArticleData('123');

    // Assert
    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/articles/123');
    expect(result).toEqual({ id: '123', title: 'テスト記事' });
  });
  
  it('APIリクエストが失敗した場合、エラーをスローする', async () => {
    // Arrange
    const mockResponse = {
      ok: false,
      status: 404,
      statusText: 'Not Found',
    };
    mockFetch.mockResolvedValue(mockResponse);

    // Act & Assert
    await expect(fetchArticleData('999')).rejects.toThrow('記事が見つかりません: 404 Not Found');
    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/articles/999');
  });
  
  it('ネットワークエラーの場合、適切なエラーメッセージでリジェクトする', async () => {
    // Arrange
    mockFetch.mockRejectedValue(new Error('Network error'));

    // Act & Assert
    await expect(fetchArticleData('123')).rejects.toThrow('APIリクエスト中にエラーが発生しました: Network error');
  });
});
```

## 重要な注意事項

1. **分離性**: 各テストは独立して実行可能
   - テスト間でグローバル状態を共有しない
   - 毎回テスト前にmockを初期化
   - 例: テスト毎に `beforeEach` で初期化する
   ```typescript
   beforeEach(() => {
     vi.clearAllMocks();
     localStorage.clear();
     mockDb.reset();
   });
   ```

2. **高速性**: 外部依存は必ずモック化
   - ネットワーク通信をモック化
   - データベース呼び出しをモック化
   - 時間がかかる処理をモック化
   - 例: タイマーのモック化
   ```typescript
   it('1秒後にコールバックが実行される', () => {
     vi.useFakeTimers();
     const callback = vi.fn();
     
     setTimeout(callback, 1000);
     expect(callback).not.toHaveBeenCalled();
     
     vi.advanceTimersByTime(1000);
     expect(callback).toHaveBeenCalledTimes(1);
     
     vi.useRealTimers();
   });
   ```

3. **再現性**: 実行順序に依存しない
   - 各テストが互いに影響しないようにする
   - 環境変数やグローバル状態に依存しない
   - 例: テスト環境の独立性を保つ
   ```typescript
   // 悪い例
   let sharedState = {};
   
   it('値を設定する', () => {
     sharedState.value = 'test';
     expect(sharedState.value).toBe('test');
   });
   
   it('値を確認する', () => {
     // 前のテストに依存している
     expect(sharedState.value).toBe('test');
   });
   
   // 良い例
   it('値を設定して確認する', () => {
     const state = {};
     state.value = 'test';
     expect(state.value).toBe('test');
   });
   ```

4. **可読性**: テスト名と内容で何をテストしているか明確
   - テスト名は具体的でわかりやすく
   - AAAパターンを守って構造化されている
   - アサーションが明確
   - 複雑なテストの場合はコメントを追加する
   ```typescript
   it('商品検索: フィルター条件に一致する商品のみを返す', () => {
     // Arrange
     const products = [
       { id: 1, name: 'Product A', category: 'Electronics', price: 1000 },
       { id: 2, name: 'Product B', category: 'Books', price: 500 },
       { id: 3, name: 'Product C', category: 'Electronics', price: 2000 }
     ];
     const filters = { category: 'Electronics', maxPrice: 1500 };
     
     // Act
     const result = filterProducts(products, filters);
     
     // Assert
     expect(result).toHaveLength(1);
     expect(result[0].id).toBe(1);
   });
   ```

5. **網羅性**: エッジケースも含めて網羅的にテスト
   - 成功パス、失敗パス、特殊なケースを網羅
   - 境界値に特に注意する
   - 例: 数値の境界値テスト
   ```typescript
   describe('validateAge', () => {
     it('18歳以上の場合、trueを返す', () => {
       expect(validateAge(18)).toBe(true);
       expect(validateAge(19)).toBe(true);
       expect(validateAge(100)).toBe(true);
     });
     
     it('18歳未満の場合、falseを返す', () => {
       expect(validateAge(17)).toBe(false);
       expect(validateAge(0)).toBe(false);
     });
     
     it('無効な入力の場合、エラーをスローする', () => {
       expect(() => validateAge(-1)).toThrow();
       expect(() => validateAge(null)).toThrow();
     });
   });
   ```
