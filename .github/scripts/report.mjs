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

import path from 'path'
import fs from 'fs'
import { gzipSizeSync } from 'gzip-size'
import { getBuildOutputDirectory, getOptions, safeReadJSON, safeWriteFile } from './utils.mjs'

// Hash pattern constants for Next.js build outputs
// Next.js generates content hashes with hexadecimal characters (0-9a-f)
// Minimum hash length is typically 8 characters, but can be longer
const NEXT_JS_HASH_MIN_LENGTH = 8

// Pattern to match and remove Next.js build hash suffix from App Router paths
// Example: "page-89866720651bb81e" -> removes "-89866720651bb81e"
const NEXT_JS_BUILD_HASH_SUFFIX = /-[0-9a-f]+$/

// Pattern to match chunk files with hash in filename
// Example: "framework-abc123.js" or "123.abc123.js"
const NEXT_JS_CHUNK_HASH_PATTERN = new RegExp(`[-\\.][0-9a-f]{${NEXT_JS_HASH_MIN_LENGTH},}\\.js$`)

// Pattern to extract numeric chunk ID from filename
// Example: "117.abc123.js" -> captures "117"
const NUMERIC_CHUNK_ID_PATTERN = /^([0-9]+)\..*\.js$/

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
const buildMetaPath = path.join(nextMetaRoot, 'build-manifest.json')
const buildMeta = safeReadJSON(buildMetaPath)

if (!buildMeta) {
  console.error(`Error: build-manifest.json not found at ${buildMetaPath}`)
  console.error('Please run "next build" first.')
  process.exit(1)
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
console.log(`\n📂 Checking app chunks directory: ${appChunksDir}`)
console.log(`   Exists: ${fs.existsSync(appChunksDir)}`)

if (fs.existsSync(appChunksDir)) {
  const topLevelItems = fs.readdirSync(appChunksDir)
  console.log(`   Top-level items (${topLevelItems.length}): ${topLevelItems.slice(0, 5).join(', ')}${topLevelItems.length > 5 ? '...' : ''}`)

  // Scan all JS files in app chunks directory
  const appPageSizes = scanJsFilesRecursively(
    appChunksDir,
    '',
    NEXT_JS_BUILD_HASH_SUFFIX,
    '/_app/'
  )
  Object.assign(allPageSizes, appPageSizes)
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
        .replace(NEXT_JS_CHUNK_HASH_PATTERN, '.js')  // Remove hash with - or . separator
        .replace(NUMERIC_CHUNK_ID_PATTERN, '$1.js')  // For patterns like 117.hash.js -> 117.js

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

const outputPath = path.join(nextMetaRoot, 'analyze/__bundle_analysis.json')
safeWriteFile(outputPath, rawData)

console.log('Bundle analysis saved to:', outputPath)

// --------------
// Utility Functions
// --------------

/**
 * Recursively scans a directory for JavaScript files and calculates their bundle sizes
 * @param {string} dir - Directory to scan
 * @param {string} basePath - Relative base path for constructing page paths
 * @param {RegExp} hashPattern - Pattern to remove from page paths (e.g., content hashes)
 * @param {string} pathPrefix - Prefix to prepend to page paths (e.g., '/_app/')
 * @returns {Object.<string, {raw: number, gzip: number}>} Map of page paths to size data
 */
function scanJsFilesRecursively(dir, basePath, hashPattern, pathPrefix) {
  const results = {}
  const files = fs.readdirSync(dir, { withFileTypes: true })

  files.forEach(file => {
    const fullPath = path.join(dir, file.name)
    const relativePath = path.join(basePath, file.name)

    if (file.isDirectory()) {
      // Recursively scan subdirectories
      const subResults = scanJsFilesRecursively(fullPath, relativePath, hashPattern, pathPrefix)
      Object.assign(results, subResults)
    } else if (file.isFile() && file.name.endsWith('.js')) {
      // Calculate size for each JS file
      const scriptPath = `static/chunks/app/${relativePath}`
      const sizes = getScriptSizes([scriptPath])

      // Map to a readable page path, removing hash
      let pagePath = `${pathPrefix}${relativePath.replace(/\\/g, '/').replace(/\.js$/, '')}`
      // Remove hash pattern (e.g., -89866720651bb81e)
      pagePath = pagePath.replace(hashPattern, '')

      results[pagePath] = sizes
    }
  })

  return results
}

/**
 * Calculates the total raw and gzipped sizes for an array of script files
 * @param {string[]} scriptPaths - Array of relative script paths from Next.js build output
 * @returns {{raw: number, gzip: number}} Object containing total raw and gzipped sizes in bytes
 * @example
 *   getScriptSizes(['static/chunks/main.js', 'static/chunks/framework.js'])
 *   // => { raw: 150000, gzip: 50000 }
 */
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

/**
 * Calculates the raw and gzipped size of a single script file
 * Uses an in-memory cache to avoid re-calculating sizes for the same file
 * @param {string} scriptPath - Relative path to the script file from Next.js build output
 * @returns {[number, number]} Tuple of [rawSize, gzipSize] in bytes
 * @example
 *   getScriptSize('static/chunks/main.js') // => [100000, 35000]
 */
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
      gzipSize = gzipSizeSync(textContent)
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

/**
 * Formats byte count to human-readable string with appropriate unit
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted string (e.g., "1.5 KB", "250 Bytes", "2.3 MB")
 * @example
 *   formatBytes(0) // => '0 Bytes'
 *   formatBytes(1024) // => '1 KB'
 *   formatBytes(1536) // => '1.5 KB'
 *   formatBytes(1048576) // => '1 MB'
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}
