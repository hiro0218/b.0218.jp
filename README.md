# b.0218.jp

This repository maintains the source code for b.0218.jp

## Technologies used

- Next.js
- TypeScript

Article data is managed in a separate repository and loaded via submodule.

## Preparing for development

First, prepare the .env file.

```ini
TZ=Asia/Tokyo
GITHUB_GRAPHQL_TOKEN="GitHub Token"
NEXT_PUBLIC_GA_MEASUREMENT_ID="Google Analytics ID"
```

You need to run `prebuild` because you need to pre-build the markdown files.

```
npm run prebuild
```

However, if you have run `npm run build` beforehand, you do not need to run `npm run prebuild`.

### Development

The Next.js development server will be started.

```
npm run dev
```

### Production build

The Next.js build will be executed.

```
npm run build
```
