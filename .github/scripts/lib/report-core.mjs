/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * Next.js 16対応バンドルサイズ解析スクリプト（コアロジック）
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
import { getBuildOutputDirectory, getOptions, safeReadJSON, safeWriteFile } from '../utils.mjs'

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

/**
 * バンドル解析を実行してJSONを出力する
 * @param {object} [params] - 実行パラメータ
 * @param {string} [params.cwd] - 実行ディレクトリ（デフォルト: process.cwd）
 * @param {object} [params.options] - package.jsonのnextBundleAnalysis設定
 * @param {Console} [params.logger] - ロガー
 * @returns {{ outputPath: string, rawData: string }} 出力パスとJSON文字列
 */
export function runReport({ cwd = process.cwd(), options = getOptions(cwd), logger = console } = {}) {
  const BUILD_OUTPUT_DIRECTORY = getBuildOutputDirectory(options)

  const nextMetaRoot = path.join(cwd, BUILD_OUTPUT_DIRECTORY)
  try {
    fs.accessSync(nextMetaRoot, fs.constants.R_OK)
  } catch (err) {
    throw new Error(
      `No build output found at "${nextMetaRoot}" - you may not have your working directory set correctly, or not have run "next build".`
    )
  }

  const memoryCache = new Map()

  const buildMetaPath = path.join(nextMetaRoot, 'build-manifest.json')
  const buildMeta = safeReadJSON(buildMetaPath)

  if (!buildMeta) {
    throw new Error(`build-manifest.json not found at ${buildMetaPath}`)
  }

  let globalBundle = buildMeta.rootMainFiles || []
  let globalBundleSizes = getScriptSizes(globalBundle, nextMetaRoot, memoryCache, logger)

  if (buildMeta.polyfillFiles && buildMeta.polyfillFiles.length > 0) {
    const polyfillSizes = getScriptSizes(buildMeta.polyfillFiles, nextMetaRoot, memoryCache, logger)
    globalBundleSizes.raw += polyfillSizes.raw
    globalBundleSizes.gzip += polyfillSizes.gzip
  }

  let allPageSizes = {}

  const appChunksDir = path.join(nextMetaRoot, 'static/chunks/app')
  const sharedChunksDir = path.join(nextMetaRoot, 'static/chunks')

  logger.log(`\n📂 Checking app chunks directory: ${appChunksDir}`)
  logger.log(`   Exists: ${fs.existsSync(appChunksDir)}`)

  if (fs.existsSync(appChunksDir)) {
    const topLevelItems = fs.readdirSync(appChunksDir)
    logger.log(`   Top-level items (${topLevelItems.length}): ${topLevelItems.slice(0, 5).join(', ')}${topLevelItems.length > 5 ? '...' : ''}`)

    const appPageSizes = scanJsFilesRecursively({
      dir: appChunksDir,
      basePath: '',
      hashPattern: NEXT_JS_BUILD_HASH_SUFFIX,
      pathPrefix: '/_app/',
      nextMetaRoot,
      memoryCache,
      logger,
    })
    Object.assign(allPageSizes, appPageSizes)
  }

  if (fs.existsSync(sharedChunksDir)) {
    const files = fs.readdirSync(sharedChunksDir)

    files.forEach(file => {
      if (file.endsWith('.js') && !globalBundle.some(gb => gb.includes(file))) {
        const scriptPath = `static/chunks/${file}`
        const sizes = getScriptSizes([scriptPath], nextMetaRoot, memoryCache, logger)

        let cleanFileName = file
          .replace(NEXT_JS_CHUNK_HASH_PATTERN, '.js')
          .replace(NUMERIC_CHUNK_ID_PATTERN, '$1.js')

        allPageSizes[`/_shared/${cleanFileName}`] = sizes
      }
    })
  }

  const rawData = JSON.stringify({
    ...allPageSizes,
    __global: globalBundleSizes,
  })

  logger.log('\n=== Bundle Analysis Results ===')
  logger.log(`Global bundle: ${formatBytes(globalBundleSizes.raw)} (raw), ${formatBytes(globalBundleSizes.gzip)} (gzip)`)
  logger.log(`  - rootMainFiles count: ${globalBundle.length}`)
  logger.log(`  - polyfillFiles count: ${buildMeta.polyfillFiles ? buildMeta.polyfillFiles.length : 0}`)
  logger.log(`Total pages analyzed: ${Object.keys(allPageSizes).length}`)
  logger.log(`  - App chunks found: ${fs.existsSync(appChunksDir) ? 'Yes' : 'No'}`)
  logger.log(`  - Shared chunks found: ${fs.existsSync(sharedChunksDir) ? 'Yes' : 'No'}`)
  logger.log('================================\n')

  const outputPath = path.join(nextMetaRoot, 'analyze/__bundle_analysis.json')
  safeWriteFile(outputPath, rawData)

  logger.log('Bundle analysis saved to:', outputPath)

  return { outputPath, rawData }
}

/**
 * Recursively scans a directory for JavaScript files and calculates their bundle sizes
 * @param {object} params - 実行パラメータ
 * @param {string} params.dir - Directory to scan
 * @param {string} params.basePath - Relative base path for constructing page paths
 * @param {RegExp} params.hashPattern - Pattern to remove from page paths
 * @param {string} params.pathPrefix - Prefix to prepend to page paths
 * @param {string} params.nextMetaRoot - Next.js build output root
 * @param {Map<string, [number, number]>} params.memoryCache - サイズキャッシュ
 * @param {Console} params.logger - ロガー
 * @returns {Object.<string, {raw: number, gzip: number}>} Map of page paths to size data
 */
export function scanJsFilesRecursively({
  dir,
  basePath,
  hashPattern,
  pathPrefix,
  nextMetaRoot,
  memoryCache,
  logger,
}) {
  const results = {}
  const files = fs.readdirSync(dir, { withFileTypes: true })

  files.forEach(file => {
    const fullPath = path.join(dir, file.name)
    const relativePath = path.join(basePath, file.name)

    if (file.isDirectory()) {
      const subResults = scanJsFilesRecursively({
        dir: fullPath,
        basePath: relativePath,
        hashPattern,
        pathPrefix,
        nextMetaRoot,
        memoryCache,
        logger,
      })
      Object.assign(results, subResults)
    } else if (file.isFile() && file.name.endsWith('.js')) {
      const scriptPath = `static/chunks/app/${relativePath}`
      const sizes = getScriptSizes([scriptPath], nextMetaRoot, memoryCache, logger)

      let pagePath = `${pathPrefix}${relativePath.replace(/\\/g, '/').replace(/\.js$/, '')}`
      pagePath = pagePath.replace(hashPattern, '')

      results[pagePath] = sizes
    }
  })

  return results
}

/**
 * Calculates the total raw and gzipped sizes for an array of script files
 * @param {string[]} scriptPaths - Array of relative script paths from Next.js build output
 * @param {string} nextMetaRoot - Next.js build output root
 * @param {Map<string, [number, number]>} memoryCache - サイズキャッシュ
 * @param {Console} logger - ロガー
 * @returns {{raw: number, gzip: number}} Object containing total raw and gzipped sizes in bytes
 */
function getScriptSizes(scriptPaths, nextMetaRoot, memoryCache, logger) {
  const res = scriptPaths.reduce(
    (acc, scriptPath) => {
      const [rawSize, gzipSize] = getScriptSize(scriptPath, nextMetaRoot, memoryCache, logger)
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
 * @param {string} nextMetaRoot - Next.js build output root
 * @param {Map<string, [number, number]>} memoryCache - サイズキャッシュ
 * @param {Console} logger - ロガー
 * @returns {[number, number]} Tuple of [rawSize, gzipSize] in bytes
 */
function getScriptSize(scriptPath, nextMetaRoot, memoryCache, logger) {
  const encoding = 'utf8'
  const p = path.join(nextMetaRoot, scriptPath)

  let rawSize, gzipSize
  if (memoryCache.has(p)) {
    const cached = memoryCache.get(p)
    rawSize = cached[0]
    gzipSize = cached[1]
  } else {
    try {
      if (!fs.existsSync(p)) {
        throw new Error(`File does not exist: ${p}`)
      }
      const textContent = fs.readFileSync(p, encoding)
      rawSize = Buffer.byteLength(textContent, encoding)
      gzipSize = gzipSizeSync(textContent)
      memoryCache.set(p, [rawSize, gzipSize])
    } catch (err) {
      logger.error('❌ Error processing file')
      logger.error(`   Full path: ${p}`)
      logger.error(`   Relative path: ${scriptPath}`)
      logger.error(`   Error: ${err.message}`)
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
 */
export function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}
