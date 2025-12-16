import { type ChildProcess, spawn } from 'node:child_process';
import { join } from 'node:path';

import * as Log from '~/tools/logger';

import { OGPServerManager } from './server-manager';

function waitForProcessExit(process: ChildProcess): Promise<number> {
  return new Promise((resolve, reject) => {
    process.on('exit', (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(new Error(`Process exited with code ${code}`));
      }
    });

    process.on('error', (error) => {
      reject(error);
    });
  });
}

async function main(): Promise<void> {
  const serverManager = new OGPServerManager();

  try {
    await serverManager.start();

    Log.info('OGP Generation', 'Generating screenshots...');

    const screenshotPath = join(__dirname, 'screenshot.ts');
    const screenshotProcess = spawn('node', ['--require', 'esbuild-register', screenshotPath], {
      stdio: 'inherit',
    });

    await waitForProcessExit(screenshotProcess);

    Log.info('OGP Generation', 'Completed successfully');
  } catch (error) {
    Log.error('OGP Generation', `Failed: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  } finally {
    await serverManager.stop();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
