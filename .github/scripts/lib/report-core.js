/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * Next.js 16対応バンドルサイズ解析スクリプト（コアロジック）
 *
 * ルートごとの代表の静的 HTML から、初回に読み込む JS（noModule を除く <script src>）を数える。
 * webpack と Turbopack のどちらのビルドでも、同じ方法で数えられる。
 *
 * build-manifest.json の rootMainFiles と static/chunks/app のチャンクは使わない。
 * Turbopack の出力には app/ が無く、チャンクの名前は内容のハッシュだけで、ビルドごとに変わる。
 * 名前を比較の単位にすると、PR の比較はチャンクが変わるたびに、すべてを新規ページとして報告する。
 */

import fs from 'fs';
import { gzipSizeSync } from 'gzip-size';
import path from 'path';
import { getBuildOutputDirectory, getOptions, safeReadJSON, safeWriteFile } from '../utils.js';

const SCRIPT_TAG = /<script\b[^>]*\bsrc="\/_next\/([^"]+)"[^>]*>/g;

/**
 * バンドル解析を実行してJSONを出力する
 * @param {object} [params] - 実行パラメータ
 * @param {string} [params.cwd] - 実行ディレクトリ（デフォルト: process.cwd）
 * @param {object} [params.options] - package.jsonのnextBundleAnalysis設定
 * @param {Console} [params.logger] - ロガー
 * @returns {{ outputPath: string, rawData: string }} 出力パスとJSON文字列
 */
export function runReport({ cwd = process.cwd(), options = getOptions(cwd), logger = console } = {}) {
  const BuildOutputDirectory = getBuildOutputDirectory(options);

  const nextMetaRoot = path.join(cwd, BuildOutputDirectory);
  try {
    fs.accessSync(nextMetaRoot, fs.constants.R_OK);
  } catch (_err) {
    throw new Error(
      `No build output found at "${nextMetaRoot}" - you may not have your working directory set correctly, or not have run "next build".`,
    );
  }

  const prerenderManifestPath = path.join(nextMetaRoot, 'prerender-manifest.json');
  const prerenderManifest = safeReadJSON(prerenderManifestPath);

  if (!prerenderManifest) {
    throw new Error(`prerender-manifest.json not found at ${prerenderManifestPath}`);
  }

  const memoryCache = new Map();

  // ルートの全ページを読まない。同じルートのページは同じ JS を読むため、最初の 1 ページだけを読む
  const scriptsByRoute = new Map();
  for (const [routePath, route] of Object.entries(prerenderManifest.routes)) {
    // route handler（feed.xml など）は HTML を持たない
    // global-error は root layout を置き換えて JS が少ない。共通の JS の算出に入れると、共通分が runtime だけに縮む
    if (route.routeType !== 'page' || route.srcRoute === '/_global-error' || scriptsByRoute.has(route.srcRoute)) {
      continue;
    }

    const fileName = routePath === '/' ? 'index' : routePath.slice(1);
    const html = fs.readFileSync(path.join(nextMetaRoot, 'server/app', `${fileName}.html`), 'utf8');
    scriptsByRoute.set(route.srcRoute, extractScripts(html));
  }

  if (scriptsByRoute.size === 0) {
    throw new Error(`No prerendered page found in ${path.join(nextMetaRoot, 'server/app')}`);
  }

  // 全ルートの HTML が共通して読む JS が、グローバルのバンドル
  const globalScripts = [...scriptsByRoute.values()].reduce((common, scripts) =>
    common.filter((script) => scripts.includes(script)),
  );
  const globalBundleSizes = getScriptSizes(globalScripts, nextMetaRoot, memoryCache, logger);

  const allPageSizes = {};
  for (const [route, scripts] of scriptsByRoute) {
    const ownScripts = scripts.filter((script) => !globalScripts.includes(script));
    allPageSizes[route] = getScriptSizes(ownScripts, nextMetaRoot, memoryCache, logger);
  }

  const rawData = JSON.stringify({
    ...allPageSizes,
    __global: globalBundleSizes,
  });

  logger.log('\n=== Bundle Analysis Results ===');
  logger.log(
    `Global bundle: ${formatBytes(globalBundleSizes.raw)} (raw), ${formatBytes(globalBundleSizes.gzip)} (gzip)`,
  );
  logger.log(`  - scripts shared by every page: ${globalScripts.length}`);
  logger.log(`Routes analyzed: ${scriptsByRoute.size}`);
  logger.log('================================\n');

  const outputPath = path.join(nextMetaRoot, 'analyze/__bundle_analysis.json');
  safeWriteFile(outputPath, rawData);

  logger.log('Bundle analysis saved to:', outputPath);

  return { outputPath, rawData };
}

/**
 * HTML が初回に読み込む JS の、ビルド出力からの相対パスを返す
 * 外部のスクリプト（広告・計測など）は、ビルドの成果物ではないので含めない
 * @param {string} html - 静的 HTML
 * @returns {string[]} 例: static/chunks/xxxx.js
 */
function extractScripts(html) {
  const scripts = new Set();

  for (const [tag, src] of html.matchAll(SCRIPT_TAG)) {
    // noModule の script は古いブラウザ向けの polyfill で、現行のブラウザは読まない
    if (/\bnomodule\b/i.test(tag)) continue;

    // [slug] のような名前は、HTML では %5Bslug%5D の形で書かれている
    scripts.add(decodeURIComponent(src.split('?')[0]));
  }

  return [...scripts];
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
      const [rawSize, gzipSize] = getScriptSize(scriptPath, nextMetaRoot, memoryCache, logger);
      acc.raw += rawSize;
      acc.gzip += gzipSize;
      return acc;
    },
    { raw: 0, gzip: 0 },
  );
  return res;
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
  const encoding = 'utf8';
  const p = path.join(nextMetaRoot, scriptPath);

  let rawSize, gzipSize;
  if (memoryCache.has(p)) {
    const cached = memoryCache.get(p);
    rawSize = cached[0];
    gzipSize = cached[1];
  } else {
    try {
      if (!fs.existsSync(p)) {
        throw new Error(`File does not exist: ${p}`);
      }
      const textContent = fs.readFileSync(p, encoding);
      rawSize = Buffer.byteLength(textContent, encoding);
      gzipSize = gzipSizeSync(textContent);
      memoryCache.set(p, [rawSize, gzipSize]);
    } catch (err) {
      logger.error('❌ Error processing file');
      logger.error(`   Full path: ${p}`);
      logger.error(`   Relative path: ${scriptPath}`);
      logger.error(`   Error: ${err.message}`);
      rawSize = 0;
      gzipSize = 0;
    }
  }

  return [rawSize, gzipSize];
}

/**
 * Formats byte count to human-readable string with appropriate unit
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted string (e.g., "1.5 KB", "250 Bytes", "2.3 MB")
 */
export function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
}
