---
description: 'Panda CSS styling rules and zero-margin principle'
applyTo: '**/{ui,components}/**/*.{ts,tsx}'
---

# Panda CSS Styling Rules

This file defines styling conventions automatically applied during implementation.

## Import Rules

```tsx
// ✅ Recommended: Project-unified import
import { css, styled, cx } from '@/ui/styled';

// ❌ Forbidden: Direct import
import { css } from '~/styled-system/css';
```

**Reason**: `@/ui/styled` is the unified entry point.

## Hover States (Critical)

### Correct: Write `:hover` directly

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

## CSS Variables (Required)

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

## Zero Margin Principle (Strict)

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

**Why no margins**: Components should not dictate their own positioning. This makes them more reusable and prevents layout bugs.

## Basic Usage

### Inline Styles with `css`

```tsx
import { css } from '@/ui/styled';

export const Component = () => (
  <div
    className={css`
      background: var(--colors-gray-a-3);
      padding: var(--spacing-2);
      border-radius: 0.5rem;
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
  padding: 0.5rem 1rem;
  background: var(--colors-blue-500);
  color: white;
  border-radius: 0.25rem;

  &:hover {
    background: var(--colors-blue-600);
  }
`;

export const Button = ({ children }: ButtonProps) => <StyledButton>{children}</StyledButton>;
```

## Responsive Design

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

## Performance Considerations

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

## Accessibility

### Focus States

```tsx
// ✅ Recommended: Use box-shadow (respects border-radius)
const button = css`
  border-radius: var(--radii-8);

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--colors-blue-a-300);
  }
`;

// ❌ Avoid: Use outline (Safari ignores border-radius)
const button = css`
  &:focus-visible {
    outline: 3px solid var(--colors-blue-500); // ❌ Avoid
  }
`;
```

## Common Patterns

### Conditional Styles

```tsx
const Button = styled.button<{ variant: 'primary' | 'secondary' }>`
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;

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

  h2 {
    font-size: var(--font-sizes-2xl);
    margin-bottom: var(--spacing-2);
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
