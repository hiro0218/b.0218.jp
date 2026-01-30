/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import path from 'path'
import fs from 'fs'

/**
 * Reads options from `package.json`
 * @param {string} pathPrefix - Base directory path (defaults to current working directory)
 * @returns {object} Combined options from nextBundleAnalysis and package name
 * @throws {Error} If package.json is not found, invalid, or missing required fields
 */
export const getOptions = (pathPrefix = process.cwd()) => {
  const pkgPath = path.join(pathPrefix, 'package.json')

  try {
    // Check if file exists before reading
    if (!fs.existsSync(pkgPath)) {
      throw new Error(`package.json not found at: ${pkgPath}`)
    }

    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))

    // Validate required fields
    if (!pkg.name) {
      throw new Error('package.json must have a "name" field')
    }

    return { ...pkg.nextBundleAnalysis, name: pkg.name }
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(`package.json not found at: ${pkgPath}`)
    }
    if (err instanceof SyntaxError) {
      throw new Error(`Invalid JSON in package.json: ${err.message}`)
    }
    // Re-throw errors with context
    throw err
  }
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
