# Code Comment Examples: Good vs Bad

This document provides concrete examples of good and bad comments across common scenarios.

## Table of Contents

1. [Redundant Comments](#redundant-comments)
2. [Function Documentation](#function-documentation)
3. [Performance Optimizations](#performance-optimizations)
4. [Library Constraints](#library-constraints)
5. [Business Logic](#business-logic)
6. [TODO Comments](#todo-comments)
7. [Complex Algorithms](#complex-algorithms)
8. [Refactoring Opportunities](#refactoring-opportunities)

---

## Redundant Comments

### ❌ Bad: Repeating what code says

```typescript
// Increment counter by 1
counter++;

// Check if user is null
if (user === null) {
  // Return null if user is null
  return null;
}

// Create a new array
const items: Item[] = [];
```

### ✅ Good: No comment needed

```typescript
counter++;

if (user === null) {
  return null;
}

const items: Item[] = [];
```

**Principle**: Code is self-explanatory. Comment adds no value.

---

## Function Documentation

### ❌ Bad: Low-value JSDoc

```typescript
/**
 * Gets a user
 * @param id - the id
 * @returns a user
 */
function getUser(id: string): User {
  return users.find((u) => u.id === id);
}
```

### ✅ Good: Meaningful public API documentation

````typescript
/**
 * Retrieves user by ID from the cached user list
 *
 * @param id - User's unique identifier
 * @returns User object, or undefined if not found
 *
 * @example
 * ```typescript
 * const user = getUser('user-123');
 * if (user) {
 *   console.log(user.name);
 * }
 * ```
 */
export function getUser(id: string): User | undefined {
  return users.find((u) => u.id === id);
}
````

**Principle**: Public APIs need documentation. Add context, examples, and edge cases.

---

## Performance Optimizations

### ❌ Bad: No explanation for optimization

```typescript
const postsMap = new Map<string, Post>();
for (let i = 0; i < posts.length; i++) {
  postsMap.set(posts[i].slug, posts[i]);
}
```

### ✅ Good: Explain the "why"

```typescript
// Convert to Map for O(1) lookup instead of O(n) array.find()
// With 1000+ posts, this reduces search from ~500ms to <1ms
const postsMap = new Map<string, Post>();
for (let i = 0; i < posts.length; i++) {
  postsMap.set(posts[i].slug, posts[i]);
}
```

**Principle**: Non-obvious optimizations need rationale and impact measurement.

---

## Library Constraints

### ❌ Bad: Unexplained workaround

```typescript
const emptySubscribe = () => () => {};
const getSnapshot = () => typeof navigator !== 'undefined' && !!navigator.share;
```

### ✅ Good: Explain library requirement

```typescript
// React Compiler requires subscribe function to be defined outside component
// See: https://react.dev/blog/2024/02/15/react-compiler
const emptySubscribe = () => () => {};
const getSnapshot = () => typeof navigator !== 'undefined' && !!navigator.share;
```

**Principle**: Workarounds and library constraints need explanation with links when possible.

---

## Business Logic

### ❌ Bad: Explaining the "what"

```typescript
// If price is greater than 100, apply discount
if (price > 100) {
  return price * 0.9;
}
```

### ✅ Good: Extract function to explain business rule

```typescript
const BULK_ORDER_THRESHOLD = 100;
const BULK_DISCOUNT_RATE = 0.1;

function applyBulkDiscount(price: number): number {
  if (price > BULK_ORDER_THRESHOLD) {
    return price * (1 - BULK_DISCOUNT_RATE);
  }
  return price;
}
```

**Principle**: Business logic belongs in well-named constants and functions, not comments.

---

## TODO Comments

### ❌ Bad: Vague TODOs

```typescript
// TODO: fix this
// TODO: improve performance
// TODO: refactor
```

### ✅ Good: Specific, actionable TODOs

```typescript
// TODO(issue-#123): Implement exponential backoff for retry logic
// TODO: Cache this query result (currently hits DB on every request)
// TODO(@username): Extract this to shared utility after v2.0 release
```

**Principle**: TODOs should be specific, link to issues, and have context.

---

## Complex Algorithms

### ❌ Bad: Step-by-step code narration

```typescript
function quickSort(arr: number[]): number[] {
  // Check if array is empty or has one element
  if (arr.length <= 1) return arr;

  // Get the middle element as pivot
  const pivot = arr[Math.floor(arr.length / 2)];

  // Filter elements less than pivot
  const left = arr.filter((x) => x < pivot);

  // Filter elements equal to pivot
  const middle = arr.filter((x) => x === pivot);

  // Filter elements greater than pivot
  const right = arr.filter((x) => x > pivot);

  // Recursively sort and combine
  return [...quickSort(left), ...middle, ...quickSort(right)];
}
```

### ✅ Good: High-level algorithm explanation

```typescript
/**
 * Quicksort implementation using functional approach
 * Time: O(n log n) average, O(n²) worst case
 * Space: O(log n) due to recursion
 *
 * Note: Uses middle element as pivot to reduce worst-case probability.
 * For production use with large datasets, consider iterative version
 * to avoid stack overflow.
 */
function quickSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter((x) => x < pivot);
  const middle = arr.filter((x) => x === pivot);
  const right = arr.filter((x) => x > pivot);

  return [...quickSort(left), ...middle, ...quickSort(right)];
}
```

**Principle**: Document algorithm choice, complexity, and trade-offs. Code shows implementation.

---

## Refactoring Opportunities

### ❌ Bad: Long comment explaining complex logic

```typescript
// This function calculates the user's discount based on their membership level,
// total purchase amount, and whether they have a coupon. Premium members get 20%,
// regular members get 10%, and non-members get 5%. If the purchase is over $100,
// add an extra 5%. If they have a coupon, add another 10% off.
function calculateDiscount(user: User, amount: number, hasCoupon: boolean): number {
  let discount = 0;
  if (user.membershipLevel === 'premium') {
    discount = 0.2;
  } else if (user.membershipLevel === 'regular') {
    discount = 0.1;
  } else {
    discount = 0.05;
  }
  if (amount > 100) {
    discount += 0.05;
  }
  if (hasCoupon) {
    discount += 0.1;
  }
  return discount;
}
```

### ✅ Good: Refactor into self-documenting code

```typescript
const MEMBERSHIP_DISCOUNTS = {
  premium: 0.2,
  regular: 0.1,
  none: 0.05,
} as const;

const BULK_ORDER_BONUS = 0.05;
const BULK_ORDER_THRESHOLD = 100;
const COUPON_DISCOUNT = 0.1;

function calculateDiscount(user: User, amount: number, hasCoupon: boolean): number {
  const membershipDiscount = getMembershipDiscount(user);
  const bulkDiscount = isBulkOrder(amount) ? BULK_ORDER_BONUS : 0;
  const couponDiscount = hasCoupon ? COUPON_DISCOUNT : 0;

  return membershipDiscount + bulkDiscount + couponDiscount;
}

function getMembershipDiscount(user: User): number {
  return MEMBERSHIP_DISCOUNTS[user.membershipLevel] || MEMBERSHIP_DISCOUNTS.none;
}

function isBulkOrder(amount: number): boolean {
  return amount > BULK_ORDER_THRESHOLD;
}
```

**Principle**: Long explanatory comments signal that code needs refactoring into smaller, well-named functions.

---

## Summary Patterns

| Scenario                 | Comment Needed?     | Alternative               |
| ------------------------ | ------------------- | ------------------------- |
| Simple operations        | ❌ No               | Self-explanatory code     |
| Public API               | ✅ Yes (JSDoc)      | N/A                       |
| Complex algorithm        | ✅ Yes (high-level) | + Good naming             |
| Performance optimization | ✅ Yes (rationale)  | N/A                       |
| Business logic           | ❌ No               | Named constants/functions |
| Library workaround       | ✅ Yes (with link)  | N/A                       |
| Complex conditional      | ❌ No               | Extract to function       |
| Magic numbers            | ❌ No               | Named constants           |
| TODO notes               | ✅ Yes (specific)   | Issue tracker link        |
