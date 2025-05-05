#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * バンドルサイズの比較を行い、PR用コメントを生成するスクリプト
 * Next.jsのApp RouterとPages Router両方に対応
 */

const fs = require('fs');
const path = require('path');

// 設定の取得
const options = getOptionsFromPackageJson();
const budget = options.budget || 350000; // デフォルトは350KB
const redStatusPercentage = options.redStatusPercentage || 20; // デフォルトは20%

// 出力ディレクトリとファイルパスの設定
const nextDir = path.join(process.cwd(), options.buildOutputDirectory || '.next');
const analyzeDir = path.join(nextDir, 'analyze');
const baseBundlePath = path.join(analyzeDir, 'base/bundle/__bundle_analysis.json');
const currentBundlePath = path.join(analyzeDir, '__bundle_analysis.json');
const outputCommentPath = path.join(analyzeDir, '__bundle_analysis_comment.txt');

// メイン処理
async function main() {
  try {
    // 現在のバンドル情報の読み込み
    const currentBundle = readJsonFile(currentBundlePath);
    if (!currentBundle) {
      throw new Error(`現在のバンドル情報を読み込めませんでした: ${currentBundlePath}`);
    }

    // ベースブランチのバンドル情報の読み込み
    let baseBundle;
    try {
      baseBundle = readJsonFile(baseBundlePath);
      console.log('ベースブランチのバンドル情報を読み込みました');
    } catch (error) {
      console.warn(`ベースブランチのバンドル情報を読み込めませんでした: ${error.message}`);
      console.log('比較なしでコメントを生成します');
      baseBundle = null;
    }

    // PR用コメントの生成
    const comment = generateComment(currentBundle, baseBundle);

    // コメントの出力
    fs.writeFileSync(outputCommentPath, comment);
    console.log(`コメントを保存しました: ${outputCommentPath}`);
  } catch (error) {
    console.error('エラーが発生しました:', error);
    process.exit(1);
  }
}

// バンドル情報の比較とコメント生成
function generateComment(currentBundle, baseBundle) {
  let comment = '## 📊 Next.js バンドルサイズ分析\n\n';

  // ルーターの種類を確認
  const hasAppRouter = currentBundle.app && Object.keys(currentBundle.app).length > 0;
  const hasPagesRouter = currentBundle.pages && Object.keys(currentBundle.pages).length > 0;

  // 比較情報の追加
  if (baseBundle) {
    comment += '### 🔄 前回のビルドとの比較\n\n';

    // App Routerの比較
    if (hasAppRouter) {
      if (baseBundle.app) {
        const appComparison = compareRouterBundles(currentBundle.app, baseBundle.app, 'App Router');
        comment += appComparison;
      } else {
        comment += '- App Router: 前回のビルドに情報がないため比較できません\n';
      }
    }

    // Pages Routerの比較
    if (hasPagesRouter) {
      if (baseBundle.pages) {
        const pagesComparison = compareRouterBundles(currentBundle.pages, baseBundle.pages, 'Pages Router');
        comment += pagesComparison;
      } else {
        comment += '- Pages Router: 前回のビルドに情報がないため比較できません\n';
      }
    }

    comment += '\n';
  }

  // 現在のバンドル情報の表示
  comment += '### 📦 現在のバンドルサイズ\n\n';

  // App Routerのサイズ一覧
  if (hasAppRouter) {
    comment += '#### App Router\n\n';
    comment += generateBundleSizeTable(currentBundle.app);
  }

  // Pages Routerのサイズ一覧
  if (hasPagesRouter) {
    comment += '#### Pages Router\n\n';
    comment += generateBundleSizeTable(currentBundle.pages);
  }

  return comment;
}

// ルーターごとのバンドル比較を行う
function compareRouterBundles(current, base, routerName) {
  if (!current.__global || !base.__global) {
    return `- ${routerName}: global bundle情報がないため比較できません\n`;
  }

  const currentGlobalGzip = current.__global.gzip;
  const baseGlobalGzip = base.__global.gzip;
  const globalDiff = currentGlobalGzip - baseGlobalGzip;
  const globalDiffPercentage = (globalDiff / baseGlobalGzip) * 100;

  // ステータスの判定（予算超過や増加率に基づく）
  let status = '🟢'; // デフォルトは良好
  if (currentGlobalGzip > budget) {
    status = '🔴'; // 予算超過
  } else if (globalDiff > 0 && globalDiffPercentage > redStatusPercentage) {
    status = '🟠'; // 大幅増加
  } else if (globalDiff > 0) {
    status = '🟡'; // 小幅増加
  }

  // 結果文字列の生成
  let result = `- ${routerName}: ${status} `;
  result += `global bundle: ${formatBytes(currentGlobalGzip)}`;

  if (globalDiff !== 0) {
    const sign = globalDiff > 0 ? '+' : '';
    result += ` (${sign}${formatBytes(globalDiff)}, ${sign}${globalDiffPercentage.toFixed(2)}%)`;
  } else {
    result += ' (変更なし)';
  }

  // ページ数の比較
  const currentPageCount = Object.keys(current).length - 1; // __globalを除く
  const basePageCount = Object.keys(base).length - 1; // __globalを除く

  if (currentPageCount !== basePageCount) {
    result += `\n  - ページ数: ${currentPageCount}ページ (${currentPageCount - basePageCount > 0 ? '+' : ''}${currentPageCount - basePageCount})`;
  } else {
    result += `\n  - ページ数: ${currentPageCount}ページ (変更なし)`;
  }

  return result + '\n';
}

// バンドルサイズ一覧表の生成
function generateBundleSizeTable(bundleData) {
  const table = [
    '| ページ | サイズ (gzip) |',
    '| :--- | ---: |',
  ];

  // global bundleを先頭に追加
  if (bundleData.__global) {
    table.push(`| global bundle | ${formatBytes(bundleData.__global.gzip)} |`);
  }

  // ページごとのバンドルサイズを追加（サイズ順）
  const pages = Object.keys(bundleData)
    .filter(key => key !== '__global')
    .sort((a, b) => bundleData[b].gzip - bundleData[a].gzip);

  for (const page of pages) {
    const size = bundleData[page].gzip;
    table.push(`| \`${page}\` | ${formatBytes(size)} |`);
  }

  return table.join('\n') + '\n\n';
}

// バイト数を人間が読みやすい形式にフォーマット
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

// JSONファイルの読み込み
function readJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`ファイル読み込みエラー (${filePath}):`, error.message);
    return null;
  }
}

// package.jsonからオプションを取得
function getOptionsFromPackageJson(pathPrefix = process.cwd()) {
  try {
    const pkg = require(path.join(pathPrefix, 'package.json'));
    return { ...pkg.nextBundleAnalysis, name: pkg.name };
  } catch (error) {
    console.warn('package.jsonからオプションを読み込めませんでした:', error.message);
    return {};
  }
}

// スクリプト実行
main();
