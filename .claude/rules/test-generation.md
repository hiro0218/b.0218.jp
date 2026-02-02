---
paths:
  - '**/*.test.{ts,tsx}'
---

# テスト生成の指示

## Priority Markers

> 優先度の定義については [CLAUDE.md](../../CLAUDE.md#priority-markers) を参照。

## 技術スタック

- **テストフレームワーク**: Vitest
- **モック**: `vi.mock()` / `vi.fn()`
- **環境**: jsdom（DOM 操作用）

## 必須対象

- `export` された関数・クラス・メソッド
- 公開APIとして利用される機能

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
