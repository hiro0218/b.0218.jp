/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * Markdown templates for bundle analysis reports
 */

/**
 * Detail section explaining global bundle changes
 */
export const DETAILS_GLOBAL_BUNDLE = `
<details>
<summary>Details</summary>
<p>The <strong>global bundle</strong> is the javascript bundle that loads alongside every page. It is in its own category because its impact is much higher - an increase to its size means that every page on your website loads slower, and a decrease means every page loads faster.</p>
<p>For Pages Router, the global bundle is based on _app.js. For App Router, it's based on the root layout file.</p>
<p>Pages with [App] prefix are from the App Router, others are from the Pages Router.</p>
<p>Any third party scripts you have added directly to your app using the <code>&lt;script&gt;</code> tag are not accounted for in this analysis</p>
<p>If you want further insight into what is behind the changes, give <a href='https://www.npmjs.com/package/@next/bundle-analyzer'>@next/bundle-analyzer</a> a try!</p>
</details>

`

/**
 * Detail section explaining page size changes
 * @param {Object} options - Template options
 * @param {number} options.budgetPercentIncreaseRed - Threshold percentage for red indicator
 * @param {number} [options.budget] - Performance budget in bytes
 * @returns {string} Formatted detail section
 */
export function renderDetailsPageChanges({ budgetPercentIncreaseRed, budget }) {
  const budgetExplanation = budget
    ? `<p>The "Budget %" column shows what percentage of your performance budget the <strong>First Load</strong> total takes up. For example, if your budget was 100kb, and a given page's first load size was 10kb, it would be 10% of your budget. You can also see how much this has increased or decreased compared to the base branch of your PR. If this percentage has increased by ${budgetPercentIncreaseRed}% or more, there will be a red status indicator applied, indicating that special attention should be given to this. If you see "+/- <0.01%" it means that there was a change in bundle size, but it is a trivial enough amount that it can be ignored.</p>`
    : `<p>Next to the size is how much the size has increased or decreased compared with the base branch of this PR. If this percentage has increased by ${budgetPercentIncreaseRed}% or more, there will be a red status indicator applied, indicating that special attention should be given to this.`

  return `
<details>
<summary>Details</summary>
<p>Only the gzipped size is provided here based on <a href='https://twitter.com/slightlylate/status/1412851269211811845'>an expert tip</a>.</p>
<p><strong>First Load</strong> is the size of the global bundle plus the bundle for the individual page. If a user were to show up to your website and land on a given page, the first load size represents the amount of javascript that user would need to download. If <code>next/link</code> is used, subsequent page loads would only need to download that page's bundle (the number in the "Size" column), since the global bundle has already been downloaded.</p>
<p>Any third party scripts you have added directly to your app using the <code>&lt;script&gt;</code> tag are not accounted for in this analysis</p>
${budgetExplanation}
</details>
`
}
