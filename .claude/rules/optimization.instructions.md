---
description: 'React Compiler optimization rules and performance guidelines'
applyTo: '{next.config.mjs,**/use*.{ts,tsx}}'
---

# Performance Optimization Rules

**Applies to**: `~/next.config.mjs`, custom hooks (`use*.ts{,x}`), optimization suggestions

**Purpose**: Prevent incorrect optimization suggestions and ensure proper React Compiler usage.

## Critical Rule

⚠️ **ALWAYS read `~/next.config.mjs` before suggesting optimizations**

Check for:

```js
reactCompiler: true;
```

If enabled, follow React Compiler rules below.

## React Compiler (React 19)

### Overview

React Compiler (`reactCompiler: true`) automatically handles memoization and re-render optimization **within component rendering**.

### What is Automatically Optimized

✅ **React Compiler handles**:

- Component rendering results
- JSX element generation
- Inline calculations within components
- Props and state comparisons

**Example** (No manual memoization needed):

```tsx
// ✅ React Compiler automatically optimizes this
export const PostList = ({ posts }: Props) => {
  // This calculation is automatically memoized
  const sortedPosts = posts.sort((a, b) => b.date - a.date);

  return (
    <ul>
      {sortedPosts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
};
```

### What is NOT Automatically Optimized

❌ **Manual memoization required**:

1. **Class instance creation in custom hooks**
2. **Function definitions in custom hooks**
3. **External library initialization**
4. **Side-effect-heavy operations**

### Custom Hooks: When to Use useMemo/useCallback

#### ❌ Without useMemo (Cache Recreated on Every Render)

```tsx
export const useSearchWithCache = () => {
  // ❌ New cache instance created on EVERY render
  const cache = new SearchCache();

  return (data: Data[], query: string) => {
    // Cache is useless - recreated every time
    return cache.search(data, query);
  };
};
```

**Problem**: `SearchCache` instance is recreated on every component re-render, making the cache ineffective.

#### ✅ With useMemo (Cache Persists Across Renders)

```tsx
import { useMemo } from 'react';

export const useSearchWithCache = () => {
  // ✅ Cache persists across re-renders
  const cache = useMemo(() => new SearchCache(), []);

  // ✅ Search function persists and uses the same cache
  return useMemo(
    () => (data: Data[], query: string) => {
      return cache.search(data, query);
    },
    [cache],
  );
};
```

**Solution**: `useMemo` ensures the cache instance persists across re-renders.

### More Examples

#### Function Definitions in Hooks

```tsx
// ❌ Without useCallback - new function every render
export const useEventHandler = (callback: () => void) => {
  const handler = () => {
    // Some logic
    callback();
  };

  return handler;
};

// ✅ With useCallback - stable function reference
export const useEventHandler = (callback: () => void) => {
  const handler = useCallback(() => {
    // Some logic
    callback();
  }, [callback]);

  return handler;
};
```

#### External Library Initialization

```tsx
// ❌ Library re-initialized every render
export const useMarkdownParser = () => {
  const parser = new MarkdownParser({
    /* heavy config */
  });
  return parser;
};

// ✅ Library initialized once
export const useMarkdownParser = () => {
  const parser = useMemo(
    () =>
      new MarkdownParser({
        /* heavy config */
      }),
    [],
  );
  return parser;
};
```

## Decision Matrix

| Code Location                | Optimization Type   | React Compiler Handles? | Manual Memoization?  |
| ---------------------------- | ------------------- | ----------------------- | -------------------- |
| Component body (rendering)   | JSX, calculations   | ✅ Yes                  | ❌ Not needed        |
| Custom hook (class instance) | `new ClassName()`   | ❌ No                   | ✅ Use `useMemo`     |
| Custom hook (function)       | Function definition | ❌ No                   | ✅ Use `useCallback` |
| Component props              | Passing callbacks   | ✅ Yes                  | ❌ Not needed        |
| Component state              | State updates       | ✅ Yes                  | ❌ Not needed        |

## DO NOT Suggest

❌ **These are unnecessary with React Compiler**:

```tsx
// ❌ Unnecessary - React Compiler handles this
const MemoizedComponent = memo(function Component() {
  return <div>Content</div>;
});

// ❌ Unnecessary - React Compiler handles this
const MemoizedValue = useMemo(() => {
  return props.items.length;
}, [props.items]);

// ❌ Unnecessary - React Compiler handles this
const MemoizedCallback = useCallback(() => {
  console.log('clicked');
}, []);
```

## DO Suggest (When Appropriate)

✅ **These are valid optimizations**:

1. **Algorithm improvements**:
   - O(n²) → O(n)
   - Unnecessary loops
   - Inefficient data structures

2. **Data structure optimizations**:
   - Map instead of array for lookups
   - Set for deduplication
   - Proper indexing

3. **Build-time optimizations**:
   - Code splitting
   - Image optimization
   - Bundle analysis

4. **Custom hook internals** (see examples above)

## Verification Process

Before suggesting or removing optimizations:

1. **Read `~/next.config.mjs`** to check `reactCompiler` setting

2. **Identify optimization target**:
   - Component rendering? → React Compiler handles it
   - Custom hook internals? → Manual memoization may be needed

3. **For custom hooks with stateful instances or functions**:
   - Does the value need to persist across re-renders?
   - Is it a class instance, function, or expensive object?
   - If yes → Use `useMemo` or `useCallback`

4. **Test the optimization**:
   - Does the cache actually work?
   - Does the function reference remain stable?
   - Is there a measurable performance improvement?

## Common Pitfalls

### Pitfall 1: Removing useMemo from Custom Hooks

```tsx
// ❌ Dangerous refactor
// Before (working):
const cache = useMemo(() => new SearchCache(), []);

// After (broken):
const cache = new SearchCache(); // Cache recreated every render
```

**Lesson**: Always verify if the value needs to persist before removing `useMemo`.

### Pitfall 2: Assuming React Compiler Optimizes Everything

```tsx
// ❌ Wrong assumption
export const useHeavyComputation = () => {
  // "React Compiler will optimize this"
  const result = new ExpensiveClass(); // ❌ Wrong - recreated every render
  return result;
};
```

**Lesson**: React Compiler optimizes **component rendering**, not custom hook internals.

### Pitfall 3: Over-Optimizing

```tsx
// ❌ Unnecessary with React Compiler
const Component = memo(() => {
  const value = useMemo(() => props.count * 2, [props.count]);
  const handler = useCallback(() => console.log(value), [value]);

  return <button onClick={handler}>{value}</button>;
});
```

**Lesson**: React Compiler makes most manual memoization unnecessary.

## Related Guidelines

See also: **Technology Adoption Guidelines** (in main CLAUDE.md)

- Verify scope before assuming
- Test behavioral changes
- Question generalizations
- Avoid anti-patterns

## Quick Reference

**Before suggesting optimizations**:

1. Read `~/next.config.mjs`
2. Check if React Compiler is enabled
3. Identify if it's component rendering or custom hook internals
4. Apply appropriate optimization strategy
5. Test that the optimization actually works
