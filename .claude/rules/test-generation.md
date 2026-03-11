---
paths:
  - '**/*.test.{ts,tsx}'
---

# テスト生成の指示

## 技術スタック

- **テストフレームワーク**: Vitest
- **モック**: `vi.mock()` / `vi.fn()`
- **環境**: jsdom（DOM 操作用）

## 必須対象

- `export` された関数・クラス・メソッド
- 公開APIとして利用される機能

## 🔴 配置ルール（CRITICAL）

テストファイルは対象ファイルと同じディレクトリに配置する（コロケーション）。`__test__` ディレクトリは使用しない。

### 正しい配置例

```
src/
  components/
    Button/
      Button.tsx
      Button.test.tsx       ✅ 正しい
```

### 誤った配置例

```
src/
  components/
    Button/
      Button.tsx
      __tests__/
        Button.test.tsx     ❌ 禁止
```

### 例外

統合テストやE2Eテストは `tests/` や `e2e/` に配置可能。

## 必須ルール

1. **カバレッジ目標**: 80%以上（グローバルルール `~/.claude/rules/testing.md` に準拠）
2. **ファイル命名**: `src/utils/helper.ts` → `src/utils/helper.test.ts`
3. **AAA パターン**を守る
4. **テスト名は日本語**で「〜の場合、〜を返す」形式
5. **外部依存は必ずモック**する

## モック対象

- 外部 API 呼び出し
- ファイルシステムアクセス
- 時刻依存の処理（`vi.useFakeTimers` + `vi.setSystemTime`）

## 最小例

```typescript
it('空文字列の場合、nullを返す', () => {
  // Arrange
  const input = '';

  // Act
  const result = parseJson(input);

  // Assert
  expect(result).toBeNull();
});
```
