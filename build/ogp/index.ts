import { type ChildProcess, spawn } from 'node:child_process';
import { join } from 'node:path';

import * as Log from '~/tools/logger';

const SERVER_PORT = 3000;
const SERVER_URL = `http://localhost:${SERVER_PORT}`;
const SERVER_READY_TIMEOUT = 30000;
const SERVER_READY_CHECK_INTERVAL = 500;

async function waitForServerReady(url: string, timeout: number): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(2000),
      });

      if (response.ok) {
        return;
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, SERVER_READY_CHECK_INTERVAL));
    }
  }

  throw new Error(`Server not ready after ${timeout}ms`);
}

function attachProcessLogging(process: ChildProcess, label: string): void {
  process.stdout?.on('data', (data) => {
    const message = data.toString().trim();
    if (message) {
      Log.info(`[${label}]`, message);
    }
  });

  process.stderr?.on('data', (data) => {
    const message = data.toString().trim();
    if (message) {
      Log.error(`[${label}]`, message);
    }
  });
}

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
  let serverProcess: ChildProcess | null = null;

  try {
    Log.info('OGP Generation', 'Starting server...');

    const serverPath = join(__dirname, 'server.tsx');
    serverProcess = spawn('node', ['--require', 'esbuild-register', serverPath], {
      stdio: ['ignore', 'pipe', 'pipe'],
      detached: false,
    });

    attachProcessLogging(serverProcess, 'Server');

    Log.info('OGP Generation', `Waiting for server ready at ${SERVER_URL}...`);
    await waitForServerReady(SERVER_URL, SERVER_READY_TIMEOUT);
    Log.info('OGP Generation', 'Server ready');

    Log.info('OGP Generation', 'Generating screenshots...');

    const screenshotPath = join(__dirname, 'screenshot.ts');
    const screenshotProcess = spawn('node', ['--require', 'esbuild-register', screenshotPath], {
      stdio: 'inherit',
    });

    await waitForProcessExit(screenshotProcess);

    Log.info('OGP Generation', 'Screenshots generated successfully');
  } catch (error) {
    Log.error('OGP Generation', `Failed: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  } finally {
    if (serverProcess && !serverProcess.killed) {
      Log.info('OGP Generation', 'Stopping server...');
      serverProcess.kill('SIGTERM');

      await Promise.race([
        new Promise<void>((resolve) => {
          serverProcess?.on('exit', () => resolve());
        }),
        new Promise<void>((resolve) => setTimeout(resolve, 5000)),
      ]);

      if (!serverProcess.killed) {
        serverProcess.kill('SIGKILL');
      }

      Log.info('OGP Generation', 'Server stopped');
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
