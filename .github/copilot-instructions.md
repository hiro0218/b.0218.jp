# AI Assistant Instructions

> **Note**: This file is the source for symlinks `AGENTS.md` and `CLAUDE.md` to enforce consistency among AI assistants.

## Language Preference

**IMPORTANT: Always respond in Japanese unless explicitly asked otherwise.**

- Use Japanese for all explanations, comments, and documentation
- Technical terms and code may remain in English
- Maintain a professional tone in Japanese (desu/masu form)

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

## 🔴 Critical Rules (Must Follow)

These rules are **CRITICAL**. Violations can cause runtime errors, build failures, or serious bugs.

### Priority Levels

- 🔴 **CRITICAL**: Must Follow (violations cause severe errors)
- 🟡 **IMPORTANT**: Should Follow (maintenance/quality may degrade)
- ⚪ **RECOMMENDED**: Best Practices (consistency improvement)

### 1. Zero Margin Principle

**RULE**: UI components must not set external margins. Parents control spacing with `gap` or `Stack`.

**Details**: [components.instructions.md - Zero Margin Principle](.github/components.instructions.md#zero-margin-principle-critical)

---

### 2. Layer Dependencies

**RULE**: UI ↔ Functional (independent), Page → UI/Functional, App → all layers

**Details**: [components.instructions.md - Layer Dependencies](.github/components.instructions.md#layer-dependencies-critical)

---

### 3. React Compiler Check

**RULE**: Check `reactCompiler` in `~/next.config.mjs` before suggesting optimizations.

**Details**: [optimization.instructions.md - React Compiler](../.claude/rules/optimization.instructions.md#react-compiler-react-19)

---

### 4. Content Source Read-Only

**RULE**: Do not edit `_article/_posts/*.md` directly. Always update content via `npm run prebuild`.

**Details**: [content-pipeline.instructions.md](../.claude/rules/content-pipeline.instructions.md)

---

### 5. Hover States Handling

**RULE**: Write `:hover` directly. Do not manually write `@media (any-hover: hover)`.

**Details**: [styling.instructions.md - Hover States](.github/styling.instructions.md#hover-states-critical)

---

### 6. CSS Variables Mandatory

**RULE**: Colors, spacing, and fonts must use CSS variables (`var(--colors-*)`, `var(--spacing-*)`).

**Details**: [styling.instructions.md - CSS Variables](.github/styling.instructions.md#css-variables-critical)

---

### 7. Server First Principle

**RULE**: Default to Server Components. Use `'use client'` only when interaction is required.

**Details**: [components.instructions.md - Server First Principle](.github/components.instructions.md#server-first-principle-important)

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

### Component Architecture

Components follow strict layering and design principles. For details, see [🔴 Critical Rules](#critical-rules-must-follow) and [components.instructions.md](.github/components.instructions.md).

- **Layer Responsibilities**: App (shell), Page (logic), UI (visual), Functional (utilities)

## Development

### Styling with Panda CSS

Use project-specific imports and CSS variables:

- **Import**: `import { css, styled } from '@/ui/styled'`
- **Hover States**: Write `:hover` directly (PostCSS plugin wraps automatically)
- **CSS Variables**: Required for colors, spacing, radii (`var(--colors-*)`, `var(--spacing-*)`)

### Path Aliases

- `@/*` → `src/*` (TypeScript import alias)
- `~/*` → project root (used in this document only)

**Note**: In this document, `~/` refers to the project root directory, not the user's home directory.

### Content Pipeline

Content processing flow:

1. **Source**: `_article/_posts/*.md` (Git submodule, **read-only**)
2. **Processing**: `npm run prebuild` → article JSON, similarity JSON, OGP images
3. **Consumption**: Next.js SSG reads JSON at build time

**Critical**: NEVER edit `_article/_posts/*.md` directly.

### Testing

- Framework: Vitest with React Testing Library
- Coverage: `npm run coverage`
- Focus: Test behavior, not implementation
- One assertion per test when possible
- Cover edge cases and error conditions

## File-Specific Rules

These rules apply automatically based on file paths:

| File Pattern                   | Rules                                                      | Details                                             |
| ------------------------------ | ---------------------------------------------------------- | --------------------------------------------------- |
| `src/components/**/*`          | Layer dependencies, zero-margin, server-first              | `.github/components.instructions.md`                |
| `**/*.tsx` (styling)           | Panda CSS imports, CSS variables, hover states             | `.github/styling.instructions.md`                   |
| `**/*.{ts,tsx}` (types)        | Type safety, no `any`, type-only imports                   | `.github/typescript.instructions.md`                |
| `_article/**/*`, `build/**/*`  | Read-only submodule, content pipeline flow                 | `../.claude/rules/content-pipeline.instructions.md` |
| `~/next.config.mjs`, `use*.ts` | React Compiler scope, custom hook memoization              | `../.claude/rules/optimization.instructions.md`     |
| `**/*.test.ts{,x}`             | Vitest + React Testing Library, one assertion per test     | `../.claude/rules/testGeneration.md`                |
| `**/*.tsx` (Client)            | Require `'use client'` directive, verify necessity         | -                                                   |
| `**/*.tsx` (Server)            | Default mode, no `'use client'` unless interactive         | -                                                   |
| `~/biome.json`                 | Verify before suggesting layer dependency changes          | -                                                   |
| `~/panda.config.mts`           | Verify before styling convention changes                   | -                                                   |
| `~/postcss.config.cjs`         | Verify before CSS processing changes (hover media queries) | -                                                   |

## Task-Specific Rules

Detailed guidelines for specific development tasks:

| Task            | File                                                | Tool        |
| --------------- | --------------------------------------------------- | ----------- |
| Code Generation | `.claude/rules/codeGeneration.md`                   | Claude Code |
| Code Review     | `.claude/rules/codeReview.md`                       | Claude Code |
| Commit Messages | `.claude/rules/commitMessageGeneration.md`          | Claude Code |
| PR Descriptions | `.claude/rules/pullRequestDescriptionGeneration.md` | Claude Code |
| Test Generation | `.claude/rules/testGeneration.md`                   | Claude Code |

**Note**:

- **Claude Code rules**:
  - Project-specific: `.claude/rules/` (optimizations, content pipeline, prompts)
  - Shared with Copilot: `.github/` (components, styling, TypeScript)
- **GitHub Copilot rules**:
  - Direct access: `.github/` (components, styling, TypeScript)
- **Separation**: Claude Code advanced features in `.claude/rules/`, basic coding rules shared via `.github/`

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

**React Compiler**:

⚠️ **CRITICAL: Read `~/next.config.mjs` before suggesting optimizations**

React Compiler (`reactCompiler: true`) handles component rendering automatically.

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
