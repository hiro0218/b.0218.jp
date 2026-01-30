#!/usr/bin/env node
/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { runReport } from './lib/report-core.mjs'

try {
  runReport()
} catch (err) {
  console.error(`Error: ${err.message}`)
  process.exit(1)
}
