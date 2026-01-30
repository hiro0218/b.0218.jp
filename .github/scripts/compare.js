#!/usr/bin/env node
/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { runCompare } from './lib/compare-core.js'

try {
  const { output } = runCompare()
  console.log(output)
} catch (err) {
  console.error(`Error: ${err.message}`)
  process.exit(1)
}
