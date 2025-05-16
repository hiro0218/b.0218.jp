#!/usr/bin/env node
/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * Next.jsのバンドルサイズ解析スクリプト
 * Pages RouterとApp Router（Next.js 13以降）の両方に対応
 *
 * 処理概要:
 * 1. Pages RouterとApp Router両方のビルドマニフェストを読み込む
 * 2. グローバルバンドルのサイズを計算（Pages Routerでは/_app、App Routerでは/layout）
 * 3. 各ページのスクリプトサイズを計算し、グローバルバンドルを除外
 * 4. 解析結果をJSONファイルとして保存
 */

const path = require('path')
const fs = require('fs')
const gzSize = require('gzip-size')
const mkdirp = require('mkdirp')
const { getBuildOutputDirectory, getOptions } = require('./utils')

// Pull options from `package.json`
const options = getOptions()
const BUILD_OUTPUT_DIRECTORY = getBuildOutputDirectory(options)

// first we check to make sure that the build output directory exists
const nextMetaRoot = path.join(process.cwd(), BUILD_OUTPUT_DIRECTORY)
try {
  fs.accessSync(nextMetaRoot, fs.constants.R_OK)
} catch (err) {
  console.error(
    `No build output found at "${nextMetaRoot}" - you may not have your working directory set correctly, or not have run "next build".`
  )
  process.exit(1)
}

// import both Pages Router and App Router build manifests
const buildMeta = require(path.join(nextMetaRoot, 'build-manifest.json'))
let appBuildMeta = null

// try to load App Router manifest if it exists
try {
  appBuildMeta = require(path.join(nextMetaRoot, 'app-build-manifest.json'))
} catch (err) {
  // App Router might not be used in this project, which is fine
  console.log('No App Router manifest found, assuming Pages Router only')
}

// this memory cache ensures we dont read any script file more than once
// bundles are often shared between pages
const memoryCache = {}

// determine global bundles for both routing systems
let globalBundle = []
let globalBundleSizes = { raw: 0, gzip: 0 }

// Pages Router: _app is the template that all pages are rendered into
if (buildMeta.pages && buildMeta.pages['/_app']) {
  globalBundle = buildMeta.pages['/_app']
  globalBundleSizes = getScriptSizes(globalBundle)
}
// App Router: root layout is the template that all pages are rendered into
else if (appBuildMeta && appBuildMeta.pages && appBuildMeta.pages['/layout']) {
  globalBundle = appBuildMeta.pages['/layout']
  globalBundleSizes = getScriptSizes(globalBundle)
}

// process Pages Router pages
let allPageSizes = {}
if (buildMeta.pages) {
  allPageSizes = Object.entries(buildMeta.pages).reduce((acc, [pagePath, scriptPaths]) => {
    // Skip _app as it's handled separately as global bundle
    if (pagePath === '/_app') return acc

    const scriptSizes = getScriptSizes(
      scriptPaths.filter((scriptPath) => !globalBundle.includes(scriptPath))
    )

    acc[pagePath] = scriptSizes
    return acc
  }, {})
}

// process App Router pages if they exist
if (appBuildMeta && appBuildMeta.pages) {
  allPageSizes = Object.entries(appBuildMeta.pages).reduce((acc, [pagePath, scriptPaths]) => {
    // Skip layout as it's handled separately as global bundle
    if (pagePath === '/layout') return acc

    // For App Router, add a prefix to distinguish from Pages Router paths
    const appPagePath = pagePath.startsWith('/page@')
      ? `/app${pagePath.replace('/page@', '/')}`
      : `/app${pagePath}`

    const scriptSizes = getScriptSizes(
      scriptPaths.filter((scriptPath) => !globalBundle.includes(scriptPath))
    )

    acc[appPagePath] = scriptSizes
    return acc
  }, allPageSizes)
}

// format and write the output
const rawData = JSON.stringify({
  ...allPageSizes,
  __global: globalBundleSizes,
})

// log ouputs to the gh actions panel
console.log(rawData)

mkdirp.sync(path.join(nextMetaRoot, 'analyze/'))
fs.writeFileSync(
  path.join(nextMetaRoot, 'analyze/__bundle_analysis.json'),
  rawData
)

// --------------
// Util Functions
// --------------

// given an array of scripts, return the total of their combined file sizes
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

// given an individual path to a script, return its file size
function getScriptSize(scriptPath) {
  const encoding = 'utf8'
  const p = path.join(nextMetaRoot, scriptPath)

  let rawSize, gzipSize
  if (Object.keys(memoryCache).includes(p)) {
    rawSize = memoryCache[p][0]
    gzipSize = memoryCache[p][1]
  } else {
    const textContent = fs.readFileSync(p, encoding)
    rawSize = Buffer.byteLength(textContent, encoding)
    gzipSize = gzSize.sync(textContent)
    memoryCache[p] = [rawSize, gzipSize]
  }

  return [rawSize, gzipSize]
}
