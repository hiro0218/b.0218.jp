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

## Architecture

### Directory Structure

```
src/
├── app/              # Next.js App Router (routes)
├── components/       # Components
│   ├── App/          # App shell (Header, Footer, Layout)
│   ├── Page/         # Page-specific components
│   │   └── _shared/  # Shared sections
│   ├── UI/           # Reusable UI components (zero-margin)
│   └── Functional/   # Utility components
├── ui/               # Styling
└── types/            # TypeScript types
```

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

- `@/*` → `src/*`
- `~/*` → project root

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

React Compiler (React 19) automatically handles memoization and re-render optimization.

**❌ DO NOT suggest**:

- Manual `useMemo` / `useCallback` / `memo` (redundant when compiler is active)

**✅ DO suggest**:

- Algorithm improvements (e.g., O(n²) → O(n))
- Data structure optimizations
- Reducing unnecessary function calls or normalizations
- Build-time optimizations

**Verification**:

1. Read `next.config.mjs` to check `reactCompiler` setting
2. If `true`: Focus on algorithmic/structural improvements only
3. If `false`: Manual memoization techniques are appropriate

### Improvement Proposals

**Before suggesting architectural changes**:

- **Evidence-based**: Verify current implementation when practical
- **Context-aware**: Consider SSG characteristics (build-time data, minimal client-side)
- **Appropriate scope**: Changes should match problem size
- **Avoid over-engineering**: No patterns designed for dynamic backends/SPAs (e.g., Repository pattern)
- **Check existing solutions**: Avoid duplicating utilities or patterns

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
| Build (no lint)   | `npx next build --no-lint --webpack`  |
| Bundle analysis   | `npm run build:analyzer`              |

## Important Notes

1. Japanese content uses morphological analysis
2. Build dependencies: Playwright (`playwright install --only-shell`)
3. Environment: `TZ=Asia/Tokyo` for timestamps
4. Pre-commit: Husky via nano-staged

---

_For Copilot, Claude Code, and other AI assistants. Be concise and actionable._
