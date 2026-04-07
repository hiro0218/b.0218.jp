---
paths:
  - '**/*.ts'
  - '**/*.tsx'
---

# TypeScript Coding Style (ECC)

## Types and Interfaces

- 公開 API（export 関数、クラスメソッド）には明示的な型を付ける。ローカル変数は推論に任せる
- `interface`: 拡張・実装される可能性のあるオブジェクト型に使用
- `type`: union / intersection / tuple / mapped type に使用
- string literal union を `enum` より優先
- `any` 禁止。外部入力には `unknown` + narrowing

## React Props

- props は名前付き `interface` または `type` で定義
- コールバック props は明示的に型付け
- `React.FC` は使用しない

## Immutability

- スプレッド演算子で不変更新。直接のプロパティ代入は禁止
- 参照: グローバルルール `development.md` Immutability セクション

## Error Handling

- async/await + try-catch で `unknown` 型をキャッチし narrowing する
- 参照: グローバルルール `development.md` Error Handling Scope セクション

## Console.log

- production コードでの `console.log` 禁止。ロガーライブラリを使用
