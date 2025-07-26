# スタイリング原則

本プロジェクトのPandaCSSを用いたスタイリングにおける、一貫性と品質を保つための原則とガイドラインを定義します。

## 1. デザイン哲学

- **一貫性を重視**: 全てのコンポーネントで一貫したデザイン言語を使用する
- **目的主導**: スタイルは見た目だけでなく、目的や機能を反映すべき
- **シンプルさ**: 複雑なスタイリングより、理解しやすいシンプルな実装を優先する
- **メンテナンス性**: 将来の変更や拡張を考慮した構造を設計する
- **パフォーマンス**: スタイルの適用がパフォーマンスに与える影響を考慮する

## 2. コンポーネント設計の原則

- **コンポーネントはマージンを持たない**: レイアウトはコンテナが制御する
- **単一責任**: 各コンポーネントは明確に定義された単一の役割を持つ
- **内部の余白のみ**: padding は内部に適用し、margin は外部から制御する
- **Composition over Configuration**: 設定の複雑化よりも、小さなコンポーネントの組み合わせを優先

### 実装例

```tsx
// 良い例: ゼロマージン原則に従ったコンポーネント
// Cardコンポーネントは内部パディングのみを持ち、外部マージンは持たない
export const Card = ({ children }: { children: React.ReactNode }) => (
  <div
    className={css`
      padding: 1rem;
      border-radius: 0.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      background-color: white;
    `}
  >
    {children}
  </div>
);

// 良い例: 外部でレイアウトを制御
<div
  className={css`
    display: grid;
    gap: 1rem;
  `}
>
  <Card>...</Card>
  <Card>...</Card>
</div>
```

## 3. 変数の活用

- **直接値の使用禁止**: カラー、サイズ、間隔などは直接値ではなく変数を使用する
- **意味を持つ変数**: 変数名は使用目的や意味を反映する（例: primary-color ではなく目的に応じた変数名）
- **一貫した命名規則**: 変数名は一貫した命名パターンに従う

### 実装例

```tsx
// 悪い例: 直接値の使用
const Button = ({ children }) => (
  <button
    className={css`
      background-color: #3182ce; // 直接値を使用
      padding: 10px 15px;      // 直接値を使用
      border-radius: 4px;      // 直接値を使用
      color: white;            // 直接値を使用
    `}
  >
    {children}
  </button>
);

// 良い例: トークンとスケールの使用
const Button = ({ children }) => (
  <button
    className={css`
      background-color: token(colors.primary.500);
      padding: token(spacing.3) token(spacing.4);
      border-radius: token(radii.md);
      color: token(colors.white);
    `}
  >
    {children}
  </button>
);
```

## 4. セレクターとスタイル構造

- **セレクターの複雑さを制限**: ネストは3階層以内に制限する
- **ステートは明示的に**: 状態変化は明確に定義し、複雑な組み合わせを避ける
- **擬似要素の命名**: 装飾用の擬似要素にはcontent属性で役割を明示する

## 5. レスポンシブデザイン原則

- **モバイルファースト**: 基本スタイルはモバイル向けに定義し、大きいサイズに拡張する
- **コンテナクエリの活用**: 要素の親コンテナサイズに応じたスタイル変更を優先する
- **ブレークポイントの統一**: 独自のブレークポイントを定義せず、定義済みメディアクエリを使用する

## 6. パフォーマンス原則

- **アニメーションは計算コストの低いプロパティを使用**: transform と opacity を優先
- **レンダリングをブロックするスタイルを最小化**: 複雑なレイアウト計算が必要なプロパティを制限
- **再フローを発生させるスタイルに注意**: 高頻度の変更には transform を使用

## 7. アクセシビリティ原則

- **コントラスト比の確保**: テキストと背景のコントラスト比はWCAG AAに準拠
- **フォーカス状態の視認性**: キーボード操作時のフォーカス状態を明確に表示
- **テキストサイズの柔軟性**: 固定サイズではなく相対単位（rem）を使用

### 実装例

```tsx
// 良い例: アクセシビリティを考慮したフォームコントロール
export const Input = ({ label, id, ...props }) => (
  <div
    className={css`
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    `}
  >
    <label
      htmlFor={id}
      className={css`
        font-size: 1rem;
        font-weight: 500;
        color: token(colors.gray.800);
      `}
    >
      {label}
    </label>
    <input
      id={id}
      className={css`
        padding: 0.5rem 0.75rem;
        border: 1px solid token(colors.gray.300);
        border-radius: 0.375rem;
        font-size: 1rem;
        transition: border-color 0.2s, box-shadow 0.2s;
        width: 100%;

        &:focus {
          border-color: token(colors.blue.500);
          box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.3);
          outline: none;
        }
      `}
      {...props}
    />
  </div>
);
```

## 8. コード品質

- **プロパティの順序**: 一貫した順序でプロパティを記述する
- **簡潔な表現**: 短いhex表記、ゼロ単位の省略などを一貫して使用
- **命名の一貫性**: 一貫した命名規則を使用する

## 9. ユーティリティの使用原則

- **共通パターンにはユーティリティを使用**: 繰り返しのスタイルパターンはユーティリティに抽出
- **ユーティリティは単一目的**: 1つのユーティリティは1つの明確な役割のみを持つ
- **コンポーネント固有のスタイルとユーティリティを分離**: 再利用可能なスタイルとコンポーネント固有のスタイルを明確に区別

### 実装例

```tsx
// PandaCSSのユーティリティスタイル定義
// src/ui/styled/patterns.ts
import { defineRecipe } from '@pandacss/dev'

export const cardRecipe = defineRecipe({
  className: 'card',
  base: {
    p: '4',
    borderRadius: 'md',
    boxShadow: 'sm',
    bg: 'white',
  },
  variants: {
    size: {
      sm: { p: '2', fontSize: 'sm' },
      md: { p: '4', fontSize: 'md' },
      lg: { p: '6', fontSize: 'lg' },
    },
    variant: {
      primary: { borderColor: 'blue.500', borderWidth: '1px' },
      secondary: { borderColor: 'gray.200', borderWidth: '1px' },
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'primary',
  },
})

// ユーティリティの使用
export const Card = ({ size, variant, children }) => (
  <div className={css({ card: { size, variant } })}>
    {children}
  </div>
);
```

## 10. コラボレーション原則

- **自己文書化コード**: 複雑なスタイルには目的や理由をコメントで説明
- **実験的なプロパティには代替案**: 最新のCSS機能を使用する場合は代替手段も提供
- **ブラウザ互換性**: サポート対象のブラウザリストを意識したスタイリング

### 互換性のベストプラクティス

```css
/* 悪い例: サポートが限定的なプロパティのみを使用 */
.container {
  display: grid;
  grid-template-columns: subgrid;
  aspect-ratio: 16/9;
  content-visibility: auto;
}

/* 良い例: フォールバックを含むプログレッシブエンハンスメント */
.container {
  /* 基本的なレイアウト（すべてのブラウザで動作） */
  display: block;
  width: 100%;
  height: auto;
  padding-top: 56.25%; /* 16:9のアスペクト比 */
  position: relative;
  
  /* モダンブラウザ用の拡張機能 */
  @supports (aspect-ratio: 16/9) {
    aspect-ratio: 16/9;
    padding-top: 0;
  }
  
  /* サポートされていればGridを使用 */
  @supports (display: grid) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
```

## 11. PandaCSSの推奨パターン

- **静的インポート**: `import { css, styled } from '@/ui/styled/static'` を使用
- **内部実装の隠蔽**: テーマやトークンの実装詳細を隠蔽し、使いやすいAPIを提供
- **レスポンシブ設計**: モバイルファーストアプローチと一貫したブレークポイント使用
- **パターン化**: 繰り返し使用される要素はレシピとして定義
