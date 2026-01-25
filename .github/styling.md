---
description: 'Panda CSS styling rules and zero-margin principle'
applyTo: '**/{ui,components}/**/*.{ts,tsx}'
---

# Panda CSS Styling Rules

This file defines styling conventions automatically applied during implementation.

## Priority Markers

- 🔴 **CRITICAL**: Must Follow (violations cause severe errors)
- 🟡 **IMPORTANT**: Should Follow (maintenance/quality may degrade)
- ⚪ **RECOMMENDED**: Best Practices (consistency improvement)

> **📌 About this file**: This is a detailed guide for CLAUDE.md. For priorities and the overview, see [CLAUDE.md - Critical Rules](../../CLAUDE.md#critical-rules-must-follow).

## 🔴 Import Rules (CRITICAL)

```tsx
// ✅ Recommended: Project-unified import
import { css, styled, cx } from '@/ui/styled';

// ❌ Forbidden: Direct import
import { css } from '~/styled-system/css';
```

**Reason**: `@/ui/styled` is the unified entry point.

## 🔴 Hover States (CRITICAL)

### Correct: Write `:hover` directly

> **WHY**: The PostCSS plugin automatically wraps `:hover` with `@media (any-hover: hover)`. Manual wrapping causes double wrapping and breaks behavior on touch devices. There has been a real incident where manual wrapping prevented hover from working on touch devices.

The `postcss-media-hover-any-hover` plugin **automatically wraps** hover states for touch device detection.

```tsx
// ✅ Correct - Plugin handles @media wrapping
const Button = styled.button`
  background: var(--colors-blue-500);

  &:hover {
    background: var(--colors-blue-600);
  }
`;
```

**Generated CSS** (automatic):

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

### Incorrect: Manual @media wrapping

```tsx
// ❌ Incorrect - Redundant, plugin does this automatically
const Link = styled.a`
  color: var(--colors-blue-600);

  @media (any-hover: hover) {
    &:hover {
      color: var(--colors-blue-700);
    }
  }
`;
```

**Why this is wrong**: The PostCSS plugin (`postcss-media-hover-any-hover`) automatically wraps `:hover` states with `@media (any-hover: hover)`. Writing it manually is redundant and may cause double-wrapping issues.

## 🔴 CSS Variables (CRITICAL)

> **WHY**: CSS variables keep design tokens consistent and make theme changes easier. Using direct values causes large-scale edits when the design system changes.

### Colors

```tsx
// ✅ Recommended: CSS variables
color: var(--colors-gray-900);
background-color: var(--colors-blue-a-50);

// ❌ Forbidden: Direct values
color: '#1a1a1a';
background-color: 'rgba(59, 130, 246, 0.1)';
```

### Spacing

```tsx
// ✅ Recommended: Spacing variables
padding: var(--spacing-4);
gap: var(--spacing-2);
margin: 0;  // Zero only

// ❌ Forbidden: Direct values
padding: '2rem';
gap: '16px';
margin: '1rem';  // ❌ Margin is generally forbidden
```

### Fonts

```tsx
// ✅ Recommended: Font variables
font-size: var(--font-sizes-md);
line-height: var(--line-heights-md);
font-weight: var(--font-weights-bold);

// ❌ Forbidden: Direct values
font-size: '1rem';
line-height: 1.5;
font-weight: 700;
```

### Available CSS Variables

**Colors**:

- `var(--colors-gray-1)` to `var(--colors-gray-12)` - Grayscale
- `var(--colors-gray-a-1)` to `var(--colors-gray-a-12)` - Grayscale with alpha
- `var(--colors-blue-500)`, `var(--colors-red-500)`, etc. - Semantic colors

**Spacing**:

- `var(--spacing-1)` to `var(--spacing-12)` - Spacing scale

**Radii**:

- `var(--radii-sm)`, `var(--radii-md)`, `var(--radii-lg)` - Border radius

**Typography**:

- `var(--font-sizes-xs)` to `var(--font-sizes-3xl)` - Font sizes
- `var(--line-heights-tight)`, `var(--line-heights-normal)`, etc. - Line heights

## 🔴 Zero Margin Principle (CRITICAL)

> **Details**: For details, see [components.md - Zero Margin Principle](./components.md#zero-margin-principle-critical).

### UI Component Constraints

```tsx
// ✅ Correct: Internal spacing only
export const Alert = styled.div`
  padding: var(--spacing-3);
  border-radius: var(--radii-8);

  // Resetting child element margins is allowed
  & > * {
    margin: 0;
  }
`;

// ❌ Forbidden: External margin
export const Alert = styled.div`
  margin: var(--spacing-4); // ❌ Forbidden
  margin-bottom: var(--spacing-2); // ❌ Forbidden
  margin: 0 auto; // ❌ Centering is also forbidden
  padding: var(--spacing-3);
`;
```

### Layout is Controlled by Parent

```tsx
// ✅ Parent component (Page/App layer) controls layout
<Stack space={4}>
  <Alert type="note" />
  <Alert type="warning" />
</Stack>

// Or
<div className={css`
  display: grid;
  gap: var(--spacing-4);
`}>
  <Alert type="note" />
  <Alert type="warning" />
</div>
```

**Why no margins**: Components should not dictate their own positioning. This makes them more reusable and prevents layout bugs. For details, see [components.md](./components.md#zero-margin-principle-critical).

## 🔴 Dynamic Styling with CSS Variables (CRITICAL)

> **WHY**: Panda CSS uses **static compilation** at build time. Runtime dynamic values (props) cannot be directly embedded in `css` template literals. CSS variables must be used to apply dynamic styles.

### Constraint: Static Compilation

Panda CSS compiles `css` template literals to static CSS at **build time**, unlike other CSS-in-JS libraries (styled-components/Emotion) that process styles at runtime.

```tsx
// ❌ DOES NOT WORK - Panda CSS cannot embed runtime values
const Component = ({ value }: { value: number }) => (
  <div
    className={css`
      property: var(--spacing-${value}); // ❌ value is a runtime variable
    `}
  />
);

// ✅ CORRECT - Use CSS variables to pass runtime values
const Component = ({ value }: { value: number }) => {
  const style = { '--my-property': `var(--spacing-${value})` } as CSSProperties;

  return (
    <div
      className={css`
        property: var(--my-property); // ✅ Static CSS variable reference
      `}
      style={style}
    />
  );
};
```

### Pattern: CSS Variables for Dynamic Values

**Step 1**: Define static CSS with CSS variable placeholders

```tsx
const componentStyle = css`
  display: flex;
  gap: var(--component-gap); // Static reference to CSS variable
  justify-content: flex-start;
`;
```

**Step 2**: Pass runtime values via inline styles

```tsx
export function Component({ gap = 1 }: { gap: number }) {
  // Runtime value passed via CSS variable
  const style = { '--component-gap': `var(--spacing-${gap})` } as CSSProperties;

  return (
    <div className={componentStyle} style={style}>
      ...
    </div>
  );
}
```

### Why NOT Direct Values?

```tsx
// ❌ ANTI-PATTERN - Breaks with Panda CSS
const MyComponent = ({ value }: { value: number }) => {
  // Panda CSS compiles this at BUILD time
  // `value` is unknown at build time
  return (
    <div
      className={css`
        property: ${value}px; // ❌ value is runtime, not build-time constant
      `}
    />
  );
};
```

**Why this fails**:

1. Panda CSS processes `css` template literals during **webpack/vite build**
2. Props are **runtime values** (only known when component renders)
3. Build-time static compilation cannot access runtime values
4. Result: CSS is generated with literal `${value}px` string, not actual values

### Comparison with Other CSS-in-JS

| Library           | Compilation       | Dynamic Props    | CSS Variables Required?        |
| ----------------- | ----------------- | ---------------- | ------------------------------ |
| **Panda CSS**     | Build-time static | ❌ Not supported | ✅ Yes (for dynamic values)    |
| styled-components | Runtime           | ✅ Supported     | ❌ No (can use props directly) |
| Emotion           | Runtime           | ✅ Supported     | ❌ No (can use props directly) |

```tsx
// styled-components/Emotion (Runtime)
const Button = styled.button<{ $value: number }>`
  property: ${(props) => props.$value}px; // ✅ Works (runtime interpolation)
`;

// Panda CSS (Build-time)
const buttonStyle = css`
  property: ${value}px; // ❌ Fails (no runtime interpolation)
  property: var(--my-property); // ✅ Works (CSS variables)
`;
```

### Documentation Requirements

When using CSS variables for dynamic values, add comments explaining the constraint:

```tsx
/**
 * Component with dynamic styling
 *
 * @note Panda CSS uses static compilation, so dynamic props
 *       must be passed via CSS variables, not direct interpolation.
 */
const componentStyle = css`
  property: var(--component-property); // Runtime props via CSS variable
`;

export function Component({ value }: Props) {
  // Panda CSS constraint: runtime values via CSS variables
  const style = { '--component-property': `var(--spacing-${value})` } as CSSProperties;
  return (
    <div className={componentStyle} style={style}>
      ...
    </div>
  );
}
```

### Common Mistakes

#### Mistake 1: Trying to interpolate props

```tsx
// ❌ WRONG - props cannot be interpolated in Panda CSS
const Component = ({ color }: { color: string }) => (
  <div
    className={css`
      color: ${color};
    `}
  />
);

// ✅ CORRECT - use CSS variables
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

#### Mistake 2: Assuming runtime compilation

```tsx
// ❌ WRONG - Panda CSS is build-time, not runtime
const getStyle = (size: 'sm' | 'md' | 'lg') => {
  return css`
    property: ${size === 'sm' ? '0.5rem' : '1rem'};
  `; // Won't work
};

// ✅ CORRECT - use conditional class application
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

## Basic Usage

### Inline Styles with `css`

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

## 🟡 Responsive Design (IMPORTANT)

```tsx
// ✅ Recommended: Mobile-first approach
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

**Mobile-first approach** is recommended.

## 🟡 Performance Considerations (IMPORTANT)

```tsx
// ✅ Recommended: Performance-friendly properties
const animation = css`
  transition:
    transform 0.2s,
    opacity 0.2s; // transform/opacity only
`;

// ❌ Avoid: Properties that trigger reflow
const animation = css`
  transition:
    width 0.2s,
    height 0.2s; // causes reflow
`;
```

## 🟡 Accessibility (IMPORTANT)

### Focus States

```tsx
// ✅ Recommended: Use box-shadow (respects border-radius)
const button = css`
  border-radius: var(--radii-8);

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 var(--spacing-1) var(--colors-blue-a-300);
  }
`;

// ❌ Avoid: Use outline (Safari ignores border-radius)
const button = css`
  &:focus-visible {
    outline: 3px solid var(--colors-blue-500); // ❌ Avoid
  }
`;
```

## ⚪ Common Patterns (RECOMMENDED)

### Conditional Styles

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

### Nested Selectors

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

### Pseudo Elements

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

## Configuration Files

### Before modifying `~/panda.config.mts`

**Always read the file first** to understand:

- Existing design tokens
- Theme configuration
- Custom utilities

**Example changes**:

- Adding new color tokens
- Defining custom spacing values
- Creating new design patterns

### Before modifying `~/postcss.config.cjs`

**Always read the file first** to understand:

- PostCSS plugins configuration
- `postcss-media-hover-any-hover` settings
- Custom media queries

**Example changes**:

- Adding new PostCSS plugins
- Modifying hover detection settings
- Configuring custom transformations

## Forbidden Practices

### 1. Magic Numbers

```tsx
// ❌ Forbidden
min-width: 20px;
height: 300px;
border: 1px solid;

// ✅ Recommended: Use variables
min-width: var(--spacing-5);
height: var(--sizes-container-small);
border-width: var(--border-widths-1);
```

### 2. !important Abuse

```tsx
// ❌ Avoid
color: var(--colors-red-500) !important;

// ✅ Recommended: Adjust selector specificity
.parent .child {
  color: var(--colors-red-500);
}
```

### 3. Global Style Conflicts

```tsx
// ❌ Forbidden: Affects globally
div {
  margin: 0;
}

// ✅ Recommended: Scope it
const Container = styled.div`
  & > div {
    margin: 0;
  }
`;
```

## Verification Checklist

Before committing styling changes:

- [ ] Using `@/ui/styled` import
- [ ] Hover states written without manual `@media` wrapping
- [ ] CSS variables used for colors, spacing, and other tokens
- [ ] No external margins on components
- [ ] Responsive styles follow mobile-first approach
- [ ] Configuration file changes are intentional and documented
- [ ] No magic numbers or hardcoded values
- [ ] Focus states use `box-shadow` instead of `outline`
