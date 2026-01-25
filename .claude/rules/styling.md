---
description: 'Panda CSS スタイリング規則と Zero Margin Principle'
applyTo: '**/{ui,components}/**/*.{ts,tsx}'
paths:
  - '**/ui/**/*.{ts,tsx}'
  - '**/components/**/*.{ts,tsx}'
---

# Panda CSS スタイリング規則

このファイルは、実装時に自動的に適用されるスタイリング規約を定義する。

## Priority Markers

> See [CLAUDE.md - Priority Levels](../CLAUDE.md#priority-levels) for marker definitions.

> **📌 このファイルについて**: これは CLAUDE.md の詳細ガイドです。優先順位と概要については、[CLAUDE.md - Critical Rules](../CLAUDE.md#critical-rules-must-follow) を参照してください。

## 🔴 Import ルール (CRITICAL)

```tsx
// ✅ 推奨: プロジェクト統一 import
import { css, styled, cx } from '@/ui/styled';

// ❌ 禁止: 直接 import
import { css } from '~/styled-system/css';
```

**理由**: `@/ui/styled` が統一エントリーポイントである。

## 🔴 Hover States (CRITICAL)

### 正しい方法: `:hover` を直接記述

> **WHY**: PostCSS プラグインが自動的に `:hover` を `@media (any-hover: hover)` でラップする。手動でラップすると二重ラップが発生し、タッチデバイスで動作が壊れる。実際に、手動ラップによってタッチデバイスでホバーが機能しなくなった事例がある。

`postcss-media-hover-any-hover` プラグインは、タッチデバイス検出のためにホバー状態を**自動的にラップ**する。

```tsx
// ✅ 正しい - プラグインが @media ラップを処理
const Button = styled.button`
  background: var(--colors-blue-500);

  &:hover {
    background: var(--colors-blue-600);
  }
`;
```

**生成される CSS** (自動):

```css
.button {
  background: var(--colors-blue-500);
}

@media (any-hover: hover) {
  .button:hover {
    background: var(--colors-blue-600);
  }
}
```

### 誤った方法: 手動 @media ラップ

```tsx
// ❌ 誤り - 冗長、プラグインが自動で行う
const Link = styled.a`
  color: var(--colors-blue-600);

  @media (any-hover: hover) {
    &:hover {
      color: var(--colors-blue-700);
    }
  }
`;
```

**なぜ誤りか**: PostCSS プラグイン (`postcss-media-hover-any-hover`) が自動的に `:hover` 状態を `@media (any-hover: hover)` でラップします。手動で書くと冗長であり、二重ラップ問題を引き起こす可能性があります。

## 🔴 CSS Variables (CRITICAL)

> **WHY**: CSS 変数によりデザイントークンの一貫性が保たれ、テーマ変更が容易になります。直接値を使用すると、デザインシステム変更時に大規模な編集が必要になります。

### Colors

```tsx
// ✅ 推奨: CSS 変数
color: var(--colors-gray-900);
background-color: var(--colors-blue-a-50);

// ❌ 禁止: 直接値
color: '#1a1a1a';
background-color: 'rgba(59, 130, 246, 0.1)';
```

### Spacing

```tsx
// ✅ 推奨: Spacing 変数
padding: var(--spacing-4);
gap: var(--spacing-2);
margin: 0;  // Zero のみ

// ❌ 禁止: 直接値
padding: '2rem';
gap: '16px';
margin: '1rem';  // ❌ Margin は一般的に禁止
```

### Fonts

```tsx
// ✅ 推奨: Font 変数
font-size: var(--font-sizes-md);
line-height: var(--line-heights-md);
font-weight: var(--font-weights-bold);

// ❌ 禁止: 直接値
font-size: '1rem';
line-height: 1.5;
font-weight: 700;
```

### 利用可能な CSS Variables

**Colors**:

- `var(--colors-gray-1)` to `var(--colors-gray-12)` - グレースケール
- `var(--colors-gray-a-1)` to `var(--colors-gray-a-12)` - アルファ付きグレースケール
- `var(--colors-blue-500)`, `var(--colors-red-500)`, etc. - セマンティックカラー

**Spacing**:

- `var(--spacing-1)` to `var(--spacing-12)` - Spacing スケール

**Radii**:

- `var(--radii-sm)`, `var(--radii-md)`, `var(--radii-lg)` - Border radius

**Typography**:

- `var(--font-sizes-xs)` to `var(--font-sizes-3xl)` - フォントサイズ
- `var(--line-heights-tight)`, `var(--line-heights-normal)`, etc. - 行の高さ

## 🔴 Zero Margin Principle (CRITICAL)

> **詳細**: 完全な説明と例については、[components.md - Zero Margin Principle](./components.md#-zero-margin-principle-critical) を参照してください。

### 概要

UI コンポーネントは自身の外部マージンを設定してはならない。親コンポーネントが間隔を制御する。

```tsx
// ✅ 正しい: 外部マージンなし
export const Alert = styled.div`
  padding: var(--spacing-3);
  border-radius: var(--radii-8);
`;

// ✅ 親がレイアウトを制御
<Stack space={4}>
  <Alert type="note" />
  <Alert type="warning" />
</Stack>;
```

**詳細、例、根拠については**: [components.md - Zero Margin Principle](./components.md#-zero-margin-principle-critical)

## 🔴 Dynamic Styling with CSS Variables (CRITICAL)

> **WHY**: Panda CSS は**ビルド時の静的コンパイル**を使用します。ランタイムの動的な値 (props) は `css` テンプレートリテラル内に直接埋め込めません。動的スタイルを適用するには CSS 変数を使用する必要があります。

### 制約: 静的コンパイル

Panda CSS は `css` テンプレートリテラルを**ビルド時**に静的 CSS へコンパイルします。これは、ランタイムでスタイルを処理する他の CSS-in-JS ライブラリ (styled-components/Emotion) とは異なります。

```tsx
// ❌ 動作しない - Panda CSS はランタイム値を埋め込めない
const Component = ({ value }: { value: number }) => (
  <div
    className={css`
      property: var(--spacing-${value}); // ❌ value はランタイム変数
    `}
  />
);

// ✅ 正しい - CSS 変数を使用してランタイム値を渡す
const Component = ({ value }: { value: number }) => {
  const style = { '--my-property': `var(--spacing-${value})` } as CSSProperties;

  return (
    <div
      className={css`
        property: var(--my-property); // ✅ 静的な CSS 変数参照
      `}
      style={style}
    />
  );
};
```

### パターン: 動的な値のための CSS Variables

**Step 1**: CSS 変数プレースホルダーで静的 CSS を定義

```tsx
const componentStyle = css`
  display: flex;
  gap: var(--component-gap); // CSS 変数への静的参照
  justify-content: flex-start;
`;
```

**Step 2**: インラインスタイルでランタイム値を渡す

```tsx
export function Component({ gap = 1 }: { gap: number }) {
  // CSS 変数経由でランタイム値を渡す
  const style = { '--component-gap': `var(--spacing-${gap})` } as CSSProperties;

  return (
    <div className={componentStyle} style={style}>
      ...
    </div>
  );
}
```

### なぜ直接値はダメなのか?

```tsx
// ❌ アンチパターン - Panda CSS で壊れる
const MyComponent = ({ value }: { value: number }) => {
  // Panda CSS はビルド時にコンパイルする
  // `value` はビルド時に不明
  return (
    <div
      className={css`
        property: ${value}px; // ❌ value はランタイム、ビルド時定数ではない
      `}
    />
  );
};
```

**なぜ失敗するか**:

1. Panda CSS は **webpack/vite ビルド** 時に `css` テンプレートリテラルを処理
2. Props は **ランタイム値** (コンポーネントレンダリング時にのみ判明)
3. ビルド時の静的コンパイルはランタイム値にアクセスできない
4. 結果: CSS は実際の値ではなく、リテラル `${value}px` 文字列で生成される

### 他の CSS-in-JS との比較

| ライブラリ        | コンパイル   | 動的 Props    | CSS Variables 必須?            |
| ----------------- | ------------ | ------------- | ------------------------------ |
| **Panda CSS**     | ビルド時静的 | ❌ 非サポート | ✅ はい (動的値用)             |
| styled-components | ランタイム   | ✅ サポート   | ❌ いいえ (props を直接使用可) |
| Emotion           | ランタイム   | ✅ サポート   | ❌ いいえ (props を直接使用可) |

```tsx
// styled-components/Emotion (ランタイム)
const Button = styled.button<{ $value: number }>`
  property: ${(props) => props.$value}px; // ✅ 動作する (ランタイム補間)
`;

// Panda CSS (ビルド時)
const buttonStyle = css`
  property: ${value}px; // ❌ 失敗 (ランタイム補間なし)
  property: var(--my-property); // ✅ 動作する (CSS 変数)
`;
```

### ドキュメント要件

動的な値に CSS 変数を使用する場合、制約を説明するコメントを追加してください:

```tsx
/**
 * 動的スタイリングを持つコンポーネント
 *
 * @note Panda CSS は静的コンパイルを使用するため、動的 props は
 *       直接補間ではなく CSS 変数経由で渡す必要があります。
 */
const componentStyle = css`
  property: var(--component-property); // CSS 変数経由でランタイム props
`;

export function Component({ value }: Props) {
  // Panda CSS 制約: CSS 変数経由でランタイム値
  const style = { '--component-property': `var(--spacing-${value})` } as CSSProperties;
  return (
    <div className={componentStyle} style={style}>
      ...
    </div>
  );
}
```

### よくある間違い

#### 間違い 1: props を補間しようとする

```tsx
// ❌ 誤り - Panda CSS では props を補間できない
const Component = ({ color }: { color: string }) => (
  <div
    className={css`
      color: ${color};
    `}
  />
);

// ✅ 正しい - CSS 変数を使用
const Component = ({ color }: { color: string }) => {
  const style = { '--my-color': color } as CSSProperties;
  return (
    <div
      className={css`
        color: var(--my-color);
      `}
      style={style}
    />
  );
};
```

#### 間違い 2: ランタイムコンパイルを仮定

```tsx
// ❌ 誤り - Panda CSS はビルド時、ランタイムではない
const getStyle = (size: 'sm' | 'md' | 'lg') => {
  return css`
    property: ${size === 'sm' ? '0.5rem' : '1rem'};
  `; // 動作しない
};

// ✅ 正しい - 条件付きクラス適用を使用
const styleClasses = {
  sm: css`
    property: 0.5rem;
  `,
  md: css`
    property: 1rem;
  `,
  lg: css`
    property: 1.5rem;
  `,
};

const Component = ({ size }: { size: 'sm' | 'md' | 'lg' }) => <div className={styleClasses[size]} />;
```

## 基本的な使用方法

### `css` によるインラインスタイル

```tsx
import { css } from '@/ui/styled';

export const Component = () => (
  <div
    className={css`
      background: var(--colors-gray-a-3);
      padding: var(--spacing-2);
      border-radius: var(--radii-md);
    `}
  >
    Content
  </div>
);
```

### Styled Components

```tsx
import { styled } from '@/ui/styled';

const StyledButton = styled.button`
  padding: var(--spacing-2) var(--spacing-4);
  background: var(--colors-blue-500);
  color: white;
  border-radius: var(--radii-sm);

  &:hover {
    background: var(--colors-blue-600);
  }
`;

export const Button = ({ children }: ButtonProps) => <StyledButton>{children}</StyledButton>;
```

## 🟡 レスポンシブデザイン (IMPORTANT)

```tsx
// ✅ 推奨: モバイルファーストアプローチ
const ResponsiveCard = styled.div`
  padding: var(--spacing-2);

  @media (min-width: 768px) {
    padding: var(--spacing-4);
  }

  @media (min-width: 1024px) {
    padding: var(--spacing-6);
  }
`;
```

**モバイルファーストアプローチ** が推奨されます。

## 🟡 パフォーマンス考慮事項 (IMPORTANT)

```tsx
// ✅ 推奨: パフォーマンスに優しいプロパティ
const animation = css`
  transition:
    transform 0.2s,
    opacity 0.2s; // transform/opacity のみ
`;

// ❌ 避ける: リフローを引き起こすプロパティ
const animation = css`
  transition:
    width 0.2s,
    height 0.2s; // リフローを引き起こす
`;
```

## 🟡 アクセシビリティ (IMPORTANT)

### Focus States

```tsx
// ✅ 推奨: box-shadow を使用 (border-radius を尊重)
const button = css`
  border-radius: var(--radii-8);

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 var(--spacing-1) var(--colors-blue-a-300);
  }
`;

// ❌ 避ける: outline を使用 (Safari が border-radius を無視)
const button = css`
  &:focus-visible {
    outline: 3px solid var(--colors-blue-500); // ❌ 避ける
  }
`;
```

## ⚪ 一般的なパターン (RECOMMENDED)

### 条件付きスタイル

```tsx
const Button = styled.button<{ variant: 'primary' | 'secondary' }>`
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radii-sm);

  ${(props) =>
    props.variant === 'primary' &&
    `
    background: var(--colors-blue-500);
    color: white;
  `}

  ${(props) =>
    props.variant === 'secondary' &&
    `
    background: var(--colors-gray-200);
    color: var(--colors-gray-900);
  `}
`;
```

### ネストされたセレクター

```tsx
const Card = styled.div`
  padding: var(--spacing-4);
  display: grid;
  gap: var(--spacing-2);

  h2 {
    font-size: var(--font-sizes-2xl);
  }

  p {
    color: var(--colors-gray-11);
  }
`;
```

### 疑似要素

```tsx
const Divider = styled.div`
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: var(--colors-gray-a-6);
  }
`;
```

## 設定ファイル

### `~/panda.config.mts` を変更する前に

**必ずファイルを先に読んで以下を理解すること**：

- 既存のデザイントークン
- テーマ設定
- カスタムユーティリティ

**変更例**：

- 新しいカラートークンの追加
- カスタムスペーシング値の定義
- 新しいデザインパターンの作成

### `~/postcss.config.cjs` を変更する前に

**必ずファイルを先に読んで以下を理解すること**：

- PostCSS プラグインの設定
- `postcss-media-hover-any-hover` の設定
- カスタムメディアクエリ

**変更例**：

- 新しい PostCSS プラグインの追加
- hover 検出設定の変更
- カスタム変換の設定

## 禁止事項

### 1. マジックナンバー

```tsx
// ❌ 禁止
min-width: 20px;
height: 300px;
border: 1px solid;

// ✅ 推奨: 変数を使用
min-width: var(--spacing-5);
height: var(--sizes-container-small);
border-width: var(--border-widths-1);
```

### 2. !important の乱用

```tsx
// ❌ 避ける
color: var(--colors-red-500) !important;

// ✅ 推奨: セレクターの詳細度を調整
.parent .child {
  color: var(--colors-red-500);
}
```

### 3. グローバルスタイルの競合

```tsx
// ❌ 禁止: グローバルに影響
div {
  margin: 0;
}

// ✅ 推奨: スコープを限定
const Container = styled.div`
  & > div {
    margin: 0;
  }
`;
```

## 検証チェックリスト

スタイリング変更をコミットする前に：

- [ ] `@/ui/styled` import を使用していること
- [ ] Hover States が手動の `@media` ラッピングなしで記述されていること
- [ ] 色、スペーシング、その他のトークンに CSS 変数を使用していること
- [ ] コンポーネントに外部マージンがないこと
- [ ] レスポンシブスタイルがモバイルファーストアプローチに従っていること
- [ ] 設定ファイルの変更が意図的でドキュメント化されていること
- [ ] マジックナンバーやハードコードされた値がないこと
- [ ] Focus States が `outline` の代わりに `box-shadow` を使用していること
