---
description: "Panda CSS スタイリング規約とゼロマージン原則"
applyTo: "**/{ui,components}/**/*.{ts,tsx}"
---

# Panda CSS スタイリング規約

このファイルは、スタイリング実装時に自動的に適用される規約を定義します。

## Import規則

```typescript
// **RECOMMENDED**: プロジェクト統一import
import { css, styled, cx } from '@/ui/styled';

// **FORBIDDEN**: 直接import
import { css } from '~/styled-system/css';
```

**理由**: `@/ui/styled`は統一されたエントリーポイントです。

## CSS変数の使用（必須）

### 色

```typescript
// **RECOMMENDED**: CSS変数使用
color: var(--colors-gray-900);
background-color: var(--colors-blue-a-50);

// **FORBIDDEN**: 直接値
color: '#1a1a1a';
background-color: 'rgba(59, 130, 246, 0.1)';
```

### スペーシング

```typescript
// **RECOMMENDED**: スペーシング変数
padding: var(--spacing-4);
gap: var(--spacing-2);
margin: 0;  // ゼロのみ許可

// **FORBIDDEN**: 直接値
padding: '2rem';
gap: '16px';
margin: '1rem';  // **FORBIDDEN** マージンは基本的に禁止
```

### フォント

```typescript
// **RECOMMENDED**: フォント変数
font-size: var(--font-sizes-md);
line-height: var(--line-heights-md);
font-weight: var(--font-weights-bold);

// **FORBIDDEN**: 直接値
font-size: '1rem';
line-height: 1.5;
font-weight: 700;
```

## ゼロマージン原則（厳格）

### UIコンポーネントの制約

```typescript
// **CORRECT**: 内部スペーシングのみ
export const Alert = styled.div`
  padding: var(--spacing-3);
  border-radius: var(--radii-8);

  // 子要素のマージンリセットは許可
  & > * {
    margin: 0;
  }
`;

// **FORBIDDEN**: 外部マージン
export const Alert = styled.div`
  margin: var(--spacing-4);  // **FORBIDDEN**
  margin-bottom: var(--spacing-2);  // **FORBIDDEN**
  margin: 0 auto;  // **FORBIDDEN** センタリングも禁止
  padding: var(--spacing-3);
`;
```

### レイアウトは親が制御

```typescript
// ✅ 親コンポーネント（Page層/App層）でレイアウト
<Stack space={4}>
  <Alert type="note" />
  <Alert type="warning" />
</Stack>

// または
<div className={css`
  display: grid;
  gap: var(--spacing-4);
`}>
  <Alert type="note" />
  <Alert type="warning" />
</div>
```

## レスポンシブデザイン

```typescript
// **RECOMMENDED**: オブジェクト記法
const styles = css`
  font-size: {
    base: var(--font-sizes-sm),
    md: var(--font-sizes-md),
    lg: var(--font-sizes-lg)
  };
  padding: {
    base: var(--spacing-2),
    md: var(--spacing-4)
  };
`;

// **ALTERNATIVE** (複雑な場合のみ): メディアクエリ直接記述
const styles = css`
  font-size: var(--font-sizes-sm);

  @media (min-width: 768px) {
    font-size: var(--font-sizes-md);
  }

  @media (min-width: 1024px) {
    font-size: var(--font-sizes-lg);
  }
`;
```

## パフォーマンス考慮

```typescript
// **RECOMMENDED**: パフォーマンスの良いプロパティ
const animation = css`
  transition: transform 0.2s, opacity 0.2s;  // transform/opacityのみ
`;

// **AVOID**: レイアウトを引き起こすプロパティ
const animation = css`
  transition: width 0.2s, height 0.2s;  // reflow発生
`;
```

## アクセシビリティ

### フォーカス状態

```typescript
// **RECOMMENDED**: box-shadow使用（border-radiusに従う）
const button = css`
  border-radius: var(--radii-8);

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--colors-blue-a-300);
  }
`;

// **AVOID**: outline使用（Safariでborder-radiusを無視）
const button = css`
  &:focus-visible {
    outline: 3px solid var(--colors-blue-500);  // **AVOID**
  }
`;
```

### タッチデバイス対応

```typescript
// **RECOMMENDED**: ホバー状態はポインタデバイスのみ
const link = css`
  color: var(--colors-blue-600);

  @media (hover: hover) {
    &:hover {
      color: var(--colors-blue-700);
    }
  }
`;

// **AVOID**: タッチデバイスでもホバー状態が表示される
const link = css`
  &:hover {
    color: var(--colors-blue-700);  // タッチ時にちらつく
  }
`;
```

## Styled Components記法

```typescript
// **RECOMMENDED**: テンプレートリテラル記法
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  padding: var(--spacing-6);
`;

// **ALTERNATIVE** (複雑な条件がある場合のみ): オブジェクト記法
const Container = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-4)',
  },
  variants: {
    size: {
      sm: { padding: 'var(--spacing-2)' },
      md: { padding: 'var(--spacing-4)' },
      lg: { padding: 'var(--spacing-6)' },
    },
  },
});
```

## 禁止事項

### 1. マジックナンバー

```typescript
// **FORBIDDEN**
min-width: 20px;
height: 300px;
border: 1px solid;

// **RECOMMENDED**: 変数化
min-width: var(--spacing-2½);
height: var(--sizes-container-small);
border-width: var(--border-widths-1);
```

### 2. !important の乱用

```typescript
// **AVOID**
color: var(--colors-red-500) !important;

// **RECOMMENDED**: セレクタ詳細度を調整
.parent .child {
  color: var(--colors-red-500);
}
```

### 3. グローバルスタイルの競合

```typescript
// **FORBIDDEN**: グローバルに影響
div {
  margin: 0;
}

// **RECOMMENDED**: スコープを限定
const Container = styled.div`
  & > div {
    margin: 0;
  }
`;
```

## 詳細ガイドライン

より詳細なUI/UXガイドラインは`web-interface-guidelines.md`を参照してください：

- インタラクティブ要素の設計
- タイポグラフィ
- モーション設計
- タッチデバイス対応
- パフォーマンス最適化
