# b.0218.jp

This repository contains the source code for `b.0218.jp`, a Japanese-focused blog built with Next.js, React 19, and TypeScript. Article data is stored in a separate repository and loaded through a submodule.

## Technologies used

### Core

- [Next.js](https://nextjs.org/) 16.x (App Router)
- [React](https://react.dev/) 19.x
- [TypeScript](https://www.typescriptlang.org/)
- [Panda CSS](https://panda-css.com/) - CSS-in-JS styling system

### Development

- [Biome](https://biomejs.dev/) - Fast linter and formatter
- [Vitest](https://vitest.dev/) - Unit testing framework
- [Playwright](https://playwright.dev/) - Screenshot generation for OG images

### Features

- **ML-Powered Recommendations**: Article similarity analysis using Japanese morphological analysis (kuromoji)
- **Analytics Integration**: Google Analytics with popular articles tracking
- **OG Image Generation**: Automated Open Graph image generation using Playwright
- **Static Generation**: Pre-built article data for optimal performance

Article data is managed in a separate repository and loaded via submodule.

## Architecture

This project is designed to complete heavy processing—such as ML inference and external API integrations—entirely at build time (`prebuild`), keeping the runtime limited to serving static files. The main flows are shown in the sequence diagrams below.

### 1. Prebuild pipeline: from submodule to `dist/`

When `npm run build` runs, npm's pre-script mechanism automatically runs `prebuild` (`scripts/prebuild.sh`) first. Everything from fetching article data via the Git submodule, through article conversion, the parallel processing of similarity/search/popular articles/tag categorization, to OG image generation—all interaction with external systems (GitHub, linked sites, Google Analytics, Hatena Bookmark) is consolidated into this stage.

```mermaid
sequenceDiagram
    actor Dev as Developer / CI
    participant Git as Git submodule
    participant Article as build:article
    participant Web as External site (link preview)
    participant Dist as dist/
    participant Parallel as similarity/search/popular/category
    participant GA as GA Data API / Hatena API
    participant Ogp as build:ogp

    Dev->>Git: git submodule update --remote
    Dev->>Article: npm run build:article
    Article->>Article: Parse _article/_posts/*.md
    Article->>Web: Fetch OGP meta for URLs in the article body
    Web-->>Article: OGP meta
    Article->>Dist: Output posts/*.json, posts-list.json, tags.json
    Dev->>Parallel: Run in parallel (no interdependencies)
    Parallel->>Dist: Read posts/*.json, posts-list.json, tags.json
    Parallel->>GA: Fetch page views / bookmark counts
    GA-->>Parallel: Aggregated data
    Parallel->>Dist: Output posts-similarity.json, search.json, posts-popular.json, tag-categories.json
    Dev->>Ogp: npm run build:ogp (can be skipped with SKIP_OGP=true)
    Ogp->>Dist: Read the article list
    Ogp-->>Dev: Generate public/images/ogp/*.jpg
```

### 2. SSG build and request handling

Since static HTML is generated from the JSON produced under `dist/` at build time, there is no server-side processing at request time. The only runtime data loading is the dynamic import of `search.json` when the search dialog is opened.

```mermaid
sequenceDiagram
    actor Dev as Developer / CI
    participant Next as next build (SSG)
    participant Page as PostPage
    participant Data as getPostPageData
    participant Dist as dist/*.json
    participant CDN as CDN (Vercel)
    actor Browser

    Dev->>Next: next build
    Next->>Dist: Read posts-list.json (shape validation)
    Next->>Page: Enumerate all article routes via generateStaticParams
    loop For each article
        Page->>Data: getPostPageData(slug)
        Data->>Dist: posts/{slug}.json, posts-similarity.json, tags-similarity.json, posts-popular.json, tags.json
        Dist-->>Data: Body, related articles, related tags, popularity
        Data-->>Page: Composed page data
        Page-->>Next: Static HTML (including OGP image URL)
    end
    Next->>CDN: Deploy static HTML
    Browser->>CDN: Request the page
    CDN-->>Browser: Static HTML (no server processing)
    Browser->>Browser: Dynamically import search.json on search interaction
```

### 3. ML-powered article similarity

Related article recommendations are computed by combining tag-based similarity (NPMI) with body-text similarity (morphological analysis via kuromoji + TF-IDF). Morphological analysis is distributed across `worker_threads`, falling back to synchronous processing on failure.

```mermaid
sequenceDiagram
    participant Main as build:similarity
    participant Dist as dist/
    participant Tag as Tag similarity (NPMI)
    participant Worker as worker_threads (kuromoji)
    participant Score as Scoring (TF-IDF)

    Main->>Dist: Read posts/*.json, tags.json
    Main->>Tag: Compute NPMI from the tag co-occurrence matrix
    Tag-->>Main: tags-similarity.json
    Main->>Worker: Split article bodies and send (fewer than 16 articles run synchronously)
    Worker->>Worker: Morphological analysis and part-of-speech filtering with kuromoji (IPADIC)
    Worker-->>Main: Token sequences (Main falls back to synchronous processing on failure)
    Main->>Score: Vectorize with BM25 IDF + sublinear TF
    Score->>Score: Narrow down to articles sharing tags (up to 50)
    Score->>Score: Combine tag similarity (0.6) + body cosine similarity (0.4) + freshness bonus
    Score-->>Main: Top 6 per article
    Main->>Dist: Output posts-similarity.json
```

### 4. OG image generation

Instead of a serverless-oriented API like `@vercel/og`, OG images are generated by taking screenshots with a locally launched Hono server and Playwright (Chromium). This is parallelized using cluster workers and a page pool.

```mermaid
sequenceDiagram
    participant Main as build:ogp
    participant Mgr as OGPServerManager
    participant Hono as Hono server (child process, port 3000)
    participant Pool as WorkerPool
    participant Worker as cluster worker
    participant Pw as Playwright Chromium
    participant Fs as public/images/ogp/

    Main->>Mgr: Request server startup
    Mgr->>Hono: spawn (serve template via hono/jsx)
    Mgr->>Hono: Check readiness (fetch polling)
    Main->>Pool: Split the article list from dist/posts-list.json
    Pool->>Worker: fork + send via IPC (CPU count, up to 4)
    Worker->>Pw: Launch Chromium, establish a pool of 8 pages
    Pw->>Hono: Connect each page to the Hono server
    loop For each article
        Worker->>Pw: Inject title/theme color into the DOM, wait for font loading
        Pw->>Fs: Save a 1200x630 JPEG screenshot
    end
    Worker-->>Main: Notify completion/failure via IPC
    Main->>Hono: Instruct server shutdown
    Main->>Pw: Instruct browser termination
```

## Preparing for development

Before you begin development, make sure to prepare the .env file with the following contents:

```ini
# Required for consistent timestamps
TZ=Asia/Tokyo

# Google Analytics (required for popular articles feature)
GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
GA_PROPERTY_ID="123456789"
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

You need to run `prebuild` to process markdown files, generate article data, and create OG images:

```bash
npm run prebuild
```

**Note**: If you have run `npm run build` beforehand, you do not need to run `npm run prebuild`.

## Development

### Start development server

The development server runs with Next.js experimental HTTPS feature (`--experimental-https`) on port 8080:

```bash
npm run dev
```

Access at: **`https://localhost:8080`** (HTTPS only, self-signed certificate by Next.js)

### Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run coverage
```

### Linting

```bash
# Check code with Biome
npm run lint

# Auto-fix with Biome
npm run lint:write

# Lint CSS
npm run lint:css

# Lint markup (HTML/JSX)
npm run lint:markup
```

### Production build

To execute the Next.js build for production:

```bash
npm run prebuild  # Required: process articles and generate assets
npm run build     # Build the application
```

### Bundle analysis

To analyze the production bundle size:

```bash
npm run build:analyzer
```

---

## Repository Stats

![Alt](https://repobeats.axiom.co/api/embed/b00d97f83f44e270e58b711cbf5ead377bee099c.svg 'Repobeats analytics image')
