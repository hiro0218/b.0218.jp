#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// edited to work with the appdir

const path = require('path');
const fs = require('fs');
const { gzipSizeSync } = require('gzip-size');
const mkdirp = require('mkdirp');

// Pull options from `package.json`
const options = getOptions();
const BUILD_OUTPUT_DIRECTORY = getBuildOutputDirectory(options);

// first we check to make sure that the build output directory exists
const nextMetaRoot = path.join(process.cwd(), BUILD_OUTPUT_DIRECTORY);
try {
  fs.accessSync(nextMetaRoot, fs.constants.R_OK);
} catch (err) {
  console.error(
    `No build output found at "${nextMetaRoot}" - you may not have your working directory set correctly, or not have run "next build".`,
  );
  process.exit(1);
}

// this memory cache ensures we dont read any script file more than once
// bundles are often shared between pages
const memoryCache = {};

// 結果を格納するオブジェクト
const result = {};

// Pages Router（従来のルーター）のサイズ計算
try {
  // Check if build-manifest.json exists
  const buildManifestPath = path.join(nextMetaRoot, 'build-manifest.json');
  if (fs.existsSync(buildManifestPath)) {
    console.log('Analyzing Pages Router bundles from build-manifest.json');
    const buildMeta = require(buildManifestPath);

    // Pages Routerでは _app.js がグローバルコンポーネント
    if (buildMeta.pages && buildMeta.pages['/_app']) {
      const globalBundle = buildMeta.pages['/_app'];
      const globalBundleSizes = getScriptSizes(globalBundle);

      // Set the global bundle info
      result.pages = {
        __global: globalBundleSizes
      };

      // Calculate page-specific bundle sizes
      Object.keys(buildMeta.pages).forEach(pagePath => {
        const scriptPaths = buildMeta.pages[pagePath];

        // Filter out global scripts to get page-specific scripts
        const pageSpecificScripts = scriptPaths.filter(scriptPath => !globalBundle.includes(scriptPath));
        if (pageSpecificScripts.length > 0) {
          const scriptSizes = getScriptSizes(pageSpecificScripts);
          result.pages[pagePath] = scriptSizes;
        }
      });

      console.log(`Pages Router: Analyzed ${Object.keys(result.pages).length - 1} pages plus global bundle`);
    } else {
      console.warn('Pages Router: No _app entry point found in build-manifest.json');
    }
  } else {
    console.log('Pages Router: build-manifest.json not found, skipping Pages Router analysis');
  }
} catch (err) {
  console.warn('Failed to analyze Pages Router bundles:', err.message);
}

// App Router（新しいルーター）のサイズ計算
try {
  // Check if app-build-manifest.json exists
  const appBuildManifestPath = path.join(nextMetaRoot, 'app-build-manifest.json');
  if (fs.existsSync(appBuildManifestPath)) {
    console.log('Analyzing App Router bundles from app-build-manifest.json');
    const appDirMeta = require(appBuildManifestPath);

    result.app = {};

    // ルートレイアウトとグローバルファイルを特定するための変数
    const appPages = appDirMeta.pages || {};
    const rootLayoutCandidates = [
      '/layout', // 最優先: 標準的なルートレイアウト
      '/',       // ルートページ
    ];

    // その他のレイアウト候補を追加
    Object.keys(appPages).forEach(key => {
      if (key.includes('layout') || key.includes('__layout')) {
        // ルートレベルのレイアウトを優先
        if (key.split('/').length <= 2) {
          rootLayoutCandidates.push(key);
        }
      }
    });

    // ルートレイアウトキーを見つける
    let rootLayoutKey = null;
    for (const candidate of rootLayoutCandidates) {
      if (appPages[candidate]) {
        rootLayoutKey = candidate;
        console.log(`App Router: Found root layout: ${rootLayoutKey}`);
        break;
      }
    }

    // rootMainFilesが存在する場合はそれを使用
    let globalAppFiles = [];
    if (appDirMeta.rootMainFiles && appDirMeta.rootMainFiles.length > 0) {
      console.log('App Router: Using rootMainFiles as global scripts');
      globalAppFiles = appDirMeta.rootMainFiles;
    } else if (rootLayoutKey) {
      console.log('App Router: Using root layout scripts as global scripts');
      globalAppFiles = appPages[rootLayoutKey];
    }

    // グローバルスクリプトの計算
    const globalAppBundleSizes = getScriptSizes(globalAppFiles);
    result.app['__global'] = globalAppBundleSizes;

    // 各ページごとのバンドルサイズを計算
    let pageCount = 0;
    Object.keys(appPages).forEach(pagePath => {
      // グローバルレイアウト以外のページのみ処理
      if (pagePath !== rootLayoutKey) {
        const scriptPaths = appPages[pagePath];

        // グローバルスクリプトを除外してページ固有のスクリプトを取得
        const pageSpecificScripts = scriptPaths.filter(
          scriptPath => !globalAppFiles.includes(scriptPath)
        );

        if (pageSpecificScripts.length > 0) {
          const scriptSizes = getScriptSizes(pageSpecificScripts);
          // ページパスを正規化して保存
          const normalizedPath = pagePath.replace(/\/page$/, '');
          result.app[normalizedPath] = scriptSizes;
          pageCount++;
        }
      }
    });

    console.log(`App Router: Analyzed ${pageCount} pages plus global bundle`);
  } else {
    console.log('App Router: app-build-manifest.json not found, skipping App Router analysis');
  }
} catch (err) {
  console.warn('Failed to analyze App Router bundles:', err.message);
  console.error(err);
}

// 結果に両方のルーターの情報が含まれているか確認
if (Object.keys(result).length === 0) {
  console.error('No bundle information found for either Pages Router or App Router.');
  process.exit(1);
}

// format and write the output
const rawData = JSON.stringify(result, null, 2);

// log outputs to the gh actions panel
console.log('Bundle analysis complete. Result summary:');
if (result.pages) {
  console.log(`Pages Router: ${Object.keys(result.pages).length - 1} pages, Global bundle: ${formatBytes(result.pages.__global.gzip)} gzipped`);
}
if (result.app) {
  console.log(`App Router: ${Object.keys(result.app).length - 1} pages, Global bundle: ${formatBytes(result.app.__global.gzip)} gzipped`);
}

mkdirp.sync(path.join(nextMetaRoot, 'analyze/'));
fs.writeFileSync(path.join(nextMetaRoot, 'analyze/__bundle_analysis.json'), rawData);
console.log(`Bundle analysis data written to ${path.join(nextMetaRoot, 'analyze/__bundle_analysis.json')}`);

// --------------
// Util Functions
// --------------

// Format bytes to human readable format
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

// given an array of scripts, return the total of their combined file sizes
function getScriptSizes(scriptPaths) {
  if (!Array.isArray(scriptPaths)) {
    console.warn(`Expected scriptPaths to be an array, got ${typeof scriptPaths}`);
    return { raw: 0, gzip: 0 };
  }

  const res = scriptPaths.reduce(
    (acc, scriptPath) => {
      try {
        const [rawSize, gzipSize] = getScriptSize(scriptPath);
        acc.raw += rawSize;
        acc.gzip += gzipSize;
      } catch (err) {
        console.warn(`Failed to get size for script: ${scriptPath}`, err.message);
      }
      return acc;
    },
    { raw: 0, gzip: 0 },
  );

  return res;
}

// given an individual path to a script, return its file size
function getScriptSize(scriptPath) {
  if (typeof scriptPath !== 'string') {
    console.warn(`Invalid script path: ${scriptPath}, expected string but got ${typeof scriptPath}`);
    return [0, 0];
  }

  const encoding = 'utf8';
  const p = path.join(nextMetaRoot, scriptPath);

  if (!fs.existsSync(p)) {
    console.warn(`Script file does not exist: ${p}`);
    return [0, 0];
  }

  let rawSize, gzipSize;
  if (Object.keys(memoryCache).includes(p)) {
    rawSize = memoryCache[p][0];
    gzipSize = memoryCache[p][1];
  } else {
    try {
      const textContent = fs.readFileSync(p, encoding);
      rawSize = Buffer.byteLength(textContent, encoding);
      gzipSize = gzipSizeSync(textContent);
      memoryCache[p] = [rawSize, gzipSize];
    } catch (err) {
      console.warn(`Error reading script file: ${p}`, err.message);
      return [0, 0];
    }
  }

  return [rawSize, gzipSize];
}

/**
 * Reads options from `package.json`
 */
function getOptions(pathPrefix = process.cwd()) {
  const pkg = require(path.join(pathPrefix, 'package.json'));

  return { ...pkg.nextBundleAnalysis, name: pkg.name };
}

/**
 * Gets the output build directory, defaults to `.next`
 *
 * @param {object} options the options parsed from package.json.nextBundleAnalysis using `getOptions`
 * @returns {string}
 */
function getBuildOutputDirectory(options) {
  return options.buildOutputDirectory || '.next';
}
