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

// ステータスインジケーターを生成する関数
function renderStatusIndicator(percentageChange) {
  let res = '';
  if (percentageChange > 0 && percentageChange < redStatusPercentage) {
    res += '🟡 +';
  } else if (percentageChange >= redStatusPercentage) {
    res += '🔴 +';
  } else if (percentageChange < 0.01 && percentageChange > -0.01) {
    res += '';
  } else {
    res += '🟢 ';
  }
  return res;
}

// ルーターごとのバンドル比較を行う
function compareRouterBundles(current, base, routerName) {
  let result = `#### ${routerName}\n\n`;

  // テーブルヘッダー
  result += '| Page | Size (compressed) | \n';
  result += '|---|---|\n';

  // グローバルバンドルの比較
  if (current.__global && base.__global) {
    const currentGlobalGzip = current.__global.gzip;
    const baseGlobalGzip = base.__global.gzip;
    const globalDiff = currentGlobalGzip - baseGlobalGzip;
    const globalDiffPercentage = (globalDiff / baseGlobalGzip) * 100;

    // ステータスインジケーターを取得
    const status = renderStatusIndicator(globalDiffPercentage);

    // 差分表示を整形
    let diffText = '';
    if (globalDiff !== 0) {
      diffText = ` _(${status}${formatBytes(globalDiff)})_`;
    }

    result += `| \`global\` | \`${formatBytes(currentGlobalGzip)}\`${diffText} |\n`;
  } else {
    result += `| \`global\` | 情報がありません |\n`;
  }

  // 変更のあったページの比較
  const changedPages = [];
  const addedPages = [];
  const removedPages = [];

  // 全ページを調査
  for (const page in current) {
    if (page === '__global') continue;

    if (base[page]) {
      // 既存ページの変更を検出
      const currentGzip = current[page].gzip;
      const baseGzip = base[page].gzip;
      const gzipDiff = currentGzip - baseGzip;

      if (gzipDiff !== 0) {
        const diffPercentage = (gzipDiff / baseGzip) * 100;
        changedPages.push({
          page,
          currentGzip,
          gzipDiff,
          diffPercentage
        });
      }
    } else {
      // 新規追加されたページ
      addedPages.push({
        page,
        gzip: current[page].gzip
      });
    }
  }

  // 削除されたページを検出
  for (const page in base) {
    if (page === '__global') continue;
    if (!current[page]) {
      removedPages.push({
        page,
        gzip: base[page].gzip
      });
    }
  }

  // 変更のあったページをテーブルに追加（サイズの変化量順）
  if (changedPages.length > 0) {
    changedPages
      .sort((a, b) => Math.abs(b.gzipDiff) - Math.abs(a.gzipDiff))
      .forEach(({ page, currentGzip, gzipDiff, diffPercentage }) => {
        const status = renderStatusIndicator(diffPercentage);
        const diffText = ` _(${status}${formatBytes(gzipDiff)})_`;
        result += `| \`${page}\` | \`${formatBytes(currentGzip)}\`${diffText} |\n`;
      });
  }

  // テーブル下に追加情報
  if (addedPages.length > 0) {
    result += `\n**追加されたページ:** ${addedPages.length}件\n`;
  }

  if (removedPages.length > 0) {
    result += `\n**削除されたページ:** ${removedPages.length}件\n`;
  }

  return result + '\n';
}

// バンドルサイズ一覧表の生成
function generateBundleSizeTable(bundleData) {
  // テーブルヘッダー
  let table = '| Page | Size (compressed) | \n';
  table += '|---|---|\n';

  // global bundleを先頭に追加
  if (bundleData.__global) {
    table += `| \`global\` | \`${formatBytes(bundleData.__global.gzip)}\` |\n`;
  }

  // ページごとのバンドルサイズを追加（サイズ順）
  const pages = Object.keys(bundleData)
    .filter(key => key !== '__global')
    .sort((a, b) => bundleData[b].gzip - bundleData[a].gzip);

  for (const page of pages) {
    const size = bundleData[page].gzip;
    table += `| \`${page}\` | \`${formatBytes(size)}\` |\n`;
  }

  return table + '\n';
}

// バイト数を読みやすい形式にフォーマット
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));

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

main();
