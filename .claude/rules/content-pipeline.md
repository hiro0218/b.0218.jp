---
description: 'Content pipeline and Git submodule management rules'
applyTo: '{_article/**/*,scripts/prebuild/**/*,build/**/*}'
paths:
  - '_article/**/*'
  - 'scripts/prebuild/**/*'
  - 'build/**/*'
---

# Content Pipeline Rules

**Applies to**: `_article/**/*`, `scripts/prebuild/**/*`, `build/**/*`

**Purpose**: Prevent content source modifications and ensure proper build pipeline usage.

## Critical Rule

⚠️ **NEVER edit files in `_article/_posts/*.md` directly**

These files are a **Git submodule** (read-only).

## Content Source

### Git Submodule Structure

```
_article/                    ← Git submodule (separate repository)
└── _posts/                  ← Markdown source files
    ├── 2024-01-01-post.md
    ├── 2024-01-02-post.md
    └── ...
```

**Properties**:

- External repository
- Managed separately from main project
- Content team owns and maintains
- Development team consumes as read-only

### Why Read-Only?

1. **Separation of concerns**: Content team manages content repository independently
2. **Version control**: Content changes tracked in separate repository
3. **Build process**: Main project pulls latest content during prebuild

## Content Pipeline Flow

### 1. Source Update

```bash
# Updates submodule to latest commit
git submodule update --remote
```

Automatically executed by `npm run prebuild`.

### 2. Processing (`build/article/`)

**Input**: `_article/_posts/*.md` (Markdown files)

**Processing**:

- Parse Markdown with front matter (gray-matter)
- Extract metadata (title, date, tags, etc.)
- Convert Markdown to HTML (unified, remark, rehype)
- Perform morphological analysis (kuromoji) for Japanese text
- Calculate TF-IDF for content similarity
- Generate table of contents (mokuji.js)

**Output**: JSON files in `.next/cache/article/` or similar

**Scripts**:

- `build/article/index.ts` - Main processing
- `build/article/parser.ts` - Markdown parsing
- `build/article/analyzer.ts` - Text analysis

### 3. Similarity Calculation (`build/similarity/`)

**Input**: Processed article JSON

**Processing**:

- Calculate cosine similarity between articles
- Generate similarity matrix
- Rank related articles

**Output**: JSON with article relationships

**Scripts**:

- `build/similarity/index.ts` - Similarity calculation
- `build/similarity/vectorizer.ts` - Text vectorization

### 4. Popular Posts (`build/popular/`)

**Input**: Google Analytics data (via API)

**Processing**:

- Fetch page view data
- Rank articles by popularity
- Generate popular posts list

**Output**: JSON with popularity rankings

**Scripts**:

- `build/popular/index.ts` - GA data fetching

### 5. OGP Image Generation (`build/ogp/`)

**Input**: Article metadata (title, excerpt)

**Processing**:

- Render article preview using Playwright
- Capture screenshot
- Optimize image
- Save as PNG

**Output**: `public/ogp/{slug}.png`

**Scripts**:

- `build/ogp/index.ts` - Image generation
- `build/ogp/server.tsx` - Preview rendering

### 6. Consumption (SSG)

**Input**: Generated JSON files

**Processing**:

- Next.js reads JSON during build
- `generateStaticParams` creates static pages
- `getStaticProps` equivalent (App Router)

**Output**: Static HTML pages

## Prebuild Command

**Always run before development or build**:

```bash
npm run prebuild
```

**What it does**:

```json
{
  "scripts": {
    "prebuild": "git submodule update --remote && npm run build:article && npm run build:similarity && npm run build:popular && npm run build:ogp"
  }
}
```

**Execution order**:

1. Update Git submodule (`_article/`)
2. Process articles → JSON
3. Calculate similarity → JSON
4. Fetch popular posts → JSON
5. Generate OGP images → PNG

**Why it's critical**:

- Ensures latest content is available
- Regenerates all derived data
- Updates similarity calculations
- Refreshes OGP images

## File Modification Rules

### ✅ CAN Modify

- `build/**/*` - Build scripts (processing logic)
- `scripts/**/*` - Helper scripts
- `src/lib/posts.ts` - JSON consumption logic
- `src/app/**/page.tsx` - Page components consuming data

### ❌ CANNOT Modify

- `_article/_posts/*.md` - Content source (Git submodule)
- Generated JSON files (will be overwritten)
- Generated OGP images (will be overwritten)

### 🔄 TEMPORARY Modifications (Development)

For testing purposes only:

```bash
# Temporarily modify content for local testing
cd _article
# Edit files
cd ..
npm run build:article

# Revert before committing
git submodule update --remote
```

## Common Tasks

### Adding New Content

❌ **Do NOT**:

```bash
# Wrong - editing submodule directly
vim _article/_posts/2024-01-01-new-post.md
```

✅ **Do THIS**:

1. Create content in the separate content repository
2. Commit and push in content repository
3. Update submodule in main project:
   ```bash
   npm run prebuild
   ```

### Modifying Content Processing

✅ **Correct workflow**:

1. Edit `build/article/*.ts` (processing logic)
2. Run `npm run build:article` to test
3. Verify output JSON structure
4. Commit changes to main repository

### Debugging Content Issues

```bash
# 1. Verify submodule status
git submodule status

# 2. Check latest content
ls -la _article/_posts/

# 3. Reprocess with debug output
DEBUG=true npm run build:article

# 4. Inspect generated JSON
cat .next/cache/article/*.json | jq

# 5. Test OGP generation locally
npm run dev:ogp
```

## Data Flow Diagram

```
┌─────────────────────┐
│ _article/_posts/*.md│ (Git submodule, read-only)
└──────────┬──────────┘
           │ npm run build:article
           ↓
┌─────────────────────┐
│ JSON (processed)    │
└──────────┬──────────┘
           │ npm run build:similarity
           ↓
┌─────────────────────┐
│ JSON (similarity)   │
└──────────┬──────────┘
           │ npm run build:popular
           ↓
┌─────────────────────┐
│ JSON (popular)      │
└──────────┬──────────┘
           │ npm run build:ogp
           ↓
┌─────────────────────┐
│ PNG (OGP images)    │
└──────────┬──────────┘
           │ npm run build / npm run dev
           ↓
┌─────────────────────┐
│ Static HTML Pages   │
└─────────────────────┘
```

## Environment Variables

**Build-time**:

- `TZ=Asia/Tokyo` - Timezone for date processing
- `DEBUG=true` - Enable debug output
- `ANALYZE=true` - Bundle analysis mode

**Runtime** (for popular posts):

- `GOOGLE_APPLICATION_CREDENTIALS` - GA API credentials path
- `GA_PROPERTY_ID` - Google Analytics property ID

## Troubleshooting

### Issue: Content not updating

```bash
# Solution: Force submodule update
git submodule update --remote --force
npm run prebuild
```

### Issue: OGP images not generating

```bash
# Solution: Verify Playwright installation
playwright install --only-shell
npm run build:ogp
```

### Issue: Similarity calculation failing

```bash
# Solution: Clear cache and rebuild
rm -rf .next/cache
npm run prebuild
```

## Verification Checklist

Before committing content pipeline changes:

- [ ] `_article/_posts/*.md` files are NOT modified
- [ ] Build scripts changes are tested with `npm run prebuild`
- [ ] Generated JSON structure is validated
- [ ] OGP images are regenerating correctly
- [ ] Development server works with new data
- [ ] Production build completes successfully
