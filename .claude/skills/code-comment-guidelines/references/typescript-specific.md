# TypeScript/JavaScript Specific Comment Patterns

This document covers comment patterns specific to TypeScript and JavaScript development.

## TypeScript Types as Documentation

### ❌ Bad: Commenting type information

```typescript
// User object with name and email
const user = {
  name: 'John',
  email: 'john@example.com'
};

// Array of numbers
const scores = [90, 85, 95];

// Function that takes a string and returns a number
function getLength(str) {
  return str.length;
}
```

### ✅ Good: Use TypeScript types

```typescript
interface User {
  name: string;
  email: string;
}

const user: User = {
  name: 'John',
  email: 'john@example.com'
};

const scores: number[] = [90, 85, 95];

function getLength(str: string): number {
  return str.length;
}
```

**Principle**: TypeScript's type system is self-documenting. Don't duplicate with comments.

---

## JSDoc for Public APIs (Required)

### ❌ Bad: No documentation for exported API

```typescript
export function calculateTax(amount: number, rate: number): number {
  return amount * rate;
}
```

### ✅ Good: Complete JSDoc for public API

```typescript
/**
 * Calculates tax amount based on the given rate
 *
 * @param amount - The base amount in cents (to avoid floating point errors)
 * @param rate - Tax rate as decimal (e.g., 0.08 for 8%)
 * @returns Tax amount in cents, rounded to nearest cent
 *
 * @throws {Error} If amount is negative or rate is outside [0, 1]
 *
 * @example
 * ```typescript
 * const tax = calculateTax(10000, 0.08); // 800 cents = $8.00
 * ```
 */
export function calculateTax(amount: number, rate: number): number {
  if (amount < 0 || rate < 0 || rate > 1) {
    throw new Error('Invalid amount or rate');
  }
  return Math.round(amount * rate);
}
```

**Principle**: All exported functions, classes, and complex constants need JSDoc.

---

## React Components

### ❌ Bad: Commenting obvious React patterns

```typescript
// Props interface for Button component
interface ButtonProps {
  // The text to display
  children: React.ReactNode;
  // Click handler
  onClick: () => void;
}

// Button component
export function Button({ children, onClick }: ButtonProps) {
  // Return a button element
  return <button onClick={onClick}>{children}</button>;
}
```

### ✅ Good: Document only non-obvious behavior

```typescript
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  /**
   * When true, prevents double-click submissions by disabling
   * the button for 500ms after first click
   */
  preventDoubleClick?: boolean;
}

export function Button({ children, onClick, preventDoubleClick }: ButtonProps) {
  // Implementation is self-explanatory
  return <button onClick={onClick}>{children}</button>;
}
```

**Principle**: React patterns are well-known. Only document unusual behavior or constraints.

---

## Server Components vs Client Components

### ❌ Bad: No explanation for 'use client'

```typescript
'use client';

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### ✅ Good: Explain when 'use client' is non-obvious

```typescript
// This component MUST be a Client Component because Next.js Server Components
// cannot access browser APIs (window.matchMedia) or use event handlers
'use client';

export function ThemeToggle() {
  const [theme, setTheme] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  return <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>{theme}</button>;
}
```

**Principle**: When 'use client' is obvious (useState, onClick), no comment needed. Explain when multiple factors are involved.

---

## Async/Promise Patterns

### ❌ Bad: Explaining what async does

```typescript
// Async function that waits for the response
async function fetchUser(id: string) {
  // Await the fetch call
  const response = await fetch(`/api/users/${id}`);
  // Await the JSON parsing
  const user = await response.json();
  // Return the user
  return user;
}
```

### ✅ Good: Explain error handling strategy

```typescript
/**
 * Fetches user by ID with automatic retry on network failure
 *
 * @throws {Error} After 3 failed attempts
 */
async function fetchUser(id: string): Promise<User> {
  // Retry up to 3 times with exponential backoff for transient network errors
  // Critical for production stability with flaky connections
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(`/api/users/${id}`);
      return await response.json();
    } catch (error) {
      if (attempt === 2) throw error;
      await sleep(2 ** attempt * 1000);
    }
  }
}
```

**Principle**: Async mechanics are understood. Explain retry logic, error handling, or race condition prevention.

---

## Type Guards and Narrowing

### ❌ Bad: Explaining TypeScript narrowing

```typescript
// Type guard to check if value is a string
function isString(value: unknown): value is string {
  // Check typeof
  return typeof value === 'string';
}
```

### ✅ Good: Document why complex type guard exists

```typescript
/**
 * Type guard for API responses that may return either User object or error string
 * Needed because legacy API inconsistently returns errors as strings vs objects
 *
 * TODO(issue-#456): Remove after API v2 migration completes
 */
function isUserObject(response: unknown): response is User {
  return typeof response === 'object'
    && response !== null
    && 'id' in response
    && 'email' in response;
}
```

**Principle**: Simple type guards need no comment. Explain business context for complex guards.

---

## Dependency Array Comments (React Hooks)

### ❌ Bad: Explaining dependency arrays

```typescript
useEffect(() => {
  fetchData();
}, [userId]); // Re-run when userId changes
```

### ✅ Good: Explain intentional omissions only

```typescript
useEffect(() => {
  // Intentionally omitting `onSuccess` from dependencies
  // We want this effect to run only when userId changes, not when callback reference changes
  // onSuccess is guaranteed stable by parent component's useCallback
  fetchData(userId).then(onSuccess);
}, [userId]); // eslint-disable-line react-hooks/exhaustive-deps
```

**Principle**: Standard dependency arrays need no comment. Explain when intentionally violating exhaustive-deps.

---

## Module Augmentation

### ❌ Bad: No context for augmentation

```typescript
declare module 'next' {
  interface NextConfig {
    customOption?: boolean;
  }
}
```

### ✅ Good: Explain why augmentation is needed

```typescript
// Extend Next.js config type to support our custom build plugin
// This augmentation is safe because the plugin reads this option at build time
// See: https://nextjs.org/docs/advanced-features/custom-webpack-config
declare module 'next' {
  interface NextConfig {
    customOption?: boolean;
  }
}
```

**Principle**: Module augmentation is unusual. Always explain why it's needed and link to docs.

---

## Environment-Specific Code

### ❌ Bad: No explanation for environment checks

```typescript
if (typeof window !== 'undefined') {
  localStorage.setItem('key', 'value');
}
```

### ✅ Good: Explain SSR/SSG context

```typescript
// Next.js SSG: window is undefined during build-time rendering
// Only access localStorage in browser environment to avoid build errors
if (typeof window !== 'undefined') {
  localStorage.setItem('theme', theme);
}
```

**Principle**: SSR/SSG environment checks need brief context for developers unfamiliar with the pattern.

---

## Performance: useMemo and useCallback

### ❌ Bad: Commenting every memo

```typescript
// Memoize to prevent re-renders
const memoizedValue = useMemo(() => expensiveComputation(data), [data]);

// Memoize callback
const memoizedCallback = useCallback(() => {
  doSomething();
}, []);
```

### ✅ Good: Only comment when profiling-driven

```typescript
/**
 * Memoized to prevent re-calculation on every render
 *
 * Profiling showed this computation takes ~200ms with 10k items
 * Before memoization: 200ms per render
 * After memoization: <1ms per render (only recalculates when data changes)
 */
const sortedItems = useMemo(
  () => [...items].sort((a, b) => a.priority - b.priority),
  [items]
);
```

**Principle**: Don't comment obvious memoization. Explain when profiling drove the decision with metrics.

---

## Summary: TypeScript-Specific Principles

| Pattern | Comment Needed? | Why |
|---------|----------------|-----|
| Type annotations | ❌ Never | Types are self-documenting |
| Public exported API | ✅ Always (JSDoc) | Contract documentation |
| Simple React patterns | ❌ No | Well-known conventions |
| 'use client' directive | 🟡 Sometimes | Only when non-obvious |
| Async/await | ❌ No | Syntax is understood |
| Type guards | 🟡 Sometimes | Complex business logic only |
| Dependency arrays | 🟡 Sometimes | Intentional omissions only |
| Module augmentation | ✅ Yes | Unusual pattern |
| SSR/SSG checks | ✅ Yes | Framework-specific |
| useMemo/useCallback | 🟡 Sometimes | Profiling-driven only |

**Key Insight**: TypeScript's type system eliminates ~70% of comment needs compared to JavaScript.
