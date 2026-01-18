---
description: 'Component architecture, layer dependencies, and zero-margin principle'
applyTo: '**/components/**/*.{ts,tsx}'
---

# Component Architecture Rules

This file defines design principles automatically applied when editing React/Next.js components.

## Priority Markers

- 🔴 **CRITICAL**: Must Follow (violations cause severe errors)
- 🟡 **IMPORTANT**: Should Follow (maintenance/quality may degrade)
- ⚪ **RECOMMENDED**: Best Practices (consistency improvement)

> **📌 About this file**: This is a detailed guide for CLAUDE.md. For priorities and the overview, see [CLAUDE.md - Critical Rules](../../CLAUDE.md#critical-rules-must-follow).

## Component Principles

### 🔴 Zero Margin Principle (CRITICAL)

UI components must NOT set their own external margins (`margin`, `margin-top`, etc.). Parent components control spacing.

**Correct**:

```tsx
// Component (no margin)
export const Card = ({ children }: CardProps) => (
  <div
    className={css`
      padding: var(--spacing-4);
    `}
  >
    {children}
  </div>
);

// Parent controls spacing
<div
  className={css`
    display: flex;
    gap: var(--spacing-4);
  `}
>
  <Card />
  <Card />
</div>;
```

**Incorrect**:

```tsx
// ❌ Component sets its own margin
export const Card = ({ children }: CardProps) => (
  <div
    className={css`
      padding: var(--spacing-4);
      margin-bottom: var(--spacing-4); /* ❌ Violates zero-margin principle */
    `}
  >
    {children}
  </div>
);
```

**Layout is controlled by parent**:

```tsx
// Parent (Page/App layer) controls layout
<Stack space={4}>
  <Card>...</Card>
  <Card>...</Card>
</Stack>

// Or
<div className={css`
  display: grid;
  gap: var(--spacing-4);
`}>
  <Card>...</Card>
  <Card>...</Card>
</div>
```

### 🔴 Layer Dependencies (CRITICAL)

> **WHY**: Layered dependencies improve testability and make change impact clearer. Biome's automated checks prevent architecture violations.

Layer dependencies are **enforced by Biome** (`~/biome.json`):

```
App/ (top)
  ↓ depends on
Page/
  ↓ depends on
UI/ ← → Functional/ (independent)
```

**Rules**:

- `UI/` and `Functional/` are **independent** layers (cannot import from each other)
- `Page/` may import from `UI/` and `Functional/`
- `App/` may import from all lower layers
- **Lower layers CANNOT import from upper layers**

**Examples**:

#### UI Layer (`src/components/UI/**`)

```tsx
// ✅ Allowed: Independent UI components
import { Heading } from '@/components/UI/Heading';
import { css } from '@/ui/styled';

// ❌ Forbidden: Dependencies on other layers
import { PostHeader } from '@/components/Page/Post/Header'; // Biome error
import { Layout } from '@/components/App/Layout'; // Biome error
```

**Rule**: UI layer is completely independent. Cannot depend on App, Page, or Functional layers.

#### Page Layer (`src/components/Page/**`)

```tsx
// ✅ Allowed: Dependencies on UI and Functional
import { Button } from '@/components/UI/Button';
import { Stack } from '@/components/UI/Layout';

// ❌ Forbidden: Dependencies on App layer
import { Header } from '@/components/App/Header'; // Biome error
```

**Rule**: Page layer can depend on UI/Functional. Cannot depend on App.

#### App Layer (`src/components/App/**`)

```tsx
// ✅ Allowed: Dependencies on all lower layers
import { Button } from '@/components/UI/Button';
import { PostSection } from '@/components/Page/_shared/PostSection';
```

**Rule**: App layer can depend on all lower layers.

**Verification**:

```bash
# Biome will catch layer violations
npm run lint
```

### 🟡 Server First Principle (IMPORTANT)

Use Server Components by default. Add `'use client'` **only when necessary**:

**Default: Server Component**

```tsx
export function PostList({ posts }: { posts: Post[] }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug}>{post.title}</li>
      ))}
    </ul>
  );
}
```

**Only when needed: Client Component**

```tsx
'use client';

export function InteractiveButton() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
```

**Client Component required when**:

- Using React hooks (`useState`, `useEffect`, etc.)
- Event handlers (`onClick`, `onChange`, etc.)
- Browser APIs (`window`, `document`)

## Layer Responsibilities

### App/ (Application Shell)

**Purpose**: Application-wide layout, navigation, singleton-like components

**Examples**:

- `Header.tsx` - Site-wide header
- `Footer.tsx` - Site-wide footer
- `Layout.tsx` - Root layout wrapper
- `GlobalSearch.tsx` - Global search bar

**Characteristics**:

- Singleton patterns acceptable
- May depend on all lower layers
- Should be stable (rarely changes)

### Page/ (Page-Specific)

**Purpose**: Page-specific logic and components

**Examples**:

- `PostDetail.tsx` - Post page detail view
- `ArchiveList.tsx` - Archive page list
- `PostHeader.tsx` - Post-specific header

**Characteristics**:

- May depend on `UI/` and `Functional/`
- Cannot depend on `App/`
- Page-specific logic and composition

**Shared sections**: `Page/_shared/` for components used across multiple page types

### UI/ (Visual Components)

**Purpose**: Reusable, visual components with zero external dependencies

**Examples**:

- `Button.tsx` - Button component
- `Card.tsx` - Card component
- `Modal.tsx` - Modal dialog
- `Icon.tsx` - Icon wrapper

**Characteristics**:

- Zero-margin principle enforced
- Independent layer (no imports from `Page/`, `App/`, or `Functional/`)
- Purely visual, no business logic
- Should be highly reusable

### Functional/ (Non-Visual Utilities)

**Purpose**: Non-visual utility components

**Examples**:

- `PreconnectLinks.tsx` - DNS prefetch links
- `GoogleAnalytics.tsx` - Analytics integration
- `StructuredData.tsx` - JSON-LD schema
- `ErrorBoundary.tsx` - Error handling

**Characteristics**:

- Independent layer (no imports from `Page/`, `App/`, or `UI/`)
- No visual output (or minimal)
- Side-effect or metadata focused

## SSG Optimization Patterns

### Build-Time Data Loading

```tsx
// ✅ Recommended (SSG): Build-time JSON
// Note: `npm run prebuild` generates JSON files in `dist/`
// Path alias: `~/* → project root`
import posts from '~/dist/posts.json';

export function RecentPosts() {
  const recent = posts.slice(0, 5);
  return <ul>{recent.map(...)}</ul>;
}

// ❌ Avoid: Runtime fetch
'use client';
export function RecentPosts() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch('/api/posts').then(r => r.json()).then(setPosts);
  }, []);
  return <ul>{posts.map(...)}</ul>;
}
```

### Static Parameter Generation

```tsx
// app/(PostPage)/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  return <PostDetail post={post} />;
}
```

## ⚪ Component Naming (RECOMMENDED)

```tsx
// ✅ Good: Clear naming
export const PostDetail = () => { ... };
export const TagList = () => { ... };
export const SearchPanel = () => { ... };

// ❌ Bad: Vague naming
export const Component = () => { ... };
export const Item = () => { ... };
export const Wrapper = () => { ... };
```

## 🟡 Props Design (IMPORTANT)

```tsx
// ✅ Recommended: Explicit type definition
interface PostDetailProps {
  post: Post;
  showRelated?: boolean;
}

export const PostDetail = ({ post, showRelated = true }: PostDetailProps) => {
  // Implementation
};

// ❌ Avoid: Inline type definition (for complex cases)
export const PostDetail = ({ post, showRelated }: {
  post: { slug: string; title: string; content: string; ... };
  showRelated?: boolean;
}) => {
  // Implementation
};
```

## 🟡 Accessibility (IMPORTANT)

```tsx
// ✅ Correct: Semantic HTML + ARIA
<button
  onClick={handleClick}
  aria-label="Share article"
  type="button"
>
  <ShareIcon />
</button>

// ✅ Correct: List structure
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/archive">Archive</a></li>
  </ul>
</nav>

// ❌ Incorrect: Non-semantic
<div onClick={handleClick}>  // ❌ Should use button
  <ShareIcon />
</div>
```

## Layer Violation Examples

**❌ UI importing from Page**:

```tsx
// src/components/UI/Button.tsx
import { PostHeader } from '@/components/Page/PostHeader'; // ❌ Violation
```

**❌ Page importing from App**:

```tsx
// src/components/Page/PostDetail.tsx
import { Header } from '@/components/App/Header'; // ❌ Violation
```

**❌ Functional importing from UI**:

```tsx
// src/components/Functional/GoogleAnalytics.tsx
import { Button } from '@/components/UI/Button'; // ❌ Violation
```

**✅ Correct dependencies**:

```tsx
// src/components/Page/PostDetail.tsx
import { Button } from '@/components/UI/Button'; // ✅ OK
import { StructuredData } from '@/components/Functional/StructuredData'; // ✅ OK

// src/components/App/Header.tsx
import { SearchInput } from '@/components/Page/SearchInput'; // ✅ OK
import { Button } from '@/components/UI/Button'; // ✅ OK
```

## Avoid These Anti-Patterns

### Unnecessary Client Components

Client Components should only be used when interactive features are required. Avoid converting Server Components to Client Components unnecessarily.

**❌ Incorrect: Unnecessary Client Component**

```tsx
'use client';

export function StaticText({ text }: { text: string }) {
  return <p>{text}</p>;
}
```

**✅ Correct: Keep as Server Component**

```tsx
export function StaticText({ text }: { text: string }) {
  return <p>{text}</p>;
}
```

### Unnecessary useEffect for SSG

This project uses SSG (Static Site Generation), so data fetching at runtime is generally unnecessary. Load data at build time instead.

**❌ Incorrect: Runtime data fetching with useEffect**

```tsx
'use client';

export function PostCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch('/api/posts/count')
      .then((r) => r.json())
      .then(setCount);
  }, []);

  return <span>{count}</span>;
}
```

**✅ Correct: Build-time data loading**

```tsx
import posts from '~/dist/posts.json';

export function PostCount() {
  return <span>{posts.length}</span>;
}
```

**Why this matters**:

- SSG pre-renders pages at build time
- Runtime data fetching adds unnecessary Client Component overhead
- Build-time data is faster and more reliable

## Verification Checklist

Before committing component changes:

- [ ] Component does not set its own margin
- [ ] Layer dependencies are correct (verified by `npm run lint`)
- [ ] `'use client'` is used only when necessary
- [ ] Component is placed in the correct directory
- [ ] Imports follow the dependency rules
- [ ] Props have explicit type definitions
- [ ] Semantic HTML is used for accessibility
- [ ] No unnecessary Client Components or useEffect hooks
