# AI Assistant Instructions

> **Note**: This file is the source for symlinks `AGENTS.md` and `CLAUDE.md` to enforce consistency among AI assistants.

## Language Preference

**IMPORTANT: Always respond in Japanese (日本語) unless explicitly asked otherwise.**

- Use Japanese for all explanations, comments, and documentation
- Technical terms and code may remain in English
- Maintain professional tone in Japanese (ですます調)

## Project Overview

- Next.js 16.x blog using TypeScript, React 19.x, and Panda CSS
- Focused on Japanese content with ML-powered features
- **SSG (Static Site Generation)**: Data loads at build time, Client Components are minimal

### Critical Requirements

```bash
# Run before ANY development/build
npm run prebuild  # Updates submodules, processes content, generates assets
npm run dev       # Development server on port 8080 with HTTPS
```

**Dev Server**: Use `https://localhost:8080` (HTTPS only). HTTP fails.

**Content Source**: `_article/_posts/*.md` is a Git submodule. **DO NOT edit directly.**

## Important Configuration Files

AI agents should verify these files before suggesting changes:

| File              | Path                   | When to Check                                           |
| ----------------- | ---------------------- | ------------------------------------------------------- |
| Next.js Config    | `~/next.config.mjs`    | Before optimization suggestions (React Compiler status) |
| Biome Config      | `~/biome.json`         | Before architectural changes (layer dependencies)       |
| Panda CSS Config  | `~/panda.config.mts`   | Before styling changes (design tokens)                  |
| TypeScript Config | `~/tsconfig.json`      | Before type-related changes (strict mode, paths)        |
| PostCSS Config    | `~/postcss.config.cjs` | Before CSS changes (hover media queries)                |
| Package JSON      | `~/package.json`       | Before adding dependencies or scripts                   |

**Critical Checkpoints**:

- React Compiler optimizations: Read `~/next.config.mjs` first
- Component layer violations: Read `~/biome.json` first
- Styling conventions: Read `~/panda.config.mts` first
- CSS processing (hover queries): Read `~/postcss.config.cjs` first

## Architecture

### Directory Structure

```
~/                              # Project root
├── src/                        # Source code (import alias: @/)
│   ├── app/                    # Next.js App Router (routes)
│   ├── components/             # React components
│   │   ├── App/                # App shell (Header, Footer, Layout)
│   │   ├── Page/               # Page-specific components
│   │   │   └── _shared/        # Shared page sections
│   │   ├── UI/                 # Reusable UI (zero-margin principle)
│   │   └── Functional/         # Non-visual utility components
│   ├── ui/                     # Panda CSS styling (styled, tokens)
│   └── types/                  # TypeScript type definitions
├── _article/                   # Git submodule (read-only)
│   └── _posts/                 # Markdown blog posts
├── public/                     # Static assets
├── scripts/                    # Build and prebuild scripts
└── [config files]              # See "Important Configuration Files"
```

**Path Reference Rules**:

- Config files: Use `~/filename` (e.g., `~/next.config.mjs`)
- Source files: Use `@/path` in imports (e.g., `import { css } from '@/ui/styled'`)
- Submodule: `_article/_posts/*.md` (DO NOT edit directly)

### Component Principles

- **Zero Margin**: No self-margins; parents control spacing
- **Layer Dependencies**: Enforced by Biome (`biome.json`)
  - UI and Functional are independent layers
  - Page depends on UI/Functional
  - App depends only on lower layers
- **Server First**: Use Server Components by default, `'use client'` only when necessary

### Layer Responsibilities

- **App/**: Application shell, layout, singleton-like
- **Page/**: Page-specific logic and components
- **UI/**: Visual, reusable components (Button, Card, Modal, etc.)
- **Functional/**: Non-visual utilities (e.g., PreconnectLinks, metadata)

## Development

### Styling with Panda CSS

```tsx
import { css, styled } from '@/ui/styled';

const StyledDiv = styled.div`
  background: var(--colors-gray-a-3);
  padding: var(--spacing-2);
`;
```

**Hover States**: Write `:hover` directly. The `postcss-media-hover-any-hover` plugin automatically wraps it for touch device detection.

```tsx
// ✅ Correct
const Button = styled.button`
  &:hover {
    background: blue;
  }
`;

// ❌ Incorrect - redundant
const Button = styled.button`
  @media (any-hover: hover) {
    &:hover {
      background: blue;
    }
  }
`;
```

### Path Aliases

- `@/*` → `src/*` (TypeScript import alias)
- `~/*` → project root (used in this document only)

**Note**: In this document, `~/` refers to the project root directory, not the user's home directory.

### Content Pipeline

1. **Source**: `_article/_posts/*.md` (Git submodule)
2. **Processing**: `npm run prebuild` → JSON
3. **Consumption**: SSG uses JSON output

### Testing

- Framework: Vitest with React Testing Library
- Coverage: `npm run coverage`
- Focus: Test behavior, not implementation
- One assertion per test when possible
- Cover edge cases and error conditions

## File-Specific Rules

These rules apply automatically based on file paths:

| File Pattern                     | Rules                                                      |
| -------------------------------- | ---------------------------------------------------------- |
| `src/components/UI/**/*`         | Zero-margin principle, no dependencies on Page/App layers  |
| `src/components/Functional/**/*` | No visual elements, utility-only, independent layer        |
| `src/components/Page/**/*`       | May depend on UI/Functional, not on App layer              |
| `src/components/App/**/*`        | May depend on all lower layers, singleton-like patterns    |
| `**/*.test.ts{,x}`               | Vitest + React Testing Library, one assertion per test     |
| `**/*.tsx` (Client)              | Require `'use client'` directive, verify necessity         |
| `**/*.tsx` (Server)              | Default mode, no `'use client'` unless interactive         |
| `_article/**/*`                  | **Read-only** - Git submodule, do not edit                 |
| `~/biome.json`                   | Verify before suggesting layer dependency changes          |
| `~/next.config.mjs`              | Verify before React Compiler optimization suggestions      |
| `~/panda.config.mts`             | Verify before styling convention changes                   |
| `~/postcss.config.cjs`           | Verify before CSS processing changes (hover media queries) |

## Standards

### Coding Standards

- **TypeScript**: Strict mode, explicit types for public APIs, type-only imports
- **React**: App Router, Server Components by default
- **Import Order**: external libs → internal utilities → components → types → styles/constants
- **File Naming**: PascalCase for components, camelCase for utilities, UPPER_SNAKE for constants
- **Comments**: JSDoc for public APIs only, no redundant comments
- **Security**: Validate inputs, prevent XSS/injection attacks
- **Accessibility**: Semantic HTML, ARIA labels where needed

### Performance & Optimization

**Static Generation**:

- Route-based code splitting
- Next.js Image optimization
- Bundle analysis: `npm run build:analyzer`

**React Compiler** (`reactCompiler: true` in `next.config.mjs`):

⚠️ **CRITICAL: Check `next.config.mjs` before suggesting manual optimizations**

React Compiler (React 19) automatically handles memoization and re-render optimization **within component rendering**.

**React Compiler Scope**:

✅ **Automatically optimized**:

- Component rendering results
- JSX element generation
- Inline calculations within components

❌ **NOT automatically optimized** (manual memoization required):

- Class instance creation in custom hooks (`new ClassName()`)
- Function definitions in custom hooks
- External library initialization
- Side-effect-heavy operations

**Example - Custom Hook with Cache**:

```tsx
// ❌ Without useMemo - cache recreated on every render
export const useSearchWithCache = () => {
  const cache = new SearchCache();
  return (data, query) => {
    /* ... */
  };
};

// ✅ With useMemo - cache persists across renders
export const useSearchWithCache = () => {
  const cache = useMemo(() => new SearchCache(), []);
  return useMemo(
    () => (data, query) => {
      /* ... */
    },
    [cache],
  );
};
```

**❌ DO NOT suggest**:

- Manual `useMemo` / `useCallback` / `memo` for component-level rendering optimization

**✅ DO suggest when appropriate**:

- `useMemo` / `useCallback` for custom hook internals (see "NOT automatically optimized" above)
- Algorithm improvements (e.g., O(n²) → O(n))
- Data structure optimizations
- Build-time optimizations

**Verification Process** (before removing or adding optimizations):

1. Read `next.config.mjs` to check `reactCompiler` setting
2. Identify if optimization is for:
   - Component rendering (handled by: React Compiler)
   - Custom hook internals (requires: Manual memoization)
3. For custom hooks with stateful instances or functions:
   - Verify if the value should persist across re-renders
   - Add `useMemo` / `useCallback` if persistence is required
4. Test that the optimization actually works (e.g., cache functionality)

**Common Pitfalls**:

- Removing `useMemo` from custom hooks without verification
- Assuming React Compiler optimizes everything (it doesn't)

**See also**: Technology Adoption Guidelines > Test Behavioral Changes (applies beyond React Compiler)

### Improvement Proposals

**Before suggesting architectural changes**:

- **Evidence-based**: Verify current implementation when practical
- **Context-aware**: Consider SSG characteristics (build-time data, minimal client-side)
- **Appropriate scope**: Changes should match problem size
- **Avoid over-engineering**: No patterns designed for dynamic backends/SPAs (e.g., Repository pattern)
- **Check existing solutions**: Avoid duplicating utilities or patterns

### Technology Adoption Guidelines

**Applies to**: React Compiler, build tools (Next.js, Webpack, esbuild), formatters (Biome), type checkers (TypeScript), CSS-in-JS (Panda CSS), test frameworks (Vitest), and any new technology or optimization.

**When introducing new technologies or removing existing optimizations**:

1. **Verify Scope Before Assuming**:
   - Read official documentation to understand exact capabilities
   - Don't assume "new = better in all cases"
   - Identify explicit limitations and unsupported use cases

2. **Test Behavioral Changes**:

   **Examples of changes that broke in production**:
   - React Compiler: Removed `useMemo` from custom hook (result: cache recreated on every render)
   - Next.js Tree-shaking: Enabled aggressive DCE (result: necessary side-effect code removed)
   - TypeScript strict mode: Enabled without testing (result: hidden type errors surfaced)

3. **Question Generalizations**:
   - "This tool handles X automatically" (ask: In which contexts? What are exceptions?)
   - "We don't need Y anymore" (ask: Are there edge cases where Y is still required?)
   - "The docs say Z" (ask: Is that recommendation universal or context-specific?)

   **Real-world examples**:
   - "React Compiler memoizes everything" (actually: Only component rendering, not custom hooks)
   - "TypeScript strict mode catches all errors" (actually: Runtime validation still needed)
   - "Panda CSS has zero runtime" (actually: True, but atomic CSS classes still need loading)

4. **Avoid These Anti-Patterns**:
   - ❌ "New feature exists, so old approach is obsolete"
   - ❌ "If it compiles, it probably works"
   - ❌ "The framework is smart, so I don't need to think about it"

## Git Workflow

### Commit Messages

Format: `type: description` (Japanese, under 50 chars)

- Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`
- Focus on "why" rather than "what"

### Pull Requests

Include:

- Title: Japanese, under 50 chars
- Overview: Purpose and background (1-2 sentences)
- Changes: Bulleted list of modifications
- Testing: What was verified

## Quick Reference

| Task              | Command                               |
| ----------------- | ------------------------------------- |
| Start development | `npm run prebuild && npm run dev`     |
| Dev server URL    | `https://localhost:8080` (HTTPS only) |
| Run tests         | `npm test`                            |
| Type check file   | `tsc --noEmit --skipLibCheck <file>`  |
| Lint file         | `npx @biomejs/biome check <file>`     |
| Lint all          | `npm run lint`                        |
| Build production  | `npm run prebuild && npm run build`   |
| Build (fast)      | `npx next build --webpack`            |
| Bundle analysis   | `npm run build:analyzer`              |

## Important Notes

1. Japanese content uses morphological analysis
2. Build dependencies: Playwright (`playwright install --only-shell`)
3. Environment: `TZ=Asia/Tokyo` for timestamps
4. Pre-commit: Husky via nano-staged

---

_For Copilot, Claude Code, and other AI assistants. Be concise and actionable._
