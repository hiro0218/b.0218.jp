import cluster from 'node:cluster';

import * as Log from '~/tools/logger';

import { OGP_CONFIG } from './config';
import { ScreenshotGenerator } from './screenshot-generator';
import { OGPServerManager } from './server-manager';

async function main(): Promise<void> {
  if (!cluster.isPrimary) {
    const workerScript = process.env.WORKER_SCRIPT;
    if (workerScript) {
      require(workerScript);
      return;
    }
    throw new Error('WORKER_SCRIPT not defined');
  }

  const serverManager = new OGPServerManager();
  const screenshotGenerator = new ScreenshotGenerator();

  try {
    await serverManager.start();

    Log.info('OGP Generation', 'Generating screenshots...');

    await screenshotGenerator.generate();

    Log.info('OGP Generation', 'Completed successfully');
  } catch (error) {
    if (error instanceof Error) {
      Log.error('OGP Generation', `Failed: ${error.message}`);
      if (OGP_CONFIG.debug && error.stack) {
        console.error('Stack trace:', error.stack);
      }
    } else {
      Log.error('OGP Generation', `Failed: ${String(error)}`);
    }
    throw error;
  } finally {
    await Promise.all([serverManager.stop(), screenshotGenerator.stop()]);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
