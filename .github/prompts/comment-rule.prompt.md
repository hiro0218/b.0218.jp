# Code Comment Guidelines

## Core Principle

Write comments that explain **WHY**, not **WHAT**. TypeScript shows what the code does.

## Required Documentation

### JSDoc Required For:

- All exported functions and classes
- Complex business logic
- Public APIs

### JSDoc Format:

```typescript
/**
 * Generates description text from HTML content
 * @param postContent - HTML string to convert
 * @returns Plain text description (max 140 chars)
 */
export const getDescriptionText = (postContent: string): string => {
  // HTML tags not needed in plain text descriptions
  return postContent.replace(/<[^>]*>/g, '').substring(0, 140);
};
```

## Forbidden Patterns

### Never Write:

- **Type repetition**: `@param user - User object` ❌
- **What-only comments**: `// Delete HTML tags` ❌
- **Redundant descriptions**: `getUserData gets user data` ❌

### Always Convert:

- `// Delete HTML tags` → `// HTML tags not needed in plain text`
- `// Get data` → `// Load from pre-built JSON`
- `// Sort items` → `// Pre-sort for performance`

## Standard JSDoc Tags

### Essential Tags:

- `@param` - Parameter description (no type repetition)
- `@returns` - Return value description
- `@throws` - Exception information
- `@deprecated` - Deprecation notices
- `@example` - Usage examples
- `@see` - External references
- `@todo` - Future improvements

### Example:

```typescript
/**
 * @param page - Integer between 1 and 10000
 * @returns Paginated user list
 * @throws {RangeError} If page is out of bounds
 * @example
 * const users = getUsers(1);
 * @see {@link https://example.com/api/users}
 * @todo Add caching mechanism
 */
```

## Quality Targets

- Type duplication: 0
- JSDoc coverage: 90%+ for public APIs
- Comment density: 8-15 lines per 100 lines
