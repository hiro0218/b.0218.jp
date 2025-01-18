# b.0218.jp

This repository contains the source code for `b.0218.jp`, a web application built using Next.js and TypeScript. Article data is stored in a separate repository and loaded through a submodule.

## Technologies used

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Emotion](https://emotion.sh/)

Article data is managed in a separate repository and loaded via submodule.

## Preparing for development

Before you begin development, make sure to prepare the .env file with the following contents:

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

To start the Next.js development server, run the following command:

```
npm run dev
```

### Production build

To execute the Next.js build for production, run the following command:

```
npm run build
```

---

## Repository Stats

![Alt](https://repobeats.axiom.co/api/embed/b00d97f83f44e270e58b711cbf5ead377bee099c.svg "Repobeats analytics image")

