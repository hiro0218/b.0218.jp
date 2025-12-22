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

## **CRITICAL**: Requirements

```bash
# Run before ANY development/build
npm run prebuild  # Updates submodules, processes content, generates assets
npm run dev       # Development server on port 8080 with HTTPS
```

- **Dev Server URL**:
  - **RECOMMENDED**: `https://localhost:8080` (HTTPS only)
  - **DO NOT USE**: `http://localhost:8080` (HTTP fails)
  - Dev server launched with `--experimental-https` and a self-signed certificate

## **CRITICAL**: Improvement Proposals Guidelines

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
- **Layer Dependencies**: Enforced by Biome (`biome.json`)
- UI and Functional are independent layers
- **Detailed guidelines**: See `.claude/skills/` for architecture and interface review skills

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

**Important: `:hover` and Media Queries**

- **DO NOT manually wrap `:hover` with `@media (any-hover: hover)`**
- The `postcss-media-hover-any-hover` plugin (postcss.config.cjs) automatically wraps all `:hover` selectors
- Simply write `:hover` styles directly - the plugin handles touch device detection

```tsx
// ✅ Correct - plugin handles media query automatically
const Button = styled.button`
  &:hover {
    background: blue;
  }
`;

// ❌ Incorrect - redundant manual wrapping
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

## Content Architecture

1. **Source:** `_article/_posts/*.md` Git submodule (DO NOT edit direct)
2. **Processing:** `npm run prebuild` → JSON
3. **Consumption:** SSG uses JSON output

## Coding Standards

- TypeScript strict mode, explicit types for public APIs, type-only imports
- React: App Router, Server Components by default, `'use client'` only if needed
- Import order: external libs, internal utilities, components, types, styles/constants
- File naming: PascalCase for components, camelCase for utilities, UPPER_SNAKE for constants
- **Comments**: JSDoc for public APIs only, no redundant comments (see `.github/instructions/typescript.instructions.md`)

## Performance

- Static site generation (SSG)
- Route-based code splitting
- Next.js Image optimization
- Bundle analysis: `npm run build:analyzer`

## Testing

- Unit tests for utilities/hooks using Vitest
- Test framework: Vitest with React Testing Library
- Coverage reporting available via `npm run coverage`

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

## Task-Specific Guidelines

### Code Generation

**Basic Principles** (always applied):

- Follow existing patterns in the codebase
- Use TypeScript strict mode with explicit types
- Prefer Server Components (only add `'use client'` when necessary)
- Follow layer dependencies (UI → Page → App)
- Apply zero-margin principle for UI components

**For detailed code generation guidance**: Execute `/prompt-codeGeneration` in VS Code

### Code Review

**Basic Checks** (always verify):

- Type safety: No `any` types, proper type definitions
- Architecture compliance: Correct component layer placement
- Performance: Avoid unnecessary Client Components
- Accessibility: Semantic HTML and ARIA labels
- Security: No XSS vulnerabilities, proper input validation

**For comprehensive review checklist**: Execute `/prompt-codeReview` in VS Code

### Commit Messages

**Basic Format** (always follow):

- Start with type: `feat:`, `fix:`, `refactor:`, `docs:`, etc.
- Use Japanese for description
- Keep under 50 characters for title
- Focus on "why" rather than "what"

**For detailed commit message guidelines**: Execute `/prompt-commitMessageGeneration` in VS Code

### Pull Requests

**Essential Components** (always include):

- Clear title describing the change (Japanese, under 50 chars)
- Overview: Purpose and background (1-2 sentences)
- Changes: Bulleted list of specific modifications
- Impact: Affected features/components
- Testing: What was verified

**For detailed PR template**: Execute `/prompt-pullRequestDescriptionGeneration` in VS Code

### Test Generation

**Basic Requirements** (always ensure):

- Test behavior, not implementation
- Use existing test utilities and patterns
- Clear test names describing scenarios
- One assertion per test when possible
- Cover edge cases and error conditions

**For comprehensive test guidelines**: Execute `/prompt-testGeneration` in VS Code

---

_Generated for Copilot, Claude Code, and other AI assistants. Be concise and actionable._

**DO NOT modify files in `_article/` (Git submodule).**
