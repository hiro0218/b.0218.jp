/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import path from 'path'
import fs from 'fs'

/**
 * Reads options from `package.json`
 */
export const getOptions = (pathPrefix = process.cwd()) => {
  const pkgPath = path.join(pathPrefix, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
  return { ...pkg.nextBundleAnalysis, name: pkg.name }
}

/**
 * Gets the output build directory, defaults to `.next`
 *
 * @param {object} options the options parsed from package.json.nextBundleAnalysis using `getOptions`
 * @returns {string}
 */
export const getBuildOutputDirectory = (options) => {
  return options.buildOutputDirectory || '.next'
}
