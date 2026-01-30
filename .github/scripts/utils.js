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

/**
 * Safely reads and parses a JSON file
 * @param {string} filePath - Absolute path to JSON file
 * @returns {Object|null} Parsed JSON object, or null if file doesn't exist or is invalid
 * @example
 *   const data = safeReadJSON('/path/to/file.json')
 *   if (data) {
 *     // File exists and is valid JSON
 *   }
 */
export function safeReadJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(content)
  } catch (err) {
    if (err.code === 'ENOENT') {
      // File doesn't exist - this is expected for base bundle on first run
      return null
    }
    if (err instanceof SyntaxError) {
      // Invalid JSON - log warning but don't crash
      console.warn(`Warning: Invalid JSON in file: ${filePath}`)
      return null
    }
    // Unexpected error - re-throw
    throw err
  }
}

/**
 * Ensures a directory exists, creating it if necessary (including parent directories)
 * @param {string} dirPath - Absolute path to directory
 * @returns {void}
 * @example
 *   ensureDirectory('/path/to/nested/dir')
 *   // Creates /path, /path/to, /path/to/nested, and /path/to/nested/dir if they don't exist
 */
export function ensureDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

/**
 * Writes content to a file, ensuring the parent directory exists
 * @param {string} filePath - Absolute path to file
 * @param {string} content - Content to write
 * @returns {void}
 * @example
 *   safeWriteFile('/path/to/output.json', JSON.stringify(data))
 */
export function safeWriteFile(filePath, content) {
  const dir = path.dirname(filePath)
  ensureDirectory(dir)
  fs.writeFileSync(filePath, content, 'utf8')
}
