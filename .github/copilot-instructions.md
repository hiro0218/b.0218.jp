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

## 🔴 Critical Requirements

```bash
# Run before ANY development/build
npm run prebuild  # Updates submodules, processes content, generates assets
npm run dev       # Development server on port 8080 with HTTPS
```

- **Dev Server URL**:
  - ✅ Use: `https://localhost:8080` (HTTPS only)
  - ❌ Do NOT use: `http://localhost:8080` (HTTP fails)
  - Dev server launched with `--experimental-https` and a self-signed certificate

## 🔴 Improvement Proposals: Guidelines

**Project uses SSG (Static Site Generation)**

When suggesting improvements or architectural changes:

### Key Considerations

- **Evidence-based**: When practical, verify current implementation before proposing changes
- **Context-aware**: Consider SSG characteristics (build-time data loading, static generation)
- **Appropriate patterns**: Use established approaches or design patterns when suitable for the context
- **Check existing solutions**: Avoid duplicating existing utilities or patterns
- **Balanced scope**: Propose changes appropriate to the problem size
- **SSG-specific**: Remember that data loads at build time, and Client Components are minimal

### What to Avoid

- Over-engineering with patterns designed for dynamic backends or SPAs (e.g., Repository pattern, complex error handling)
- Runtime solutions for build-time problems

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
└── types/            # Typescript types
```

### Component Principles

- **Zero Margin**: No self-margins; parents control spacing
- **Container Sizes**: small (768px), default (1024px), large (1280px)
- **See**: [docs/ui-ux-guidelines.md](../docs/ui-ux-guidelines.md)
- **Layer Dependencies**: Enforced by Biome (`biome.json`)
- UI and Functional are independent layers

### Layer Responsibilities

#### App/

- App structure, layout
- Singleton-like
- Depends only on lower layers

#### Page/

- Page business logic/components
- Shared sections in `Page/_shared/`
- Depends on UI/Functional
- Does NOT depend on App/

#### UI/

- Visual, reusable components (Button, Card, Modal, etc.)
- No business logic
- Zero margin
- No dependencies on other component layers

#### Functional/

- Non-visual utilities (e.g., PreconnectLinks)
- Handles metadata, optimization
- No dependencies on component layers

### Architecture Rationale

- Separation of concerns
- Maintainability, testability, and scalability
- Biome enforces static dependencies

## Workflow & Tooling

See "Quick Reference" section below for essential commands.

### Styling

```tsx
// Panda CSS example
import { css, styled } from '@/ui/styled';

const StyledDiv = styled.div`
  background: var(--colors-gray-a-3);
  padding: var(--spacing-2);
`;
```

### Path Aliases

- `@/*` → `src/*`
- `~/*` → project root

## Content Architecture

1. **Source:** `_article/_posts/*.md` Git submodule (DO NOT edit direct)
2. **Processing:** `npm run prebuild` → JSON
3. **Consumption:** SSG uses JSON output

## Coding Standards

- TypeScript strict mode, explicit types for public APIs, type-only imports
- React: App Router, Server Components by default, `'use client'` only if needed
- Import order: external libs, internal utilities, components, types, styles/constants
- File naming: PascalCase for components, camelCase for utilities, UPPER_SNAKE for constants
- **Comments**: Follow @.github/prompts/comment-rule.prompt.md (JSDoc for public APIs only, no redundant comments)

## Performance

- Static generation with ISR-style rebuilds
- Route-based code splitting
- Next.js Image optimization
- Bundle analysis: `npm run build:analyzer`

## Testing

- Unit tests for utilities/hooks, integration tests for critical paths
- 80% coverage target

## Patterns

### Data Fetching

```typescript
async function getData() {
  const posts = await import('@/posts.json');
  return posts.default;
}
```

## Important Notes

1. Japanese content: uses morphological analysis
2. Build dependencies: Playwright (`playwright install --only-shell`)
3. Environment: `TZ=Asia/Tokyo` for timestamps
4. Pre-commit: Husky via nano-staged

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

---

_Generated for Copilot, Claude Code, and other AI assistants. Be concise and actionable._

**DO NOT modify files in `_article/` (Git submodule).**
