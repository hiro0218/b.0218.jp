# Recipes

Panda CSS の [Recipes](https://panda-css.com/docs/concepts/recipes) を配置するディレクトリです。

## 概要

Recipes は、コンポーネントのバリアントを定義するための機能です。複数のスタイルバリアントを持つコンポーネントを簡単に作成できます。

## 使用例

```typescript
// button.recipe.ts
import { defineRecipe } from '@pandacss/dev';

export const buttonRecipe = defineRecipe({
  className: 'button',
  description: 'Button component styles',
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  variants: {
    visual: {
      solid: { bg: 'blue.500', color: 'white' },
      outline: { borderWidth: '1px', borderColor: 'blue.500' },
    },
    size: {
      sm: { px: '3', py: '1', fontSize: 'sm' },
      md: { px: '4', py: '2', fontSize: 'md' },
      lg: { px: '6', py: '3', fontSize: 'lg' },
    },
  },
  defaultVariants: {
    visual: 'solid',
    size: 'md',
  },
});
```

## panda.config.ts への登録

```typescript
import { buttonRecipe } from '@/ui/styled/recipes/button.recipe';

export default defineConfig({
  theme: {
    extend: {
      recipes: {
        button: buttonRecipe,
      },
    },
  },
});
```

## 参考

- [Panda CSS - Recipes](https://panda-css.com/docs/concepts/recipes)
- [Panda CSS - Slot Recipes](https://panda-css.com/docs/concepts/slot-recipes)
