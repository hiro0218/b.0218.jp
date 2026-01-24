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

![Alt](https://repobeats.axiom.co/api/embed/b00d97f83f44e270e58b711cbf5ead377bee099c.svg "Repobeats analytics image")

