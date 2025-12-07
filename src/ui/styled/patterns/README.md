# Patterns

Panda CSS の [Patterns](https://panda-css.com/docs/concepts/patterns) を配置するディレクトリです。

## 概要

Patterns は、レイアウトパターンを定義するための機能です。Stack、Grid、Flexなどの一般的なレイアウトパターンを再利用可能な形で定義できます。

## 使用例

```typescript
// container.pattern.ts
import { definePattern } from '@pandacss/dev';

export const containerPattern = definePattern({
  description: 'Container pattern with max-width and centering',
  properties: {
    size: { type: 'enum', value: ['sm', 'md', 'lg', 'xl'] },
  },
  transform(props) {
    const { size = 'md', ...rest } = props;

    const sizes = {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    };

    return {
      maxWidth: sizes[size],
      marginX: 'auto',
      paddingX: '4',
      ...rest,
    };
  },
});
```

## panda.config.ts への登録

```typescript
import { containerPattern } from '@/ui/styled/patterns/container.pattern';

export default defineConfig({
  patterns: {
    extend: {
      container: containerPattern,
    },
  },
});
```

## 参考

- [Panda CSS - Patterns](https://panda-css.com/docs/concepts/patterns)
- [Panda CSS - Pattern Properties](https://panda-css.com/docs/concepts/patterns#pattern-properties)
