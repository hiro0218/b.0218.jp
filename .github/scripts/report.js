#!/usr/bin/env node
/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * Next.js 16対応バンドルサイズ解析スクリプト
 *
 * Next.js 16の変更点:
 * - app-build-manifest.jsonが廃止
 * - build-manifest.jsonにrootMainFilesが追加（グローバルバンドル）
 * - App Routerのチャンクは.next/static/chunks/app/に配置
 * - app-paths-manifest.jsonでページパスとファイルをマッピング
 */

const path = require('path')
const fs = require('fs')
const gzSize = require('gzip-size')
const mkdirp = require('mkdirp')
const { getBuildOutputDirectory, getOptions } = require('./utils')

// Pull options from `package.json`
const options = getOptions()
const BUILD_OUTPUT_DIRECTORY = getBuildOutputDirectory(options)

// Check build output directory exists
const nextMetaRoot = path.join(process.cwd(), BUILD_OUTPUT_DIRECTORY)
try {
  fs.accessSync(nextMetaRoot, fs.constants.R_OK)
} catch (err) {
  console.error(
    `No build output found at "${nextMetaRoot}" - you may not have your working directory set correctly, or not have run "next build".`
  )
  process.exit(1)
}

// Memory cache for file sizes
const memoryCache = {}

// Load build manifests
const buildMeta = require(path.join(nextMetaRoot, 'build-manifest.json'))
let appPathsManifest = null

// Try to load App Router paths manifest
try {
  appPathsManifest = require(path.join(nextMetaRoot, 'server/app-paths-manifest.json'))
} catch (err) {
  console.log('No App Router paths manifest found')
}

// Calculate global bundle size from rootMainFiles
let globalBundle = buildMeta.rootMainFiles || []
let globalBundleSizes = getScriptSizes(globalBundle)

// Add polyfills to global bundle
if (buildMeta.polyfillFiles && buildMeta.polyfillFiles.length > 0) {
  const polyfillSizes = getScriptSizes(buildMeta.polyfillFiles)
  globalBundleSizes.raw += polyfillSizes.raw
  globalBundleSizes.gzip += polyfillSizes.gzip
}

let allPageSizes = {}

// Define directory paths upfront for logging
const appChunksDir = path.join(nextMetaRoot, 'static/chunks/app')
const sharedChunksDir = path.join(nextMetaRoot, 'static/chunks')

// Process App Router pages if they exist
if (appPathsManifest) {
  console.log(`Processing ${Object.keys(appPathsManifest).length} App Router pages...`)

  console.log(`\n📂 Checking app chunks directory: ${appChunksDir}`)
  console.log(`   Exists: ${fs.existsSync(appChunksDir)}`)

  if (fs.existsSync(appChunksDir)) {
    const topLevelItems = fs.readdirSync(appChunksDir)
    console.log(`   Top-level items (${topLevelItems.length}): ${topLevelItems.slice(0, 5).join(', ')}${topLevelItems.length > 5 ? '...' : ''}`)
  }

  if (fs.existsSync(appChunksDir)) {
    // Scan all JS files in app chunks directory
    const scanDirectory = (dir, basePath = '') => {
      const files = fs.readdirSync(dir, { withFileTypes: true })

      files.forEach(file => {
        const fullPath = path.join(dir, file.name)
        const relativePath = path.join(basePath, file.name)

        if (file.isDirectory()) {
          // Recursively scan subdirectories
          scanDirectory(fullPath, relativePath)
        } else if (file.isFile() && file.name.endsWith('.js')) {
          // Calculate size for each JS file
          const scriptPath = `static/chunks/app/${relativePath}`
          const sizes = getScriptSizes([scriptPath])

          // Map to a readable page path, removing hash
          let pagePath = `/_app/${relativePath.replace(/\\/g, '/').replace(/\.js$/, '')}`
          // Remove hash pattern (e.g., -89866720651bb81e)
          pagePath = pagePath.replace(/-[0-9a-f]+$/, '')

          allPageSizes[pagePath] = sizes
        }
      })
    }

    scanDirectory(appChunksDir)
  }
}

// Process shared chunks (non-app specific)
if (fs.existsSync(sharedChunksDir)) {
  const files = fs.readdirSync(sharedChunksDir)

  files.forEach(file => {
    if (file.endsWith('.js') && !globalBundle.some(gb => gb.includes(file))) {
      const scriptPath = `static/chunks/${file}`
      const sizes = getScriptSizes([scriptPath])
      // Remove hash from filename for consistent tracking
      // Handles patterns like: framework-abc123.js, 123.abc123.js, abc-123.js
      let cleanFileName = file
        .replace(/[-\.][0-9a-f]{8,}\.js$/, '.js')  // Remove hash with - or . separator
        .replace(/^([0-9]+)\..*\.js$/, '$1.js')     // For patterns like 117.hash.js -> 117.js

      allPageSizes[`/_shared/${cleanFileName}`] = sizes
    }
  })
}

// Format and write the output
const rawData = JSON.stringify({
  ...allPageSizes,
  __global: globalBundleSizes,
})

// Log outputs to the GitHub Actions panel
console.log('\n=== Bundle Analysis Results ===')
console.log(`Global bundle: ${formatBytes(globalBundleSizes.raw)} (raw), ${formatBytes(globalBundleSizes.gzip)} (gzip)`)
console.log(`  - rootMainFiles count: ${globalBundle.length}`)
console.log(`  - polyfillFiles count: ${buildMeta.polyfillFiles ? buildMeta.polyfillFiles.length : 0}`)
console.log(`Total pages analyzed: ${Object.keys(allPageSizes).length}`)
console.log(`  - App chunks found: ${fs.existsSync(appChunksDir) ? 'Yes' : 'No'}`)
console.log(`  - Shared chunks found: ${fs.existsSync(sharedChunksDir) ? 'Yes' : 'No'}`)
console.log('================================\n')

mkdirp.sync(path.join(nextMetaRoot, 'analyze/'))
fs.writeFileSync(
  path.join(nextMetaRoot, 'analyze/__bundle_analysis.json'),
  rawData
)

console.log('Bundle analysis saved to:', path.join(nextMetaRoot, 'analyze/__bundle_analysis.json'))

// --------------
// Util Functions
// --------------

// Given an array of scripts, return the total of their combined file sizes
function getScriptSizes(scriptPaths) {
  const res = scriptPaths.reduce(
    (acc, scriptPath) => {
      const [rawSize, gzipSize] = getScriptSize(scriptPath)
      acc.raw += rawSize
      acc.gzip += gzipSize
      return acc
    },
    { raw: 0, gzip: 0 }
  )
  return res
}

// Given an individual path to a script, return its file size
function getScriptSize(scriptPath) {
  const encoding = 'utf8'
  const p = path.join(nextMetaRoot, scriptPath)

  let rawSize, gzipSize
  if (Object.keys(memoryCache).includes(p)) {
    rawSize = memoryCache[p][0]
    gzipSize = memoryCache[p][1]
  } else {
    try {
      if (!fs.existsSync(p)) {
        throw new Error(`File does not exist: ${p}`)
      }
      const textContent = fs.readFileSync(p, encoding)
      rawSize = Buffer.byteLength(textContent, encoding)
      gzipSize = gzSize.sync(textContent)
      memoryCache[p] = [rawSize, gzipSize]
    } catch (err) {
      console.error(`❌ Error processing file`)
      console.error(`   Full path: ${p}`)
      console.error(`   Relative path: ${scriptPath}`)
      console.error(`   Error: ${err.message}`)
      rawSize = 0
      gzipSize = 0
    }
  }

  return [rawSize, gzipSize]
}

// Format bytes to human-readable format
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}
